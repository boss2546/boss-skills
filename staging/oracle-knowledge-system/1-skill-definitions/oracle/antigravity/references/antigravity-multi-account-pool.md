# Antigravity Multi-Account Setup & Quota Failover

Session learning (2026-09-25): Configuring and scaling `antigravity-claude-proxy` using multi-account load balancing to eliminate `RESOURCE_EXHAUSTED` / rate limits.

## Why Multi-Account Pool?

- Single-account setups hit Google's rolling capacity limits (`RESOURCE_EXHAUSTED` on `gemini-3`) easily under heavy reasoning or iterative tool loops.
- Hermes' 3-attempt backoff retry rapidly escalates short (~5 min) limits into 30m and 2h cooldowns.
- `antigravity-claude-proxy` (v2.8.6+) has built-in multi-account pooling with automatic failover and load balancing (`--strategy=hybrid`, `--strategy=sticky`, or round-robin).

## Setup Workflow

1. **Add Google Accounts via OAuth:**
   ```bash
   npx antigravity-claude-proxy accounts add
   # or shorthand:
   acc accounts add
   ```
   Follow the browser OAuth consent flow for each secondary/burner account.

2. **Verify Account Pool:**
   ```bash
   npx antigravity-claude-proxy accounts list
   ```
   Ensure 2+ accounts show status `ok`.

3. **Restart Proxy Service:**
   ```bash
   npx antigravity-claude-proxy restart
   ```

4. **Verify Health & Quotas:**
   ```bash
   curl -s http://127.0.0.1:8080/account-limits
   ```

## Status Bar Quota Pitfall

- Hermes CLI's interactive status bar (`display.status_bar`) displays context window tokens (`183K/1M [█....] 17%`), NOT live account API quota.
- `display.show_cost: true` in config is a legacy flag and is not rendered in recent Hermes v0.21+ status bar segments (`cli_status_bar_mixin.py` has no cost rendering).
- Do not promise cost or live account quota in the terminal status bar unless a custom script/poller or dashboard is integrated.
