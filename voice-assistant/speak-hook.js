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
const fs = require('fs');

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

function readTranscript(transcriptPath) {
  try {
    const lines = fs.readFileSync(transcriptPath, 'utf8').trim().split('\n');
    return lines.map(l => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  } catch {
    return [];
  }
}

function extractLastAssistantText(event) {
  // Claude Code Stop hook sends { transcript_path } pointing to a JSONL file
  const entries = event.transcript_path
    ? readTranscript(event.transcript_path)
    : (event.transcript ?? event.messages ?? []);

  const last = [...entries].reverse().find(e => {
    const role = e.role ?? e.message?.role;
    const type = e.type;
    if (type === 'assistant' || role === 'assistant') {
      const content = (e.message ?? e).content;
      return Array.isArray(content)
        ? content.some(b => b.type === 'text')
        : typeof content === 'string' && content.length > 0;
    }
    return false;
  });
  if (!last) return '';

  const msg = last.message ?? last;
  const content = msg.content;

  let text = '';
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    text = content
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
