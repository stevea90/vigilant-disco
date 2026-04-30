require('dotenv').config();
const express = require('express');
const axios = require('axios');
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

let currentPlayback = null; // track active playback so we can interrupt later

// ── POST /speak — convert text to speech and play on laptop speakers ──────────
app.post('/speak', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true });

  console.log(`\n[${source || 'api'}] Speaking: ${cleaned.slice(0, 80)}${cleaned.length > 80 ? '…' : ''}\n`);

  // Respond immediately — don't make the hook wait for TTS
  res.json({ ok: true, chars: cleaned.length });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: cleaned,
        model_id: 'eleven_flash_v2_5',  // ~75ms latency, lowest available
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 }
      },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
        responseType: 'arraybuffer',
        timeout: 20000
      }
    );

    // Write to a temp file and play via system audio
    const tmpFile = path.join(os.tmpdir(), `jarvis-${Date.now()}.mp3`);
    fs.writeFileSync(tmpFile, Buffer.from(response.data));

    // Stop any currently playing audio before starting new
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
});

// ── GET /status — health check ────────────────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({ ok: true, voiceId: VOICE_ID, playing: !!currentPlayback });
});

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
