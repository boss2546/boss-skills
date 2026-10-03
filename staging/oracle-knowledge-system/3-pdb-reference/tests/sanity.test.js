'use strict';
/* เทส sanity — ยืนยันว่า test runner ทำงาน (baseline เขียว)
 * เทสจริงของ lib/ จะเพิ่มทีหลังตอน TDD */
const { test } = require('node:test');
const assert = require('node:assert');

test('test runner ทำงาน', () => {
  assert.strictEqual(1 + 1, 2);
});

test('โหลด config.example ได้ + มี field ที่จำเป็น', () => {
  const { CONFIG } = require('../config.example.js');
  for (const k of ['sourceDir', 'vaultDir', 'openrouterModel']) {
    assert.ok(k in CONFIG, `config ต้องมี field: ${k}`);
  }
});
