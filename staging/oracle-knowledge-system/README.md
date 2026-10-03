# 🔮 Oracle & Obsidian Knowledge Vault System (Staging Area)

พื้นที่จัดเก็บไฟล์ต้นฉบับ (Raw Staging) ของระบบ **Oracle (External Brain)** และ **Obsidian Knowledge Vault** เพื่อเตรียมพร้อมสำหรับการสังเคราะห์ เรียบเรียง และออกแบบเป็น Universal Skill ใหม่สำหรับ `boss-ai`

---

## 📂 โครงสร้างที่จัดเก็บในโปรเจกต์ (Clean Structure)

```text
staging/oracle-knowledge-system/
├── 1-skill-definitions/                  # คำนิยามสกิลต้นฉบับ
│   ├── oracle/                           # สกิล Oracle ทั้งหมด (จาก ~/.hermes/skills/oracle/)
│   │   ├── standup/ & oracle-standup/    # วางแผนประจำวัน / เริ่มวัน (Morning Orient)
│   │   ├── rrr/ & oracle-rrr/            # สรุปทบทวนงาน (Review/Reflect/Reset)
│   │   ├── recap/ & oracle-recap/        # สรุปสถานะงานด่วน (Mid-session Recap)
│   │   ├── learn/ & oracle-learn/        # จดจำองค์ความรู้ / สกัดความรู้จากโค้ด
│   │   ├── fyi/                          # จดบันทึกข้อเท็จจริงสั้น
│   │   ├── feel/ & oracle-feel/          # ประเมินสภาวะ อารมณ์ และความเหนื่อยล้า
│   │   ├── trace/ & oracle-trace/        # บันทึกสืบย้อนที่มาที่ไป
│   │   ├── forward/ & oracle-forward/    # ส่งต่องาน / Handoff
│   │   ├── awaken/                       # ปลุกการรับรู้บริบท
│   │   ├── oracle-philosophy/            # ปรัชญาแม่บท: "The Oracle Keeps the Human Human"
│   │   ├── oracle-session-lifecycle/     # วงจรชีวิตของเซสชัน (Orient -> Act -> Reflect)
│   │   └── who-are-you/                  # ตัวตนของ Oracle (Thinking Partner)
│   └── note-taking-obsidian/             # สกิลเชื่อมต่อ Obsidian Vault (Filesystem-First)
│
└── 2-data-vaults/                        # คลังความรู้และข้อมูลจริง
    ├── oracle-vault-psi/                 # คลังความรู้ถาวร (~/ψ)
    │   ├── inbox/                        # รับข้อมูลเข้า / Handoff จากเซสชันก่อน
    │   ├── learn/                        # คลังสรุปองค์ความรู้เชิงลึกของแต่ละระบบ/Repo
    │   ├── memory/                       # บันทึกความจำระยะยาว (Retrospectives, Learnings)
    │   ├── active/                       # งานและโปรเจกต์ที่กำลังโฟกัส ณ ปัจจุบัน
    │   ├── identity/                     # ตัวตน ค่านิยม และ Profile ของคุณบอส
    │   ├── trace/                        # บันทึกสืบย้อนที่มาที่ไปของแนวคิด
    │   └── archive/                      # คลังเก็บข้อมูลประวัติเก่า (Nothing is Deleted)
    └── obsidian-vault-documents/         # คลังสมุดโน้ต ~/Documents/Obsidian Vault
```

---

## 🎯 สถาปัตยกรรม 2-Vault (Oracle + Obsidian)

1. **Oracle Psi Vault (`~/ψ`)**:
   - หน้าที่: เป็น **"สมองส่วนลึก" (Deep Memory & Identity)** เก็บตัวตน, ค่านิยม, บทเรียนเชิงลึก (`learn/`), และความจำระยะยาว (`memory/`)
2. **Obsidian Vault (`~/Documents/Obsidian Vault`)**:
   - หน้าที่: เป็น **"กระดานคิดงาน & กราฟความรู้" (Visual Knowledge Graph)** สำหรับจดโน้ตรายวัน, งานด่วน, และการเชื่อมโยงความสัมพันธ์ด้วย `[[Wikilinks]]`
