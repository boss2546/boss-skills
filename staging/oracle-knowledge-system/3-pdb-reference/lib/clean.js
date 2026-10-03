'use strict';
/* lib/clean.js — ล้างข้อความแบบ lossless (ฟังก์ชันเพียว)
 * หลักการ: ตัดเฉพาะ "สำเนาที่ติดกันและเป๊ะ" เท่านั้น (ของที่ตัด = ของที่เก็บ) · ไม่ชัวร์ = ไม่ตัด */

// สแกนซ้าย→ขวา ที่แต่ละตำแหน่งหาสำเนายาวสุด (minLen..CAP) ที่ตามมาทันที (อนุญาตช่องว่าง/บรรทัดคั่น)
function collapseAdjacentDuplicateRun(text, minLen = 12, CAP = 160) {
  const removed = [];
  let out = '';
  let i = 0;
  while (i < text.length) {
    let hit = 0;
    const maxLen = Math.min(CAP, (text.length - i) >> 1);
    for (let len = maxLen; len >= minLen; len--) {
      const seg = text.substr(i, len);
      let j = i + len;
      while (j < text.length && (text[j] === ' ' || text[j] === '\n' || text[j] === '\t')) j++;
      if (text.substr(j, len) === seg) {
        removed.push({ kind: 'repeat', sample: seg });
        out += seg;
        hit = j + len - i;
        break;
      }
    }
    if (hit) i += hit; else { out += text[i]; i++; }
  }
  return { text: out, removed };
}

// ทำซ้ำจนนิ่ง (จับสำเนา 3 รอบขึ้นไป)
function cleanRepeats(text) {
  const removed = [];
  let prev = null, cur = text;
  while (cur !== prev) {
    prev = cur;
    const r = collapseAdjacentDuplicateRun(cur);
    cur = r.text;
    removed.push(...r.removed);
  }
  return { text: cur, removed };
}

// ยุบบรรทัดที่เหมือนบรรทัดก่อนหน้าแบบเป๊ะ (เมนู/สถานะจอซ้ำทุกเฟรม) — lossless
function collapseConsecutiveDuplicateLines(text) {
  const removed = [];
  const out = [];
  for (const line of text.split('\n')) {
    if (out.length && out[out.length - 1].trim() === line.trim() && line.trim() !== '') {
      removed.push({ kind: 'dup-line', sample: line });
      continue;
    }
    out.push(line);
  }
  return { text: out.join('\n'), removed };
}

// รวมล้างทั้งวัน: เสียง (ยุบสำเนา) + จอ (ยุบบรรทัดซ้ำ)
function cleanDay({ audioText = '', screenText = '' }) {
  const a = cleanRepeats(audioText);
  const s = collapseConsecutiveDuplicateLines(screenText);
  const parts = [];
  if (a.text.trim()) parts.push('# เสียง\n' + a.text.trim());
  if (s.text.trim()) parts.push('# หน้าจอ\n' + s.text.trim());
  return { cleanedText: parts.join('\n\n'), removalLog: [...a.removed, ...s.removed] };
}

// เรนเดอร์ removalLog เป็นข้อความสำหรับ _removed.log
function renderRemovalLog(removalLog) {
  if (!removalLog.length) return 'ไม่มีการตัดข้อมูล\n';
  return removalLog.map(r => `[${r.kind}] ${r.sample.replace(/\n/g, '⏎').slice(0, 200)}`).join('\n') + '\n';
}

module.exports = {
  collapseAdjacentDuplicateRun, cleanRepeats,
  collapseConsecutiveDuplicateLines, cleanDay, renderRemovalLog
};
