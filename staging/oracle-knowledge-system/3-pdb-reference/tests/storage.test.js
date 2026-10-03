'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs'); const os = require('os'); const path = require('path');
const { readDay, writeVault, writeWikiSource } = require('../lib/storage');

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

test('writeVault เขียน .md/_full.md/_removed.log/.json ถูกที่ (ไม่แตะ source)', () => {
  const v = tmp();
  writeVault(v, '2026-06-13', { full: 'เต็ม', removed: 'log', note: 'โน้ต', json: { summary: 's' } });
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13.md'), 'utf8'), 'โน้ต');
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13', '_full.md'), 'utf8'), 'เต็ม');
  assert.strictEqual(fs.readFileSync(path.join(v, '2026-06-13', '_removed.log'), 'utf8'), 'log');
  const j = JSON.parse(fs.readFileSync(path.join(v, '2026-06-13.json'), 'utf8'));
  assert.strictEqual(j.summary, 's');
});

test('writeVault ไม่มี json → ข้ามได้ ไม่พัง', () => {
  const v = tmp();
  assert.doesNotThrow(() => writeVault(v, '2026-06-13', { full: 'f', removed: 'r', note: 'n' }));
  assert.strictEqual(fs.existsSync(path.join(v, '2026-06-13.json')), false);
});

test('writeWikiSource เขียน <date>.md ลง raw/sources/ ด้วยข้อความที่ล้างแล้ว', () => {
  const dir = path.join(tmp(), 'raw', 'sources');
  const file = writeWikiSource(dir, '2026-06-13', 'เนื้อหาสะอาด');
  assert.ok(file && fs.existsSync(file));
  const body = fs.readFileSync(file, 'utf8');
  assert.match(body, /เนื้อหาสะอาด/);
  assert.match(body, /2026-06-13/);
});

test('writeWikiSource สร้างโฟลเดอร์ปลายทางให้ถ้ายังไม่มี', () => {
  const dir = path.join(tmp(), 'a', 'b', 'raw', 'sources');
  assert.doesNotThrow(() => writeWikiSource(dir, '2026-06-13', 'x'));
  assert.ok(fs.existsSync(path.join(dir, '2026-06-13.md')));
});

test('writeWikiSource ไม่ตั้ง path (ว่าง/undefined) → ข้ามเงียบ ๆ ไม่พัง', () => {
  assert.strictEqual(writeWikiSource('', '2026-06-13', 'x'), null);
  assert.strictEqual(writeWikiSource(undefined, '2026-06-13', 'x'), null);
});
