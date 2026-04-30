# Claude Voice Assistant — Architecture

## MVP Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR MOBILE DEVICE                      │
│                                                                 │
│   🎙️ Voice → Claude Code app → text prompt                      │
│                     │                                           │
│                     ▼                                           │
│             Claude generates response                           │
│                     │                                           │
│                     ▼                                           │
│         Claude Code Stop hook fires                             │
│         (speak-hook.js reads transcript)                        │
│                     │                                           │
│                     ▼                                           │
│         POST /speak → voice server (Node.js)                    │
│                     │                                           │
│                     ▼                                           │
│         ElevenLabs TTS API → MP3 audio                          │
│                     │                                           │
│                     ▼                                           │
│         SSE broadcast to browser tab                            │
│                     │                                           │
│                     ▼                                           │
│   🔊 Audio auto-plays in mobile browser                         │
└─────────────────────────────────────────────────────────────────┘
```

## Component Map

```
vigilant-disco/
├── voice-assistant/
│   ├── server.js            ← Express server (TTS + SSE)
│   ├── speak-hook.js        ← Claude Code Stop hook
│   ├── mcp-voice-bridge.js  ← GitHub / ServiceNow voice confirmations
│   ├── public/
│   │   └── index.html       ← Mobile web player (PWA-ready)
│   ├── package.json
│   └── .env.example
└── .claude/
    └── settings.json        ← Hook registration
```

## Deployment Options (MVP → Production)

| Stage | Option | Effort |
|-------|--------|--------|
| MVP | Run server on your laptop, open ngrok tunnel | 10 min |
| Step 2 | Deploy to Railway / Fly.io (free tier) | 30 min |
| Step 3 | Cloudflare Worker + R2 for audio caching | 2 hr |
| Production | WebRTC real-time with interruption support | 1 day |

## Real-Time Evolution Path

```
MVP (HTTP polling)
  └─→ SSE (current — instant push, no polling)
        └─→ WebSocket (bidirectional, enables interruption)
              └─→ WebRTC (sub-200ms, VAD, full duplex)
```

## Voice Command → Action Flow (MCP)

```
"Commit my changes"
        │
        ▼
  Claude interprets
        │
        ├─→ MCP tool: git_commit(message)
        │
        ├─→ MCP tool: github_push(branch)
        │
        └─→ mcp-voice-bridge.speakResult("Done. Committed...")
                │
                ▼
           🔊 Audio plays on mobile
```
