---
name: standup
description: Use when the user types /standup to start a day/session with priorities; short alias for oracle-standup.
version: 1.0.0
author: Hermes Agent
license: MIT
metadata:
  hermes:
    tags: [oracle, alias, slash-command]
    related_skills: [oracle-standup]
---

# Standup Alias

## Overview

This is a short slash-command alias for `oracle-standup`.

Hermes skill slash commands are generated from skill names. The upstream Oracle docs use commands like `/standup`, while the Hermes-native skills were originally named `oracle-standup`. This alias lets the user type the short Oracle command.

## Behavior

When invoked, follow the behavior of `oracle-standup`.

If more detail is needed, load the full skill with:

```text
/skill oracle-standup
```

## User-facing rule

For this user, answer in concise Thai unless they ask for detail.
