# Reverse Engineering: bertrandmbanwi/Jarvis

Date: 2026-07-31
Local path: `/Users/meuu/Desktop/โปรเจ็ค hermes/Jarvis-bertrandmbanwi`
Upstream: https://github.com/bertrandmbanwi/Jarvis

## Scope

Static inspection only. No full setup or runtime demo was started for this repo. Goal is to decompose the system for possible Maymint/Hermes adaptation.

## Repository Evidence

- Full clone, not shallow.
- Branch: `main`
- Latest commit observed: `5784e0c Merge pull request #28 from bertrandmbanwi/codex/split-workflows`
- Commit count: 110
- Git tracked files: 190
- No submodules.
- No git-lfs files observed.
- GitHub API license is null; README badge says MIT but no `LICENSE` file exists in checkout. Treat license as unclear until verified upstream.

## Top-Level Structure

```text
.env.example
.github/workflows/ci.yml
CLAUDE.md
HOW-TO.md
README.md
com.jarvis.assistant.plist
desktop-overlay/
docs/
evals/
github-setup.sh
jarvis/
pyproject.toml
requirements*.txt
scripts/
setup.sh
start.sh
templates/prompts/
tests/
```

File counts by extension excluding `.git` and common build/dependency folders:

- Python: 108
- TSX: 19
- Shell: 9
- JavaScript: 8
- YAML: 7
- TypeScript: 7
- Markdown: 6
- PNG: 6
- JSON: 5
- HTML: 2
- Swift: 1

## Claimed/Documented Architecture

README architecture shows:

```text
Desktop Overlay + Chrome Extension + Next.js UI
        -> FastAPI server on port 8741
        -> Brain / LLM
        -> Voice Pipeline
        -> Multi-Agent Layer
        -> Tool Registry
        -> Memory + Learning
```

Ports and endpoints:

- UI: `http://localhost:3000` by default.
- API: `http://localhost:8741` by default.
- Ollama fallback: `http://localhost:11434`.
- Overlay websocket: `ws://localhost:8741/ws/overlay`.
- Chrome extension websocket: `ws://localhost:8741/ws/extension`.
- Optional Cloudflare tunnel exposes UI URL when enabled.

## Launch System

Key files:

- `setup.sh` — one-time macOS setup.
- `start.sh` — mode launcher.
- `jarvis/main.py` — Python entrypoint and mode router.

Modes from docs/start script:

```bash
./start.sh text
./start.sh voice
./start.sh server
./start.sh full
```

`full` launches roughly:

1. Ollama if not already running.
2. Desktop overlay on macOS.
3. Next.js UI.
4. Optional Cloudflare tunnel if `JARVIS_ENABLE_TUNNEL=true` and cloudflared exists.
5. FastAPI backend with voice listener.
6. Chrome extension reconnects if installed.

Important risk: `start.sh` has `stop_listeners_on_ports` and may kill listeners on UI/API ports, so inspect port ownership before running. It also opens browser dashboard by default unless `JARVIS_OPEN_DASHBOARD=false`.

## Configuration

Key files:

- `.env.example`
- `jarvis/config/settings.py`
- `jarvis/core/secrets.py`
- `jarvis/core/settings_api.py`

Important env vars:

- `ANTHROPIC_API_KEY` for Claude cloud backend.
- `CLAUDE_FAST_MODEL`, `CLAUDE_BRAIN_MODEL`, `CLAUDE_DEEP_MODEL`.
- `PREFER_CLAUDE=true` default.
- `OLLAMA_BASE_URL`, `OLLAMA_MODEL`, `OLLAMA_FAST_MODEL`.
- `TTS_ENGINE`, `TTS_VOICE`, `TTS_SPEED`, `TTS_BROWSER_FORMAT`.
- `STT_ENGINE`, `WHISPER_MODEL`.
- `API_PORT`, `UI_PORT`.
- `JARVIS_PIN_AUTH_ENABLED`, `JARVIS_ENABLE_TUNNEL`, `JARVIS_PIN`.
- `JARVIS_TOOL_PERMISSION_MODE`; `.env.example` recommends enforce, docs/OPERATIONS says default audit.

Settings layer loads `.env`, then keyring fallback for secrets. Some upstream prompt text is personalized to “Becs”; this must be removed/replaced before adapting to Maymint.

## Backend / Server

Key files:

- `jarvis/core/server.py` — FastAPI app, ~2,781 lines.
- `jarvis/main.py` — run modes and shared voice/server wiring.

Important server features:

- Global `JarvisBrain` instance.
- Auth routes: `/auth/login`, `/auth/status`, `/auth/logout`, `/auth/set-pin`.
- Chat: `POST /chat`.
- Background jobs: `/jobs`, `/jobs/{job_id}`, cancel endpoint.
- Pending tool confirmations: `/tools/pending`, `/tools/confirm`.
- Routines and workflows endpoints.
- Workflow scheduler, approvals, versioning, dry-run, assertions, replay, releases.
- Settings API router.
- Calendar/OAuth/team/profile/proactive/cost APIs.
- WebSocket manager for browser UI, multi-device audio routing, overlay, extension.
- Middleware for tracing, security headers, CSRF protection.

## Brain / Agent Orchestration

Key files:

- `jarvis/core/brain.py`
- `jarvis/core/llm.py`
- `jarvis/agent/planner.py`
- `jarvis/agent/executor.py`
- `jarvis/agent/coordinator.py`
- `jarvis/agent/qa_agent.py`
- `jarvis/agent/task_tracker.py`
- `jarvis/agent/learning.py`

Flow:

1. `JarvisBrain.initialize()` checks LLM backend, initializes memory, wires executor/planner/learning/coordinator/proactive.
2. `JarvisBrain.process()` sanitizes input, catches shutdown requests, handles local routing/simple cases, selects model tier, enriches with memory, and dispatches to agent/tool loop or planner.
3. `_select_tier()` routes simple chat to fast, normal work to brain, complex requests to deep unless cost settings downgrade.
4. `TaskPlanner` uses heuristics first, then optional fast LLM complexity check; max subtasks is 8.
5. `AgentExecutor` selects relevant tools, calls Claude native tool use, executes tools, feeds tool results back, optionally performs QA retry.
6. Multi-step tasks can be decomposed into subtasks with prior-result context.
7. Learning loop records tool reliability and plan outcomes.

## LLM Layer

Key file: `jarvis/core/llm.py`

- Primary: Anthropic Claude API.
- Fallback: Ollama via HTTP.
- Model tiers:
  - fast: `claude-haiku-4-5-20251001`
  - brain: `claude-sonnet-4-6`
  - deep: `claude-opus-4-6`
  - local: `llama3.1:8b`
- Uses Anthropic tool_use schemas from `jarvis/agent/tools_schema.py`.
- Tool result content is truncated at 8,000 chars.
- Has cost tracking and hard budget checks.
- Uses prompt caching when possible.

Maymint note: Instead of adopting Anthropic-only wiring, map this tier concept to Hermes configured providers/OpenRouter/Antigravity/custom providers.

## Tool Registry

Key file: `jarvis/agent/tools_schema.py`

Observed 104 tool schemas and 104 registry entries. Tool groups:

- macOS/app/system: open/close apps, running apps, frontmost app, URL open, volume, brightness, clipboard, paste/write to app, notifications.
- Filesystem: list/read/write/move/copy/create/info/open/search.
- Screen: capture, OCR/read, analyze.
- Shell/coding: run command, smart terminal via Claude Code, run Claude Code, scaffold project.
- Web/search/public data: search web/news/read, weather, currency, crypto, holidays, countries, SEC, IP, spaceflight, citybikes.
- Browser: Playwright persistent browser, tab switching, screenshots, upload, sync sessions.
- Chrome extension bridge: navigate, click, type, read page, find elements, screenshot, tabs, execute JS, fill form, scroll.
- Memory/profile: facts, patterns, preferences, notes.
- Calendar/email: events, calendar list, email read/search/send.
- Meta tools: agent status, learning insights, perf/cache, proactive settings, plan status/history.

Tool modules:

```text
jarvis/tools/browser_agent.py
jarvis/tools/calendar_email.py
jarvis/tools/chrome_extension.py
jarvis/tools/chrome_sync.py
jarvis/tools/claude_code.py
jarvis/tools/filesystem.py
jarvis/tools/mac_control.py
jarvis/tools/notes_access.py
jarvis/tools/public_data.py
jarvis/tools/screen.py
jarvis/tools/shell.py
jarvis/tools/weather.py
jarvis/tools/web_browse.py
jarvis/tools/web_search.py
```

## Permissions / Safety

Key files:

- `jarvis/core/permissions.py`
- `jarvis/core/hardening.py`
- `jarvis/core/pending_actions.py`
- `jarvis/core/confirmation.py`
- `jarvis/tools/filesystem.py`
- `jarvis/tools/shell.py`
- `jarvis/tools/mac_control.py`

Safety features observed:

- Tool permission catalog with risk levels: low, medium, high, critical.
- Capabilities: read/write local, system control, shell, browser, external network, communication, memory, observation, destructive.
- High/critical tools can require confirmation.
- Audit DB at `data/jarvis_security_audit.db`, sensitive keys redacted.
- Shell blocks `rm -rf /`, shutdown/reboot/poweroff/log out/sleep/systemsetup/fdesetup, sensitive prefixes like `rm`, `sudo`, `kill`, `diskutil` unless confirmed.
- AppleScript blocks shut down/restart/log out/sleep/power off and protected app quit attempts.
- Filesystem tools block sensitive paths and credential-like files: `.ssh`, `.aws`, `.kube`, `.docker`, `.env`, PEM/key files, credentials files, keychains, etc.
- Chrome extension JS execution is scoped in code/docs to localhost/tunnel targets.

Caveat: docs/OPERATIONS says default is audit mode, while `.env.example` comments recommend enforce. Before running with real desktop control, set `JARVIS_TOOL_PERMISSION_MODE=enforce`.

## Voice Stack

Key files:

- `jarvis/voice/listener.py`
- `jarvis/voice/speaker.py`
- `jarvis/voice/confirm.py`

Listener:

- PyAudio microphone.
- OpenWakeWord `hey_jarvis_v0.1` if installed, otherwise keyboard activation.
- STT priority: Moonshine ONNX, then faster-whisper, then original whisper.
- Audio sample rate 16 kHz, mono.
- Follow-up window after JARVIS speaks so user can answer without wake word.
- External activation through overlay hotkey calls `request_activation()`.

Speaker:

- TTS priority: Kokoro if selected/available, then Edge TTS, then macOS `say`.
- Naturalizes text for TTS: removes markdown, fixes dashes/ellipsis, contractions, acronym pronunciation.
- Can stream audio chunks/base64 to browser clients.
- Computes amplitude envelope for orb animation.

## UI / Overlay / Browser Bridge

Key files:

- `jarvis/ui/jarvis-ui/package.json`
- `jarvis/ui/jarvis-ui/src/app`
- `jarvis/ui/jarvis-ui/src/components/{auth,chat,cinematic,dashboard,overlay,product,settings,shared}`
- `jarvis/ui/jarvis-ui/src/hooks/{useAuth,useJarvisWebSocket,useServerStatus,useVoiceRecorder}.ts`
- `jarvis/ui/jarvis-ui/src/lib/jarvisOrbRenderer.js`
- `desktop-overlay/JarvisOverlay.swift`
- `desktop-overlay/overlay.html`
- `jarvis/extensions/chrome/background.js`
- `jarvis/extensions/chrome/content.js`

Frontend stack:

- Next.js 15, React 18, TypeScript, Three.js, Tailwind.
- UI modes: cinematic orb, chat, system dashboard, product/workflow/settings panels.
- WebSocket hook talks to API on port 8741.

Desktop overlay:

- Native Swift app using WKWebView.
- Borderless transparent always-on-top window, movable, all Spaces.
- Registers global hotkey Control+Option+J.
- Connects to `ws://localhost:8741/ws/overlay`.
- Shows state, user utterance, assistant response, orb animation.

Chrome extension:

- Manifest V3.
- Background service connects to `ws://localhost:8741/ws/extension`.
- Content script handles DOM/page actions.
- Keepalive via chrome alarms.

## Memory / Learning

Key files:

- `jarvis/memory/store.py`
- `jarvis/memory/conversation_store.py`
- `jarvis/memory/sqlite_store.py`
- `jarvis/memory/facts.py`
- `jarvis/memory/preferences.py`
- `jarvis/agent/learning.py`
- `jarvis/agent/evolution_pipeline.py`
- `jarvis/agent/ab_testing.py`

Memory design:

- ChromaDB persistent vector store under `data/memory/chroma`.
- SQLite/FTS5 fast keyword lookup.
- JSON-like facts/preferences stores.
- Conversation turns are stored, pruned, and used as context.
- Learning loop tracks tool success/failure, planner context, and reliability reports.
- Evolution/A-B pipeline exists for prompt/template improvement.

Maymint note: This overlaps with Hermes memory/session_search/Oracle vault/skills. Avoid copying blindly; extract patterns: reliability tracking, explicit facts vs preferences, cost/perf dashboards.

## Validation / Tests

Key files:

- `scripts/validate.sh`
- `tests/`
- `.github/workflows/ci.yml`

Validation script performs:

```bash
python -m compileall -q jarvis tests scripts
python -m ruff check .
python -m mypy jarvis
python -m pytest tests -q
python scripts/check_tool_contracts.py
python scripts/run_evals.py --offline
python -m bandit -q -r jarvis
# if UI node_modules exists: npm run lint, npm run build, npm audit --audit-level=high
```

Observed test coverage files include auth, confirmation, coordinator, cost controls, hardening, learning, memory, permissions, planner, public data, tool contracts, voice activation/confirmation, weather, app lifecycle, operational infra, and UI smoke.

## Setup Risks / Do Not Run Blindly

`setup.sh` does real machine changes:

- Installs Homebrew packages: portaudio, ffmpeg.
- Checks Ollama.
- Pulls `llama3.1:8b` (~4.7GB) if missing.
- Creates `.venv`.
- Installs Python packages including faster-whisper, kokoro, openwakeword, chromadb.
- Creates `data/` dirs.

`start.sh full` does real machine actions:

- Can start Ollama.
- Can build/open macOS overlay.
- Starts UI and API.
- May kill stale listeners on configured UI/API ports.
- May start Cloudflare tunnel if enabled.
- Opens dashboard unless disabled.

## Recommended safe run path:

1. Do not run `setup.sh` until dependencies/ports are accepted.
2. Prefer creating `.env` with safe settings first:
   - `JARVIS_OPEN_DASHBOARD=false`
   - `JARVIS_ENABLE_TUNNEL=false`
   - `JARVIS_TOOL_PERMISSION_MODE=enforce`
   - `JARVIS_TOOL_PERMISSION_MODE` should fail closed if invalid; upstream may not.
   - `TTS_ENGINE=say` initially
   - map Anthropic backend to available Hermes/OpenRouter later or provide Anthropic key separately.
3. Check ports 3000/8741/11434 before launch.
4. Run `./start.sh text` before `voice` or `full`.
5. Run tests after minimal deps install, not after full desktop launch.

## Subagent Cross-Check Additions

Independent static inspections confirmed the overall architecture and added these details:

- `server.py` route inventory:
  - Auth: `/auth/login`, `/auth/status`, `/auth/logout`, `/auth/set-pin`.
  - Core: `POST /chat`, `/jobs`, `/tools/pending`, `/tools/confirm`.
  - Observability/config: `/health`, `/perf`, `/cache`, `/costs`, `/privacy`, `/models`, `/profile`, `/plan`, `/learning`, `/agents`.
  - Voice: `POST /voice/transcribe` uses ffmpeg temp file + faster-whisper.
  - WebSockets: `/ws`, `/ws/extension`, `/ws/overlay`.
- Auth details:
  - Localhost bypasses auth; remote uses PIN/session token.
  - Query-token auth is off by default unless `JARVIS_ALLOW_QUERY_TOKEN`.
  - Non-local state-changing requests need `X-JARVIS-Client` CSRF header.
- Planner/coordinator details:
  - Agent types include researcher, coder, browser, system, communicator, analyst, generalist.
  - Coordinator builds dependency-based parallel groups with max parallel 3.
  - Complex plan execution broadcasts plan progress to UI and creates final LLM summary.
- UI/voice details:
  - Web UI modes include cinematic, chat, dashboard, product.
  - Three.js orb uses about 2,400 particles and shared renderer for UI/overlay.
  - Browser mic path uses MediaRecorder Opus/WebM or mp4/webm, then backend `/voice/transcribe` converts to WAV 16k mono with ffmpeg.
  - Overlay docs say click-through, but Swift code sets `window.ignoresMouseEvents = false`; current overlay is draggable/clickable, not true click-through.
  - `settings.py` exposes `WAKE_WORD_MODEL=hey_jarvis`, but listener hardcodes `hey_jarvis_v0.1`.
  - `.env.example` comments `UI_PORT=3741`, while code/docs default to `3000`.
- Security details:
  - Tool selector reduces tool schemas to lower token/cost.
  - Shell has two guard layers: tool-level blocklist plus executor hardening regex.
  - Some high/critical tools are not marked `requires_confirmation=True`, notably `write_file`, `move_file`, `paste_to_app`, `write_to_app`, `chrome_type`, `chrome_execute_js`, `chrome_fill_form`, `run_claude_code`, `scaffold_project`, `forget_fact`.
  - `run_claude_code` can add `--dangerously-skip-permissions` if `JARVIS_CLAUDE_CODE_SKIP_PERMISSIONS` is set.
  - Persistent Playwright profile and cookie sync can expose real sessions/logins.
  - Memory/facts can be injected into cloud LLM prompts when privacy mode is off.

## What to Reuse for Maymint/Hermes

High-value patterns:

1. Desktop overlay pattern: Swift WKWebView always-on-top orb + WS state feed + global hotkey.
2. Voice pipeline shape: wake word → one-shot capture → STT → brain → TTS → follow-up window.
3. Tool permission catalog with capabilities/risk/confirmation/audit.
4. Tool registry grouping and schema discipline.
5. Multi-device WebSocket audio routing.
6. Browser bridge extension plus Playwright fallback.
7. Cost dashboard and tier routing.
8. Memory split: facts/preferences/conversation/semantic search.
9. Planner + executor + QA retry as a bounded multi-step flow.
10. Validation stack and tool-contract tests.

Do not reuse as-is:

- Persona/system prompt hard-coded for “Becs” and JARVIS.
- Anthropic-only model names.
- Full shell/desktop control without adapting confirmation into Hermes safety model.
- Auto port-kill behavior.
- Cloudflare tunnel defaults without explicit opt-in.
- Ollama model pull as mandatory setup step.

## Adaptation Direction

Best Maymint architecture from this repo:

```text
Maymint UI/Overlay/Voice
  -> local FastAPI/WebSocket shim or Hermes gateway
  -> Hermes brain/providers/memory/tools
  -> desktop-tool adapter with explicit confirmation
  -> Oracle vault/session/memory/skills as long-term brain
```

Practical phases:

1. Study-only: read tests and modules, no install.
2. Safe smoke: create venv, install only backend test deps, run compile/tool contract tests if possible.
3. LLM adapter: make JARVIS LLM layer talk to Hermes/OpenRouter instead of Anthropic/Ollama.
4. UI extraction: run/copy Next.js orb or Swift overlay with fake WS state first.
5. Tool adapter: port selected macOS/screen/browser tools into Hermes skills/tools with confirmation.
6. Voice integration: use existing Maymint Discord/web voice first; local OpenWakeWord/overlay hotkey later.
