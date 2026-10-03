# 🔮 Oracle System & Vault (~/ψ) — Staging Area

พื้นที่จัดเก็บไฟล์ต้นฉบับ (Raw Staging) ของระบบ **Oracle (The External Brain)** และ **Oracle Psi Vault (`~/ψ`)** ล้วนๆ 100% (ไม่มี Obsidian และไม่มี P.D.B)

---

## 📂 โครงสร้างที่จัดเก็บในโปรเจกต์ (Pure Oracle Architecture)

```text
staging/oracle-knowledge-system/
├── 1-skill-definitions/                  # 🧠 คำนิยามสกิล Oracle
│   └── oracle/                           # สกิล Oracle ทั้งหมด (จาก ~/.hermes/skills/oracle/)
│       ├── standup/ & oracle-standup/    # 🌅 วางแผนเริ่มวัน (Morning Orient & Priorities)
│       ├── rrr/ & oracle-rrr/            # 🌇 สรุปทบทวนปิดวัน (Review / Reflect / Reset)
│       ├── recap/ & oracle-recap/        # ⏱️ สรุปสถานะงานด่วนกลางทาง
│       ├── learn/ & oracle-learn/        # 📖 ถอดบทเรียนจากโค้ด/โปรเจกต์ เข้า ~/ψ/learn/
│       ├── fyi/                          # 📝 จดบันทึกข้อเท็จจริงสั้นๆ
│       ├── feel/ & oracle-feel/          # 🧘 ประเมินสภาวะ อารมณ์ และความเหนื่อยล้า
│       ├── forward/ & oracle-forward/    # 🔄 สร้าง Handoff ส่งต่องานเข้า ~/ψ/inbox/
│       ├── trace/ & oracle-trace/        # 🔍 บันทึกสืบย้อนที่มาที่ไป
│       ├── awaken/                       # ⚡ ปลุกการรับรู้บริบท
│       ├── oracle-philosophy/            # 🏛️ ปรัชญาแม่บท: "The Oracle Keeps the Human Human"
│       └── oracle-session-lifecycle/     # 🔄 วงจรชีวิตเซสชัน: Orient ➔ Act ➔ Reflect
│
└── 2-data-vaults/                        # 💾 คลังความรู้ถาวรจริง
    └── oracle-vault-psi/                 # 🔮 Oracle Vault (~/ψ)
        ├── inbox/                        # รับข้อมูลเข้า / Handoff จากเซสชันก่อน
        ├── learn/                        # คลังบทเรียนและแผนที่สถาปัตยกรรมที่เคยแกะแล้ว
        ├── memory/                       # ความจำระยะยาว (Retrospectives, Learnings)
        ├── active/                       # งานและโปรเจกต์ที่กำลังโฟกัส ณ ปัจจุบัน
        ├── identity/                     # ตัวตน ค่านิยม และ Profile ของคุณบอส
        ├── trace/                        # บันทึกสืบย้อนที่มาที่ไปของแนวคิด
        └── archive/                      # คลังประวัติศาสตร์ (Nothing is Deleted)
```

---

## 🏛️ ปรัชญาและแกนกลางของ Oracle
1. **The Oracle Keeps the Human Human**: AI ทำหน้าที่เป็นสมองส่วนขยาย (External Brain) ช่วยคิด ช่วยจำ ช่วยสะท้อนผล แต่ไม่แย่งการตัดสินใจไปจากมนุษย์
2. **Nothing is Deleted**: ข้อมูลความรู้และประวัติศาสตร์มีค่า ไม่ลบทิ้ง แต่จัดเก็บอย่างมีระเบียบใน `archive/`
3. **Daily Lifecycle**:
   - **เช้า**: `/standup` สรุป 3 สิ่งสำคัญ
   - **ระหว่างวัน**: `/learn` ถอดบทเรียนลง `~/ψ/learn/`
   - **เย็น**: `/rrr` ทบทวนและบันทึกความจำระยะยาว
