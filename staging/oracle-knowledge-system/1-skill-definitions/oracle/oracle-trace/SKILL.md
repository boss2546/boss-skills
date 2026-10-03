---
name: oracle-trace
description: Use when the user wants to find where something came from or recover old context; search across Hermes sessions, ~/ψ vault, Oracle MCP, files, git history, and GitHub when relevant.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, trace, search, provenance, memory]
    related_skills: [oracle-recap, oracle-learn, upstream-digest]
---

# Oracle Trace

## Overview

Hermes-native `/trace`: recover provenance and context across memory surfaces. It answers “where did this come from?” and “what do we know about this?”

## When to Use

- User says trace, ตามหา, ก่อนหน้านี้, เราเคยทำอะไร, source อยู่ไหน.
- Need to connect a claim to sessions/files/git/Oracle notes.
- Need to investigate history before acting.

## Search Order

1. Direct source first if user gives URL/file/repo.
2. Current files with `search_files` / `read_file`.
3. Hermes history with `session_search`.
4. Oracle MCP with `oracle_search` / `oracle_trace_*`.
5. Vault `~/ψ/` notes.
6. Git/GitHub history when repo activity matters.

## Process

1. Define the query and expected source type.
2. Search the most authoritative source first.
3. Collect evidence: path, session id, document id, commit/PR/issue.
4. Summarize findings and confidence.
5. If useful, log a trace with Oracle MCP.

## Output Format

```text
Trace: <query>
เจอจาก:
- source/path/id: ...
สรุป:
- ...
ความมั่นใจ:
- high/medium/low
ถัดไป:
- ...
```

## Common Pitfalls

1. Using session history as proof when a live source was provided.
2. Saying “ไม่เจอ” after only one search mode.
3. Losing citations/paths.

## Verification Checklist

- [ ] Source-first rule followed.
- [ ] At least one evidence handle returned when found.
- [ ] Confidence stated when uncertain.
