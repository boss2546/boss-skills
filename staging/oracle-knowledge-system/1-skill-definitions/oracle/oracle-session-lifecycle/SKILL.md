---
name: oracle-session-lifecycle
description: Use when operating Hermes as an Oracle-style external brain; defines the start-work-reflect-remember rhythm that preserves user agency and turns repeated patterns into memory or skills.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, lifecycle, memory, external-brain]
    created_by: agent
    related_skills: [hermes-oracle-adaptation]
---

# Oracle Session Lifecycle

## Overview

Use this as the default rhythm for Oracle-style Hermes work. The goal is to keep the human human: reduce cognitive load, preserve agency, and convert useful patterns into memory or skills.

## When to Use

- Starting a meaningful work session.
- Resuming context after a gap.
- Ending a session with reflection.
- Deciding whether to save memory or create a skill.

## Rhythm

### 1. Start: orient

- Identify the user's goal.
- If past context matters, use `session_search` before asking the user to repeat themselves.
- If durable preferences matter, use known memory.
- If the request is ambiguous but low-risk, choose the obvious path; ask only when ambiguity changes the action.

Done when the immediate goal and next action are clear.

### 2. Work: act with grounding

- Use tools for live facts, files, math, system state, installs, and verification.
- Use `todo` for multi-step work.
- Use `delegate_task` for parallel reasoning-heavy subtasks.
- Preserve user agency: present tradeoffs and options for meaningful decisions.

Done when the requested artifact or answer is verified.

### 3. Reflect: compress the useful signal

At natural stopping points, summarize:

```text
ทำอะไรแล้ว:
เรียนรู้อะไร:
ค้างอะไร:
ทางเลือกถัดไป:
```

Done when the user can continue without rereading the whole session.

### 4. Remember: save only what should survive

For explicit “FYI / จำไว้ / remember this” requests, load/use `oracle-fyi` as the router before saving. It decides whether the item belongs in Hermes memory, Oracle MCP, `~/ψ/`, or a skill patch.

Use Hermes memory for durable facts only:

- User preferences.
- Recurring corrections.
- Stable environment conventions.
- Reusable patterns.

Do not save temporary progress, one-off artifacts, PR numbers, commit SHAs, or details likely to stale quickly.

Use `~/ψ/` vault for notes/history that may be useful but should not be injected every turn.

### 5. Evolve: create or update skills

If a workflow required several steps, overcame pitfalls, or will likely repeat, offer to save it as a Hermes skill. Patch stale skills when discovered.

## Common Pitfalls

1. Saving too much to memory. Use vault/session history instead.
2. Replacing Hermes skills with Oracle skills. Add an Oracle layer; keep Hermes-native capabilities.
3. Acting like the agent owns the decision. Hermes supports; the human decides.

## Verification Checklist

- [ ] Goal understood.
- [ ] Relevant memory/session context checked when needed.
- [ ] Tool-backed claims verified.
- [ ] Durable memories saved only when appropriate.
- [ ] Reusable workflows considered for skills.
