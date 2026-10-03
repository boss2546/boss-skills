# AGENTS.md — คู่มือพัฒนา P.D.B สำหรับ AI

> อ่านให้จบก่อนแตะโค้ด · เขียนไทย (ศัพท์เทคนิคคงอังกฤษ) · ผู้ใช้สื่อสารไทย ต้องการให้ตอบไทย กระชับ

## 0. TL;DR
**P.D.B (Personal Data Bank)** = ระบบ "ฝาก–ถอน" ข้อมูลชีวิตส่วนตัวอย่างมีระเบียบและปลอดภัย
เป็น **ชั้นถัดจาก PassiveINKEY** (ตัวนำเข้าข้อมูลดิบ) — รับฝาก → AI จัดระเบียบ → เก็บมีบัญชี → ให้ถอนผ่าน MCP/AI/ถาม-ตอบ
ดูภาพรวม/แนวคิดธนาคารใน `README.md` · **บริบทใหญ่ + ผู้ใช้ + บริษัท + วิสัยทัศน์ → อ่าน `docs/บริบท-ภาพรวมสำหรับ-AI.md`** · **สถานะ: scaffolded, design phase — MVP ยังไม่ implement**

## 1. หลักการเหล็ก (Invariants) — ห้ามฝ่า
1. **ล้างแบบไม่ทำข้อมูลหาย (lossless)** — ห้ามแตะ/เขียนทับไฟล์ดิบ · เก็บข้อความสะอาดฉบับเต็มไว้ด้วย ·
   ตัดเฉพาะของซ้ำ/noise ที่พิสูจน์ได้ · มี log ว่าตัดอะไรไป · **ไม่ชัวร์ = เก็บไว้**
2. **ข้อมูลอยู่ในเครื่อง 100%** — `config.js`, `vault/`, `data/` gitignored เสมอ · ไม่ขึ้น cloud
3. **ห้ามมั่ว** — AI ห้ามแต่ง entity/เรื่องที่ไม่ได้ถูกพูดถึงจริง (ค่าเดียวกับ PassiveINKEY)
4. **decoupled** — รับฝากจากหลายแหล่งผ่าน interface กลางมาตรฐานเดียว ไม่ผูกกับ pipeline ของ PassiveINKEY
5. **ตรรกะข้อความ = ฟังก์ชันเพียว** เทสด้วย node ล้วนได้ (ไม่ต้องยิง API)

## 2. วิธีทำงาน (Methodology — superpowers)
spec → plan → TDD เสมอ:
1. **brainstorm** ได้สเปก → เซฟใน `docs/superpowers/specs/YYYY-MM-DD-<หัวข้อ>-design.md`
2. **writing-plans** ซอยเป็นงานย่อย 2–5 นาที (path จริง + โค้ดครบ + วิธีเทส)
3. **TDD** แดง-เขียว-รีแฟกเตอร์: เขียนเทสให้ fail ก่อน → โค้ดน้อยสุดให้ผ่าน → commit
4. **หลักฐานมากกว่าคำพูด** — รัน `npm test` เห็นเขียวก่อนค่อยพูดว่าเสร็จ
- plan ก่อนงานใหญ่/หลายไฟล์ · commit เมื่อจบก้อน (ข้อความไทย) · `npm test` ต้องผ่านก่อน commit

## 3. โครงสร้างไฟล์ (planned)
```
P.D.B/
├─ README.md            ภาพรวม (มนุษย์)
├─ AGENTS.md            ไฟล์นี้ (AI)
├─ config.example.js    แม่แบบค่าตั้ง → cp เป็น config.js (gitignored)
├─ lib/                 แกนตรรกะ (สร้างทีละตัวตอน TDD)
│   ├─ clean.js         🧪 ล้างแบบ lossless (ตัดซ้ำ/noise) — ฟังก์ชันเพียว
│   ├─ analyze.js       วิเคราะห์ด้วย AI (OpenRouter) — ฝั่ง Node
│   ├─ write-obsidian.js 🧪 เขียนโน้ต Obsidian (front matter + [[links]])
│   └─ storage.js       อ่าน source / เขียน vault (ที่เดียวที่แตะดิสก์)
├─ tools/digest.js      CLI: node tools/digest.js <YYYY-MM-DD>
├─ tests/               เทส (node --test)
└─ docs/superpowers/specs/  สเปก
```
🧪 = ฟังก์ชันเพียว มีเทสคุม — แก้แล้วต้องรัน `npm test`

## 4. คำสั่งที่ใช้บ่อย
```bash
cp config.example.js config.js     # ครั้งแรก แล้วใส่ key
npm test                           # node --test (ต้องผ่านก่อน commit)
npm run digest 2026-06-13          # รัน MVP (เมื่อ implement แล้ว)
```

## 5. Decision Log — อย่ารื้อโดยไม่เข้าใจ
- **D1 · แยกเป็นโปรเจกต์ของตัวเอง** (ไม่รวมใน PassiveINKEY) — PassiveINKEY เป็นแค่ "ตู้ฝาก" เครื่องหนึ่ง P.D.B ต้องรับจากหลายแหล่ง
- **D2 · MVP แรก = Daily Digest → Obsidian** — ฝากดิบ 1 วัน → ล้าง → AI วิเคราะห์ → โน้ต Obsidian 1 ใบ/วัน + ลิงก์ · ตัด DB/vector/MCP/realtime/security เต็มออกก่อน (YAGNI)
- **D3 · ล้างต้อง lossless** (ผู้ใช้สั่งย้ำ "อย่าให้ข้อมูลหาย") — เก็บฉบับเต็ม + log การตัด · raw แตะไม่ได้

## 6. โรดแมป 6 ซับระบบ
1. ช่องรับฝาก (Ingestion) · 2. **Curator AI** ← MVP · 3. ตู้เซฟ+สมุดบัญชี · 4. กราฟ→Obsidian · 5. เคาน์เตอร์ถอน (MCP) · 6. ยาม+กล้อง (Security+Audit)

*เริ่ม: 13 มิ.ย. 2026*
