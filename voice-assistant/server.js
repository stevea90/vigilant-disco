require('dotenv').config();
const express = require('express');
const axios = require('axios');
const Anthropic = require('@anthropic-ai/sdk');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const PORT = process.env.PORT || 3000;

if (!ELEVENLABS_API_KEY) {
  console.error('\nERROR: ELEVENLABS_API_KEY not set.\nCopy .env.example to .env and add your key.\n');
  process.exit(1);
}

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

const MEMORY_FILE = path.join(__dirname, 'memory.json');
const MAX_HISTORY = 40;  // 20 user+assistant pairs

const conversationHistory = [];
loadMemory();

function loadMemory() {
  try {
    const raw = fs.readFileSync(MEMORY_FILE, 'utf8');
    const msgs = JSON.parse(raw);
    if (Array.isArray(msgs) && msgs.length) {
      conversationHistory.push(...msgs);
    }
  } catch {}  // file missing or corrupt — start fresh
}

function saveMemory() {
  const toSave = conversationHistory.slice(-MAX_HISTORY);
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(toSave, null, 2));
}

// ── Audio queue — TTS calls run in parallel, playback stays in order ──────────
// Each queueSpeech() call fires a fetchTTS() immediately (parallel network),
// then chains onto playbackChain so audio plays sequentially.
let activeProc = null;
let playbackChain = Promise.resolve();

function queueSpeech(text) {
  const ttsPromise = fetchTTS(text);  // starts immediately, doesn't wait for previous
  playbackChain = playbackChain.then(async () => {
    try {
      const buf = await ttsPromise;
      await playBufferAsync(buf);
    } catch (err) {
      console.error('[TTS queue]', err.message);
    }
  });
}

async function fetchTTS(text) {
  const r = await axios.post(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    { text, model_id: 'eleven_flash_v2_5', voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 } },
    { headers: { 'xi-api-key': ELEVENLABS_API_KEY, Accept: 'audio/mpeg' }, responseType: 'arraybuffer', timeout: 20000 }
  );
  return Buffer.from(r.data);
}

function playBufferAsync(buf) {
  return new Promise(resolve => {
    const tmp = path.join(os.tmpdir(), `jarvis-${Date.now()}.mp3`);
    fs.writeFileSync(tmp, buf);
    activeProc = playFile(tmp, () => {
      activeProc = null;
      try { fs.unlinkSync(tmp); } catch {}
      resolve();
    });
  });
}

function interruptPlayback() {
  if (activeProc) { try { activeProc.kill(); } catch {} activeProc = null; }
  playbackChain = Promise.resolve();  // discard queued items
}

// ── POST /speak — Claude Code stop hook ───────────────────────────────────────
app.post('/speak', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true });

  res.json({ ok: true, chars: cleaned.length });

  interruptPlayback();
  console.log(`\n[${source || 'api'}] Speaking: ${cleaned.slice(0, 80)}${cleaned.length > 80 ? '…' : ''}\n`);
  queueSpeech(cleaned);
});

// ── POST /chat — streaming: Claude tokens → sentence chunks → ElevenLabs ──────
app.post('/chat', async (req, res) => {
  if (!anthropic) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not set. Add it to .env and restart.' });
  }

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  interruptPlayback();

  // SSE — browser reads tokens as they arrive
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');

  conversationHistory.push({ role: 'user', content: text });

  let fullText = '';
  let sentenceBuf = '';

  function flushSentences(force = false) {
    if (force) {
      const t = sentenceBuf.trim();
      sentenceBuf = '';
      if (t) queueIfCleaned(t);
      return;
    }
    let sentence;
    while ((sentence = extractSentence(sentenceBuf)) !== null) {
      sentenceBuf = sentenceBuf.slice(sentence.length).replace(/^\s+/, '');
      queueIfCleaned(sentence);
    }
  }

  function queueIfCleaned(chunk) {
    const cleaned = sanitiseForVoice(chunk);
    if (cleaned) {
      console.log(`\n[chat] Queuing: ${cleaned.slice(0, 70)}`);
      queueSpeech(cleaned);
    }
  }

  try {
    const stream = anthropic.messages.stream({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: 'You are Jarvis, a voice assistant running on a laptop. You have persistent memory — the conversation history includes previous sessions with the user, so you can refer back to things they have told you before. Keep responses concise and conversational — two or three sentences maximum unless the question genuinely requires more. Avoid bullet points, markdown, and code blocks in your replies; speak in plain prose.',
      messages: conversationHistory
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        const token = event.delta.text;
        fullText += token;
        sentenceBuf += token;
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
        flushSentences();
      }
    }

    flushSentences(true);  // speak any trailing fragment

    conversationHistory.push({ role: 'assistant', content: fullText });
    saveMemory();
    res.write(`data: ${JSON.stringify({ done: true, memoryMessages: conversationHistory.length })}\n\n`);
    res.end();
  } catch (err) {
    conversationHistory.pop();
    console.error('[chat error]', err.message);
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
});

// ── POST /chat/reset ──────────────────────────────────────────────────────────
app.post('/chat/reset', (_req, res) => {
  conversationHistory.length = 0;
  try { fs.writeFileSync(MEMORY_FILE, '[]'); } catch {}
  res.json({ ok: true });
});

// ── GET /status ───────────────────────────────────────────────────────────────
app.get('/status', (_req, res) => {
  res.json({ ok: true, voiceId: VOICE_ID, playing: !!activeProc, chatReady: !!anthropic, memoryMessages: conversationHistory.length });
});

// ── Audio playback (cross-platform, no extra install on Windows/Mac) ──────────
function playFile(filePath, onDone) {
  let proc;
  if (process.platform === 'win32') {
    const ps = [
      '-NoProfile', '-NonInteractive', '-Command',
      `Add-Type -AssemblyName presentationCore;` +
      `$p = [System.Windows.Media.MediaPlayer]::new();` +
      `$p.Open([uri]::new('${filePath.replace(/\\/g, '\\\\')}'));` +
      `$p.Play();` +
      `Start-Sleep -Milliseconds 500;` +
      `while ($p.NaturalDuration.HasTimeSpan -eq $false) { Start-Sleep -Milliseconds 50 };` +
      `Start-Sleep -Seconds ($p.NaturalDuration.TimeSpan.TotalSeconds + 0.5);` +
      `$p.Close()`
    ];
    proc = spawn('powershell', ps, { stdio: 'ignore' });
  } else if (process.platform === 'darwin') {
    proc = spawn('afplay', [filePath], { stdio: 'ignore' });
  } else {
    proc = spawn('mpg123', ['-q', filePath], { stdio: 'ignore' });
  }
  proc.on('close', onDone);
  proc.on('error', err => {
    console.error(`[audio] playback failed: ${err.message}`);
    if (process.platform === 'linux') console.error('[audio] Fix: sudo apt install mpg123');
    onDone();
  });
  return proc;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

// Match first sentence: at least 20 chars, ending in . ! ? followed by whitespace
function extractSentence(text) {
  const m = text.match(/^.{20,}?[.!?]+(?=\s)/s);
  return m ? m[0] : null;
}

function sanitiseForVoice(text) {
  return text
    .replace(/```[\s\S]*?```/g, 'code block')
    .replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 600);
}

app.listen(PORT, () => {
  console.log('\n  Jarvis is ready.');
  console.log(`  Listening on http://localhost:${PORT}`);
  if (conversationHistory.length) {
    console.log(`  Memory: ${conversationHistory.length} messages loaded from previous session.`);
  } else {
    console.log('  Memory: starting fresh.');
  }
  console.log('\n  Use Claude Code CLI — responses will play through your speakers.');
  console.log('  Test: curl -X POST http://localhost:3000/speak -H "Content-Type: application/json" -d \'{"text":"Jarvis online."}\'\n');
});
