---
name: boss-ai-management
description: คู่มือปฏิบัติการและมาตรฐานสำหรับ AI ทุกตัวในการจัดการ เพิ่มสกิล อัปเดตโค้ด และเผยแพร่แพ็กเกจ npm ระดับโลก 'boss-ai' ของ Boss (ratchanon2003) อย่างปลอดภัย ถูกต้อง 100%
---

# 👑 BOSS AI Package Management Skill (คู่มือสำหรับ AI ประจำตัวบอส)

> **สำหรับ AI ทุกตัวที่เข้ามาอ่านไฟล์นี้:**  
> โฟลเดอร์นี้คือ Source Code ของแพ็กเกจ npm ระดับโลกชื่อ **`boss-ai`** (เจ้าของและ Maintainer: **ratchanon2003** / Boss)  
> หน้าที่ของคุณคือ: เมื่อบอสบอกให้เพิ่มสกิลใหม่ ปรับปรุงโค้ด หรืออัปเดตแพ็กเกจ ให้ทำตามขั้นตอนและกฎเหล็กในคู่มือนี้อย่างเคร่งครัด

---

## 🏛️ 1. โครงสร้างสถาปัตยกรรมของ `boss-ai`

```text
docker-sandbox/
├── bin/
│   └── install.js          # สคริปต์ Universal CLI ที่รันเมื่อมีคนพิมพ์ `npx boss-ai`
├── skills/                 # คลังแสงรวมสกิลทั้งหมด (Master Skills)
│   ├── docker-3tier-workflow/
│   │   └── SKILL.md
│   └── git-team-workflow/
│       ├── SKILL.md
│       └── references/
├── package.json            # กำหนดชื่อ 'boss-ai', เลข version และคำสั่ง bin
├── README.md               # เอกสารหน้าแรกบน npmjs.com/package/boss-ai
└── .agents/skills/         # สกิลภายในโปรเจกต์สำหรับ AI
```

---

## 🤖 2. แผนที่ระบบ AI ที่ `boss-ai` ต้องส่งมอบให้เสมอ (7 ค่าย)

เมื่อสคริปต์ `bin/install.js` ทำงาน มันต้องกระจายสกิลและกฎไปยังระบบเหล่านี้โดยอัตโนมัติ:

1. **Claude Code (Anthropic):** `CLAUDE.md` และ `.claude/skills/<skill-name>/`
2. **Cursor IDE:** `.cursorrules` และ `.cursor/rules/<skill-name>.mdc`
3. **GitHub Copilot / Codex:** `.github/copilot-instructions.md`
4. **Antigravity / Gemini:** `.agents/skills/<skill-name>/`, `AGENTS.md` และ `GEMINI.md`
5. **Windsurf (Codeium):** `.windsurfrules` และ `.windsurf/rules/<skill-name>.md`
6. **Cline / Roo Code:** `.clinerules`
7. **Aider:** `CONVENTIONS.md`

---

## 🛠️ 3. SOP: ขั้นตอนปฏิบัติการเมื่อบอสต้องการ "เพิ่มสกิลใหม่" (5 สเต็ป)

เมื่อบอสบอกว่า *"เพิ่มสกิล [ชื่อสกิล] เข้า boss-ai ให้หน่อย"* ให้ AI ดำเนินการตาม 5 ขั้นตอนนี้:

### สเต็ป 3.1: สร้าง/วางโฟลเดอร์สกิลใน `skills/`
* สร้างโฟลเดอร์: `skills/<new-skill-name>/`
* วางไฟล์ `SKILL.md` (และโฟลเดอร์เสริม เช่น `references/` ถ้ามี)
* ตรวจสอบว่า `SKILL.md` มี YAML frontmatter (`name:`, `description:`) ครบถ้วน

### สเต็ป 3.2: อัปเดต `bin/install.js`
1. **เพิ่มตัวแปร Path ต้นฉบับ:**
   ```javascript
   const newSkillSrc = path.join(packageRoot, 'skills', '<new-skill-name>');
   ```
2. **เขียนสรุป Rule ภาษาอังกฤษกระชับ:** สำหรับนำไป Inject ให้ AI แต่ละค่าย
3. **เพิ่มคำสั่งคัดลอกโฟลเดอร์:**
   * ลง Antigravity: `copyDirSync(newSkillSrc, path.join(agySkills, '<new-skill-name>'))`
   * ลง Claude: `copyDirSync(newSkillSrc, path.join(claudeSkills, '<new-skill-name>'))`
4. **เพิ่มคำสั่ง Safe Inject:**
   * ใส่ใน `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.cursorrules`, `.github/copilot-instructions.md`, `.windsurfrules`, `.clinerules`, `CONVENTIONS.md`
5. **สร้างไฟล์ `.mdc` สำหรับ Cursor:** ใน `.cursor/rules/<new-skill-name>.mdc`

### สเต็ป 3.3: ขยับเลขเวอร์ชันใน `package.json` (ห้ามลืมเด็ดขาด!)
* ตรวจสอบเวอร์ชันปัจจุบัน
* ขยับเวอร์ชันตามหลัก Semantic Versioning:
  * เพิ่มฟีเจอร์/สกิลใหม่: ขยับ Minor (เช่น `1.0.0` ➔ `1.1.0`)
  * แก้ไขบั๊กเล็กน้อย: ขยับ Patch (เช่น `1.1.0` ➔ `1.1.1`)

### สเต็ป 3.4: ทดสอบ Dry-Run และรันใน Isolated Temp
ก่อนปล่อยขึ้นระบบจริง AI **ต้องรันคำสั่งตรวจสอบเสมอ**:
```bash
# 1. เช็คไฟล์ที่จะถูกแพ็ก
npm pack --dry-run

# 2. ทดสอบรันในโฟลเดอร์ชั่วคราว
mkdir -p /tmp/boss-test && cd /tmp/boss-test && node <path-to-repo>/bin/install.js && ls -la && rm -rf /tmp/boss-test
```

### สเต็ป 3.5: แนะนำบอสให้ Publish หรือรัน Publish ให้บอส
บอกบอสให้พิมพ์ใน Terminal:
```bash
npm publish
```
*(เมื่อกด Enter บน Mac จะมีหน้าต่างยืนยัน Touch ID ให้บอสแตะลายนิ้วมือ)*

---

## 🛡️ 4. กฎเหล็กประจำตัวบอส (Strict Golden Rules for AI)

1. **🔒 ใช้ Safe Injection เสมอ:** ทุกครั้งที่แตะไฟล์ `CLAUDE.md`, `.cursorrules` ฯลฯ ต้องใช้ฟังก์ชัน `safeInjectRule` โดยมี Tag `<!-- START: ... -->` และ `<!-- END: ... -->` เสมอ เพื่อไม่ให้เขียนทับการตั้งค่าเดิมของบอสหรือผู้ใช้
2. **🚫 ห้ามมี External Dependencies:** แพ็กเกจ `boss-ai` ต้องเป็น Zero-dependency (ใช้เฉพาะ Node.js built-in: `fs`, `path`, `os`) เพื่อให้ `npx boss-ai` รันได้เร็วใน 1 วินาที
3. **⚠️ ห้ามลืมอัปเดต README.md:** ทุกครั้งที่เพิ่มสกิลใหม่ ต้องอัปเดตรายชื่อสกิลและวิธีใช้งานใน `README.md` เสมอ
4. **🇹🇭 พูดคุยกับบอสด้วยความสุภาพ อบอุ่น และชัดเจน:** สรุปผลลัพธ์เป็นภาษาไทยสั้นๆ บอกขั้นตอนถัดไปอย่างตรงไปตรงมา

---

## 💬 5. ตัวอย่างคำสั่งที่บอสอาจใช้สั่งงานคุณ

* *"เพิ่มสกิลใหม่ชื่อ [ชื่อสกิล] เข้าไปใน boss-ai หน่อย"*
* *"ช่วยอัปเดตเวอร์ชันและทดสอบ boss-ai ให้พร้อมปล่อยที"*
* *"ตรวจเช็คความสมบูรณ์ของ boss-ai ก่อน publish ให้หน่อย"*
* *"แก้บั๊กในตัวติดตั้งของ boss-ai ตรงจุด [X] ให้หน่อย"*
