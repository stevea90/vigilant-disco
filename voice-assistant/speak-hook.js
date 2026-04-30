#!/usr/bin/env node
/**
 * Claude Code Stop hook.
 *
 * Claude Code pipes a JSON event to stdin when a session ends.
 * This script extracts the last assistant message and sends it
 * to the local voice server for TTS playback.
 *
 * Registered in .claude/settings.json — run setup.sh to configure.
 */

const http = require('http');

const VOICE_PORT = process.env.VOICE_PORT || 3000;
const MAX_CHARS = 600;

let raw = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', chunk => (raw += chunk));
process.stdin.on('end', () => {
  try {
    const event = JSON.parse(raw);
    const text = extractLastAssistantText(event);
    if (text && text.length >= 10) post(text);
    else process.exit(0);
  } catch {
    process.exit(0);
  }
});

function extractLastAssistantText(event) {
  // Claude Code Stop hook provides { transcript: [...] } or { messages: [...] }
  const messages = event.transcript ?? event.messages ?? [];
  const last = [...messages].reverse().find(m => m.role === 'assistant');
  if (!last) return '';

  let text = '';
  if (typeof last.content === 'string') {
    text = last.content;
  } else if (Array.isArray(last.content)) {
    text = last.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join(' ');
  }

  return sanitise(text).slice(0, MAX_CHARS);
}

function sanitise(text) {
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
    .trim();
}

function post(text) {
  const payload = JSON.stringify({ text, source: 'claude-hook' });
  const req = http.request(
    {
      hostname: '127.0.0.1',
      port: VOICE_PORT,
      path: '/speak',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 5000
    },
    res => { res.resume(); process.exit(0); }
  );
  req.on('error', () => process.exit(0)); // silent if server not running
  req.on('timeout', () => { req.destroy(); process.exit(0); });
  req.write(payload);
  req.end();
}
