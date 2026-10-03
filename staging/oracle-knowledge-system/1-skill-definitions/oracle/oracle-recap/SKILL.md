---
name: oracle-recap
description: Use when the user asks for recap/status/orientation; reconstruct where we are using Hermes memory, session_search, recent ~/ψ/ notes, and current project/git state.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, recap, session, orientation]
    created_by: agent
    related_skills: [oracle-session-lifecycle]
---

# Oracle Recap

## Overview

Hermes-native port of Oracle `/recap`. Its job is quick orientation: where we are, what matters, what is pending, and what choices come next.

## When to Use

- User says recap, status, where are we, ตอนนี้เราอยู่ตรงไหน.
- Starting a resumed session.
- Context feels lost.
- Before continuing multi-step work.

## Process

1. Check immediate conversation context.
2. If older context matters, use `session_search`.
3. If working in a repo, check git state with terminal.
4. If vault context matters, inspect recent markdown under `~/ψ/`.
5. Produce a short orientation, not a long report.

## Output Format

```text
ตอนนี้เราอยู่ตรงไหน:
- เป้าหมายล่าสุด:
- ทำแล้ว:
- ค้างอยู่:
- ข้อมูลที่ควรรู้:
- ทางเลือกถัดไป:
```

## Rules

- Do not claim to know current external state without checking tools.
- Do not dump irrelevant history.
- If session_search is inconclusive, say so.
- Keep Thai concise unless the user asks for detail.

## Common Pitfalls

1. Summarizing from memory only when live files/git matter.
2. Overloading the user with full history.
3. Treating vault notes as injected memory; read them only when relevant.

## Verification Checklist

- [ ] Current goal identified.
- [ ] Pending work identified.
- [ ] Next options are actionable.
