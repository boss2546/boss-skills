# Antigravity Model Status Reference (2026-08-08)

## Live Test Results — 19 Models (Google AI Ultra Plan)

| Model | Status | Latency | Notes |
|:---|:---:|:---:|:---|
| gemini-3.6-flash-high | ✅ PASS | ~5-7s | Primary recommended |
| gemini-3.6-flash-medium | ✅ PASS | ~6s | |
| gemini-3.6-flash-low | ✅ PASS | ~5s | |
| gemini-3.6-flash-tiered | ✅ PASS | ~5s | |
| gemini-3.1-pro-low | ✅ PASS | ~9s | Slower but works |
| gemini-3.1-flash-lite | ✅ PASS | ~5s | |
| gemini-3.1-flash-image | ✅ PASS | ~7-10s | Vision capable |
| gemini-3.5-flash-low | ✅ PASS | ~5s | |
| gemini-3.5-flash-extra-low | ✅ PASS | ~4.9s | Fastest overall |
| gemini-2.5-flash | ✅ PASS | ~4-5s | |
| gemini-2.5-flash-lite | ✅ PASS | ~5s | |
| gemini-2.5-flash-thinking | ✅ PASS | ~5s | Good for complex tasks |
| gemini-3-flash | ✅ PASS | ~5s | |
| gemini-3-flash-agent | ✅ PASS | ~5s | |
| gemini-pro-agent | ✅ PASS | ~8-10s | |
| claude-sonnet-4-6 | ✅ PASS | ~5-6s | Requires Ultra plan quota |
| claude-opus-4-6-thinking | ✅ PASS | ~6s | Requires Ultra plan quota |
| **gemini-3.1-pro-high** | ❌ FAIL | ~5s | INVALID_ARGUMENT always — Proxy backend issue |
| **gemini-2.5-pro** | ⚠️ TIMEOUT | >25s | Too slow every request |

## Claude-to-Gemini Fallback Bug (fixed locally 2026-08-08 20:33)

Symptom: a Hermes request selecting `claude-sonnet-4-6` returned `RESOURCE_EXHAUSTED` for `gemini-3-flash` because the proxy silently redirected Claude to Gemini.

Local fix: removed both `claude-sonnet-4-6 → gemini-3-flash` and `claude-opus-4-6-thinking → gemini-3.1-pro-high` mappings from `MODEL_FALLBACK_MAP`; Gemini → Claude fallbacks remain.

Verification after restart:
- `getFallbackModel('claude-sonnet-4-6')` = `null`
- `getFallbackModel('claude-opus-4-6-thinking')` = `null`
- Direct Sonnet test with 43,195 input tokens: HTTP 200, 5.53s, returned model `claude-sonnet-4-6`.

Backup: `~/.npm/_npx/e6962cfe180333b5/node_modules/antigravity-claude-proxy/src/constants.js.bak-disable-claude-gemini-fallback-20260808-2033`.
Caveat: this npx-cache patch can be overwritten by a proxy package update/reinstall.

## Streaming Config
- `streaming.enabled` must be `true` — if chat seems frozen/unresponsive, run: `hermes config set streaming.enabled true`

## Account Cooldown Warning
- Running many requests on `gemini-2.5-pro` (timeout) can trigger `rateLimitCooldownRemaining` on the account (~5hrs)
- This does NOT block other models — Claude and Gemini Flash still work during cooldown

## Vision/Image Support
- Models that accept image attachments: `gemini-3.1-flash-image`, `gemini-3.6-flash-*`, `claude-sonnet-4-6`, `claude-opus-4-6-thinking`
- Models that do NOT accept images: `gemini-3.1-pro-high`, `gemini-3.1-pro-low`, most agent variants
- Attaching an image to a non-vision model = HTTP 400 INVALID_ARGUMENT (not a quota issue)
