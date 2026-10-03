'use strict';
/* lib/write-obsidian.js — เรนเดอร์ digest เป็นโน้ต Obsidian (ฟังก์ชันเพียว)
 * แยก "การตัดสินใจ (decisions)" เป็นหัวข้อของตัวเอง — เป็นแกนของวิสัยทัศน์ Digital Twin */

function renderNote(date, digest = {}) {
  const d = digest || {};
  const ents = [...(d.people || []), ...(d.projects || [])];
  const links = ents.length ? ents.map(x => `[[${x}]]`).join(' · ') : '-';
  const bullets = (arr) => (arr && arr.length) ? arr.map(x => `- ${x}`).join('\n') : '- -';
  const todos = (d.todos && d.todos.length) ? d.todos.map(t => `- [ ] ${t}`).join('\n') : '- [ ] -';
  return `---
date: ${date}
source: PassiveINKEY
tags: [lifelog, daily]
---
## สรุปวัน
${d.summary || '-'}

## หัวข้อที่คุย
${bullets(d.topics)}

## การตัดสินใจ
${bullets(d.decisions)}

## คน / โปรเจกต์
${links}

## สิ่งที่ต้องทำ
${todos}

## ↪ ฉบับเต็ม
[[${date}/_full]]
`;
}

module.exports = { renderNote };
