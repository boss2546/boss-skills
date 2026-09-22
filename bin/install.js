#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const args = process.argv.slice(2);
const isGlobal = args.includes('--global') || args.includes('-g');

// ตัวเลือกคัดกรองสกิล (ค่าเริ่มต้น: ติดตั้งทั้ง 2 สกิล)
const installDocker = !args.includes('--git-only');
const installGit = !args.includes('--docker-only');

// ตัวเลือกคัดกรอง AI
const targetAIs = {
  antigravity: args.length === 0 || args.includes('--all') || args.includes('--antigravity') || args.includes('--gemini') || isGlobal,
  claude: args.length === 0 || args.includes('--all') || args.includes('--claude') || isGlobal,
  cursor: args.length === 0 || args.includes('--all') || args.includes('--cursor') || isGlobal,
  copilot: args.length === 0 || args.includes('--all') || args.includes('--copilot') || args.includes('--codex'),
  windsurf: args.length === 0 || args.includes('--all') || args.includes('--windsurf'),
  cline: args.length === 0 || args.includes('--all') || args.includes('--cline') || args.includes('--roo'),
  aider: args.length === 0 || args.includes('--all') || args.includes('--aider')
};

console.log('\n👑 ========================================================================');
console.log('🚀 BOSS AI — Universal Skills Installer (คำสั่งเดียว ได้ครบทุก AI)');
console.log('========================================================================');
console.log(`📦 สกิล: ${[installDocker ? '🐳 Docker Full-Stack & Production (NGINX + Enterprise)' : '', installGit ? '🌿 Git Team Workflow' : ''].filter(Boolean).join(' + ')}`);
console.log(`🎯 โหมด: ${isGlobal ? '🌐 Global (ติดตั้งเข้าแกนกลางของเครื่อง Mac ใช้งานได้ทุกโปรเจกต์)' : '📁 Project Workspace (ติดตั้งเข้าโปรเจกต์ปัจจุบัน)'}`);
console.log('🤖 AI ที่รองรับ: Claude Code, Cursor, GitHub Copilot/Codex, Antigravity, Windsurf, Cline, Aider\n');

const packageRoot = path.resolve(__dirname, '..');
const cwd = process.cwd();

const dockerSkillSrc = path.join(packageRoot, 'skills', 'docker-3tier-workflow');
const gitSkillSrc = path.join(packageRoot, 'skills', 'git-team-workflow');

// สรุปกฎ Docker Fullstack & Production สำหรับ AI
const dockerRuleSummary = `
## 🐳 Docker Full-Stack & Production Architecture Standards (Universal AI Guide)
When designing, containerizing, or managing Docker environments in this project:
1. **Architecture (4-Tier Enterprise Pattern)**:
   - **Gateway (NGINX)**: Port \`80:80\` & \`443:443\` — Entry point, HTTPS/SSL, Reverse Proxy to frontend & backend.
   - **Frontend**: Internal port \`3000\` (Next.js / React / Vite / Vue) — internal only in production.
   - **Backend API**: Internal port \`3000\` (Node.js / Python / Go) — internal only in production.
   - **Database**: Port \`127.0.0.1:3307:3306\` (MySQL 8.4+ / PostgreSQL) with \`utf8mb4\` Thai charset.
2. **Production Reliability Standards**:
   - **Auto-Restart**: All services MUST have \`restart: unless-stopped\`.
   - **Disk Full Prevention (Log Rotation)**: All containers MUST have:
     \`\`\`yaml
     logging:
       driver: "json-file"
       options:
         max-size: "10m"
         max-file: "3"
     \`\`\`
   - **Database Healthcheck**: DB must have \`healthcheck\` and Backend must use \`depends_on: db: condition: service_healthy\`.
   - **Dynamic RAM**: Allow containers to share host memory dynamically without hard ceilings, preventing sudden OOM container termination (Exit Code 137).
   - **Host Firewall (UFW)**: On Ubuntu host, allow only ports 22 (SSH), 80 (HTTP), and 443 (HTTPS); deny all other incoming.
   - **CORS & Proxy Headers**: NGINX / Backend must forward \`Host\`, \`X-Real-IP\`, \`X-Forwarded-For\`.
3. **Database Client Tools (DBeaver / DataGrip)**:
   - For MySQL 8+, ensure \`allowPublicKeyRetrieval=true\` in Driver Properties.
4. **Full Reference**: Read detailed templates and NGINX config in \`.agents/skills/docker-3tier-workflow/SKILL.md\`.
`;

// สรุปกฎ Git Team Workflow สำหรับ AI
const gitRuleSummary = `
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
4. **Full Reference**: Read detailed guides and cheatsheets in \`.agents/skills/git-team-workflow/SKILL.md\` or \`.claude/skills/git-team-workflow/SKILL.md\`.
`;

// Helper: คัดลอกโฟลเดอร์แบบ recursive
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Helper: เขียนหรืออัปเดตไฟล์แบบไม่ลบของเดิมของผู้ใช้ (Idempotent safe append)
function safeInjectRule(filePath, content, markerId) {
  const startMarker = `<!-- START: ${markerId} -->`;
  const endMarker = `<!-- END: ${markerId} -->`;
  const block = `${startMarker}\n${content.trim()}\n${endMarker}`;

  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, block + '\n', 'utf8');
    return 'สร้างไฟล์ใหม่';
  }

  let existing = fs.readFileSync(filePath, 'utf8');
  const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
  if (regex.test(existing)) {
    existing = existing.replace(regex, block);
    fs.writeFileSync(filePath, existing, 'utf8');
    return 'อัปเดตส่วนเดิม';
  } else {
    const separator = existing.endsWith('\n\n') ? '' : existing.endsWith('\n') ? '\n' : '\n\n';
    fs.writeFileSync(filePath, existing + separator + block + '\n', 'utf8');
    return 'แทรกต่อท้าย';
  }
}

const installedList = [];

try {
  // ==========================================
  // โหมด GLOBAL: ติดตั้งเข้าแกนกลางของเครื่อง
  // ==========================================
  if (isGlobal) {
    const home = os.homedir();

    // 1. Antigravity & Gemini Global (~/.gemini/config/skills/)
    const agyGlobal = path.join(home, '.gemini', 'config', 'skills');
    if (installDocker && fs.existsSync(dockerSkillSrc)) {
      copyDirSync(dockerSkillSrc, path.join(agyGlobal, 'docker-3tier-workflow'));
      installedList.push(`[Antigravity Global] -> ~/.gemini/config/skills/docker-3tier-workflow`);
    }
    if (installGit && fs.existsSync(gitSkillSrc)) {
      copyDirSync(gitSkillSrc, path.join(agyGlobal, 'git-team-workflow'));
      installedList.push(`[Antigravity Global] -> ~/.gemini/config/skills/git-team-workflow`);
    }

    // 2. Claude Code Global (~/.claude/skills/)
    const claudeGlobal = path.join(home, '.claude', 'skills');
    if (installDocker && fs.existsSync(dockerSkillSrc)) {
      copyDirSync(dockerSkillSrc, path.join(claudeGlobal, 'docker-3tier-workflow'));
      installedList.push(`[Claude Code Global]  -> ~/.claude/skills/docker-3tier-workflow`);
    }
    if (installGit && fs.existsSync(gitSkillSrc)) {
      copyDirSync(gitSkillSrc, path.join(claudeGlobal, 'git-team-workflow'));
      installedList.push(`[Claude Code Global]  -> ~/.claude/skills/git-team-workflow`);
    }

    // 3. Cursor Global (~/.cursorrules)
    const cursorGlobal = path.join(home, '.cursorrules');
    if (installDocker) safeInjectRule(cursorGlobal, dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
    if (installGit) safeInjectRule(cursorGlobal, gitRuleSummary, 'GIT-TEAM-WORKFLOW');
    installedList.push(`[Cursor IDE Global]   -> ~/.cursorrules`);

  } else {
    // ==========================================
    // โหมด PROJECT WORKSPACE: ติดตั้งเข้าโปรเจกต์
    // ==========================================

    // 1. Antigravity & Gemini Agent (.agents/skills/ + AGENTS.md + GEMINI.md)
    if (targetAIs.antigravity) {
      const agySkills = path.join(cwd, '.agents', 'skills');
      if (installDocker && fs.existsSync(dockerSkillSrc)) {
        copyDirSync(dockerSkillSrc, path.join(agySkills, 'docker-3tier-workflow'));
        installedList.push(`[Antigravity / Gemini] -> .agents/skills/docker-3tier-workflow`);
      }
      if (installGit && fs.existsSync(gitSkillSrc)) {
        copyDirSync(gitSkillSrc, path.join(agySkills, 'git-team-workflow'));
        installedList.push(`[Antigravity / Gemini] -> .agents/skills/git-team-workflow`);
      }
      if (installDocker) {
        safeInjectRule(path.join(cwd, 'AGENTS.md'), dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
        safeInjectRule(path.join(cwd, 'GEMINI.md'), dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      }
      if (installGit) {
        safeInjectRule(path.join(cwd, 'AGENTS.md'), gitRuleSummary, 'GIT-TEAM-WORKFLOW');
        safeInjectRule(path.join(cwd, 'GEMINI.md'), gitRuleSummary, 'GIT-TEAM-WORKFLOW');
      }
      installedList.push(`[Antigravity Rules]     -> AGENTS.md & GEMINI.md`);
    }

    // 2. Claude Code (CLAUDE.md + .claude/skills/)
    if (targetAIs.claude) {
      if (installDocker) safeInjectRule(path.join(cwd, 'CLAUDE.md'), dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(path.join(cwd, 'CLAUDE.md'), gitRuleSummary, 'GIT-TEAM-WORKFLOW');

      const claudeSkills = path.join(cwd, '.claude', 'skills');
      if (installDocker && fs.existsSync(dockerSkillSrc)) copyDirSync(dockerSkillSrc, path.join(claudeSkills, 'docker-3tier-workflow'));
      if (installGit && fs.existsSync(gitSkillSrc)) copyDirSync(gitSkillSrc, path.join(claudeSkills, 'git-team-workflow'));
      installedList.push(`[Claude Code]           -> CLAUDE.md & .claude/skills/ (2 สกิล)`);
    }

    // 3. Cursor IDE (.cursorrules + .cursor/rules/*.mdc)
    if (targetAIs.cursor) {
      if (installDocker) safeInjectRule(path.join(cwd, '.cursorrules'), dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(path.join(cwd, '.cursorrules'), gitRuleSummary, 'GIT-TEAM-WORKFLOW');

      const cursorMdcDir = path.join(cwd, '.cursor', 'rules');
      fs.mkdirSync(cursorMdcDir, { recursive: true });
      if (installDocker) {
        fs.writeFileSync(path.join(cursorMdcDir, 'docker-3tier.mdc'), `---\ndescription: Docker Full-Stack & Production Architecture\nglobs: "**/Dockerfile*,**/compose*.yaml,**/docker-compose*.yml,**/nginx*.conf"\n---\n${dockerRuleSummary}`, 'utf8');
      }
      if (installGit) {
        fs.writeFileSync(path.join(cursorMdcDir, 'git-team-workflow.mdc'), `---\ndescription: Git Team Workflow for Collaboration\nglobs: "**/*"\n---\n${gitRuleSummary}`, 'utf8');
      }
      installedList.push(`[Cursor IDE]            -> .cursorrules & .cursor/rules/*.mdc`);
    }

    // 4. GitHub Copilot & OpenAI Codex (.github/copilot-instructions.md)
    if (targetAIs.copilot) {
      const copilotPath = path.join(cwd, '.github', 'copilot-instructions.md');
      if (installDocker) safeInjectRule(copilotPath, dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(copilotPath, gitRuleSummary, 'GIT-TEAM-WORKFLOW');
      installedList.push(`[Copilot / Codex]       -> .github/copilot-instructions.md`);
    }

    // 5. Windsurf Codeium (.windsurfrules + .windsurf/rules/)
    if (targetAIs.windsurf) {
      const windsurfPath = path.join(cwd, '.windsurfrules');
      if (installDocker) safeInjectRule(windsurfPath, dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(windsurfPath, gitRuleSummary, 'GIT-TEAM-WORKFLOW');

      const windsurfDir = path.join(cwd, '.windsurf', 'rules');
      fs.mkdirSync(windsurfDir, { recursive: true });
      if (installDocker) safeInjectRule(path.join(windsurfDir, 'docker-3tier.md'), dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(path.join(windsurfDir, 'git-team-workflow.md'), gitRuleSummary, 'GIT-TEAM-WORKFLOW');
      installedList.push(`[Windsurf (Codeium)]    -> .windsurfrules & .windsurf/rules/`);
    }

    // 6. Cline / Roo Code (.clinerules)
    if (targetAIs.cline) {
      const clinePath = path.join(cwd, '.clinerules');
      if (installDocker) safeInjectRule(clinePath, dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(clinePath, gitRuleSummary, 'GIT-TEAM-WORKFLOW');
      installedList.push(`[Cline / Roo Code]      -> .clinerules`);
    }

    // 7. Aider (CONVENTIONS.md)
    if (targetAIs.aider) {
      const aiderPath = path.join(cwd, 'CONVENTIONS.md');
      if (installDocker) safeInjectRule(aiderPath, dockerRuleSummary, 'DOCKER-3TIER-WORKFLOW');
      if (installGit) safeInjectRule(aiderPath, gitRuleSummary, 'GIT-TEAM-WORKFLOW');
      installedList.push(`[Aider]                 -> CONVENTIONS.md`);
    }
  }

  console.log('------------------------------------------------------------------------');
  console.log('🎉 BOSS AI ติดตั้งและซิงก์ชุดสกิลให้เรียบร้อยแล้ว:');
  console.log('------------------------------------------------------------------------');
  installedList.forEach(item => console.log(`  ✓ ${item}`));
  console.log('========================================================================');
  console.log('✨ พร้อมใช้งานทันทีกับ:');
  console.log('   - Claude Code       (อ่านจาก CLAUDE.md / .claude/skills/)');
  console.log('   - Cursor IDE        (อ่านจาก .cursorrules / .cursor/rules/)');
  console.log('   - GitHub Copilot    (อ่านจาก .github/copilot-instructions.md)');
  console.log('   - Antigravity/Gemini (อ่านจาก .agents/skills/ / AGENTS.md)');
  console.log('   - Windsurf          (อ่านจาก .windsurfrules / .windsurf/rules/)');
  console.log('   - Cline / Roo Code  (อ่านจาก .clinerules)');
  console.log('   - Aider             (อ่านจาก CONVENTIONS.md)');
  console.log('========================================================================\n');
} catch (error) {
  console.error('\n❌ เกิดข้อผิดพลาดในการติดตั้ง:', error.message);
  process.exit(1);
}
