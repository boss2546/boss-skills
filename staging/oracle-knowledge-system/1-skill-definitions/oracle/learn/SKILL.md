---
name: learn
description: Use when the user types /learn to study a repo, document set, or topic; short alias for oracle-learn.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-learn]
---

# Learn Alias

## Overview

This is a short slash-command alias for `oracle-learn`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/learn`, while the Hermes-native skills were originally named `oracle-learn`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-learn`.

If more detail is needed, load the full skill with:

```text
/skill oracle-learn
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
