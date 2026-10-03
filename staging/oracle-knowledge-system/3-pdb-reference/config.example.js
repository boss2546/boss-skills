'use strict';
/* ============================================================================
 * config.example.js — แม่แบบค่าตั้ง
 * คัดลอกเป็น config.js (GITIGNORED) แล้วใส่ค่าจริง:  cp config.example.js config.js
 * โครงของไฟล์นี้ต้องตรงกับ config.js เสมอ — แก้ config ต้อง sync ไฟล์นี้ด้วย
 * ========================================================================== */

module.exports = {
  CONFIG: {
    // ── แหล่งฝาก (input) ──
    // โฟลเดอร์ recordings ของ PassiveINKEY (ผู้ฝากรายแรก)
    // ค่าเริ่ม = สมมติ P.D.B กับ PassiveINKEY วางเป็นพี่น้องกันบน Desktop
    sourceDir: '../PassiveINKEY/app/recordings',

    // ── ที่เก็บผลลัพธ์ (output / Obsidian vault) ── GITIGNORED (ข้อมูลส่วนตัว)
    vaultDir: './vault',

    // ── ปลายท่อเข้า LLM Wiki (ข้อ 3) ──
    // ใส่ path เต็มของ raw/sources/ ในโปรเจกต์ LLM Wiki
    // เช่น '/Users/you/Documents/BOSS/raw/sources'  (ใช้ ~ ได้)
    // ว่าง = ปิดฟีเจอร์ (digest เขียนแค่ vault เหมือนเดิม)
    wikiSourcesDir: '',

    // ── AI สำหรับวิเคราะห์ (Curator) — ใช้ OpenRouter เหมือน PassiveINKEY ──
    openrouterApiKey: '',                                  // ใส่ key จริงใน config.js
    openrouterBaseUrl: 'https://openrouter.ai/api/v1',
    openrouterModel: 'google/gemini-3.1-flash-lite',       // ค่าเริ่ม (ปรับได้ตอนทำจริง)
  }
};
