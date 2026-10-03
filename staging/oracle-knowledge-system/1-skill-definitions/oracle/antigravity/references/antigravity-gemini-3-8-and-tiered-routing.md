# Antigravity Gemini 3.8 Flash Tiered & High Model Selection Runbook (2026-09-25)

## Overview & Newest Models
- **Active / Newest Tested Proxy Models**:
  - `gemini-3.8-flash-high`: Verified active in live `/v1/models` and matching `~/.gemini/antigravity-cli/settings.json` (`"model": "Gemini 3.8 Flash (High)"`).
  - `gemini-3.8-flash-tiered`: Tiered counterpart balancing thinking tokens and speed.
- Verified in live `/v1/models` (listening on port 8080) alongside `gemini-3.7-flash-tiered` and `gemini-3.6-flash-high`.

## Reality of "3.8" and "High" (Ground Truth Verification)
1. **Is "3.8" Real or Hallucinated?**
   - **Do NOT claim 3.8 is fake or purely a proxy wrapper artifact.** In this environment, Google's internal Antigravity IDE and Antigravity CLI connect to `daily-cloudcode-pa.googleapis.com` / `cloudcode-pa.googleapis.com`.
   - The CLI configuration at `~/.gemini/antigravity-cli/settings.json` explicitly stores `"model": "Gemini 3.8 Flash (High)"`.
   - The proxy exposes it 1:1 in `/v1/models` with description `"Gemini 3.8 Flash (High)"`.
   - Never confuse public API marketing cutoffs with Google's internal Antigravity/Cloud Code model tags.

2. **Is "High" Thinking Real?**
   - **Yes.** In the proxy (`antigravity-claude-proxy`), `isThinkingModel()` evaluates `version >= 3` as thinking-enabled.
   - For Gemini 3+, `clampGeminiThinkingBudget()` allows a maximum thinking budget of up to **128,000 tokens** (`GEMINI_DEFAULT_THINKING_BUDGET_LIMIT`).
   - Requests to `gemini-3.8-flash-high` send maximum reasoning budget upstream to Cloud Code API, ensuring maximum depth of thought compared to low/medium/tiered variants.

## Pitfalls & Troubleshooting
1. **Model Picker Viewport Truncation & Effort Slider UI**
   - The CLI/terminal model picker modal renders only ~10 models per viewport out of 23.
   - In Antigravity IDE UI, model selection is structured as base model (`Gemini 3.8 Flash`) + an **`Effort` slider** (`low`, `medium`, `high`). Selecting `high` displays as `Gemini 3.8 Flash (High)`.
   - In Hermes CLI / Antigravity Proxy, this is mapped as an alias `gemini-3.8-flash-high` alongside `gemini-3.8-flash-tiered`.
   - If the user reports not finding the model, check both the Down Arrow key (`↓`) scrolling and ensure `gemini-3.8-flash-high` is registered in proxy `/v1/models` and `~/.config/antigravity-proxy/config.json` model mapping with high thinking budget injection. Never claim an effort level or model is nonexistent without verifying both UI slider and proxy mapping layers.

2. **"Tier 3" vs Model Naming Confusion**
   - Users may ask for "gemini-3.8-flash-tiered 3" conflating conceptual tiers (Tier 1 = fast/light, Tier 2 = mid, Tier 3 = frontier/reasoning) with the API identifier.
   - The exact API identifier is `gemini-3.8-flash-tiered` (no trailing digit).
   - If the user explicitly wants Tier 3 (deepest frontier reasoning), the true top-tier options in the proxy are `claude-opus-4-6-thinking` or `gemini-3.1-pro-high`.

3. **Thinking Budget & Optimization for Gemini 3.x Flash Tiered**
   - The local proxy (`antigravity-claude-proxy`) automatically flags Gemini version >= 3 as thinking models (`isThinkingModel()`), injecting `includeThoughts: true` with dynamic token budgets (up to 128k).
   - To elicit the highest reasoning capability from `gemini-3.8-flash-tiered`, encourage step-by-step thinking or analytical prompts.
