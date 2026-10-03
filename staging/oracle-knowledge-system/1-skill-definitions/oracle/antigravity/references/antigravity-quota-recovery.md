# Antigravity Quota Diagnostics & Recovery Reference

## Symptoms & Error Signatures
- `HTTP 400: RESOURCE_EXHAUSTED: You have exhausted your capacity on gemini-3. Quota will reset after XhYmZs.`
- `HTTP 400: RESOURCE_EXHAUSTED: You have exhausted your capacity on claude-sonnet-4-6.`

## Root Cause
- The active account in Antigravity IDE / App has hit the rate limit / quota ceiling for the specific model tier.
- The Hermes session model (e.g. `gemini-3.1-flash-image` or `claude-sonnet-4-6`) continues attempting API calls using the exhausted endpoint until retries fail.

## Recovery Workflow
1. **User Notification**: Inform the user clearly which model tier is exhausted and show the reset timer if available.
2. **Switch Model Route**: Advise starting a fresh session with an unexhausted model tier:
   ```bash
   /exit
   hermes -m gemini-3.6-flash-high --provider custom:antigravity
   ```
3. **Account Reconnect (if account was changed)**: Run `antigravity switch` or execute option `4` in `/antigravity`.
