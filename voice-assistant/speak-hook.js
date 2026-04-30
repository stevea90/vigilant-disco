#!/usr/bin/env node
/**
 * Claude Code Stop hook — sends the last assistant response to the voice server.
 * Claude Code pipes a JSON transcript to stdin when a session ends.
 *
 * Install: add to .claude/settings.json → hooks → Stop
 */

const http = require('http');

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);

    // Find the last assistant text message in the transcript
    const messages = data.transcript ?? data.messages ?? [];
    const last = [...messages].reverse().find(m => m.role === 'assistant');
    const text = extractText(last);

    if (!text || text.length < 15) process.exit(0);

    post({ text, source: 'claude-hook' });
  } catch {
    process.exit(0);
  }
});

function extractText(msg) {
  if (!msg) return '';
  if (typeof msg.content === 'string') return msg.content;
  if (Array.isArray(msg.content)) {
    return msg.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join(' ');
  }
  return '';
}

function post(body) {
  const payload = JSON.stringify(body);
  const req = http.request(
    {
      hostname: '127.0.0.1',
      port: process.env.VOICE_PORT || 3000,
      path: '/speak',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    },
    res => {
      res.resume(); // drain and exit
      process.exit(0);
    }
  );
  req.on('error', () => process.exit(0)); // server not running — silent fail
  req.write(payload);
  req.end();
}
