'use strict';
/* lib/analyze.js — วิเคราะห์ข้อความสะอาดด้วย AI (OpenRouter)
 * ส่วนเพียว (groundEntities/parseDigest) เทสได้ในเครื่อง · analyze() ยิงสด เทสบน Mac */
const { CONFIG } = require('../config');

// กันมั่ว: เก็บเฉพาะ entity ที่ปรากฏจริงในข้อความต้นทาง
function groundEntities(list, sourceText) {
  return (list || []).filter(name => name && sourceText.includes(name));
}

// อ่าน JSON จากคำตอบ (เผื่อมีข้อความหุ้ม) — พังแล้วคืน {} อย่างปลอดภัย
function parseDigest(raw) {
  try { return JSON.parse(raw); } catch (e) {}
  const m = raw && raw.match(/\{[\s\S]*\}/);
  if (m) { try { return JSON.parse(m[0]); } catch (e) {} }
  return {};
}

const SYS = `คุณเป็นผู้ช่วยสรุป lifelog ภาษาไทย ตอบเป็น JSON เท่านั้น ตามคีย์:
{"summary": "สรุป 2-4 ประโยค", "topics": ["หัวข้อ"], "people": ["ชื่อคนที่ถูกพูดถึง"], "projects": ["โปรเจกต์/องค์กร"], "todos": ["สิ่งที่ต้องทำ"], "decisions": ["การตัดสินใจ/เหตุผลที่เลือกทำ"]}
กฎ: ใช้เฉพาะข้อมูลที่อยู่ในข้อความ ห้ามเดา/แต่งชื่อหรือเรื่องที่ไม่มี · ไม่มีข้อมูลให้ใส่ array ว่าง`;

const MAX_CHARS = 40000; // เฟสนี้ตัดความยาวกันคิวยาว/แพง (chunking = อนาคต)

function buildMessages(cleanedText) {
  const text = cleanedText.length > MAX_CHARS ? cleanedText.slice(0, MAX_CHARS) : cleanedText;
  return [{ role: 'system', content: SYS }, { role: 'user', content: text }];
}

async function analyze(cleanedText) {
  const r = await fetch(CONFIG.openrouterBaseUrl.replace(/\/$/, '') + '/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + CONFIG.openrouterApiKey },
    body: JSON.stringify({
      model: CONFIG.openrouterModel,
      messages: buildMessages(cleanedText),
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })
  });
  if (!r.ok) throw new Error('OpenRouter ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 200));
  const d = await r.json();
  const digest = parseDigest(d.choices?.[0]?.message?.content || '{}');
  digest.people = groundEntities(digest.people, cleanedText);
  digest.projects = groundEntities(digest.projects, cleanedText);
  return digest;
}

module.exports = { groundEntities, parseDigest, buildMessages, analyze };
