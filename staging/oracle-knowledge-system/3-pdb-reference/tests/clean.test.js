'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const {
  collapseAdjacentDuplicateRun, cleanRepeats,
  collapseConsecutiveDuplicateLines, cleanDay, renderRemovalLog
} = require('../lib/clean');

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

test('lossless: เนื้อหาไม่ซ้ำอยู่ครบ แม้มีสำเนาคั่นกลางก้อนยาว', () => {
  const uniqueA = 'ประโยคแรกที่ไม่ซ้ำเกี่ยวกับการลงทุนในอินเดียยาวพอสมควร';
  const dup = 'ขอย้ำอีกครั้งหนึ่งนะครับทุกคน';
  const uniqueB = 'ประโยคสุดท้ายที่ไม่ซ้ำเกี่ยวกับซอฟต์พาวเวอร์ไทย';
  const { text } = cleanRepeats(`${uniqueA} ${dup} ${dup} ${uniqueB}`);
  assert.ok(text.includes(uniqueA), 'เนื้อหาไม่ซ้ำ A ต้องอยู่ครบ');
  assert.ok(text.includes(uniqueB), 'เนื้อหาไม่ซ้ำ B ต้องอยู่ครบ');
  assert.strictEqual((text.match(new RegExp(dup, 'g')) || []).length, 1, 'สำเนาต้องเหลือชุดเดียว');
});
