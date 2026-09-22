# 👑 BOSS AI — Maintainer & AI Developer Guide

> **คู่มือสำหรับ AI ทุกตัวที่เข้ามาทำงานในโปรเจกต์นี้:**  
> โปรเจกต์นี้คือ Source Code ของแพ็กเกจ npm ระดับโลก **`boss-ai`** (Maintainer: **ratchanon2003** / Boss)  
> รายละเอียดขั้นตอนและคู่มือปฏิบัติการฉบับเต็ม บันทึกอยู่ในสกิล:  
> 📍 **[`.agents/skills/boss-ai-management/SKILL.md`](.agents/skills/boss-ai-management/SKILL.md)**

---

## 🚀 สรุปด่วนเมื่อ Boss สั่งเพิ่มสกิลใหม่ (Quick SOP)
1. **วางไฟล์:** นำสกิลใหม่ใส่ใน `skills/<new-skill-name>/SKILL.md`
2. **แก้โค้ด:** อัปเดต `bin/install.js` ให้รองรับสกิลใหม่และกระจายไปให้ AI ครบทั้ง 7 ค่าย
3. **ขยับเวอร์ชัน:** เปลี่ยน `"version"` ใน `package.json` (เช่น `1.0.0` ➔ `1.1.0`)
4. **ทดสอบ:** รัน `npm pack --dry-run` เพื่อดูความถูกต้อง
5. **Publish:** แนะนำบอสให้รัน `npm publish` พร้อมยืนยัน Touch ID

---

## 🛡️ กฎเหล็กประจำตัวบอส
- ใช้ **Safe Injection** เสมอ (ห้ามเขียนทับโค้ดเดิมของผู้ใช้)
- แพ็กเกจต้อง **Zero External Dependencies** เสมอ (รันผ่าน `npx` ได้ใน 1 วินาที)
