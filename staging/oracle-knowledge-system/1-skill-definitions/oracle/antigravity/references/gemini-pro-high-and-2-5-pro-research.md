# Community evidence: Gemini Pro models via Antigravity Proxy

Research date: 2026-08-08. This note is public-source evidence, not a promise that undocumented Google endpoints remain stable.

## Gemini 3.1 Pro High: not a local quota/config problem

- Exact matching upstream report: [`badrisnarayanan/antigravity-claude-proxy#361`](https://github.com/badrisnarayanan/antigravity-claude-proxy/issues/361).
  - Environment: proxy v2.8.5 (same as local package in this session).
  - `gemini-3.1-pro-high` returns Google Cloud Code `400 INVALID_ARGUMENT`; `gemini-3.1-pro-low` succeeds on the same account, proxy, and request path.
  - The reporter reproduced direct to `/v1/messages`, eliminating an OpenAI adapter as root cause.
  - The official `agy` CLI succeeded on High with the same account. This supports a proxy-to-Cloud-Code request-shape/model-routing incompatibility rather than entitlement exhaustion.
- Release [`v2.8.5`](https://github.com/badrisnarayanan/antigravity-claude-proxy/releases/tag/v2.8.5) deliberately replaced `gemini-3.1-pro-high` in the Gemini preset with `gemini-3.1-pro-low`, explicitly citing Google backend 400 responses.
- As of research, upstream master had no later code fix for #361. Do not claim a working proxy configuration for High without a new live test.
- Public Gemini API conventions use a base model plus a separate reasoning/thinking level. That is only a hypothesis for the undocumented Cloud Code endpoint; other proxy implementations reported that naive suffix removal/thinking-config experiments still failed. Do not patch a running proxy based on that hypothesis alone.

Operational policy:
- Default to `gemini-3.1-pro-low` for the proxy route.
- Leave High visible only as an explicitly known-broken experimental entry, or remove it from the picker if the user prefers a clean usable-only list.
- Official native Antigravity/`agy` may expose High, but this is a different route from Hermes through the local proxy.

## Gemini 2.5 Pro: capacity/rate-limit condition

- Local evidence: proxied requests returned `RESOURCE_EXHAUSTED` or timed out, and `/health` reported `modelRateLimits[gemini-2.5-pro].isRateLimited: true` with a reset time.
- Proxy-wide status percentages can remain high while a specific model tier is rate-limited. Trust the per-model rate-limit flag and actual request response over aggregate remaining quota.
- Public Gemini CLI reports also document capacity/429 incidents even for paid plans: [`google-gemini/gemini-cli#24937`](https://github.com/google-gemini/gemini-cli/issues/24937).
- There is no local config flag that restores an upstream capacity allocation. Legitimate remedies are waiting for the stated reset, using a supported fallback model, or using a legitimately authorized account/tier with capacity. Do not describe account rotation as a quota bypass.

## Regression test rule for routing changes

When changing `MODEL_FALLBACK_MAP` or request routing:
1. Back up the source file before changing it.
2. Restart only the proxy that owns TCP 8080 after explicit approval.
3. Test every configured model with a real `/v1/messages` request sequentially.
4. Record requested model, HTTP status, latency, returned `model`, and a response/error snippet.
5. Mark `FALLBACK` when returned model differs from requested model; do not mark it as a normal pass.
6. Test a realistic long-context Claude request after removing cross-family fallback, because this is when automatic compaction/retry routes may appear.

## Caveat: npx cache patches

A patch under `~/.npm/_npx/.../node_modules/` can be overwritten by `npx`/npm reinstall or package update. Keep a timestamped backup and re-run the routing regression test after any update.
