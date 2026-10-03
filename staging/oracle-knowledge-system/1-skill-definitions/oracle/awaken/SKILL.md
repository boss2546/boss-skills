---
name: awaken
description: Use when the user types /awaken in Hermes; verify or initialize the Hermes Oracle layer rather than running Claude Code /awaken.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [hermes-oracle-adaptation]
---

# Awaken Alias

## Overview

This is a short slash-command alias for `hermes-oracle-adaptation`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/awaken`, while the Hermes-native skills were originally named `hermes-oracle-adaptation`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `hermes-oracle-adaptation`.

If more detail is needed, load the full skill with:

```text
/skill hermes-oracle-adaptation
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
