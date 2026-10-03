'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const { renderNote } = require('../lib/write-obsidian');

const digest = {
  summary: 'คุยเรื่องการลงทุนในอินเดีย',
  topics: ['อินเดีย', 'ซอฟต์พาวเวอร์'],
  people: ['พี่บุ๊ค'], projects: ['T-Hub'],
  todos: ['ติดต่อพระนครเหนือ'],
  decisions: ['เลือกใช้ Gemini เพราะนิ่งกว่า']
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
test('decisions แยกเป็นหัวข้อของตัวเอง (แกนวิสัยทัศน์)', () => {
  const n = renderNote('2026-06-13', digest);
  assert.match(n, /## การตัดสินใจ/);
  assert.match(n, /เลือกใช้ Gemini เพราะนิ่งกว่า/);
});
test('ฟิลด์ว่าง → ไม่พัง', () => {
  assert.doesNotThrow(() => renderNote('2026-06-13', {}));
});
