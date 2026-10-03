---
name: rrr
description: Use when the user types /rrr to reflect, retrospect, and remember at the end of a session; short alias for oracle-rrr.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-rrr]
---

# Rrr Alias

## Overview

This is a short slash-command alias for `oracle-rrr`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/rrr`, while the Hermes-native skills were originally named `oracle-rrr`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-rrr`.

If more detail is needed, load the full skill with:

```text
/skill oracle-rrr
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
