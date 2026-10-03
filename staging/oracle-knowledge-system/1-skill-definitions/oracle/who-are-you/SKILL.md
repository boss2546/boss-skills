---
name: who-are-you
description: Use when the user types /who-are-you to verify Hermes Oracle identity; short alias for oracle-who-are-you.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-who-are-you]
---

# Who Are You Alias

## Overview

This is a short slash-command alias for `oracle-who-are-you`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/who-are-you`, while the Hermes-native skills were originally named `oracle-who-are-you`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-who-are-you`.

If more detail is needed, load the full skill with:

```text
/skill oracle-who-are-you
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
