require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';
const PORT = process.env.PORT || 3000;

if (!ELEVENLABS_API_KEY) {
  console.error('ERROR: ELEVENLABS_API_KEY is not set. Copy .env.example to .env and add your key.');
  process.exit(1);
}

// SSE clients — each open browser tab
let sseClients = [];

// ── SSE stream ────────────────────────────────────────────────────────────────
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  const heartbeat = setInterval(() => res.write(': ping\n\n'), 25000);
  sseClients.push(res);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients = sseClients.filter(c => c !== res);
  });
});

function broadcast(event, payload) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  sseClients.forEach(c => c.write(msg));
}

// ── /speak — buffered (full audio, then plays) ────────────────────────────────
// Good for short responses. Lower complexity.
app.post('/speak', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: cleaned,
        model_id: 'eleven_flash_v2_5',   // fastest model ~75ms latency
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 }
      },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
        responseType: 'arraybuffer',
        timeout: 20000
      }
    );

    const audio = `data:audio/mpeg;base64,${Buffer.from(response.data).toString('base64')}`;
    broadcast('speak', { audio, text: cleaned, source: source || 'api', ts: Date.now() });
    res.json({ ok: true, chars: cleaned.length, clients: sseClients.length });
  } catch (err) {
    const detail = err.response?.data
      ? Buffer.from(err.response.data).toString()
      : err.message;
    console.error('[TTS error]', detail);
    res.status(502).json({ error: 'ElevenLabs request failed', detail });
  }
});

// ── /speak-stream — streaming (audio chunks arrive as they're generated) ──────
// Noticeably faster first-sound latency. The browser stitches chunks together.
// ElevenLabs streams MP3 chunks; we forward them as base64 SSE events.
app.post('/speak-stream', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true });

  // Tell the browser a stream is starting
  broadcast('stream-start', { text: cleaned, ts: Date.now() });

  res.json({ ok: true, chars: cleaned.length }); // respond to hook immediately

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        text: cleaned,
        model_id: 'eleven_flash_v2_5',
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.15 },
        // Optimise for latency: send audio as soon as the first chunk is ready
        optimize_streaming_latency: 4
      },
      {
        headers: { 'xi-api-key': ELEVENLABS_API_KEY, Accept: 'audio/mpeg' },
        responseType: 'stream',
        timeout: 30000
      }
    );

    const chunks = [];
    response.data.on('data', chunk => {
      chunks.push(chunk);
      // Broadcast each chunk so the browser can start buffering immediately
      broadcast('stream-chunk', {
        chunk: chunk.toString('base64'),
        ts: Date.now()
      });
    });

    response.data.on('end', () => {
      const full = Buffer.concat(chunks);
      broadcast('stream-end', {
        audio: `data:audio/mpeg;base64,${full.toString('base64')}`,
        ts: Date.now()
      });
    });

    response.data.on('error', err => {
      console.error('[stream error]', err.message);
      broadcast('stream-error', { error: err.message });
    });
  } catch (err) {
    console.error('[speak-stream error]', err.message);
    broadcast('stream-error', { error: err.message });
  }
});

// ── /status ───────────────────────────────────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({ ok: true, clients: sseClients.length, voiceId: VOICE_ID, port: PORT });
});

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
  console.log('');
  console.log('  Claude Voice Assistant');
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  Status:  http://localhost:${PORT}/status`);
  console.log('');
  console.log('  Waiting for Claude Code hook to fire...');
  console.log('');
});
