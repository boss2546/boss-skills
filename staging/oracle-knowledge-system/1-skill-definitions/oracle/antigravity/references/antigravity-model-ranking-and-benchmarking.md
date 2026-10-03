# Antigravity model ranking and benchmarking notes

## Session learning: Gemini 3.7 Flash High vs proxy id

When Boss asks for the strongest Gemini model in Antigravity, answer with the exact usable route:

```text
gemini-3.7-flash-tiered
```

Antigravity IDE may display the human label **Gemini 3.7 Flash High** with Low / Medium / High menu levels, but local `antigravity-claude-proxy` v2.8.5 exposes only one Gemini 3.7 API id via `/v1/models`:

```text
gemini-3.7-flash-tiered
```

Direct tests in this session:

```text
gemini-3.7-flash-low     -> HTTP 400 invalid model
gemini-3.7-flash-medium  -> HTTP 400 invalid model
gemini-3.7-flash-high    -> HTTP 400 invalid model
gemini-3.7-flash-tiered  -> HTTP 200, returned gemini-3.7-flash-tiered
```

Treat `/v1/models` and the returned `model` field from `/v1/messages` as source of truth for Hermes routing. Treat IDE labels as display names.

## Practical recommendation

For Boss's question “Gemini ตัวไหนเก่งสุดที่เราใช้ได้?”:

- Best Gemini route available through Hermes/proxy: `gemini-3.7-flash-tiered`
- Previous fallback: `gemini-3.6-flash-high`
- If Gemini reasoning is not enough and non-Gemini is allowed: escalate to `claude-opus-4-6-thinking` for hard architecture/debug/review, or `claude-sonnet-4-6` for strong general coding.

Short Thai answer pattern:

```text
ถ้าเอา Gemini ที่เก่งสุดของเราใน Hermes ตอนนี้ เลือก `gemini-3.7-flash-tiered` นะบอส — ใน IDE มันคือกลุ่ม Gemini 3.7 Flash High แต่ proxy เรียกชื่อ high ตรง ๆ ไม่ได้ ต้องใช้ tiered ค่ะ
```

## Benchmarking pattern

When Boss asks to “research/เทสเยอะ ๆ” how good a model is:

1. Query live `/v1/models` first and confirm exact ids.
2. Run actual `/v1/messages` smoke tests, not just infer from the IDE label.
3. Use a small comparative battery across available local models:
   - one coding implementation task with executable tests,
   - one debugging/edge-case task,
   - one reasoning/format-following task.
4. Beware test-oracle errors: if many frontier models all fail the same case, verify the expected answer before concluding all models are wrong.
5. Report with honest scope: local mini-benchmark ≠ public benchmark ranking.

## Observed qualitative ranking from this session

Local mini-test suggested:

- `gemini-3.7-flash-tiered`: fastest, good default Gemini/coding-agent route, but not always strongest on deep reasoning.
- `gemini-3.1-pro-low`: slower; may do better on some reasoning tasks.
- `claude-opus-4-6-thinking`: slower but stronger for difficult reasoning/review when available.

Do not overclaim. Say “best Gemini route we can actually use through Hermes now” rather than “best model in the world”.
