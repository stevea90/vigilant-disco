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

// SSE client registry — each open browser tab registers here
let sseClients = [];

// ── SSE stream (browser connects once, stays open) ───────────────────────────
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders();

  // Heartbeat keeps the connection alive through mobile proxies
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

// ── TTS endpoint ──────────────────────────────────────────────────────────────
app.post('/speak', async (req, res) => {
  const { text, source } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text is required' });

  const cleaned = sanitiseForVoice(text);
  if (!cleaned) return res.json({ skipped: true, reason: 'nothing speakable after cleanup' });

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        text: cleaned,
        model_id: 'eleven_turbo_v2_5',        // fastest model, low latency
        voice_settings: { stability: 0.45, similarity_boost: 0.8, style: 0.2 }
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg'
        },
        responseType: 'arraybuffer',
        timeout: 15000
      }
    );

    const audioBase64 = Buffer.from(response.data).toString('base64');
    broadcast('speak', {
      audio: `data:audio/mpeg;base64,${audioBase64}`,
      text: cleaned,
      source: source || 'manual',
      ts: Date.now()
    });

    res.json({ ok: true, chars: cleaned.length, clients: sseClients.length });
  } catch (err) {
    const detail = err.response?.data
      ? Buffer.from(err.response.data).toString()
      : err.message;
    console.error('[TTS error]', detail);
    res.status(502).json({ error: 'ElevenLabs request failed', detail });
  }
});

// ── Status endpoint (health check / debug) ────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({ ok: true, clients: sseClients.length, voiceId: VOICE_ID });
});

// ── Helpers ───────────────────────────────────────────────────────────────────

// Strip markdown so the TTS reads clean prose, not symbols
function sanitiseForVoice(text) {
  return text
    .replace(/```[\s\S]*?```/g, 'code block')  // fenced code → label
    .replace(/`[^`]+`/g, '')                   // inline code → silence
    .replace(/#{1,6}\s/g, '')                  // headings
    .replace(/\*{1,2}([^*]+)\*{1,2}/g, '$1')  // bold/italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // links → anchor text
    .replace(/^\s*[-*+]\s/gm, '')             // bullets
    .replace(/^\s*\d+\.\s/gm, '')            // numbered lists
    .replace(/\n{2,}/g, '. ')               // paragraph breaks → pause
    .replace(/\n/g, ' ')
    .trim()
    .slice(0, 600);                         // cap length — keep voice snappy
}

app.listen(PORT, () => {
  console.log(`Voice assistant running → http://localhost:${PORT}`);
  console.log(`SSE endpoint            → http://localhost:${PORT}/events`);
  console.log(`TTS endpoint            → POST http://localhost:${PORT}/speak`);
});
