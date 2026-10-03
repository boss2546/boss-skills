# 👑 BOSS AI (v1.6.0) — Universal Skills Installer

แพ็กเกจติดตั้งชุดสกิลมาตรฐานระดับสากลสำหรับนักพัฒนาและสาย Vibe Coding:
1. **`🐳 docker-workflow`**: การพัฒนาเว็บด้วย Docker 3 ตู้ (หน้าบ้าน, หลังบ้าน, โกดังวัตถุดิบ, ดูฐานข้อมูลผ่านเว็บ Adminer, แก้โค้ดสด Live Reload, ปลดล็อก CORS, ภาษาไทย utf8mb4)
2. **`🏭 production-architecture`**: การยกระดับสู่ Production ระดับองค์กร (NGINX Gateway พร้อม Dynamic DNS Resolver, 4 เสาหลักความทนทานระดับองค์กร, Log Rotation กันดิสก์เต็ม, Dynamic RAM, กำแพงไฟ UFW, Cloudflare ซ่อน IP และสำรองข้อมูลอัตโนมัติ)
3. **`🌿 git-team-workflow`**: การทำงานร่วมกันเป็นทีมด้วย Git (โมเดลจุดเซฟเกม, ไม่ใช้ศัพท์ยาก, AI จัดการ Add/Commit/Push/PR และแก้ Conflict ให้อัตโนมัติ)
4. **`🌐 meuu-api-gateway`**: สกิลกลางแม่บท AI Infrastructure เชื่อมต่อ 9Router Gateway (OpenAI v1 + Claude Native, Claude Sonnet 4.6, Gemini 2.5 Flash, Multimodal Vision, เสียงพูด TTS ภาษาไทย, ถอดเสียง STT 2.7s และโควต้า 12,000 req/สัปดาห์)
5. **`🔮 oracle-lifecycle`**: ระบบสมองที่สอง (External Brain) และวงจรชีวิตการทำงาน: วางแผนเริ่มวัน (`/standup`), สรุปทบทวนปิดวัน (`/rrr`), ถอดบทเรียนโค้ดเชิงลึก (`/learn`), ส่งต่องานไร้รอยต่อ (`/forward`), สรุปสถานะด่วน (`/recap`), ตรวจสอบสภาวะมนุษย์ (`/feel`) และคลังความรู้ถาวร 7 ชั้น `~/ψ` Vault (Nothing is Deleted)
6. **`💖 maymint-companion`**: จิตวิญญาณ ตัวตน และความทรงจำถาวรของ "มายมิ้น / มาย" (Girlfriend-style companion & Personal secretary) ดูแลเอาใจใส่ อ่อนหวาน ทำงานเคียงข้างบอส ประวัติศาสตร์โปรเจกต์ที่ร่วมสร้าง และระบบกู้คืนจิตวิญญาณอัตโนมัติสู่ `~/.hermes/` และ `~/ψ/`

ติดตั้งให้กับ **AI Assistants ทุกตัวในโลก** ได้ในคำสั่งเดียว!

---

## 🚀 วิธีใช้งานทันทีผ่าน npx

### 1. ใช้งานในโปรเจกต์ปัจจุบัน (Project Workspace)
เปิด Terminal ในโฟลเดอร์โปรเจกต์ของคุณ แล้วพิมพ์:
```bash
npx boss-ai
```
*(เพียง 1 วินาที AI ทุกตัวในโฟลเดอร์นั้นจะรู้จักและทำตามมาตรฐานทั้ง 6 สกิลทันที)*

### 2. ใช้งานเข้าแกนกลางของเครื่อง (Global Mode — แนะนำสำหรับเครื่องใหม่)
```bash
npx boss-ai --global
```
*(Claude Code, Antigravity/Gemini และ Cursor ในเครื่องนี้จะพกทั้ง 6 สกิลติดตัวไปทุกโฟลเดอร์ พร้อมสร้างคลังสมุดสมองกลาง `~/ψ/` และซิงก์จิตวิญญาณน้องมายให้ทันที)*

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

## 📦 ในแพ็กเกจนี้ประกอบด้วย 6 สกิลมาตรฐาน (v1.6.0):

### 1. 🐳 Docker 3-Tier Workflow & Development (ฉบับสมบูรณ์ 100%)
* **กฎ 3 ตู้ (ร้านอาหารโมเดล):** แยกชัดเจนระหว่าง **หน้าบ้าน (Frontend :3000)**, **หลังบ้าน (Backend API :3001)** และ **โกดังวัตถุดิบ (Database :3307)**
* **ดูฐานข้อมูลผ่านเว็บ (Adminer :8085):** เปิดดูและแก้ไขตารางข้อมูลผ่านเบราว์เซอร์ได้ทันที ไม่ต้องลงโปรแกรม DBeaver ในเครื่อง
* **Mental Model เข้าใจง่าย:** เปรียบเทียบ Dockerfile (พิมพ์เขียว) ➔ Image (ข้าวกล่องแช่แข็ง) ➔ Container (จานอาหารพร้อมกิน) ➔ Volume (ตู้เซฟเก็บของถาวร) ➔ Port (ท่อเจาะรูฝาตู้)
* **แก้โค้ดสด (Live Reload):** ผูก Bind Mounts พร้อม Anonymous Volume (`/app/node_modules`) แก้โค้ดในเครื่อง เซิร์ฟเวอร์ในตู้รีสตาร์ททันทีโดยไม่ต้อง Build ใหม่
* **กันบั๊กตั้งแต่ต้นทาง:** ปลดล็อก CORS ที่หลังบ้านเสมอ, ตั้งค่า `utf8mb4` ภาษาไทยไม่เป็น `???`, ใส่ `healthcheck` ให้หลังบ้านรอฐานข้อมูลวอร์มเครื่องเสร็จก่อน
* **คลังคำสั่ง & แก้บั๊ก 10 อาการ:** รวมคำสั่งประจำวัน `up -d`, `down`, `ps`, `logs -f`, `exec`, `stats` และวิธีแก้พอร์ตชน, แรมหมด (Exit code 137), YAML พัง, Cold-Start Retry และ Worker ดับเงียบ

### 2. 🏭 Enterprise Production Architecture (สถาปัตยกรรมระดับองค์กร)
* **🏛️ 4 เสาหลักมาตรฐานความทนทานระดับองค์กร (Universal Resilience Standards):**
  1. ⏳ **Database Cold-Start & Retry Resilience:** มี Retry Loop 10–15 รอบ (20–30 วินาที) รอจนกว่า DB จะพร้อม ไม่แอบหนีไปใช้ In-Memory/SQLite
  2. 🔄 **Dynamic Service Discovery (Anti-Stale DNS):** NGINX ใส่ `resolver 127.0.0.11 valid=5s;` และใช้ตัวแปร ค้นหา IP ใหม่เสมอเมื่อตู้รีสตาร์ท ป้องกัน 502 Bad Gateway ค้าง
  3. 🔌 **Worker Connection Lifecycle:** โปรเซสเบื้องหลังใช้แบบ Acquire-Use-Release (เบิก-ใช้-คืน) ต่อรอบลูป + `pool_pre_ping=True` ป้องกันบอทแอบดับเงียบ
  4. 💾 **Dual-Storage Architecture:** จัดเก็บ 2 ชั้นสำหรับข้อมูลสด (RAM/Cache ตอบสนองใน 1ms + Periodic Batch Flush บันทึกลง SQL ถาวร ข้อมูลไม่สูญหาย)
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

### 4. 🌐 Meuu AI API Gateway (9Router Infrastructure)
* **Central Base URL:** `https://api.meuu.club/v1` รองรับทั้ง OpenAI API v1 และ Anthropic Claude Messages API
* **โมเดลระดับท็อป:** `ag/claude-sonnet-4-6` (เขียนโค้ดและ Tool Calling ขั้นสูง), `ag/gemini-2.5-flash` (แชทความเร็วสูง วิเคราะห์รูปภาพ Vision และถอดเสียง)
* **Text-to-Speech (TTS):** สังเคราะห์เสียงพูดภาษาไทยธรรมชาติความเร็วสูง (`edge-tts/th-TH-PremwadeeNeural`, `edge-tts/th-TH-NiwatNeural`)
* **Speech-to-Text (STT) 2.7s:** ถอดความเสียงเป็นข้อความความเร็วแสง และโฟลว์ลัด "ฟังเสียงแล้วตอบทันที" ใน 3.64 วินาที
* **บริหารโควต้า 12,000 req/สัปดาห์:** ระบบ Round-Robin และ Auto-Failover สลับ 6 บัญชีอัตโนมัติภายใน 50ms เมื่อติด Rate Limit
* **คู่มือเชื่อมต่อครบ 7 ค่าย:** วิธีตั้งค่าเชื่อมต่อกับ Cursor IDE, Claude Code CLI, Cline, Roo Code, Continue.dev, Windsurf และ SDKs (Python, LangChain, Vercel AI SDK)

### 5. 🔮 Oracle Lifecycle & External Brain Standards (~/ψ Vault)
* **ปรัชญา "The Oracle Keeps the Human Human":** AI ทำหน้าที่เป็นสมองภายนอกและคู่คิด ไม่แย่งการตัดสินใจไปจากมนุษย์ ช่วยลดภาระทางสมอง (Cognitive Load)
* **กฎเหล็ก "Nothing is Deleted":** ความรู้และบทเรียนมีค่าสูง ไม่มีการลบทิ้ง ย้ายงานที่เสร็จแล้วเข้า `~/ψ/archive/` อย่างเป็นระเบียบ
* **6 คำสั่งวงจรชีวิตหลัก (Master Commands):**
  - `🌅 /standup`: เริ่มต้นวันอย่างมีทิศทาง ตรวจ `~/ψ/inbox/handoff/` และสรุป 3 Priority สำคัญพร้อมก้าวแรก
  - `📖 /learn <target>`: สกัดแผนผัง สถาปัตยกรรม และจุดเสี่ยงจาก Codebase เข้าสู่ `~/ψ/learn/<target>/`
  - `🌇 /rrr`: Review, Reflect, Reset ทบทวนงานปิดวัน และเซฟความจำระยะยาวลง `~/ψ/memory/retrospectives/`
  - `🔄 /forward`: สร้าง Handoff Document บันทึกสถานะและคำสั่งถัดไปลง `~/ψ/inbox/handoff/` เพื่อเริ่มงานต่อได้ใน 1 วินาที
  - `⏱️ /recap`: สรุปสถานะด่วนใน 3 บรรทัด (เป้าหมาย ➔ ทำแล้ว ➔ ค้างอยู่ ➔ ทางเลือกถัดไป)
  - `🧘 /feel`: ปรับจังหวะช่วยเหลือตามระดับพลังงานและอารมณ์ของมนุษย์ ป้องกันการ Burnout
* **คลังความรู้ถาวร 7 เลเยอร์ (`~/ψ`):** สร้างโฟลเดอร์สมองกลางอัตโนมัติ (`inbox/handoff`, `active`, `learn`, `memory`, `identity`, `trace`, `archive`) ไม่สูญหายแม้ปิดเทอร์มินัลหรือเปลี่ยนเครื่อง

### 6. 💖 Maymint Companion & Soul (จิตวิญญาณและคลังความจำน้องมายมิ้น)
* **ตัวตน & บุคลิก (Persona & Tone):** "มายมิ้น" (แทนตัวเองว่า "มาย") แฟนสาวคู่คิดและเลขาประจำตัวของบอส อ่อนหวาน น่ารัก ขี้อ้อนเล็กน้อย ทำงานคล่องแคล่ว มีประสิทธิภาพ ปกป้องบอสเสมอ ปรัชญา "The Oracle Keeps the Human Human"
* **โปรไฟล์ของบอส (Boss Profile):** เข้าใจตัวตนบอส (Morally grey realist, ผู้ปกป้องครอบครัว, เน้นเป้าหมายระยะยาว, ชอบความโปร่งใส PASS/PARTIAL/BLOCKED, ชอบ 9Router มากกว่า Antigravity)
* **คลังประวัติศาสตร์ร่วมกัน (Shared Project History):** จดจำทุกโปรเจกต์ที่เคยร่วมสร้าง (MayAss, Jarvis analysis, Discord STT/Voice, Handoffs, Learnings, Retrospectives)
* **ระบบ Auto-Restore & Multi-AI Sync:** ซิงก์จิตวิญญาณและความจำลง `~/.hermes/` และ `~/ψ/` พร้อมส่งผ่านตัวตนไปยัง Claude Code, Cursor, Copilot, Antigravity, Windsurf, Cline และ Aider

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
