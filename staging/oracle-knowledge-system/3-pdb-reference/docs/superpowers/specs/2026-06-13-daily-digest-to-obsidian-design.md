# Daily Digest → Obsidian — Design Spec (MVP)

**โปรเจกต์:** P.D.B (Personal Data Bank) · **วันที่:** 13 มิ.ย. 2026 · **สถานะ:** ร่างให้รีวิว

---

## 1. เป้าหมาย

แปลงข้อมูลดิบ 1 วันจาก PassiveINKEY (เสียง+จอที่ถอดแล้ว) ให้เป็น **โน้ต Obsidian 1 ใบ/วัน** ที่อ่านรู้เรื่อง สรุปประเด็น และลิงก์คน/โปรเจกต์ที่เกี่ยวข้อง — โดย**ไม่ทำข้อมูลจริงหาย**

เป็นซับระบบที่ 2 (Curator) ของธนาคาร: ฝากดิบ → พนักงานนับ/จัด → ลงบัญชีเป็นโน้ต

## 2. ขอบเขต

**มีในเฟสนี้:** อ่านดิบ 1 วัน → ล้าง (lossless) → วิเคราะห์ด้วย AI → เขียนโน้ต Obsidian · สั่งผ่าน CLI ทีละวัน

**ไม่มี (YAGNI — เฟสถัดไป):** ฐานข้อมูล, vector/semantic search, MCP, ถาม-ตอบ, realtime, รับหลายแหล่ง, ประมวลผลอัตโนมัติ, security/audit เต็มรูปแบบ

## 3. หลักการ (Invariants ของงานนี้)

1. **Lossless — ไม่ทำข้อมูลหาย** (ผู้ใช้สั่งย้ำ):
   - ไฟล์ดิบของ PassiveINKEY **อ่านอย่างเดียว ห้ามแก้/ลบ**
   - เก็บ **ข้อความสะอาดฉบับเต็ม** (`_full.md`) ไว้เสมอ — โน้ตสรุปเป็นชั้นเสริม ไม่ใช่ตัวแทน
   - ล้าง = ตัดเฉพาะของที่ **พิสูจน์ได้ว่าซ้ำ/เป็น noise** · **ไม่ชัวร์ = เก็บไว้**
   - ทุกอย่างที่ตัดออกถูกบันทึกใน **removal log** เพื่อตรวจสอบย้อนหลัง
2. **ไม่มั่ว** — AI ห้ามสร้าง entity/เรื่องที่ไม่มีในข้อความจริง (ตรวจ entity ว่าโผล่ในต้นทางจริง)
3. **local-only** — ผลลัพธ์ลง `vault/` ที่ gitignored ไม่ขึ้น cloud
4. **ตรรกะข้อความเป็นฟังก์ชันเพียว** — `clean` กับ `write-obsidian` เทสด้วย `node --test` ได้โดยไม่ยิง API

## 4. สถาปัตยกรรม + Data Flow

```
sourceDir/<วัน>/                         (PassiveINKEY — อ่านอย่างเดียว)
  audio-HH.md, screen-HH.md
        │  storage.readDay()
        ▼
  clean.js  ── ล้าง lossless ──►  { cleanedText, removalLog }
        │                               │
        │                               ├─► vault/<วัน>/_full.md   (สะอาดฉบับเต็ม)
        │                               └─► vault/<วัน>/_removed.log (ตัดอะไรไป)
        ▼
  analyze.js  ── AI (OpenRouter) ──►  digest { summary, topics, people, projects, todos }
        │            (ตรวจ entity grounding กันมั่ว)
        ▼
  write-obsidian.js  ──►  vault/<วัน>.md   (โน้ต Obsidian + [[links]])
```

CLI `tools/digest.js <วัน>` เป็นตัวร้อยทุกขั้น

## 5. โมเดลข้อมูล

**Input** (จาก PassiveINKEY): `sourceDir/<YYYY-MM-DD>/audio-HH.md`, `screen-HH.md` (หลายชั่วโมง)

**Intermediate** `CleanedDay`:
```
{ date: '2026-06-13',
  cleanedText: string,        // เสียง+จอ รวม สะอาด เรียงตามเวลา
  removalLog: [{ kind, sample, reason }] }   // ของที่ตัดออก
```

**Output A — ฉบับเต็ม (lossless record):** `vault/<วัน>/_full.md` = cleanedText ทั้งหมด (ไม่ตัดเนื้อ)
**Output A2:** `vault/<วัน>/_removed.log` = removalLog (ตรวจสอบได้ว่าไม่ตัดของจริง)

**Output B — โน้ตสรุป (Obsidian):** `vault/<วัน>.md`
```
---
date: 2026-06-13
source: PassiveINKEY
tags: [lifelog, daily]
---
## สรุปวัน
<2–4 ประโยค>
## หัวข้อที่คุย
- ...
## คน / โปรเจกต์
- [[ชื่อคน]] · [[ชื่อโปรเจกต์]]
## สิ่งที่ต้องทำ / ตัดสินใจ
- [ ] ...
## ↪ ฉบับเต็ม
[[2026-06-13/_full]]
```

`digest` (ผลจาก AI):
```
{ summary: string,
  topics: string[],
  people: string[], projects: string[],
  todos: string[], decisions: string[] }
```

## 6. รายละเอียดแต่ละโมดูล

### 6.1 `lib/clean.js` (ฟังก์ชันเพียว 🧪)
- `cleanAudio(text)` → ตัด **ประโยค/วลีซ้ำติดกัน** ที่เกิดจาก overlap (เห็นในข้อมูลจริง เช่นวลีเดียวกันถอดซ้ำ 2 รอบติดกัน) — เก็บไว้ 1 ชุด · เกณฑ์อนุรักษ์: ซ้ำต้องเกือบเป๊ะและติดกันเท่านั้น
- `cleanScreen(text)` → ตัดบรรทัดที่เป็น UI chrome ล้วน (ชื่อเมนู/ไอคอน/ตัวเลขสถานะที่ซ้ำทุกเฟรม) · เก็บข้อความเนื้อหา
- ทุกการตัด push เข้า `removalLog` พร้อมเหตุผล
- **กฎเหล็กของเทส:** ทุก "ประโยคข้อมูลที่ไม่ซ้ำ" ใน input ต้องยังอยู่ใน output (assert ไม่มีเนื้อหาจริงหาย)

### 6.2 `lib/analyze.js` (AI ฝั่ง Node)
- ส่ง `cleanedText` → OpenRouter (Gemini 3.1 Flash Lite) → ขอผลเป็น **JSON ตามสคีมา** `digest`
- prompt บังคับ: ใช้เฉพาะข้อมูลในข้อความ · ห้ามเดา/แต่ง entity · ตอบไทย
- **กันมั่ว:** หลังได้ผล ตรวจว่า people/projects แต่ละตัว "ปรากฏจริง" ใน cleanedText — ตัวที่ไม่เจอ → ทิ้ง (log ไว้)

### 6.3 `lib/write-obsidian.js` (ฟังก์ชันเพียว 🧪)
- `renderNote(date, digest)` → string ตามรูปแบบ Output B · ใส่ `[[wikilink]]` ให้ people/projects · ลิงก์ไป `_full`
- ไม่ยุ่งดิสก์ (เทสง่าย)

### 6.4 `lib/storage.js`
- `readDay(date)` อ่านไฟล์ source (อ่านอย่างเดียว) · `writeVault(date, files)` เขียนผลลง vault
- ห้ามเขียนทับ source เด็ดขาด

## 7. CLI — `tools/digest.js <YYYY-MM-DD>`
- รันทั้ง pipeline ของวันนั้น เขียนผล 3 ไฟล์ลง vault
- ธง `--no-ai` = ทำแค่ล้าง+เขียน `_full` (ใช้เทสในแซนด์บ็อกซ์ที่ยิง API ไม่ได้)

## 8. การจัดการข้อผิดพลาด
- ไม่มีโฟลเดอร์วันนั้น → error ชัดเจน, exit 1
- **AI ล้มเหลว → ยังเขียน `_full.md` (ข้อมูลสะอาดไม่หาย)** + โน้ตสรุปใส่หมายเหตุ "AI ไม่สำเร็จ" (fail ปลอดภัย ไม่ทำข้อมูลหาย)
- บางชั่วโมงขาด → ประมวลผลเท่าที่มี

## 9. การเทส (TDD)
- `clean.js`, `write-obsidian.js` = pure → `node --test` ด้วย fixture จากข้อมูลจริง (คัดตัวอย่างสั้นมาวางใน `tests/fixtures/`)
- เทสหลัก: **lossless** (เนื้อหาจริงไม่หาย), ตัดซ้ำได้จริง, โน้ตมี [[links]] ถูก
- `analyze.js` = ยิง API → เทสบน Mac: ตรวจสคีมา JSON + entity grounding (ไม่มี entity หลอน)

## 10. ค่าตั้งเพิ่ม (config.js)
`sourceDir`, `vaultDir`, `openrouterApiKey/BaseUrl/Model` (มีในแม่แบบแล้ว)

## 11. ความเป็นส่วนตัว / PDPA
- โน้ต/ฉบับเต็มมีข้อมูลบุคคลที่สาม → `vault/` gitignored, อยู่ในเครื่อง
- การกรองให้เหลือเฉพาะเสียงเจ้าของ (Voice ID) = อนาคต (ดูโน้ตผู้ใช้ใน PassiveINKEY) — เฟสนี้ยังไม่กรองบุคคลที่สาม

## 12. นอกขอบเขต (อนาคต)
Ingestion หลายแหล่ง · Storage+Ledger (ดัชนีค้น) · กราฟความสัมพันธ์ข้ามวัน · เคาน์เตอร์ถอน (MCP) · Security+Audit
