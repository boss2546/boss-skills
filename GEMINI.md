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
4. **Full Reference**: Read detailed guides in `.agents/skills/git-team-workflow/SKILL.md`.
<!-- END: GIT-TEAM-WORKFLOW -->

<!-- START: DOCKER-WORKFLOW -->
## 🐳 Docker Workflow Standards (Universal AI Guide)
When designing, containerizing, or managing Docker environments in development:
1. **3-Tier Architecture Pattern**:
   - **Frontend**: Port `3000` (React / Vite / Vue / Next.js) — with live reload volume mount.
   - **Backend API**: Port `3001` (Node.js / Python / Go) — with live reload and CORS enabled.
   - **Database**: Port `3307:3306` (MySQL 8.4+ / PostgreSQL) with `utf8mb4` Thai charset and named volume.
   - **Adminer**: Web GUI for DB at Port `8085` (no local DBeaver installation needed).
2. **Key Reliability & Workflow Standards**:
   - **Healthcheck & Cold-Start**: Database MUST have healthcheck, backend MUST use `depends_on: db: condition: service_healthy` and a 10-15 retry loop (20-30s) waiting for DB to ready.
   - **Live Reload**: Bind mounts (`./backend:/app`) for instant edits without rebuilds.
   - **Daily Operations**: Proactively assist with `docker compose up -d`, `down`, `ps`, `logs -f`, `exec`, and safe `prune`.
   - **Worker Safety**: Background loops must use Acquire-Use-Release per cycle, avoiding stale connections.
   - **Vibe Coding Communication**: Explain step-by-step in friendly Thai, explain terminal flags, and remind users to save files.
3. **Full Reference**: Read detailed templates in `.agents/skills/docker-workflow/SKILL.md`.
<!-- END: DOCKER-WORKFLOW -->

<!-- START: PRODUCTION-ARCHITECTURE -->
## 🏭 Enterprise Production Architecture Standards (Universal AI Guide)
When deploying or upgrading Docker environments to Production:
1. **4-Tier Architecture Pattern**:
   - **Gateway (NGINX)**: Port `80:80` & `443:443` — Entry point, SSL termination, Reverse Proxy.
   - **Frontend**: Internal port `3000` — closed to the outside, reverse proxied by NGINX.
   - **Backend API**: Internal port `3000` — closed to the outside, reverse proxied by NGINX.
   - **Database**: Port `127.0.0.1:3307:3306` (MySQL 8.4+ / PostgreSQL) with `utf8mb4` Thai charset.
2. **Production Reliability Standards**:
   - **Auto-Restart**: All services MUST have `restart: unless-stopped`.
   - **Disk Full Prevention (Log Rotation)**: All containers MUST have:
     ```yaml
     logging:
       driver: "json-file"
       options:
         max-size: "10m"
         max-file: "3"
     ```
   - **Dynamic RAM**: Containers share host RAM dynamically without hard ceilings, preventing OOM crash (Exit Code 137).
   - **Host Firewall (UFW)**: Allow only ports 22 (SSH), 80 (HTTP), 443 (HTTPS); deny all other incoming.
   - **Cloudflare & Domain**: Protect server with Cloudflare Proxied (Orange Cloud 🟠) or Cloudflare Tunnel, set SSL mode to "Full".
   - **Proxy Headers**: NGINX / Backend forward `Host`, `X-Real-IP`, `X-Forwarded-For`, `CF-Connecting-IP`.
   - **Auto DB Backup**: Rolling 7-day automated database dump scripts.
3. **🏛️ 4 Pillars of Enterprise Resilience**:
   - **⏳ DB Cold-Start Resilience**: Backend must implement retry loops (10-15 retries / 20-30s total) to wait for database init; NEVER fail-fast or silently fall back to in-memory/SQLite.
   - **🔄 Dynamic Service Discovery (Anti-Stale DNS)**: NGINX must specify `resolver 127.0.0.11 valid=5s ipv6=off;` and use variable proxying (`set $backend ...; proxy_pass http://$backend;`) to prevent 502 Bad Gateway when container IPs change upon rebuild/restart.
   - **🔌 Long-Running Worker Connection Lifecycle**: Background workers/daemons MUST use "Acquire-Use-Release per Cycle" pattern with connection health checks (`pool_pre_ping=True`); NEVER hold a single connection object indefinitely across infinite loops.
   - **💾 Dual-Storage Architecture**: High-frequency streaming/real-time services must utilize dual-storage (RAM/Cache for sub-millisecond UI responses + Periodic Batch Flush to persistent SQL database).
4. **Full Reference**: Read detailed templates in `.agents/skills/production-architecture/SKILL.md`.
<!-- END: PRODUCTION-ARCHITECTURE -->
