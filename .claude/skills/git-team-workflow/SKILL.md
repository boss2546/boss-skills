---
name: git-team-workflow
description: Use this skill whenever a user is collaborating with teammates on a code project (often "vibe coded" with AI) using git/GitHub and needs help with version control — especially if they are non-technical, new to coding, or explicitly say they don't know how to code. Trigger on requests like "save my work", "push this to GitHub", "start a new feature/branch", "merge my teammate's changes", "I got a conflict", "clone the repo", "send this to my friend", "บันทึกงาน", "push โค้ดขึ้น", "สร้าง branch ใหม่", "ทำงานร่วมกับเพื่อน", "merge เข้า main", "มี conflict", or any mention of git, GitHub, branch, commit, push, pull, merge, or pull request in the context of a team project. Also use this proactively any time the user is about to hand off, save, or share code changes with teammates, even if they don't use git terminology themselves — assume they may not know the right words for what they want.
---

# Git Team Workflow (for non-coders working with AI)

## Why this skill exists

The user and their teammates are building a project by describing what they want to an AI and having it write the code — they may not know git at all. Your job is to be the git-literate member of the team: handle the mechanics, and explain what happened in plain language, in the language the user is writing in (Thai or English — match them).

Two things you'll be asked to do, often both in the same request:
1. **Just do it** — run the actual git commands so the user doesn't have to type anything.
2. **Teach as you go** — briefly say what each command did and why, so the user builds intuition over time instead of staying dependent on you forever.

Don't dump a wall of git jargon. One or two short sentences per action is usually enough. Save deeper explanations for when something goes wrong or the user asks "why".

## Before doing anything: figure out your mode

You'll encounter two very different situations, and mixing them up is the single biggest way this skill fails a beginner:

- **You have shell/terminal access to their project folder** (e.g. Cowork, Claude Code, an IDE agent). Run the commands yourself. Narrate briefly afterward.
- **You're chat-only** (no shell access — the user is pasting your replies into their own terminal). Don't say "I've pushed your branch" when you haven't. Instead give the exact command(s) in a copy-pasteable block and say plainly where it goes — "เปิด terminal ใน VS Code (เมนู Terminal > New Terminal) แล้ววางคำสั่งนี้" (open the terminal in VS Code and paste this). Then ask them to paste back what happened so you can tell them the next step. Never assume they know how to open a terminal — say exactly where to click if there's any chance they don't.

If you're not sure which mode you're in, check whether you actually have a working shell tool available — don't guess.

**State which mode you're in as the first thing you say**, before any questions or instructions — not buried at the end of your reply. A beginner reading top to bottom needs to know immediately whether you're about to act for them or whether they'll be the one typing, otherwise they read the rest of your message with the wrong assumption.

**Never ask the user to paste a password or access token into the chat.** Only ask them to confirm it worked ("it asked for a password, I entered the token, it succeeded" is fine — the token itself is not). If they paste one anyway, don't repeat it back, and mention they may want to revoke/regenerate it since it's now sitting in a chat log.

## Never used git before? Start here

If the user or a teammate has never run a git command, don't jump straight to the workflow below — check `references/first_time_setup.md` first. It covers: installing git, creating a GitHub account, being added as a collaborator on the repo, telling git who they are (`git config`), and — the step that trips up almost everyone — setting up authentication, since GitHub no longer accepts your account password in the terminal (you need a Personal Access Token or SSH key instead). Skipping this and jumping straight to `git clone` is the most common way a beginner gets stuck on their very first command with a confusing password prompt.

## Before doing anything else: find the repo

Confirm you're in a git repository before running commands — `cd` into the project folder and check with `git status`. If there's no `.git` folder and the user hasn't given you a repo URL, ask where the project lives (a GitHub URL to clone, or a folder they already have).

If cloning is needed and you're working through a sandboxed tool that can't reach github.com directly (network restrictions), don't silently give up — tell the user plainly and hand them the exact `git clone <url>` command to run in their own terminal instead.

## No-typing alternative: VS Code's Source Control panel

Some teammates will never want to touch a terminal, and that's fine — VS Code (which the team is already using) has a point-and-click way to do steps 3–5 of the workflow below (check changes, commit, push):
1. Click the branch icon / Source Control icon in the left sidebar (or `Ctrl+Shift+G`).
2. Changed files show up there automatically — click a file to see the diff, same information as `git diff`.
3. Type a commit message in the box at the top and click the checkmark (✓) to commit — same as `git add .` + `git commit -m`.
4. Click "Sync Changes" or the push icon to push — same as `git push`.
Mention this as an option for anyone who says they don't like typing commands or gets intimidated by the terminal — it does the same thing, just with buttons.

## The core workflow

This is the loop every teammate repeats for every piece of work. Default to this feature-branch pattern unless the user describes a different one their team already uses.

**1. Start from a clean, up-to-date main**
```
git checkout main
git pull origin main
```
Always do this before starting new work — it prevents building on stale code and reduces conflicts later.

**2. Create a branch for the task at hand**
```
git checkout -b feature/short-task-name
```
One branch per task/feature. Naming convention: `feature/` for new stuff, `fix/` for bug fixes. Keep the name short and descriptive (`feature/login-page`, not `feature/stuff`). Never work directly on `main` — that's the one rule that matters most for a beginner team, because it keeps main always in a working state.

**3. Work, then check what changed**
```
git status
git diff
```
`status` lists which files changed; `diff` shows the actual line-by-line changes. Use these before every commit so the user (or you) can sanity-check what's about to be saved.

**4. Save the work (commit)**
```
git add .
git commit -m "short description of what changed"
```
A commit is a checkpoint/save-point. Commit messages should describe *what* changed in plain terms — "add login button", not "fix stuff" or "wip". If the user doesn't give you a message, write one yourself based on the actual diff, don't just ask them to make one up.

**5. Send it to GitHub**
```
git push -u origin feature/short-task-name   # first push on this branch
git push                                      # subsequent pushes
```
This uploads the branch so teammates (and the AI helping them) can see it.

**6. Bring it into the team's main codebase (Pull Request)**
After pushing, git prints a URL like `https://github.com/<org>/<repo>/pull/new/<branch>`. Give the user this link and tell them: open it, it creates a Pull Request (PR) — a request to merge this branch into `main`. A teammate can review it there, then click "Merge". Don't merge a PR on their behalf without asking — merging into main affects everyone on the team, so this is a decision point for a human, not something to automate silently.

**7. After the PR is merged, sync main again**
```
git checkout main
git pull origin main
```
Now everyone's local `main` matches GitHub, and the loop restarts from step 1 for the next task.

## When things go wrong

Beginners hit the same handful of situations. Handle them calmly and explain what's happening — panic is the main risk, not the git error itself.

**Merge conflict** (shows up during `git pull` or when merging a PR): git couldn't automatically combine two changes to the same lines. Open the flagged file(s), look for blocks marked `<<<<<<<`, `=======`, `>>>>>>>`, and read both versions to figure out what the final code should look like. Edit the file to keep the right content and delete the conflict markers, then:
```
git add <file>
git commit
```
If you have the context to tell which version is correct (e.g. one side is clearly a typo or leftover test code), say so and offer to resolve it — but check with the user before discarding someone else's work.

**"I want to undo this"**
- Not yet added: `git restore <file>` — throws away uncommitted edits to that file.
- Added but not committed: `git restore --staged <file>` — un-stages without losing the edits.
- Need to switch branches with unfinished, uncommitted work: `git stash` (save it aside), do the switch, then `git stash pop` later to bring it back.

**"I don't know if I copied the folder right / it says already exists"**
Common when re-cloning: `fatal: destination path '<name>' already exists`. Either delete the old folder first (`rm -rf <name>`, but confirm with the user before deleting anything) or `cd` into it and `git pull` instead of cloning again.

**Asked for a username/password, or "Permission denied" / "403" on push**
This is an authentication problem, not a mistake in the workflow — see `references/first_time_setup.md`. GitHub stopped accepting account passwords in the terminal years ago; they need a Personal Access Token or SSH key set up instead.

**Untracked files that shouldn't be in git** (dependencies, secrets, editor config, `.env` files): create or check for a `.gitignore` file in the repo root and add the relevant patterns (e.g. `node_modules/`, `.env`, `.DS_Store`) rather than committing them and then trying to remove them later.

## Quick reference

- `references/command_cheatsheet.md` — plain-language, copy-pasteable list of every workflow command, organized the same way as above. Hand this to a teammate who wants the reference without the explanation.
- `references/first_time_setup.md` — one-time setup: installing git, GitHub account, collaborator access, git identity, authentication (PAT/SSH). Read this the first time a new teammate is involved, or any time an auth error shows up.

## Ground rules

- Prefer running commands yourself over making the user type them, when you have shell access to their project folder.
- Narrate briefly *after* running something, not with a lecture before it — "pushed your branch, here's the PR link" beats a paragraph of git theory up front.
- Never force-push (`git push -f`), rewrite history, or delete a branch/remote without explicit confirmation — these are the git operations that can genuinely lose a teammate's work.
- Never merge a PR or push directly to `main` without the user asking for it — treat `main` as shared, protected territory.
- Match the user's language (Thai/English) and keep technical terms minimal; when you do use a git term, a three-to-five word plain-language gloss right after it goes a long way ("commit — basically a save point").
