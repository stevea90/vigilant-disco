# Claude Voice Assistant

Voice playback layer for Claude Code. Claude speaks its responses back to you automatically.

## Quickstart (15 minutes)

### 1. Install & configure

```bash
cd voice-assistant
npm install
cp .env.example .env
# Edit .env — add your ElevenLabs API key
```

Get a free ElevenLabs key at https://elevenlabs.io (10,000 chars/month free).

### 2. Start the server

```bash
npm start
# → Voice assistant running on http://localhost:3000
```

### 3. Expose to your phone

```bash
# Option A: ngrok (easiest)
npx ngrok http 3000
# Copy the https URL, open it in your mobile browser

# Option B: same WiFi network
# Open http://<your-laptop-ip>:3000 on your phone
```

### 4. Register the Claude Code hook

The `.claude/settings.json` is already configured. Update the path if your
repo lives somewhere other than `/home/user/vigilant-disco`:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "node /path/to/voice-assistant/speak-hook.js"
      }]
    }]
  }
}
```

### 5. Test it

Keep the browser tab open on your phone. Ask Claude anything. It speaks back.

To test the endpoint directly:
```bash
curl -X POST http://localhost:3000/speak \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, your voice assistant is working."}'
```

---

## Files

| File | Purpose |
|------|---------|
| `server.js` | Express server — TTS + SSE broadcast |
| `speak-hook.js` | Claude Code Stop hook — reads transcript, triggers TTS |
| `public/index.html` | Mobile web player with history + mute/replay |
| `mcp-voice-bridge.js` | Spoken confirmations for GitHub/ServiceNow MCP actions |
| `.env.example` | Environment variable template |

---

## Voice Commands → Actions (with MCP)

| Say | Claude does |
|-----|-------------|
| "Commit my changes with message: fix login" | git commit + push, speaks confirmation |
| "Open a pull request for this branch" | Creates PR via GitHub MCP, speaks PR number |
| "Create a ServiceNow ticket for the login bug" | Creates INC ticket, speaks ticket number |
| "Deploy version 2 to production" | Triggers SN deployment, speaks result |
| "What did you just do?" | Replays last spoken response |

---

## Evolution Path

- **Now**: Text → ElevenLabs → SSE → Mobile browser
- **Next**: Add wake word detection (say "Hey Claude" to interrupt)
- **Later**: WebRTC for real-time bidirectional voice
- **Avatar**: Add D-ID or HeyGen for animated face layer

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for a full diagram.
