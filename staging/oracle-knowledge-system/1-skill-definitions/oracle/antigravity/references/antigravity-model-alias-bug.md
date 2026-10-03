# Antigravity Proxy: gemini-3.1-pro-high Root Cause Analysis
Date: 2026-08-08 | Confirmed by: source code inspection + /account-limits live probe

## CORRECTION (updated same session)
Earlier hypothesis: Google doesn't know the model name "gemini-3.1-pro-high".
**WRONG.** `/account-limits` shows `gemini-3.1-pro-high: remaining 99%` — Google DOES know the name.

Actual root cause: **proxy injects Gemini thinking config for a model that doesn't support thinking mode.**

---

## True Root Cause: isThinkingModel() mis-classification

Source: `~/.npm/_npx/e6962cfe180333b5/node_modules/antigravity-claude-proxy/src/`

### Step 1 — isThinkingModel() returns TRUE incorrectly (constants.js ~line 235)
```js
export function isThinkingModel(modelName) {
    const lower = (modelName || '').toLowerCase();
    if (lower.includes('gemini')) {
        // gemini-3.1-pro-high → version "3" >= 3 → TRUE
        const versionMatch = lower.match(/gemini-(\d+)/);
        if (versionMatch && parseInt(versionMatch[1], 10) >= 3) return true;
    }
    return false;
}
```
Result: `isThinkingModel('gemini-3.1-pro-high') === true`  ← WRONG, model doesn't support thinking

### Step 2 — Proxy injects Gemini thinking config (request-converter.js ~line 190)
```js
} else if (isGeminiModel) {
    const thinkingConfig = {
        includeThoughts: true,
        thinkingBudget: clampGeminiThinkingBudget(modelName, thinking?.budget_tokens)
        // → defaults to 16000
    };
    googleRequest.generationConfig.thinkingConfig = thinkingConfig;
}
```
`gemini-3.1-pro-high` doesn't support `thinkingConfig` → Google rejects with `INVALID_ARGUMENT`

### Step 3 — Routes to SSE endpoint (message-handler.js ~line 160)
```js
const url = isThinking
    ? `${endpoint}/v1internal:streamGenerateContent?alt=sse`  // ← used for pro-high
    : `${endpoint}/v1internal:generateContent`;
```
SSE + thinkingConfig combination on a non-thinking model = guaranteed reject.

---

## Why gemini-3.1-pro-low Works
server.js `modelMapping` resolves `gemini-3.1-pro-low` → `claude-sonnet-4-6` BEFORE the request.
`getModelFamily('claude-sonnet-4-6')` → 'claude' → uses Claude path (no Gemini thinking injection) → works.

## Circular Fallback Alias (constants.js lines 280-283)
```js
const MODEL_FALLBACK_MAPPING = {
    'gemini-3.1-pro-high': 'claude-opus-4-6-thinking',  // quota-exhausted fallback only
    'gemini-3.1-pro-low': 'claude-sonnet-4-6',
    'claude-opus-4-6-thinking': 'gemini-3.1-pro-high',  // reverse alias
};
```
These fire ONLY when `accountManager.isAllRateLimited(model)` — they do NOT translate
the model name for the initial request. First try always reaches Google as `gemini-3.1-pro-high`
with thinkingConfig → always INVALID_ARGUMENT.

---

## Fix Shape / Current Finding Update (2026-08-08 evening)
Earlier proposed fix was to mark `gemini-3.1-pro-high` as non-thinking in `isThinkingModel()` so the proxy would stop injecting `thinkingConfig` and stop routing it as a thinking/SSE model.

Live follow-up showed the local installed proxy already contains this guard:
```js
const GEMINI_NON_THINKING = [
  'gemini-3.1-pro-high',
  'gemini-3.1-pro-low',
];
if (GEMINI_NON_THINKING.includes(lower)) return false;
```

But `gemini-3.1-pro-high` still returns HTTP 400 `INVALID_ARGUMENT` from the proxy, while `gemini-3.1-pro-low` works. So the earlier thinking-config explanation is incomplete or no longer the active cause on this install. Treat `gemini-3.1-pro-high` as currently broken upstream/proxy-side even after the non-thinking guard.

**Practical workaround:** use `claude-opus-4-6-thinking`, `gemini-3.1-pro-low`, or `gemini-3.6-flash-high` instead. Do not promise that patching `isThinkingModel()` alone will restore `gemini-3.1-pro-high`.

---

## Streaming Config Bug (separate, same session)
`streaming.enabled: false` in config.yaml → chat silently doesn't respond.
Fix: `hermes config set streaming.enabled true`
Check this FIRST when chat seems unresponsive.

---

## Live Test Results (2026-08-08, Round 2, 19 models)
- 17/19 PASS (4.9s–10.4s latency)
- gemini-3.1-pro-high: FAIL (INVALID_ARGUMENT — thinking config injection bug)
- gemini-2.5-pro: TIMEOUT (>25s — server capacity, not quota)
- Fastest: gemini-3.5-flash-extra-low (4.9s)
- Claude sonnet + opus: PASS ~5.4–5.9s (after Google AI Ultra upgrade)
- Account quota confirmed from /account-limits: gemini-3.1-pro-high has 99% remaining
