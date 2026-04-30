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

const conversationHistory = [];

let currentPlayback = null; // track active playback so we can interrupt later

// ── POST /speak — convert text to speech and play on laptop speakers ──────────
app.post('/speak', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true });

  // Respond immediately — don't make the hook wait for TTS
  res.json({ ok: true, chars: cleaned.length });

  speakText(cleaned, source || 'api');
});

// ── POST /chat — voice input → Claude → TTS → speakers ───────────────────────
app.post('/chat', async (req, res) => {
  if (!anthropic) {
    return res.status(503).json({ error: 'ANTHROPIC_API_KEY not set. Add it to .env and restart.' });
  }

  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  conversationHistory.push({ role: 'user', content: text });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 1024,
      system: 'You are Jarvis, a voice assistant running on a laptop. Keep responses concise and conversational — two or three sentences maximum unless the question genuinely requires more. Avoid bullet points, markdown, and code blocks in your replies; speak in plain prose.',
      messages: conversationHistory
    });

    const reply = message.content[0].text;
    conversationHistory.push({ role: 'assistant', content: reply });

    // Send text back to browser immediately, then speak async
    res.json({ ok: true, response: reply });

    // Play via ElevenLabs in the background
    const cleaned = sanitiseForVoice(reply);
    if (cleaned) speakText(cleaned, 'chat');
  } catch (err) {
    // Roll back the user message so history stays consistent
    conversationHistory.pop();
    console.error('[chat error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ── POST /chat/reset — clear conversation memory ──────────────────────────────
app.post('/chat/reset', (_req, res) => {
  conversationHistory.length = 0;
  res.json({ ok: true });
});

// ── GET /status — health check ────────────────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({ ok: true, voiceId: VOICE_ID, playing: !!currentPlayback, chatReady: !!anthropic });
});

// ── speakText — shared TTS helper used by /speak and /chat ───────────────────
async function speakText(cleaned, source) {
  console.log(`\n[${source || 'api'}] Speaking: ${cleaned.slice(0, 80)}${cleaned.length > 80 ? '…' : ''}\n`);
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: cleaned,
        model_id: 'eleven_flash_v2_5',
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 }
      },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
        responseType: 'arraybuffer',
        timeout: 20000
      }
    );

    const tmpFile = path.join(os.tmpdir(), `jarvis-${Date.now()}.mp3`);
    fs.writeFileSync(tmpFile, Buffer.from(response.data));

    if (currentPlayback) {
      try { currentPlayback.kill(); } catch {}
    }

    currentPlayback = playFile(tmpFile, () => {
      currentPlayback = null;
      try { fs.unlinkSync(tmpFile); } catch {}
    });
  } catch (err) {
    const detail = err.response?.data
      ? Buffer.from(err.response.data).toString()
      : err.message;
    console.error('[TTS error]', detail);
  }
}

// ── Audio playback (cross-platform, no extra install on Windows/Mac) ──────────
function playFile(filePath, onDone) {
  let proc;

  if (process.platform === 'win32') {
    // PowerShell MediaPlayer — built into every Windows 10/11 machine, no install needed
    const ps = [
      '-NoProfile', '-NonInteractive', '-Command',
      `Add-Type -AssemblyName presentationCore;` +
      `$p = [System.Windows.Media.MediaPlayer]::new();` +
      `$p.Open([uri]::new('${filePath.replace(/\\/g, '\\\\')}'));` +
      `$p.Play();` +
      `Start-Sleep -Milliseconds 500;` +                 // give it time to load
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
    if (process.platform === 'linux') {
      console.error('[audio] Fix: sudo apt install mpg123');
    }
    onDone();
  });

  return proc;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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
  console.log('\n  Use Claude Code CLI — responses will play through your speakers.');
  console.log('  Test: curl -X POST http://localhost:3000/speak -H "Content-Type: application/json" -d \'{"text":"Jarvis online."}\'\n');
});
