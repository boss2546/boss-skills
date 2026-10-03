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
