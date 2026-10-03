---
name: recap
description: Use when the user types /recap or asks what happened / where we are; short alias for oracle-recap.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-recap]
---

# Recap Alias

## Overview

This is a short slash-command alias for `oracle-recap`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/recap`, while the Hermes-native skills were originally named `oracle-recap`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-recap`.

If more detail is needed, load the full skill with:

```text
/skill oracle-recap
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
