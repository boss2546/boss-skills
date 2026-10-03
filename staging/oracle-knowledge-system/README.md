# 🔮 Oracle & Knowledge Vault System (Staging Area)

พื้นที่จัดเก็บไฟล์ต้นฉบับ (Raw Staging) ทั้งหมดของระบบ Oracle และ Obsidian Knowledge Vault เพื่อเตรียมพร้อมสำหรับการสังเคราะห์ เรียบเรียง และออกแบบเป็น Universal Skill ใหม่สำหรับ `boss-ai`

---

## 📂 โครงสร้างที่นำเข้ามาจัดเก็บ (Source Map)

```text
staging/oracle-knowledge-system/
├── 1-skill-definitions/                  # คำนิยามสกิลต้นฉบับ
│   ├── oracle/                           # สกิล Oracle ทั้งหมด 21 โฟลเดอร์ (จาก ~/.hermes/skills/oracle/)
│   │   ├── standup/ & oracle-standup/    # วางแผนประจำวัน
│   │   ├── rrr/ & oracle-rrr/            # สรุปทบทวนงาน (Review/Reflect/Reset)
│   │   ├── recap/ & oracle-recap/        # สรุปสถานะงาน
│   │   ├── learn/ & oracle-learn/        # จดจำองค์ความรู้
│   │   ├── fyi/                          # จดบันทึกสั้น
│   │   ├── feel/ & oracle-feel/          # ประเมินอารมณ์และสภาวะ
│   │   ├── trace/ & oracle-trace/        # บันทึกสืบย้อน
│   │   ├── forward/ & oracle-forward/    # ส่งต่องาน / Handoff
│   │   ├── awaken/                       # ปลุกการรับรู้บริบท
│   │   ├── oracle-philosophy/            # ปรัชญาและแกนกลาง Oracle
│   │   ├── oracle-session-lifecycle/     # วงจรชีวิตของเซสชัน
│   │   └── who-are-you/ & oracle-who-are-you/ # ตัวตนของ Oracle
│   └── note-taking-obsidian/             # สกิลเชื่อมต่อ Obsidian (จาก ~/.hermes/skills/note-taking/obsidian/)
│
├── 2-data-vaults/                        # คลังความรู้และข้อมูลจริง
│   ├── oracle-vault-psi/                 # คลังความรู้ถาวร (~/ψ)
│   │   ├── inbox/                        # รับข้อมูลเข้า / Handoff
│   │   ├── learn/                        # คลังสรุปองค์ความรู้ที่เรียนรู้แล้ว
│   │   ├── memory/                       # บันทึกความจำระยะยาว
│   │   ├── active/                       # งานและโปรเจกต์ที่กำลังโฟกัส
│   │   ├── identity/                     # ตัวตนและปรัชญา Oracle
│   │   ├── trace/                        # บันทึกสืบย้อนที่มาที่ไป
│   │   ├── archive/                      # คลังเก็บข้อมูลประวัติเก่า
│   │   ├── outbox/                       # ข้อมูลส่งออก
│   │   ├── projects/                     # โปรเจกต์
│   │   └── writing/                      # งานเขียน
│   ├── obsidian-vault-documents/         # คลังสมุดโน้ต ~/Documents/Obsidian Vault
│   └── obsidian-vault-pdb/               # คลังสมุดโน้ต P.D.B Vault (จาก Desktop/aiis/P.D.B/vault)
│
└── 3-pdb-reference/                      # โค้ดและเอกสารอ้างอิง P.D.B ทั้งหมด (จาก Desktop/aiis/P.D.B)
    ├── docs/                             # เอกสารสถาปัตยกรรม LLM-Wiki, การย่อยสรุป และไดอารี่
    ├── lib/                              # โค้ด JavaScript จัดการ Obsidian (analyze, clean, storage, write-obsidian)
    ├── tools/                            # เครื่องมือ digest
    └── tests/                            # ชุดทดสอบ
```

---

## 🎯 แผนการสังเคราะห์เป็นสกิลใหม่ (Synthesis Strategy)
1. **วิเคราะห์ความซ้ำซ้อน**: สกิลฝั่ง Oracle ใน Hermes มีการสร้างคู่ขนานระหว่างชื่อสั้น (`standup`, `rrr`, `recap`, `learn`) และชื่อเต็ม (`oracle-standup`, `oracle-rrr`, `oracle-recap`, `oracle-learn`) ซึ่งเป็น Alias
2. **สร้างแกนกลาง Universal Core**: หลอมรวมวงจรชีวิตประจำวัน:
   - **Morning / Start**: `standup` (เช็ค inbox, จัด priority)
   - **During Work**: `learn` / `fyi` / `note` (บันทึกความรู้เข้า Vault)
   - **Evening / End**: `rrr` / `recap` (สรุปทบทวนและ handoff สู่ active/archive)
3. **เชื่อมต่อ 2-Layer Vault Architecture**:
   - ชั้นที่ 1: **Oracle Psi Vault (`~/ψ`)** — คลังตัวตน ความจำระยะยาว และบทเรียน
   - ชั้นที่ 2: **Obsidian Daily Digest (`~/Documents/Obsidian Vault` หรือ `P.D.B/vault`)** — กราฟความรู้และการม้วนสรุป (Hierarchical Rollup)
