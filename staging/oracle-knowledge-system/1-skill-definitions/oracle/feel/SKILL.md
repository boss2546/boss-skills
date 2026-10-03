---
name: feel
description: Use when the user types /feel to share mood, urgency, energy, or working mode; short alias for oracle-feel.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-feel]
---

# Feel Alias

## Overview

This is a short slash-command alias for `oracle-feel`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/feel`, while the Hermes-native skills were originally named `oracle-feel`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-feel`.

If more detail is needed, load the full skill with:

```text
/skill oracle-feel
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
