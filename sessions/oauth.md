# Session: Antigravity OAuth Setup

Date: 2026-05-21

## Goal
Complete Google OAuth for Antigravity so Claude models are available through the proxy to opencode.

## Status: INCOMPLETE — needs user interaction

## What's Working
- `antigravity-claude-proxy` v2.8.4 installed globally at `~/.npm-global/bin/antigravity-claude-proxy`
- triune-proxy serving on port 20128 with `anthropic/model` endpoint available
- agent-browser + Chrome 149 headless installed and working
- OAuth callback server successfully starts on port 51121
- Python OAuth script tested: generates URL, starts callback, logs "Waiting for authentication..."
- Screenshot captured of Google Sign-In page (saved at `/tmp/oauth_screenshot.png`)

## What's NOT Done
- No account file at `~/.config/antigravity-proxy/accounts.json`
- `/home/x1/.config/cliproxyapi/auth/` is empty
- triune-proxy returns `"Invalid Anthropic API Key"` for `anthropic/model`

## How to Complete OAuth
Run this command interactively in a terminal (NOT via opencode bash tool — it needs TTY):

```bash
antigravity-claude-proxy accounts add --no-browser
```

This will:
1. Print a Google OAuth URL — open it in a local browser
2. Sign in with a Google account that has Vertex AI / Codey API access
3. Google redirects to `localhost:51121/oauth-callback?code=...` — this will fail on user's machine
4. **Copy the ENTIRE failing redirect URL** from the browser address bar
5. Paste it back into the terminal

After success, the account token is saved and triune-proxy/CLIProxyAPI can route Claude models.

## Auto-Complete Attempt (tested, worked up to Google sign-in page)
A self-contained Node.js script was written at `/tmp/run_oauth.mjs` that:
1. Generates OAuth URL with PKCE
2. Starts callback server on port 51121
3. Waits for the callback with auth code
4. Exchanges code for tokens
5. Saves to `~/.config/antigravity-proxy/accounts.json`

agent-browser successfully opened the Google Sign-In page, but the email/password step requires the user's credentials.

## Snippet for testing proxy after OAuth
```bash
curl -s http://127.0.0.1:20128/v1/chat/completions \
  -H "Authorization: Bearer sk-9router-local" \
  -H "Content-Type: application/json" \
  -d '{"model":"anthropic/model","messages":[{"role":"user","content":"hello"}],"max_tokens":50}'
```

## Relevant Files
- `~/.config/opencode/opencode.jsonc` — provider `9router` → `http://127.0.0.1:20128/v1`
- `~/.npm-global/lib/node_modules/antigravity-claude-proxy/src/cli/accounts.js` — accounts CLI
- `~/.npm-global/lib/node_modules/antigravity-claude-proxy/src/auth/oauth.js` — OAuth flow
- `/tmp/run_oauth.mjs` — standalone OAuth script (can be reused)
