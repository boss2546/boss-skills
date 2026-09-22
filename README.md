# 👑 BOSS SKILL — Universal AI Skills Installer

แพ็กเกจติดตั้งชุดสกิลมาตรฐานสำหรับนักพัฒนาและสาย Vibe Coding: **`Docker 3-Tier Workflow`** + **`Git Team Workflow`** ให้กับ **AI Assistants ทุกตัวในโลก** ในคำสั่งเดียว

---

## 🚀 วิธีใช้งานทันทีผ่าน npx

### 1. ใช้งานในโปรเจกต์ปัจจุบัน (Project Workspace)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ของคุณ แล้วพิมพ์:
```bash
npx boss-skill
```
*(เพียง 1 วินาที AI ทุกตัวในโฟลเดอร์นั้นจะรู้จักและทำตามมาตรฐานทันที)*

### 2. ใช้งานเข้าแกนกลางของเครื่อง Mac (Global Mode)
```bash
npx boss-skill --global
```
*(Claude Code, Antigravity และ Cursor ในเครื่องนี้จะพกทั้ง 2 สกิลติดตัวไปทุกโฟลเดอร์ตลอดกาล)*

---

## 🤖 รองรับ AI Coding Assistants ครบทั้ง 7 ค่าย

| AI Assistant / Tool | ไฟล์โปรเจกต์ (Project Workspace) | คอนฟิกทั้งเครื่อง (Machine Global) |
| :--- | :--- | :--- |
| **Claude Code (Anthropic)** | `CLAUDE.md` + `.claude/skills/` | `~/.claude/skills/` |
| **Cursor IDE** | `.cursorrules` + `.cursor/rules/*.mdc` | `~/.cursorrules` |
| **GitHub Copilot / OpenAI Codex**| `.github/copilot-instructions.md` | *(ทำงานผ่านกฎของ Repository)* |
| **Antigravity / Gemini CLI** | `AGENTS.md` + `GEMINI.md` + `.agents/skills/` | `~/.gemini/config/skills/` |
| **Windsurf (Codeium)** | `.windsurfrules` + `.windsurf/rules/` | *(ทำงานผ่านกฎของ Repository)* |
| **Cline / Roo Code** | `.clinerules` | *(ทำงานผ่านกฎของ Repository)* |
| **Aider** | `CONVENTIONS.md` | *(ทำงานผ่านกฎของ Repository)* |

---

## 📦 ในแพ็กเกจนี้ประกอบด้วย 2 สกิลมาตรฐานระดับสากล:

### 1. 🐳 Docker 3-Tier Workflow
- **ร้านอาหารโมเดล:** แยก 3 ตู้เสมอ — Frontend (3000), Backend API (3001), Database (3307/MySQL 8.4)
- **ระบบกันบั๊ก:** มี DB `healthcheck` และ Backend `condition: service_healthy` ป้องกันปัญหา `ECONNREFUSED`
- **ภาษาไทย & ฐานข้อมูล:** รองรับ `utf8mb4` ภาษาไทย 100% พร้อมวิธีตั้งค่า DBeaver (`allowPublicKeyRetrieval=true`)
- **ปลดล็อก CORS:** ป้องกันหน้าบ้านดึงข้อมูลหลังบ้านแล้วโดนบล็อก

### 2. 🌿 Git Team Workflow (สำหรับคนที่ทำงานร่วมกับเพื่อน)
- **โมเดลจุดเซฟเกม & มิติคู่ขนาน:** เข้าใจง่ายแบบเด็กอนุบาล ไม่ใช้ศัพท์เทคนิคซับซ้อน
- **ลูปทำงาน 7 ขั้นตอน:** Main ➔ Branch ➔ Work ➔ Commit ➔ Push ➔ PR ➔ Sync
- **AI ดูแลให้อัตโนมัติ:** ช่วย Add, Commit, Push, Pull, สร้าง Branch และช่วยคลี่คลาย Merge Conflict
- **ความปลอดภัยสูงสุด:** ห้าม Force Push, ห้ามขอ Password/Token ในแชท และมี `.gitignore` เสมอ

---

## 🛡️ ระบบ Safe Injection (ปลอดภัย ไม่ทำลายของเดิม)
หากโปรเจกต์ของคุณมีไฟล์คอนฟิกเดิมอยู่แล้ว (เช่น มี `CLAUDE.md`, `.cursorrules` หรือ `.github/` อยู่ก่อน):
- ระบบจะ **แทรกเฉพาะบล็อกกฎต่อท้ายให้อย่างปลอดภัย** โดยไม่แตะต้องกฎเดิมของคุณ
- ไม่เกิดข้อความซ้ำซ้อนแม้จะเผลอรันคำสั่งซ้ำหลายครั้ง

---

## 🛠️ ทดสอบใช้งานในเครื่องคุณ (Local)

ในเครื่องของคุณได้เชื่อมต่อคำสั่งทางลัดไว้แล้ว สามารถเปิด Terminal แล้วพิมพ์สั้นๆ ได้เลย:
```bash
boss-skill
# หรือพิมพ์แค่
boss
```

---

## 🌐 การนำไปเผยแพร่ (Publish)

### ทางที่ 1: ผ่าน npmjs.com
```bash
npm publish
```
*(หลังจากนั้นทุกคนในโลกจะสั่ง `npx boss-skill` ได้ทันที)*

### ทางที่ 2: ผ่าน GitHub (ไม่ต้องมีบัญชี npm)
Push โฟลเดอร์นี้ขึ้น GitHub ของคุณ แล้วเรียกใช้ได้ทันที:
```bash
npx github:boss2546/boss-ai
```
