---
name: oracle-standup
description: Use at the start of a day/session when the user asks what to do next; combine current context, session_search, ~/ψ inbox, and recent Oracle notes into a concise daily orientation.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, standup, planning, recap]
    related_skills: [oracle-recap, oracle-forward, oracle-session-lifecycle]
---

# Oracle Standup

## Overview

Hermes-native `/standup`: start the day by orienting the human, not by creating a giant plan.

## When to Use

- User says standup, วันนี้ทำอะไรต่อ, เริ่มวัน, what next.
- Resuming after a break.
- Multiple threads are active and priority is unclear.

## Process

1. Check current chat first.
2. If needed, use `session_search` for recent context.
3. Inspect `~/ψ/inbox/` and recent handoffs if relevant.
4. Optionally check Oracle MCP inbox/learnings.
5. Produce a short priority list with tradeoffs.

## Output Format

```text
Standup วันนี้:
1. สำคัญสุด:
2. ค้างอยู่:
3. เสี่ยง/ต้องระวัง:
4. ถัดไปที่แนะนำ:
```

## Rules

- Do not invent tasks.
- Do not over-plan; 3 items is usually enough.
- If evidence is missing, say what was checked.

## Verification Checklist

- [ ] Priorities are grounded in checked context.
- [ ] Next action is clear.
- [ ] Output is concise Thai by default.
