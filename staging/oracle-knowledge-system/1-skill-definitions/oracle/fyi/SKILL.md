---
name: fyi
description: Use when the user types /fyi or wants Hermes to remember something; short alias for oracle-fyi.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-fyi]
---

# Fyi Alias

## Overview

This is a short slash-command alias for `oracle-fyi`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/fyi`, while the Hermes-native skills were originally named `oracle-fyi`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-fyi`.

If more detail is needed, load the full skill with:

```text
/skill oracle-fyi
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
