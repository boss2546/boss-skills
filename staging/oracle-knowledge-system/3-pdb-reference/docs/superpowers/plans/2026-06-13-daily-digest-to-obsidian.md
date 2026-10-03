# Daily Digest → Obsidian — Implementation Plan

> **สำหรับผู้ลงมือ (คนหรือ AI):** ทำทีละ task ตามลำดับ · แต่ละ step คือ checkbox `- [ ]` · ทำแบบ TDD เคร่งครัด (เขียนเทสให้ fail ก่อนเสมอ)
> **หมายเหตุ git:** commit ทุก task บนเครื่อง Mac (แซนด์บ็อกซ์เขียน `.git` บน Desktop ไม่ได้) · ถ้า lock ค้าง: `rm -f .git/index.lock`

**Goal:** แปลงข้อมูลดิบ 1 วันจาก PassiveINKEY เป็นโน้ต Obsidian 1 ใบ/วัน โดยล้างแบบ lossless แล้ววิเคราะห์ด้วย AI

**Architecture:** CLI เดียว (`tools/digest.js`) ร้อย 4 โมดูล: `storage` (อ่าน/เขียนดิสก์) → `clean` (ล้าง lossless, ฟังก์ชันเพียว) → `analyze` (AI, OpenRouter) → `write-obsidian` (เรนเดอร์โน้ต, ฟังก์ชันเพียว) · ตรรกะเพียวเทสด้วย `node --test` ในเครื่อง · ส่วน AI เทสบน Mac

**Tech Stack:** Node ≥20 (built-in `node:test`, `fetch`, `fs`) · ไม่มี dependency ภายนอก · OpenRouter (Gemini 3.1 Flash Lite)

---

## Scope Check
MVP เดียว (ซับระบบ Curator) — ไม่ต้องซอยเพิ่ม · DB/MCP/realtime/security = นอกแผนนี้

## File Structure
```
lib/clean.js            ★ ล้าง lossless (เพียว)        ← Task 1,2
lib/write-obsidian.js   ★ เรนเดอร์โน้ต Obsidian (เพียว) ← Task 3
lib/analyze.js          วิเคราะห์ด้วย AI               ← Task 4,5
lib/storage.js          อ่าน source / เขียน vault       ← Task 6
tools/digest.js         CLI ร้อยทุกขั้น (มีสตับแล้ว)     ← Task 7
tests/*.test.js         เทส (node --test)              ← ทุก task
tests/fixtures/         ข้อมูลตัวอย่างจริง (สั้น)         ← Task 8
```
★ = ฟังก์ชันเพียว มีเทสคุม · **layout ผลลัพธ์:** `vault/<วัน>.md` (โน้ต) + `vault/<วัน>/_full.md` + `vault/<วัน>/_removed.log`

**Data contract (ใช้ร่วมทุก task):**
- `readDay()` → `{ audioText: string, screenText: string }`
- `cleanDay({audioText, screenText})` → `{ cleanedText: string, removalLog: Array<{kind,sample}> }`
- `analyze(cleanedText)` → `digest { summary, topics[], people[], projects[], todos[], decisions[] }`
- `renderNote(date, digest)` → `string`

---

## Task 1: clean.js — ยุบสำเนาที่ติดกันแบบเป๊ะ (audio, lossless)

**Files:** Create `lib/clean.js` · Test `tests/clean.test.js`

- [ ] **Step 1 — เขียนเทสให้ fail** (`tests/clean.test.js`)
```js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { collapseAdjacentDuplicateRun, cleanRepeats } = require('../lib/clean');

test('ยุบสำเนาติดกันเป๊ะ เหลือชุดเดียว', () => {
  const { text, removed } = collapseAdjacentDuplicateRun('ไปดูหนังกันเถอะนะ ไปดูหนังกันเถอะนะ');
  assert.strictEqual(text, 'ไปดูหนังกันเถอะนะ');
  assert.strictEqual(removed.length, 1);
});

test('ไม่มีสำเนา → คืนข้อความเดิม ไม่ตัดอะไร (lossless guard)', () => {
  const input = 'วันนี้คุยเรื่องอินเดียกับการลงทุนแล้วก็เรื่องหนัง';
  const { text, removed } = collapseAdjacentDuplicateRun(input);
  assert.strictEqual(text, input);
  assert.strictEqual(removed.length, 0);
});

test('cleanRepeats ยุบสำเนาสามรอบจนเหลือชุดเดียว', () => {
  const { text } = cleanRepeats('สวัสดีครับทุกคนนะ สวัสดีครับทุกคนนะ สวัสดีครับทุกคนนะ');
  assert.strictEqual(text, 'สวัสดีครับทุกคนนะ');
});
```

- [ ] **Step 2 — รันให้เห็น fail**
Run: `node --test tests/clean.test.js`
Expected: FAIL — `Cannot find module '../lib/clean'`

- [ ] **Step 3 — เขียนโค้ดน้อยสุดให้ผ่าน** (`lib/clean.js`)
```js
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

module.exports = { collapseAdjacentDuplicateRun, cleanRepeats };
```

- [ ] **Step 4 — รันให้ผ่าน**
Run: `node --test tests/clean.test.js`
Expected: PASS ทั้งหมด

- [ ] **Step 5 — commit**
```bash
git add lib/clean.js tests/clean.test.js && git commit -m "clean: ยุบสำเนาเสียงที่ติดกันแบบเป๊ะ (lossless)"
```

---

## Task 2: clean.js — ยุบบรรทัดซ้ำ (screen) + รวมเป็น cleanDay

**Files:** Modify `lib/clean.js` · Modify `tests/clean.test.js`

- [ ] **Step 1 — เพิ่มเทสให้ fail** (ต่อท้าย `tests/clean.test.js`)
```js
const { collapseConsecutiveDuplicateLines, cleanDay, renderRemovalLog } = require('../lib/clean');

test('ยุบบรรทัดซ้ำติดกัน (screen) — lossless', () => {
  const { text, removed } = collapseConsecutiveDuplicateLines('เมนู\nเมนู\nเนื้อหาจริง\nเนื้อหาจริง\nท้าย');
  assert.strictEqual(text, 'เมนู\nเนื้อหาจริง\nท้าย');
  assert.strictEqual(removed.length, 2);
});

test('cleanDay รวมเสียง+จอ และเก็บ removalLog', () => {
  const out = cleanDay({ audioText: 'ก ก', screenText: 'x\nx' });
  assert.match(out.cleanedText, /ก/);
  assert.ok(Array.isArray(out.removalLog));
});

test('renderRemovalLog ว่าง → บอกว่าไม่มีการตัด', () => {
  assert.match(renderRemovalLog([]), /ไม่มีการตัด/);
});
```
(หมายเหตุ: `'ก ก'` สั้นกว่า minLen=12 จึงไม่ถูกตัด — ทดสอบแค่ว่ารวมได้/ไม่พัง)

- [ ] **Step 2 — รันให้เห็น fail**
Run: `node --test tests/clean.test.js`
Expected: FAIL — `collapseConsecutiveDuplicateLines is not a function`

- [ ] **Step 3 — เพิ่มโค้ด** (ต่อใน `lib/clean.js` ก่อน `module.exports`)
```js
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
```
และแก้บรรทัด exports เป็น:
```js
module.exports = { collapseAdjacentDuplicateRun, cleanRepeats, collapseConsecutiveDuplicateLines, cleanDay, renderRemovalLog };
```

- [ ] **Step 4 — รันให้ผ่าน**
Run: `node --test tests/clean.test.js`
Expected: PASS

- [ ] **Step 5 — commit**
```bash
git add lib/clean.js tests/clean.test.js && git commit -m "clean: ยุบบรรทัดจอซ้ำ + cleanDay + removalLog"
```

---

## Task 3: write-obsidian.js — เรนเดอร์โน้ต Obsidian

**Files:** Create `lib/write-obsidian.js` · Test `tests/write-obsidian.test.js`

- [ ] **Step 1 — เขียนเทสให้ fail** (`tests/write-obsidian.test.js`)
```js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { renderNote } = require('../lib/write-obsidian');

const digest = {
  summary: 'คุยเรื่องการลงทุนในอินเดีย',
  topics: ['อินเดีย', 'ซอฟต์พาวเวอร์'],
  people: ['พี่บุ๊ค'], projects: ['T-Hub'],
  todos: ['ติดต่อพระนครเหนือ'], decisions: []
};

test('โน้ตมี frontmatter วันที่', () => {
  assert.match(renderNote('2026-06-13', digest), /date: 2026-06-13/);
});
test('คน/โปรเจกต์เป็น wikilink', () => {
  const n = renderNote('2026-06-13', digest);
  assert.match(n, /\[\[พี่บุ๊ค\]\]/);
  assert.match(n, /\[\[T-Hub\]\]/);
});
test('todo เป็น checkbox + ลิงก์ฉบับเต็ม', () => {
  const n = renderNote('2026-06-13', digest);
  assert.match(n, /- \[ \] ติดต่อพระนครเหนือ/);
  assert.match(n, /\[\[2026-06-13\/_full\]\]/);
});
test('ฟิลด์ว่าง → ไม่พัง', () => {
  assert.doesNotThrow(() => renderNote('2026-06-13', {}));
});
```

- [ ] **Step 2 — รันให้เห็น fail**
Run: `node --test tests/write-obsidian.test.js`
Expected: FAIL — `Cannot find module '../lib/write-obsidian'`

- [ ] **Step 3 — เขียนโค้ด** (`lib/write-obsidian.js`)
```js
'use strict';
/* lib/write-obsidian.js — เรนเดอร์ digest เป็นโน้ต Obsidian (ฟังก์ชันเพียว) */

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

## คน / โปรเจกต์
${links}

## สิ่งที่ต้องทำ / ตัดสินใจ
${todos}

## ↪ ฉบับเต็ม
[[${date}/_full]]
`;
}

module.exports = { renderNote };
```

- [ ] **Step 4 — รันให้ผ่าน**
Run: `node --test tests/write-obsidian.test.js`
Expected: PASS

- [ ] **Step 5 — commit**
```bash
git add lib/write-obsidian.js tests/write-obsidian.test.js && git commit -m "write-obsidian: เรนเดอร์โน้ตรายวัน + wikilinks"
```

---

## Task 4: analyze.js — ground entities กันมั่ว (ฟังก์ชันเพียว)

**Files:** Create `lib/analyze.js` · Test `tests/analyze.test.js`

- [ ] **Step 1 — เขียนเทสให้ fail** (`tests/analyze.test.js`)
```js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { groundEntities, parseDigest } = require('../lib/analyze');

test('ตัด entity ที่ไม่ปรากฏในข้อความจริง (กันมั่ว)', () => {
  const src = 'วันนี้คุยกับพี่บุ๊คเรื่อง T-Hub';
  assert.deepStrictEqual(groundEntities(['พี่บุ๊ค', 'คนปลอม', 'T-Hub'], src), ['พี่บุ๊ค', 'T-Hub']);
});
test('parseDigest อ่าน JSON ที่มีข้อความหุ้มได้', () => {
  const d = parseDigest('ได้ครับ {"summary":"x","topics":["a"]} จบ');
  assert.strictEqual(d.summary, 'x');
  assert.deepStrictEqual(d.topics, ['a']);
});
test('parseDigest พังเป็น object ว่างที่ปลอดภัย', () => {
  assert.deepStrictEqual(parseDigest('ไม่ใช่ json'), {});
});
```

- [ ] **Step 2 — รันให้เห็น fail**
Run: `node --test tests/analyze.test.js`
Expected: FAIL — module not found

- [ ] **Step 3 — เขียนโค้ดส่วนเพียวก่อน** (`lib/analyze.js`)
```js
'use strict';
/* lib/analyze.js — วิเคราะห์ข้อความสะอาดด้วย AI (OpenRouter) */
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

module.exports = { groundEntities, parseDigest };
```

- [ ] **Step 4 — รันให้ผ่าน**
Run: `node --test tests/analyze.test.js`
Expected: PASS

- [ ] **Step 5 — commit**
```bash
git add lib/analyze.js tests/analyze.test.js && git commit -m "analyze: ground entities กันมั่ว + parseDigest"
```

---

## Task 5: analyze.js — เรียก OpenRouter จริง (เทสบน Mac)

**Files:** Modify `lib/analyze.js`

- [ ] **Step 1 — เพิ่ม prompt + ฟังก์ชัน analyze()** (ต่อใน `lib/analyze.js` ก่อน exports)
```js
const SYS = `คุณเป็นผู้ช่วยสรุป lifelog ภาษาไทย ตอบเป็น JSON เท่านั้น ตามคีย์:
{"summary": "สรุป 2-4 ประโยค", "topics": ["หัวข้อ"], "people": ["ชื่อคนที่ถูกพูดถึง"], "projects": ["โปรเจกต์/องค์กร"], "todos": ["สิ่งที่ต้องทำ"], "decisions": ["สิ่งที่ตัดสินใจ"]}
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
```
และเพิ่ม `buildMessages, analyze` ใน `module.exports`

- [ ] **Step 2 — เทสจริงบน Mac** (ต้องมี `config.js` + key)
Run: `node -e "require('./lib/analyze').analyze('วันนี้คุยกับพี่บุ๊คเรื่องโปรเจกต์ T-Hub ต้องติดต่อพระนครเหนือ').then(d=>console.log(JSON.stringify(d,null,2)))"`
Expected: JSON มี summary ภาษาไทย · people/projects ที่โผล่จริงเท่านั้น (เช่น "พี่บุ๊ค","T-Hub")

- [ ] **Step 3 — commit**
```bash
git add lib/analyze.js && git commit -m "analyze: เรียก OpenRouter สรุปเป็น JSON (เทสจริงบน Mac ผ่าน)"
```

---

## Task 6: storage.js — อ่าน source / เขียน vault

**Files:** Create `lib/storage.js` · Test `tests/storage.test.js`

- [ ] **Step 1 — เขียนเทสให้ fail** (`tests/storage.test.js`)
```js
'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { readDay, writeVault } = require('../lib/storage');

function tmp() { return fs.mkdtempSync(path.join(os.tmpdir(), 'pdb-')); }

test('readDay อ่านเฉพาะ audio-HH.md / screen-HH.md เรียงชั่วโมง', () => {
  const root = tmp(); const day = path.join(root, '2026-06-13');
  fs.mkdirSync(day, { recursive: true });
  fs.writeFileSync(path.join(day, 'audio-09.md'), 'เก้าโมง');
  fs.writeFileSync(path.join(day, 'audio-10.md'), 'สิบโมง');
  fs.writeFileSync(path.join(day, 'screen-09.md'), 'จอเก้า');
  const out = readDay(root, '2026-06-13');
  assert.match(out.audioText, /เก้าโมง[\s\S]*สิบโมง/);
  assert.match(out.screenText, /จอเก้า/);
});

test('readDay ไม่มีโฟลเดอร์ → throw ชัดเจน', () => {
  assert.throws(() => readDay(tmp(), '2099-01-01'), /ไม่พบ/);
});

test('writeVault เขียน 3 ไฟล์ถูกที่ (ไม่แตะ source)', () => {
  const v = tmp();
  writeVault(v, '2026-06-13', { full: 'เต็ม', removed: 'log', note: 'โน้ต' });
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13.md'), 'utf8'), 'โน้ต');
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13', '_full.md'), 'utf8'), 'เต็ม');
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13', '_removed.log'), 'utf8'), 'log');
});
```

- [ ] **Step 2 — รันให้เห็น fail**
Run: `node --test tests/storage.test.js`
Expected: FAIL — module not found

- [ ] **Step 3 — เขียนโค้ด** (`lib/storage.js`)
```js
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

function writeVault(vaultDir, date, { full, removed, note }) {
  const dayDir = path.join(vaultDir, date);
  fs.mkdirSync(dayDir, { recursive: true });
  fs.writeFileSync(path.join(dayDir, '_full.md'), full);
  fs.writeFileSync(path.join(dayDir, '_removed.log'), removed);
  fs.writeFileSync(path.join(vaultDir, `${date}.md`), note);   // โน้ตหลัก
}

module.exports = { readDay, writeVault };
```

- [ ] **Step 4 — รันให้ผ่าน**
Run: `node --test tests/storage.test.js`
Expected: PASS

- [ ] **Step 5 — commit**
```bash
git add lib/storage.js tests/storage.test.js && git commit -m "storage: readDay (อ่านอย่างเดียว) + writeVault 3 ไฟล์"
```

---

## Task 7: tools/digest.js — ร้อยทุกขั้น + ธง --no-ai

**Files:** Modify `tools/digest.js`

- [ ] **Step 1 — เขียน orchestration** (แทนที่เนื้อใน `tools/digest.js`)
```js
'use strict';
/* tools/digest.js — MVP "Daily Digest → Obsidian"
 *   node tools/digest.js <YYYY-MM-DD> [--no-ai] */
const path = require('path');
const { CONFIG } = require('../config');
const { cleanDay, renderRemovalLog } = require('../lib/clean');
const { renderNote } = require('../lib/write-obsidian');
const { readDay, writeVault } = require('../lib/storage');

function resolve(p) { return path.isAbsolute(p) ? p : path.join(__dirname, '..', p); }

async function main(argv) {
  const date = argv[2];
  const noAI = argv.includes('--no-ai');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('ใช้: node tools/digest.js <YYYY-MM-DD> [--no-ai]');
    process.exit(1);
  }

  const raw = readDay(resolve(CONFIG.sourceDir), date);          // อ่าน (ไม่แตะ source)
  const { cleanedText, removalLog } = cleanDay(raw);             // ล้าง lossless
  console.log(`🧹 ล้างแล้ว: ${cleanedText.length} ตัวอักษร · ตัดออก ${removalLog.length} ชิ้น`);

  let digest, note;
  if (noAI) {
    note = renderNote(date, { summary: '(โหมด --no-ai: ยังไม่วิเคราะห์)' });
  } else {
    try {
      digest = await require('../lib/analyze').analyze(cleanedText);  // AI
      note = renderNote(date, digest);
      console.log(`🤖 วิเคราะห์แล้ว: ${(digest.topics||[]).length} หัวข้อ · ${(digest.people||[]).length+(digest.projects||[]).length} entity`);
    } catch (e) {
      console.error('⚠️ AI ไม่สำเร็จ:', e.message, '— ยังเขียน _full.md ปกติ (ข้อมูลไม่หาย)');
      note = renderNote(date, { summary: '(AI ไม่สำเร็จ — ดูฉบับเต็มที่ _full)' });
    }
  }

  writeVault(resolve(CONFIG.vaultDir), date, {                   // เขียนผล 3 ไฟล์
    full: cleanedText, removed: renderRemovalLog(removalLog), note
  });
  console.log(`✅ เขียนลง vault แล้ว: ${date}.md + ${date}/_full.md + _removed.log`);
}

if (require.main === module) main(process.argv);
module.exports = { main };
```

- [ ] **Step 2 — เทส --no-ai บน fixture จริง** (ไม่ยิง API — รันในเครื่องได้)
Run: `node tools/digest.js <วันจริงที่มีใน recordings> --no-ai`
Expected: ขึ้น `🧹 ล้างแล้ว...` และ `✅ เขียนลง vault` · ไปดูไฟล์ `vault/<วัน>/_full.md` ว่ามีเนื้อครบ (เทียบกับ source ว่าไม่มีเนื้อหาจริงหาย)

- [ ] **Step 3 — commit**
```bash
git add tools/digest.js && git commit -m "digest: ร้อย clean→analyze→write + ธง --no-ai + fail ปลอดภัย"
```

---

## Task 8: end-to-end จริง + fixtures + verify lossless

**Files:** Create `tests/fixtures/sample-audio.md` · Modify `tests/clean.test.js`

- [ ] **Step 1 — เก็บ fixture จริง (สั้น)**: คัดข้อความเสียงจริง ~10 บรรทัดที่มีสำเนาซ้ำ จาก `recordings/` มาวางใน `tests/fixtures/sample-audio.md`

- [ ] **Step 2 — เทส lossless บน fixture** (ต่อใน `tests/clean.test.js`)
```js
const fs = require('fs'); const path = require('path');
test('lossless: ทุกประโยคไม่ซ้ำใน fixture ยังอยู่ครบหลังล้าง', () => {
  const src = fs.readFileSync(path.join(__dirname, 'fixtures/sample-audio.md'), 'utf8');
  const { text } = cleanRepeats(src);
  for (const sentence of src.split(/[\n。.!?]/).map(s => s.trim()).filter(s => s.length > 15)) {
    assert.ok(text.includes(sentence) || src.indexOf(sentence) !== src.lastIndexOf(sentence),
      `ประโยคหายหลังล้าง: ${sentence.slice(0,40)}`);
  }
});
```

- [ ] **Step 3 — รัน full suite ให้เขียวหมด**
Run: `node --test`
Expected: PASS ทั้งหมด (clean, write-obsidian, analyze เพียว, storage, sanity)

- [ ] **Step 4 — รันจริงเต็มสูบบน Mac (มี AI)**
Run: `node tools/digest.js <วันจริง>`
Expected: เปิด Obsidian เห็นโน้ต `<วัน>.md` มีสรุป/หัวข้อ/`[[ลิงก์]]` และเปิด `_full.md` เทียบกับ source ว่าเนื้อหาจริงครบ

- [ ] **Step 5 — commit**
```bash
git add tests/ && git commit -m "test: fixture จริง + เทส lossless ครบวงจร" && git push
```

---

## Self-Review (ทำหลังเขียนแผนเสร็จ)
- **ครอบ spec:** clean(lossless+log) ✓ · analyze(AI+ground) ✓ · write-obsidian(โน้ต+links+ฉบับเต็ม) ✓ · storage(อ่านอย่างเดียว+3 ไฟล์) ✓ · CLI+fail ปลอดภัย ✓ · เทส lossless ✓
- **ไม่มี placeholder:** ทุก step มีโค้ด/คำสั่งจริง
- **ชื่อสอดคล้อง:** `cleanDay/cleanRepeats/collapse*`, `renderNote`, `readDay/writeVault`, `analyze/groundEntities/parseDigest`, `main` — ตรงกันทุก task
- **ความเสี่ยงที่รู้ตัว:** ยุบเฉพาะสำเนา "เป๊ะติดกัน" (near-dup ปล่อยไว้ตามหลัก lossless) · `collapseAdjacentDuplicateRun` เป็น batch รันวันละครั้ง ไม่เน้นเร็ว · AI ตัดความยาวที่ 40k ตัว (chunking = อนาคต)

## Execution Handoff
**2 ทางเลือกการลงมือ:**
1. **Subagent-driven (แนะนำ)** — ผม dispatch subagent ทำทีละ task + รีวิวคั่น (เร็ว) — แต่ task ที่ต้อง commit/ยิง API ต้องทำบน Mac จริง
2. **Inline** — ผมทำทีละ task ในเซสชันนี้ (เขียนโค้ด+เทสเพียวในแซนด์บ็อกซ์ได้, commit/AI ทำบน Mac)

> ⚠️ ข้อจำกัดสภาพแวดล้อม: แซนด์บ็อกซ์ **ยิง OpenRouter ไม่ได้** และ **commit git บน Desktop ไม่ได้** → Task 5,7,8 (ส่วน AI/commit) ต้องรันบนเครื่อง Mac · Task 1–4,6 (ตรรกะเพียว+เทส) ทำในแซนด์บ็อกซ์ได้เลย
