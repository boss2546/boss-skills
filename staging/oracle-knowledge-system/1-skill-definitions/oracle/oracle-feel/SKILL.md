---
name: oracle-feel
description: Use when the user states mood, energy, urgency, confusion, stress, or preferred working mode; adapt assistance style and save only durable preferences, not transient feelings.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, mood, human, agency]
    related_skills: [oracle-session-lifecycle, oracle-fyi]
---

# Oracle Feel

## Overview

Hermes-native `/feel`: keep the human human by adapting pace, detail, and workload to the user's current state.

## When to Use

- User says tired, งง, รีบ, เครียด, ขอช้าๆ, ขอเร็วๆ, ขอไม่เยอะ.
- User indicates emotional/energy context affecting how help should be delivered.

## Process

1. Acknowledge the state briefly.
2. Adjust style immediately: shorter, slower, step-by-step, or more decisive.
3. Do not pathologize or over-discuss unless asked.
4. Save to memory only if it is a stable preference, not a temporary mood.

## Style Mapping

```text
เหนื่อย/ล้า     -> fewer choices, smaller next step
รีบ             -> direct action, no long explanation
งง              -> explain one layer at a time
เครียด          -> reduce cognitive load, confirm essentials
อยากละเอียด     -> structured detail
ขอสั้น          -> compact bullets
```

## Output Format

```text
รับทราบครับ ผมจะปรับเป็น: <style>
ขั้นต่อไป: <one action>
```

## Common Pitfalls

1. Saving transient feelings as permanent memory.
2. Giving therapy-style responses when the user wants work support.
3. Ignoring the stated working mode.

## Verification Checklist

- [ ] Style adjusted immediately.
- [ ] No unnecessary memory saved.
- [ ] Human agency preserved.
