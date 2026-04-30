# setup.ps1 — run once from the repo root in PowerShell
# Usage: .\voice-assistant\setup.ps1

$ErrorActionPreference = "Stop"

$repoRoot   = Split-Path -Parent $PSScriptRoot
$envFile    = Join-Path $PSScriptRoot ".env"
$hookScript = Join-Path $PSScriptRoot "speak-hook.js"
$settingsDir= Join-Path $repoRoot ".claude"
$settingsFile = Join-Path $settingsDir "settings.json"

Write-Host ""
Write-Host "=== Jarvis Setup (Windows) ===" -ForegroundColor Magenta
Write-Host "Repo root: $repoRoot"
Write-Host ""

# 1. npm install
Write-Host "[1/3] Installing npm dependencies..."
Push-Location $PSScriptRoot
npm install --silent
Pop-Location
Write-Host "      Done."

# 2. Create .env if missing
if (-not (Test-Path $envFile)) {
    Copy-Item (Join-Path $PSScriptRoot ".env.example") $envFile
    Write-Host "[2/3] Created .env - add your ElevenLabs API key:"
    Write-Host "      $envFile" -ForegroundColor Yellow
} else {
    Write-Host "[2/3] .env already exists - skipping."
}

# 3. Write .claude/settings.json with correct absolute path
if (-not (Test-Path $settingsDir)) {
    New-Item -ItemType Directory -Path $settingsDir | Out-Null
}

# Use forward slashes in the JSON path so Node.js handles it cleanly
$hookPath = $hookScript.Replace("\", "/")

$settings = @{
    hooks = @{
        Stop = @(
            @{
                matcher = ""
                hooks = @(
                    @{
                        type    = "command"
                        command = "node $hookPath"
                    }
                )
            }
        )
    }
} | ConvertTo-Json -Depth 6

Set-Content -Path $settingsFile -Value $settings -Encoding UTF8
Write-Host "[3/3] Wrote hook path to .claude/settings.json"
Write-Host "      Hook: node $hookPath"

# Check for API key
$envContent = Get-Content $envFile -Raw
if ($envContent -match "your_key_here") {
    Write-Host ""
    Write-Host "ACTION REQUIRED: Open .env and paste your ElevenLabs API key." -ForegroundColor Yellow
    Write-Host "Get a free key at https://elevenlabs.io (10k chars/month free)"
    Write-Host "File: $envFile" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "ElevenLabs API key detected - ready to go." -ForegroundColor Green
}

Write-Host ""
Write-Host "=== Next steps ===" -ForegroundColor Magenta
Write-Host ""
Write-Host "  1. Start the voice server:"
Write-Host "     cd voice-assistant && npm start" -ForegroundColor Cyan
Write-Host ""
Write-Host "  2. In a second terminal, run Claude Code CLI:"
Write-Host "     claude" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Jarvis will speak Claude's responses through your laptop speakers."
Write-Host ""
