# Antigravity Gemini 3.7 model-id note (2026-08-15)

## Session finding
Antigravity IDE displayed the model label **“Gemini 3.7 Flash High”**, but the local `antigravity-claude-proxy` v2.8.5 `/v1/models` endpoint exposed the usable API id as:

```text
gemini-3.7-flash-tiered
```

The visually implied id was rejected:

```text
gemini-3.7-flash-high -> HTTP 400 invalid_request_error: Invalid model
```

## Verified commands / outcomes
Raw proxy smoke test:

```text
gemini-3.7-flash-tiered -> HTTP 200, returned model gemini-3.7-flash-tiered
gemini-3.7-flash-high   -> HTTP 400 invalid model
```

Hermes smoke test:

```bash
hermes -z 'ตอบแค่ ok-hermes-37' --provider custom:antigravity -m gemini-3.7-flash-tiered
```

Outcome:

```text
ok-hermes-37
```

Hermes with `gemini-3.7-flash-high` returned the invalid-model error text.

## Durable lesson
When Antigravity IDE shows a new human-readable model label, do not assume the API id. Start/reconnect the local proxy, query `/v1/models`, then use the exact id returned there for Hermes config/smoke tests. Treat IDE labels as display names and proxy `/v1/models` as the source of truth for Hermes routing.
