# 👑 BOSS AI (v1.1.0) — Universal Skills Installer

แพ็กเกจติดตั้งชุดสกิลมาตรฐานสำหรับนักพัฒนาและสาย Vibe Coding: **`Docker Full-Stack & Production Architecture`** (NGINX + Enterprise) + **`Git Team Workflow`** ให้กับ **AI Assistants ทุกตัวในโลก** ในคำสั่งเดียว

---

## 🚀 วิธีใช้งานทันทีผ่าน npx

### 1. ใช้งานในโปรเจกต์ปัจจุบัน (Project Workspace)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ของคุณ แล้วพิมพ์:
```bash
npx boss-ai
```
*(เพียง 1 วินาที AI ทุกตัวในโฟลเดอร์นั้นจะรู้จักและทำตามมาตรฐานทันที)*

### 2. ใช้งานเข้าแกนกลางของเครื่อง Mac (Global Mode)
```bash
npx boss-ai --global
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

## 📦 ในแพ็กเกจนี้ประกอบด้วย 2 สกิลมาตรฐานระดับ Production (v1.1.0):

### 1. 🐳 Docker Full-Stack & Production Architecture (ใหม่ใน v1.1.0 ✨)
- **🛡️ NGINX Gateway ด่านหน้า:** พอร์ต 80 / 443 รับแขกหน้าสุด ทำหน้าที่เป็น Reverse Proxy ส่งต่อให้ Frontend และ Backend ปิดพอร์ตข้างหลังไม่ให้โดนแฮก
- **🧹 Log Rotation กันดิสก์เต็ม:** จำกัดขนาด Log สูงสุด 10MB หมุนเวียน 3 ไฟล์ ป้องกันฮาร์ดดิสก์เซิร์ฟเวอร์ 264 GB เต็ม
- **🔄 Auto-Restart ฟื้นชีพตัวเอง:** ตั้งค่า `restart: unless-stopped` เซิร์ฟเวอร์รีบูต ตู้ฟื้นขึ้นมาทำงานต่อทันที 100%
- **🚀 จัดสรร RAM คล่องตัว (Dynamic RAM):** ไม่ล็อกเพดาน RAM ตายตัว ป้องกันปัญหาระบบเด้งดับกะทันหัน (OOM Killer / Exit Code 137) ให้เครื่องและ Docker บริหาร RAM ได้อย่างคล่องตัวและราบรื่น
- **💾 Auto DB Backup:** กลยุทธ์และแม่แบบสำรองฐานข้อมูล MySQL ทุกคืน ย้อนหลัง 7 วัน
- **🇹🇭 ภาษาไทย & ฐานข้อมูล:** รองรับ `utf8mb4` ภาษาไทย 100% พร้อมวิธีตั้งค่า DBeaver (`allowPublicKeyRetrieval=true`)

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
boss-ai
# หรือพิมพ์แค่
boss
```

---

## 🌐 ลิงก์สาธารณะ
* **npm:** [https://www.npmjs.com/package/boss-ai](https://www.npmjs.com/package/boss-ai)
* **GitHub:** [https://github.com/boss2546/boss-skills](https://github.com/boss2546/boss-skills)
