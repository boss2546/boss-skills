---
name: forward
description: Use when the user types /forward to create a handoff for the next session; short alias for oracle-forward.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-forward]
---

# Forward Alias

## Overview

This is a short slash-command alias for `oracle-forward`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/forward`, while the Hermes-native skills were originally named `oracle-forward`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-forward`.

If more detail is needed, load the full skill with:

```text
/skill oracle-forward
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
