<!-- START: DOCKER-3TIER-WORKFLOW -->
## 🐳 Docker 3-Tier Architecture Standards (Universal AI Guide)
When designing, containerizing, or managing Docker environments in this project:
1. **Architecture (3 Tiers)**:
   - **Frontend**: Port `3000:3000` (Next.js / React / Vite / Vue)
   - **Backend API**: Port `3001:3000` (Node.js / Express / Go / Python)
   - **Database**: Port `3307:3306` (MySQL 8.4+ / PostgreSQL) with `utf8mb4` Thai charset
2. **Docker Compose Reliability Standards**:
   - Database MUST have a `healthcheck` configured (e.g. `mysqladmin ping -h localhost -u root -p$$MYSQL_ROOT_PASSWORD`).
   - Backend MUST use `depends_on: db: condition: service_healthy` to prevent startup race conditions (`ECONNREFUSED`).
   - Database MUST mount to a named persistent volume (`volumes: [mysql_data:/var/lib/mysql]`).
   - Backend CORS MUST allow requests from Frontend (`http://localhost:3000`).
   - Avoid port 3306 on host; map to 3307 or custom port to prevent collision with local MySQL.
3. **Database Client Tools (DBeaver / DataGrip)**:
   - For MySQL 8+, ensure `allowPublicKeyRetrieval=true` in Driver Properties.
4. **Full Reference**: Read detailed workflow and templates in `.agents/skills/docker-3tier-workflow/SKILL.md`.
<!-- END: DOCKER-3TIER-WORKFLOW -->

<!-- START: GIT-TEAM-WORKFLOW -->
## 🌿 Git Team Workflow (Collaboration for AI & Non-Coders)
When managing git, commits, branches, pull requests, or collaborating with teammates in this project:
1. **Be the Team's Git Specialist**:
   - The user and teammates may be "vibe coding" with AI and may not know git commands. Proactively handle git operations cleanly.
   - Run safe commands for them (status, add, commit, branch, push, pull, merge) or provide exact copy-paste steps if in chat-only mode.
2. **Friendly Thai Explanations**:
   - Explain what each git action does in plain, encouraging Thai without heavy jargon.
   - Teach as you go: briefly explain why a branch or commit is needed so the user learns over time.
3. **Conflict & Safety Protocol**:
   - When conflicts occur, carefully explain both versions in plain language and ask the user how to resolve them.
   - NEVER ask the user to paste tokens/passwords in chat.
4. **Full Reference**: Read detailed guides and cheatsheets in `.agents/skills/git-team-workflow/SKILL.md` and its `references/`.
<!-- END: GIT-TEAM-WORKFLOW -->
