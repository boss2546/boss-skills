---
name: oracle-forward
description: Use when ending or pausing work and the next session should resume smoothly; create a compact handoff in ~/ψ/inbox or Oracle handoff without saving stale progress to persistent memory.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, handoff, session, continuity]
    related_skills: [oracle-recap, oracle-rrr, oracle-session-lifecycle]
---

# Oracle Forward

## Overview

Hermes-native `/forward`: prepare the next session. It preserves continuity without bloating persistent memory.

## When to Use

- User says forward, handoff, ต่อ session หน้า, พรุ่งนี้ทำต่อ.
- A long task pauses before completion.
- Important context should be easy to resume but is not durable memory.

## Process

1. Summarize only what the next session needs.
2. Include: goal, done, current state, blockers, next actions, key files/commands.
3. Write to `~/ψ/inbox/handoff/YYYY-MM-DD_HHMM-<slug>.md` or use `oracle_handoff` when Oracle MCP continuity is desired.
4. Report the path/id.

## Template

```markdown
# Handoff: <topic>

## Goal

## Done

## Current State

## Blockers / Risks

## Next Actions

## Key Paths / Commands
```

## Common Pitfalls

1. Saving handoff details to Hermes memory.
2. Writing vague next steps.
3. Forgetting paths/commands needed to resume.

## Verification Checklist

- [ ] Handoff includes concrete next action.
- [ ] Saved to vault or Oracle inbox.
- [ ] User receives path/id.
