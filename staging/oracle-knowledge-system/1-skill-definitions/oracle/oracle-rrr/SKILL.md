---
name: oracle-rrr
description: Use at the end of a work session or when the user asks for rrr/retrospective; reflect, retrospect, and remember using Hermes memory, skills, and ~/ψ/ vault.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, retrospective, memory, reflection]
    created_by: agent
    related_skills: [oracle-session-lifecycle, oracle-recap]
---

# Oracle RRR

## Overview

Hermes-native port of Oracle `/rrr`.

RRR means:

- Reflect — what happened and why it mattered.
- Retrospect — what worked, what failed, what changed.
- Remember — save only durable signal as memory or skills.

## When to Use

- User says rrr, retrospective, wrap up, สรุปท้าย session.
- A meaningful task finishes.
- A workflow was discovered or corrected.
- Before ending a long session.

## Process

1. Summarize the session from current context.
2. Use `session_search` only if older context is needed.
3. Identify durable learnings.
4. Decide storage:
   - Hermes memory for durable user/environment facts.
   - Hermes skill for reusable procedures.
   - `~/ψ/memory/retrospectives/` for narrative notes if requested.
5. Ask or state clearly before saving non-obvious durable memory.

## Output Format

```text
RRR
1. สิ่งที่เกิดขึ้น:
2. สิ่งที่เรียนรู้:
3. สิ่งที่ควรจำ:
4. สิ่งที่ควรทำต่อ:
5. ควรสร้าง/อัปเดต skill ไหม:
```

## Retrospective File

If the user asks to write a retrospective, create:

```text
~/ψ/memory/retrospectives/YYYY-MM-DD_HHMM.md
```

Keep it factual and compact.

## Common Pitfalls

1. Saving task progress as persistent memory.
2. Forgetting to create/update skills for reusable workflows.
3. Writing long retros when the user prefers concise output.

## Verification Checklist

- [ ] Summary is accurate.
- [ ] Durable memories are truly durable.
- [ ] Reusable workflows considered for skill creation.
- [ ] Optional vault file path reported if written.
