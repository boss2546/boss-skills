# Active-model quota dashboard

Use when adding quota/reset information to a Maymint/Hermes UI that routes models through Antigravity.

## Data sources and truth labels

- `GET http://127.0.0.1:8080/account-limits` is the local read-only source for Antigravity per-model quota fields. Normalize only safe fields: `remainingFraction`, `resetTime`, and model-specific rate-limit/cooldown state.
  - **Proxy schema dual-support note**: Live Antigravity proxy emits `accounts[].limits` as a dictionary mapping model names to limit objects (`acc.limits[requested_model] = {remainingFraction, resetTime}`). Some mock/proxy variants emit `accounts[].models` as an array of objects. Adapters must check `acc.limits` dict first, then fall back to `acc.models` list iteration, to avoid false `model_not_reported` errors.
- `GET /health` is a supporting health/rate-limit source; it is not a complete subscription ledger.
- Label fields as:
  - **Actual**: value supplied by the provider/proxy, e.g. remaining %, reset time, rate-limited state.
  - **Observed**: locally recorded requests/tokens over rolling 5-hour or 7-day windows.
  - **Unavailable**: provider does not expose an authoritative value.
- Session context usage (e.g. `94.5K/272K`) is not subscription credit and must never be relabelled as it.

## Active-route rule

1. Read the currently requested provider/model from the live Hermes route/config, not merely a list of available models.
2. If provider is `custom:antigravity`, request quota only for that exact active/requested model and render one card.
3. If provider is another route (for example OpenAI Codex), do not fetch or display Antigravity quota. Render a neutral “quota unavailable for this provider” state unless an official adapter exists.
4. Distinguish `requested model` from `actual response model`. Do not claim an actual routed model unless runtime/proxy evidence provides it.
5. Never surface account emails, OAuth tokens, API keys, raw proxy payloads, or config contents.

## UI state rules

- Red only when the active model is rate-limited, has verified 0 remaining quota, or the active-model quota source itself is unavailable/invalid.
- Amber for an active verified remaining allowance of 1–15%; green above 15%; neutral for unsupported/unknown/ambiguous states.
- A limit on another model must never make the current model card red.
- Refresh at a modest interval (e.g. 60 seconds); calls remain localhost and read-only.

## Verification before declaring complete

1. Unit-test normalization for healthy, exhausted, missing-model, malformed-source, timeout, and non-Antigravity routes.
2. Endpoint-test the browser API: safe JSON only, active model only, no proxy request for non-Antigravity.
3. Verify against a live redacted `/account-limits` sample at the same timestamp.
4. Run a browser smoke test and visually confirm the active card updates after a route change.
5. If code changes require a service restart, inspect PID/port first and get explicit approval before restarting the existing listener. Do not start a duplicate service.
