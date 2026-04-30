#!/usr/bin/env bash
# Run once from the repo root to configure the voice assistant for this machine.
# Usage: bash voice-assistant/setup.sh

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SETTINGS_FILE="$REPO_ROOT/.claude/settings.json"
ENV_FILE="$REPO_ROOT/voice-assistant/.env"
HOOK_SCRIPT="$REPO_ROOT/voice-assistant/speak-hook.js"

echo ""
echo "=== Claude Voice Assistant Setup ==="
echo "Repo root: $REPO_ROOT"
echo ""

# ── 1. Install npm deps ───────────────────────────────────────────────────────
echo "[1/4] Installing npm dependencies..."
cd "$REPO_ROOT/voice-assistant" && npm install --silent
echo "      Done."

# ── 2. Create .env if missing ─────────────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  cp "$REPO_ROOT/voice-assistant/.env.example" "$ENV_FILE"
  echo "[2/4] Created .env — add your ElevenLabs API key:"
  echo "      $ENV_FILE"
else
  echo "[2/4] .env already exists — skipping."
fi

# ── 3. Write .claude/settings.json with the correct absolute path ─────────────
mkdir -p "$REPO_ROOT/.claude"
cat > "$SETTINGS_FILE" <<EOF
{
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node $HOOK_SCRIPT"
          }
        ]
      }
    ]
  }
}
EOF
echo "[3/4] Wrote hook path to .claude/settings.json"
echo "      Hook: node $HOOK_SCRIPT"

# ── 4. Check for ElevenLabs key ───────────────────────────────────────────────
if grep -q "your_key_here" "$ENV_FILE" 2>/dev/null; then
  echo ""
  echo "[4/4] ACTION REQUIRED: Open .env and paste your ElevenLabs API key."
  echo "      Get a free key at https://elevenlabs.io (10k chars/month free)"
  echo "      File: $ENV_FILE"
else
  echo "[4/4] ElevenLabs API key detected — ready to go."
fi

echo ""
echo "=== Next steps ==="
echo ""
echo "  1. Start the voice server:"
echo "     cd $REPO_ROOT/voice-assistant && npm start"
echo ""
echo "  2. Expose it to your phone (new terminal):"
echo "     npx ngrok http 3000"
echo ""
echo "  3. Open the ngrok URL in your phone browser and keep the tab open."
echo ""
echo "  4. Use Claude Code CLI on this laptop — it will speak back automatically."
echo ""
