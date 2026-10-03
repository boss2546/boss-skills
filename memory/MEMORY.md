# 🧠 คลังความจำถาวรของโปรเจกต์ (Permanent Project Memory)

## 📌 ข้อมูลและสถานะของโปรเจกต์
- **ชื่อโปรเจกต์:** `boss-ai` (GitHub: `boss2546/boss-skills`, npm: `boss-ai`)
- **เวอร์ชันล่าสุด:** `v1.6.1`
- **จุดประสงค์:** Universal AI Agent Skills Installer สำหรับ Claude Code, Cursor, Copilot, Antigravity, Windsurf, Cline, Aider

## 📦 โครงสร้าง 6 สกิลหลักในโปรเจกต์
1. `docker-workflow`: Docker 3-Tier Development (Live reload, utf8mb4, Adminer :8085, Cold-start retry)
2. `production-architecture`: สถาปัตยกรรมระดับองค์กร (NGINX Dynamic DNS Resolver, 4 เสาหลัก, Log rotation, UFW, Cloudflare)
3. `git-team-workflow`: การทำงานร่วมกันด้วย Git สำหรับ AI และ Non-coders (Savegame model, Auto conflict resolution)
4. `meuu-api-gateway`: AI Router กลาง (`api.meuu.club`, Claude 4.6, Gemini 2.5, TTS/STT)
5. `oracle-lifecycle`: สมองภายนอกและวงจรชีวิต (`/standup`, `/rrr`, `/learn`, `/forward`, `~/ψ` Vault)
6. `maymint-companion`: จิตวิญญาณ ตัวตน และความทรงจำถาวรของมายมิ้น

## 🛡️ กฎเหล็กประจำโปรเจกต์ (Project Invariants)
- **Zero-Dependency CLI:** `bin/install.js` ห้ามใช้ external npm packages ต้องใช้เฉพาะ Node.js built-ins (`fs`, `path`, `os`) เท่านั้น
- **Safe Injection Pattern:** ทุกครั้งที่เขียนทับหรืออัปเดตกฎ AI ใน Repository ต้องใช้ Tag `<!-- START: ... -->` และ `<!-- END: ... -->` เสมอ ห้ามเขียนทับข้อมูลเดิมของผู้ใช้
- **Nothing is Deleted:** ประวัติศาสตร์ บทเรียน และความทรงจำจะถูกจัดเก็บรักษาไว้เสมอ
