'use strict';
/* lib/storage.js — อ่าน source (อ่านอย่างเดียว) / เขียน vault */
const fs = require('fs');
const path = require('path');

function readDay(sourceDir, date) {
  const dir = path.join(sourceDir, date);
  if (!fs.existsSync(dir)) throw new Error(`ไม่พบโฟลเดอร์ข้อมูลวันนั้น: ${dir}`);
  const files = fs.readdirSync(dir);
  const pick = (re) => files.filter(f => re.test(f)).sort()
    .map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  return { audioText: pick(/^audio-\d{2}\.md$/), screenText: pick(/^screen-\d{2}\.md$/) };
}

function writeVault(vaultDir, date, { full, removed, note, json }) {
  const dayDir = path.join(vaultDir, date);
  fs.mkdirSync(dayDir, { recursive: true });
  fs.writeFileSync(path.join(dayDir, '_full.md'), full);     // ฉบับเต็ม lossless
  fs.writeFileSync(path.join(dayDir, '_removed.log'), removed);
  fs.writeFileSync(path.join(vaultDir, `${date}.md`), note);  // โน้ต Obsidian (human)
  if (json) fs.writeFileSync(path.join(vaultDir, `${date}.json`), JSON.stringify(json, null, 2)); // เมล็ด Vault/MCP (machine)
}

// เขียน "ไฟล์วันสะอาด" เข้า raw/sources/ ของ LLM Wiki (ปลายท่อข้อ 3)
// ส่งข้อความที่ล้างแล้วฉบับเต็ม — ให้ LLM Wiki เป็นคนวิเคราะห์/สร้าง entity เอง
// wikiSourcesDir ว่าง/ไม่ตั้ง = ปิดฟีเจอร์ (ข้ามเงียบ ๆ ไม่พัง)
function writeWikiSource(wikiSourcesDir, date, cleanedText) {
  if (!wikiSourcesDir) return null;
  fs.mkdirSync(wikiSourcesDir, { recursive: true });
  const file = path.join(wikiSourcesDir, `${date}.md`);
  fs.writeFileSync(file, `# บันทึกประจำวัน ${date} (PassiveINKEY)\n\n${cleanedText}`);
  return file;
}

module.exports = { readDay, writeVault, writeWikiSource };
