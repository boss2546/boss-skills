# Terminal status bar quota display

Use when Boss asks for quota/reset to “show in Terminal”, “show on this bar”, or points at the Hermes CLI/TUI bottom status line.

## Key lesson

Do not solve this by building a Maymint web dashboard card or by creating a separate shell command such as `quota`. The user specifically wants the existing Hermes Terminal/TUI status bar line itself to include the active-model quota segment.

Correct target surface:
- Backend payload: `~/.hermes/hermes-agent/tui_gateway/server.py`
  - Function: `_get_usage(agent)` emits `usage` for TUI status rendering.
- TUI type contract: `~/.hermes/hermes-agent/ui-tui/src/types.ts`
  - Add optional quota field under `Usage`.
- Renderer: `~/.hermes/hermes-agent/ui-tui/src/components/appChrome.tsx`
  - Component: `StatusRule()` renders the top/bottom status bar.

Wrong surface for this request:
- `maymint-voice-foundation/web/maymint_ui.html`
- `maymint-voice-foundation/scripts/ui_server.py`
- a standalone `/Users/meuu/.local/bin/quota` command

## Desired status bar examples

Antigravity active route:

```text
☤ gemini-3.6-flash-high | 280K/1M | [████░░] 27% | Q 99% | reset 04:20Z | ...
```

OpenAI Codex or other unsupported provider:

```text
☤ gpt-5.5 | 280K/1M | [████░░] 27% | quota n/a | ...
```

## Backend rule

1. Read the live agent route, not stale config:
   - `model = getattr(agent, "model", "")`
   - `provider = getattr(agent, "provider", "")`
2. If `provider == "custom:antigravity"`:
   - Fetch `http://127.0.0.1:8080/account-limits` with a short timeout and small in-process TTL cache.
   - Select only the active model.
   - Support live schema `accounts[].limits[model]` first; fall back to `accounts[].models[]` only for variants/mocks.
   - Emit safe fields only: availability, remaining_percent, reset_at, source, label.
3. If provider is not Antigravity:
   - Do not call port 8080.
   - Emit neutral `not_supported_for_provider` / `quota n/a`.
4. Never expose account emails, OAuth tokens, API keys, raw account objects, or raw proxy payload.

Suggested payload shape under `usage`:

```python
usage["model_quota"] = {
    "availability": "available",
    "remaining_percent": 99,
    "reset_at": "2026-08-09T04:20:55Z",
    "source": "antigravity:/account-limits",
    "label": "Q 99%",
}
```

## Frontend rendering rule

In `StatusRule()`:
- Render the quota segment after model/context and before lower-priority tail segments.
- Width-budget it with `fits(...)` and `stringWidth(...)` so model/context stay visible on narrow terminals.
- Color states:
  - green: available and >15%
  - amber: available and 1–15%
  - red: rate-limited, 0%, source unavailable/invalid for the active model
  - muted: unsupported provider, unknown, model_not_reported

## Tests to add

Backend tests, likely in `tests/test_tui_gateway_server.py`:
- Antigravity + `accounts[].limits` emits `Q NN%`.
- Exhausted active model emits rate-limited status.
- Malformed/timeout source emits safe unavailable/invalid state.
- Non-Antigravity provider emits `quota n/a` and does not call `urlopen`/`:8080`.
- Serialized payload contains no `email`, `token`, `api_key`, or raw account object.

Frontend tests under `ui-tui/src/__tests__/`:
- `StatusRule` renders `Q 99%`.
- Unsupported provider renders `quota n/a`.
- Missing quota field preserves old status bar behavior.
- Narrow terminal does not crush model/context.
