---
name: trace
description: Use when the user types /trace to recover source/history/context; short alias for oracle-trace.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-trace]
---

# Trace Alias

## Overview

This is a short slash-command alias for `oracle-trace`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/trace`, while the Hermes-native skills were originally named `oracle-trace`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-trace`.

If more detail is needed, load the full skill with:

```text
/skill oracle-trace
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
