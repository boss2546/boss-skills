# 👑 BOSS AI (v1.2.0) — Universal Skills Installer

แพ็กเกจติดตั้งชุดสกิลมาตรฐานระดับสากลสำหรับนักพัฒนาและสาย Vibe Coding:
1. **`🐳 docker-workflow`**: การพัฒนาเว็บด้วย Docker 3 ตู้ (หน้าบ้าน, หลังบ้าน, โกดังวัตถุดิบ, ดูฐานข้อมูลผ่านเว็บ Adminer, แก้โค้ดสด Live Reload, ปลดล็อก CORS, ภาษาไทย utf8mb4)
2. **`🏭 production-architecture`**: การยกระดับสู่ Production ระดับองค์กร (NGINX Gateway, Log Rotation กันดิสก์เต็ม, Dynamic RAM, กำแพงไฟ UFW, Cloudflare ซ่อน IP และสำรองข้อมูลอัตโนมัติ)
3. **`🌿 git-team-workflow`**: การทำงานร่วมกันเป็นทีมด้วย Git (โมเดลจุดเซฟเกม, ไม่ใช้ศัพท์ยาก, AI จัดการ Add/Commit/Push/PR และแก้ Conflict ให้อัตโนมัติ)

ติดตั้งให้กับ **AI Assistants ทุกตัวในโลก** ได้ในคำสั่งเดียว!

---

## 🚀 วิธีใช้งานทันทีผ่าน npx

### 1. ใช้งานในโปรเจกต์ปัจจุบัน (Project Workspace)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ของคุณ แล้วพิมพ์:
```bash
npx boss-ai
```
*(เพียง 1 วินาที AI ทุกตัวในโฟลเดอร์นั้นจะรู้จักและทำตามมาตรฐานทั้ง 3 สกิลทันที)*

### 2. ใช้งานเข้าแกนกลางของเครื่อง Mac (Global Mode)
```bash
npx boss-ai --global
```
*(Claude Code, Antigravity/Gemini และ Cursor ในเครื่องนี้จะพกทั้ง 3 สกิลติดตัวไปทุกโฟลเดอร์ตลอดกาล)*

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

## 📦 ในแพ็กเกจนี้ประกอบด้วย 3 สกิลมาตรฐาน (v1.2.0):

### 1. 🐳 Docker 3-Tier Workflow & Development (ฉบับสมบูรณ์ 100%)
* **กฎ 3 ตู้ (ร้านอาหารโมเดล):** แยกชัดเจนระหว่าง **หน้าบ้าน (Frontend :3000)**, **หลังบ้าน (Backend API :3001)** และ **โกดังวัตถุดิบ (Database :3307)**
* **ดูฐานข้อมูลผ่านเว็บ (Adminer :8085):** เปิดดูและแก้ไขตารางข้อมูลผ่านเบราว์เซอร์ได้ทันที ไม่ต้องลงโปรแกรม DBeaver ในเครื่อง
* **Mental Model เข้าใจง่าย:** เปรียบเทียบ Dockerfile (พิมพ์เขียว) ➔ Image (ข้าวกล่องแช่แข็ง) ➔ Container (จานอาหารพร้อมกิน) ➔ Volume (ตู้เซฟเก็บของถาวร) ➔ Port (ท่อเจาะรูฝาตู้)
* **แก้โค้ดสด (Live Reload):** ผูก Bind Mounts พร้อม Anonymous Volume (`/app/node_modules`) แก้โค้ดในเครื่อง เซิร์ฟเวอร์ในตู้รีสตาร์ททันทีโดยไม่ต้อง Build ใหม่
* **กันบั๊กตั้งแต่ต้นทาง:** ปลดล็อก CORS ที่หลังบ้านเสมอ, ตั้งค่า `utf8mb4` ภาษาไทยไม่เป็น `???`, ใส่ `healthcheck` ให้หลังบ้านรอฐานข้อมูลวอร์มเครื่องเสร็จก่อน
* **คลังคำสั่ง & แก้บั๊ก 9 อาการ:** รวมคำสั่งประจำวัน `up -d`, `down`, `ps`, `logs -f`, `exec`, `stats` และวิธีแก้พอร์ตชน, แรมหมด (Exit code 137), YAML พัง

### 2. 🏭 Enterprise Production Architecture (สถาปัตยกรรมระดับองค์กร)
* **🛡️ NGINX Gateway ด่านหน้า:** พอร์ต 80 / 443 รับแขกหน้าสุด ทำ Reverse Proxy ปิดพอร์ตภายในทั้งหมดไม่ให้ถูกโจมตี
* **🧹 Log Rotation กันดิสก์เต็ม:** จำกัดขนาด Log สูงสุด 10MB หมุนเวียน 3 ไฟล์ ป้องกันฮาร์ดดิสก์เซิร์ฟเวอร์เต็ม 100%
* **🔄 Auto-Restart ฟื้นชีพตัวเอง:** ตั้งค่า `restart: unless-stopped` เซิร์ฟเวอร์รีบูต ตู้ฟื้นขึ้นมาทำงานต่อทันที
* **🚀 จัดสรร RAM คล่องตัว (Dynamic RAM):** ไม่ล็อกเพดาน RAM ตายตัว ป้องกันระบบเด้งดับกะทันหัน (Exit Code 137) ให้เซิร์ฟเวอร์บริหารจัดการได้ลื่นไหล
* **🧱 Host Firewall (UFW):** เปิดเฉพาะพอร์ต 22 (SSH), 80 (HTTP), 443 (HTTPS) ปิดพอร์ตอื่นๆ ทั้งหมด
* **☁️ Cloudflare & Custom Domain:** ซ่อน IP จริงหลังก้อนเมฆสีส้ม (Proxied) ทำ HTTPS อัตโนมัติ ป้องกัน DDoS และรองรับ Cloudflare Tunnel
* **💾 Auto DB Backup:** สคริปต์สำรองข้อมูลฐานข้อมูลอัตโนมัติทุกเที่ยงคืน พร้อมหมุนเวียนลบของเก่าเกิน 7 วัน

### 3. 🌿 Git Team Workflow (สำหรับคนที่ทำงานร่วมกับเพื่อน)
* **โมเดลจุดเซฟเกม & มิติคู่ขนาน:** เข้าใจง่ายแบบเด็กอนุบาล ไม่ใช้ศัพท์เทคนิคซับซ้อน
* **ลูปทำงาน 7 ขั้นตอน:** Main ➔ Branch ➔ Work ➔ Commit ➔ Push ➔ PR ➔ Sync
* **AI ดูแลให้อัตโนมัติ:** ช่วย Add, Commit, Push, Pull, สร้าง Branch และช่วยคลี่คลาย Merge Conflict
* **ความปลอดภัยสูงสุด:** ห้าม Force Push, ห้ามขอ Password/Token ในแชท และมี `.gitignore` เสมอ

---

## 🛡️ ระบบ Safe Injection & Auto Cleanup
* ระบบจะ **แทรกเฉพาะบล็อกกฎต่อท้ายให้อย่างปลอดภัย** โดยไม่แตะต้องกฎเดิมของผู้ใช้
* ล้างกฎและโฟลเดอร์เก่าที่ถูกยกเลิกไปแล้ว (เช่น `docker-3tier-workflow`) ให้อัตโนมัติ ไม่ให้เกิดกฎซ้ำซ้อนหรือตีกัน

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
