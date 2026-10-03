---
name: antigravity
description: Command and interactive menu runbook for managing Antigravity Proxy, Maymint Watchdog, model quotas, and account switching.
---

# /antigravity Skill & Interactive Menu Runbook

When the user types `/antigravity` in the chat or selects the `/antigravity` autocomplete entry:
- **Do not ask for further confirmation or explain technical background unless asked.**
- **Directly execute the interactive menu script** located in this skill's `scripts/` directory via the terminal tool using pty=True mode:

```bash
python3 /Users/meuu/.hermes/skills/oracle/antigravity/scripts/menu.py
```

## Available Functions in Menu
1. `[1] 🔍 Check System Status`: Verify health of Proxy (8080), Maymint UI (8787), and Hermes Agent.
2. `[2] 🤖 List Available Models`: List all 19 supported models.
3. `[3] 📊 Check Model Quotas`: Test real-time quota status for Gemini and Claude models.
4. `[4] 🔄 Account Switch & Reconnect`: Reconnect and verify after switching Antigravity accounts in the IDE/App.

## Default Model Policy

### Hermes startup resilience / permanent proxy fix

When Hermes fails on `custom:antigravity` with `APIConnectionError` to `http://127.0.0.1:8080`, treat this as the local Antigravity proxy not listening, not as a model/context failure. Boss expects the previously-designed permanent fix to be used instead of re-explaining the same diagnosis.

Preferred durable pattern on macOS:
1. Keep Hermes's active model on the working fallback (usually OpenAI Codex) while repairing proxy; do not switch back to Antigravity until a real smoke test passes.
2. Ensure a LaunchAgent exists for the proxy with `RunAtLoad`, `KeepAlive`, logs under `~/.hermes/logs/`, and a pinned proxy version instead of `@latest` to avoid surprise breakage.
3. Use a wrapper command such as `~/.local/bin/hrtmes` to best-effort `launchctl bootstrap/kickstart` the proxy, wait briefly for `127.0.0.1:8080`, then run `hermes --continue` so opening Hermes from anywhere resumes the latest session.
4. Loading/unloading LaunchAgents (`launchctl bootstrap`, `bootout`, `kickstart`) changes login/runtime services; ask for explicit approval before executing if the approval system blocks or the user has not already consented.
5. Verify with: `launchctl print gui/$(id -u)/<label>`, process check for `antigravity-claude-proxy`, and `curl -m 5 http://127.0.0.1:8080/health` or `/v1/models`. Report PASS/PARTIAL/BLOCKED honestly.

Pitfall: if a previous session already designed or partially wrote the LaunchAgent/wrapper, inspect/use that artifact first. Do not ask “how should we fix this?” again; continue from the existing design and only ask for the side-effectful service-load approval.

- **Current newest tested proxy models**: `gemini-3.8-flash-high` and `gemini-3.8-flash-tiered` via `custom:antigravity` — verified live and active in session on 2026-09-25 (matching `~/.gemini/antigravity-cli/settings.json` and proxy `/v1/models`).
- **Fallback-map limitation (v2.8.5)**: Starting the proxy with `--fallback` enables only the static `MODEL_FALLBACK_MAP`. That map contains `gemini-3.1-pro-high`, `gemini-3.1-pro-low`, `gemini-3-flash`, and the two Claude models, but **does not contain `gemini-3.8-flash-high` or `gemini-3.8-flash-tiered`**. Do not claim that `--fallback` protects the active 3.8 High route unless an explicit, verified mapping is added; prefer a Hermes-level Codex fallback for durable coverage. If Boss explicitly approves a proxy-local route, add `'gemini-3.8-flash-tiered': 'claude-sonnet-4-6'` in `src/constants.js::MODEL_FALLBACK_MAP`, restart the actual detached Node child (not merely its exited launch wrapper), and verify the new process includes `--fallback`. This npx-cache patch is lost on proxy reinstall/update; a successful normal 3.8 request proves only normal routing, not that the fallback branch was exercised.
- **Model Picker Viewport & Tier Naming Pitfall**: Terminal modal only shows ~10 models at a time out of 23. `gemini-3.8-flash-high` and `gemini-3.8-flash-tiered` sit near the bottom (position 19-23), requiring the user to scroll down with Arrow Down (`↓`). Clarify that `-high` provides maximum thinking budget (up to 128k tokens / 32k default) whereas `-tiered` balances speed/budget.
- **Reasoning Effort UI vs CLI Mapping**: In Antigravity IDE UI, the user selects a base model (`Gemini 3.8 Flash`) and sets the `Effort` slider to `high` (displays `Gemini 3.8 Flash (High)`). In Hermes CLI / proxy, this is exposed as an alias model ID `gemini-3.8-flash-high` which maps to `gemini-3.8-flash-tiered` with high thinking parameters injected server-side. Always verify via both UI semantics and live `/v1/models` endpoint before claiming a model or effort level does not exist. See `references/antigravity-gemini-3-8-and-tiered-routing.md`.
- **IDE label caveat**: Antigravity IDE may show “Gemini 3.7 Flash High”, but local proxy v2.8.5 rejects API id `gemini-3.7-flash-high` with HTTP 400 invalid model. Use exact proxy id `gemini-3.7-flash-tiered` or `gemini-3.8-flash-tiered` matching `/v1/models`.
- **Previous stable route**: `gemini-3.6-flash-high` via `custom:antigravity` remains a known-good fallback.
- **Avoid**: `gemini-3.1-pro-high` (known Cloud Code proxy incompatibility: HTTP 400 `INVALID_ARGUMENT`; use `gemini-3.1-pro-low` instead), `gemini-2.5-pro` (per-model upstream rate-limit/capacity; confirm its reset time before retrying).
- Claude models (`claude-sonnet-4-6`, `claude-opus-4-6-thinking`) work fine on Google AI Ultra plan — only fail if account quota is exhausted.
- If current session model errors HTTP 400, first verify exact model id from `/v1/models`; use `gemini-3.7-flash-tiered` or fallback `gemini-3.6-flash-high`.

## Known Broken Models (as of 2026-08-08)
| Model | Issue | Use Instead |
|:---|:---|:---|
| `gemini-3.1-pro-high` | Live tests return HTTP 400 `INVALID_ARGUMENT` while quota is reported as available. Treat as a proxy/upstream request-routing incompatibility; do not claim quota exhaustion. The earlier thinking-classification patch was insufficient; see `references/antigravity-model-alias-bug.md`. | `claude-opus-4-6-thinking` or `gemini-3.1-pro-low` |
| `gemini-2.5-pro` | Live tests may return HTTP 400 with an embedded `RESOURCE_EXHAUSTED` message, or hang in Hermes retry loops. Parse the response body, not only the HTTP status; use the reset time from health/quota data. | `gemini-2.5-flash-thinking` |

## Critical Configuration Pairing Rule
Hermes model switching can leave a model name from one provider in the active config while retaining another provider. Validate the provider/model pair together:
- `custom:antigravity` must use a model present in proxy `/v1/models`; recommended default is `gemini-3.6-flash-high`.
- `gpt-5.6-luna` belongs to the OpenAI Codex route in this environment; it is invalid when sent to the Antigravity proxy.
- If invalid, backup `~/.hermes/config.yaml`, set a valid pair, run `hermes config check`, and perform a default smoke test.

## End-to-End Verification Workflow
For full Antigravity/Hermes recovery:
1. Read config with secrets redacted; verify provider, default, base URL, API mode, streaming, and model count.
2. Inspect processes/listeners before starting anything. Port 8080 is the proxy; 8787 is Maymint Voice UI. If a listener exists, never start a duplicate. If health fails, report PID/command and ask before restart/kill.
3. Check `/health` and `/v1/models`; record HTTP code, latency, account counts, per-model rate limits, reset times, and model count.
4. Run a real non-streaming POST to `/v1/messages` for every configured model, recording requested model, returned model, PASS/FAIL/FALLBACK/TIMEOUT, HTTP code, latency, and redacted response/error snippet. A result is `FALLBACK` (not PASS) when returned model differs from requested. Interpret embedded `RESOURCE_EXHAUSTED` separately from generic HTTP 400.
5. Run Hermes default and representative explicit-model smoke tests. A default test is mandatory after config repair.
6. Read recent Hermes logs and correlate model/provider/base URL with live-test failures.
7. Report what was already running versus what this run started, plus PID/port/command and every changed file/backup path.

Keep the detailed model list, request payload, and report schema in `references/antigravity-model-status.md`; keep the alias-bug trace in `references/antigravity-model-alias-bug.md`; see `references/antigravity-multi-account-pool.md` for multi-account load balancing and failover setup; consult `references/gemini-pro-high-and-2-5-pro-research.md` before proposing a patch or configuration workaround for the two Pro models; use `references/antigravity-gemini-3-7-model-id.md` when reconciling new IDE display labels with exact proxy `/v1/models` API ids; and use `references/antigravity-model-ranking-and-benchmarking.md` when Boss asks which Antigravity/Gemini model is strongest or asks for local mini-benchmark comparisons against frontier models.

**INVALID_ARGUMENT triage:** If a model shows quota>0 in `/account-limits` but returns 400, check whether `isThinkingModel()` in proxy source wrongly returns true for it (version>=3 heuristic catches non-thinking models). Patching node_modules fixes it but resets on proxy update — use alternative model instead.

## Boss Testing Preferences (CRITICAL)
- When boss says "เทสแบบละเอียด" = run ACTUAL live subprocess test per model, one by one, printing each result line with latency + response snippet. Never report PASS/FAIL without real output evidence.
- Boss requires interactive menu IN CHAT (not just terminal commands). `/antigravity` in chat = run menu.py and present results in chat.
- Boss gets frustrated if redirected to "open terminal and run X" when he wants chat-level interaction.
- Always show tabular results with model name, status, latency, response snippet.

## User UX & Interaction Preference
- The user prefers selecting `/antigravity` from the autocomplete/slash menu directly in the chat to see and select sub-options (1-4).
- Avoid executing raw shell commands that prompt for interactive user confirmation without prior consent.
- `streaming.enabled` must be `true` in config.yaml — if chat seems unresponsive, check this first with `hermes config set streaming.enabled true`.

## Active-model quota dashboards and terminal status bar
When adding quota/reset display to Maymint or Hermes UI/CLI, show only the current active/requested model and preserve source truth: provider quota/reset is `Actual`; local rolling 5-hour/week logs are `Observed`; unavailable provider data remains unavailable. Do not infer subscription credits from context usage or show all models' quota. Use `references/active-model-quota-dashboard.md` for the general contract, states, and verification checklist.

### Boss correction: “show in Terminal” means the existing TUI status bar
If Boss says it should “show in Terminal”, points at the bottom status line, or complains that a separate command is not enough, do **not** solve it with the Maymint web dashboard or a standalone `quota` command. The correct target is the existing Hermes TUI status bar line itself.

Terminal Status Bar vs Config `display.show_cost` Pitfall:
- `display.show_cost: true` in config does NOT display USD cost in the modern CLI status bar mixin (`hermes_cli/cli_status_bar_mixin.py` has no cost rendering logic). Do not claim it adds `$0.00...` to the bar.
- To display real-time remaining quota in the terminal status bar, wire provider quota from `127.0.0.1:8080/account-limits` into the status bar segment or TUI status rule.

Patch path:
1. Backend: `~/.hermes/hermes-agent/tui_gateway/server.py::_get_usage(agent)` adds a safe `usage.model_quota` payload.
2. Type contract: `~/.hermes/hermes-agent/ui-tui/src/types.ts::Usage` adds optional quota fields.
3. Renderer: `~/.hermes/hermes-agent/ui-tui/src/components/appChrome.tsx::StatusRule()` renders `Q NN%` or `quota n/a` after model/context.

Provider rule: only fetch Antigravity quota from `127.0.0.1:8080/account-limits` when the live agent provider is `custom:antigravity`; for Codex/OpenAI or other providers, render neutral `quota n/a` and do not call the Antigravity proxy. See `references/terminal-statusbar-quota.md` for the exact implementation plan, payload shape, colors, and tests.
