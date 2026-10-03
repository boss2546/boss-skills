---
name: oracle-learn
description: Use when studying a repo, codebase, document set, or technical topic in Oracle style; create reusable learning notes under ~/ψ/learn using Hermes tools and delegation.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, learning, codebase, vault]
    created_by: agent
    related_skills: [oracle-session-lifecycle, oracle-recap]
---

# Oracle Learn

## Overview

Hermes-native port of Oracle `/learn`. Study a target, extract structure and patterns, and save useful notes without depending on Claude Code paths or session JSONL.

## When to Use

- User asks to learn/study a repo, codebase, document set, or technical topic.
- User shares a GitHub repo and wants understanding, not immediate editing.
- Hermes needs reusable knowledge for future work.

## Process

1. Identify target: URL, local path, repo, docs, or topic.
2. If local files are involved, use `search_files` and `read_file`.
3. Before studying a repo with project-scoped roles or memories, read its governing instructions and role-specific soul/memory files first. Keep project memory separate from Hermes global memory; never silently merge the two.
4. For complex targets, use `delegate_task` for parallel inspection.
4. Write notes under:

```text
~/ψ/learn/<topic-or-owner-repo>/YYYY-MM-DD/
```

5. Summarize only the useful map: architecture, key files, workflows, risks, and next questions.

## Output Format

```text
เรียนรู้อะไร:
- ภาพรวม:
- โครงสร้างสำคัญ:
- สิ่งที่ควรจำ:
- คำถาม/ช่องว่าง:
- ไฟล์บันทึก:
```

## Rules

- Do not clone or install dependencies unless needed and allowed.
- Do not write into the studied repo unless the user asks.
- Prefer vault notes for study artifacts; use memory only for durable facts.

## Common Pitfalls

1. Writing notes into the source repo by accident.
2. Treating a quick scan as deep understanding.
3. Saving bulky study notes into persistent memory.

## Verification Checklist

- [ ] Target resolved.
- [ ] Notes written to `~/ψ/learn/` when requested.
- [ ] Summary includes useful next steps.
