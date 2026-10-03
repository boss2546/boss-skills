'use strict';
/* tools/digest.js — MVP "Daily Digest → Obsidian"
 *   node tools/digest.js <YYYY-MM-DD> [--no-ai]
 *   env override (สำหรับเทส): PDB_SOURCE, PDB_VAULT */
const path = require('path');
const os = require('os');
const { CONFIG } = require('../config');
const { cleanDay, renderRemovalLog } = require('../lib/clean');
const { renderNote } = require('../lib/write-obsidian');
const { readDay, writeVault, writeWikiSource } = require('../lib/storage');

function expandHome(p) { return p && p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p; }
function resolve(p) { p = expandHome(p); return path.isAbsolute(p) ? p : path.join(__dirname, '..', p); }

async function main(argv) {
  const date = argv[2];
  const noAI = argv.includes('--no-ai');
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    console.error('ใช้: node tools/digest.js <YYYY-MM-DD> [--no-ai]');
    process.exit(1);
  }
  const sourceDir = resolve(process.env.PDB_SOURCE || CONFIG.sourceDir);
  const vaultDir = resolve(process.env.PDB_VAULT || CONFIG.vaultDir);
  const wikiSrc = process.env.PDB_WIKI_SOURCES || CONFIG.wikiSourcesDir || '';
  const wikiSourcesDir = wikiSrc ? resolve(wikiSrc) : '';

  const raw = readDay(sourceDir, date);                         // อ่าน (ไม่แตะ source)
  const { cleanedText, removalLog } = cleanDay(raw);            // ล้าง lossless
  console.log(`🧹 ล้างแล้ว: ${cleanedText.length} ตัวอักษร · ตัดออก ${removalLog.length} ชิ้น`);

  let note, json = null;
  if (noAI) {
    note = renderNote(date, { summary: '(--no-ai: ยังไม่วิเคราะห์)' });
  } else {
    try {
      const digest = await require('../lib/analyze').analyze(cleanedText);  // AI
      json = { date, ...digest };                                           // เมล็ด Vault/MCP
      note = renderNote(date, digest);
      console.log(`🤖 วิเคราะห์แล้ว: ${(digest.topics||[]).length} หัวข้อ · ${(digest.decisions||[]).length} การตัดสินใจ · ${(digest.people||[]).length+(digest.projects||[]).length} entity`);
    } catch (e) {
      console.error('⚠️ AI ไม่สำเร็จ:', e.message, '— ยังเขียน _full.md ปกติ (ข้อมูลไม่หาย)');
      note = renderNote(date, { summary: '(AI ไม่สำเร็จ — ดูฉบับเต็มที่ _full)' });
    }
  }

  writeVault(vaultDir, date, { full: cleanedText, removed: renderRemovalLog(removalLog), note, json });
  console.log(`✅ เขียนลง vault: ${date}.md${json ? ' + ' + date + '.json' : ''} + ${date}/_full.md + _removed.log`);

  // ── ปลายท่อ → LLM Wiki (ข้อ 3): ส่งข้อความที่ล้างแล้วเข้า raw/sources/ ──
  const wikiFile = writeWikiSource(wikiSourcesDir, date, cleanedText);
  if (wikiFile) console.log(`🔗 ส่งเข้า LLM Wiki: ${wikiFile} (auto-watch จะ ingest ให้เอง)`);
  else console.log('ℹ️  wikiSourcesDir ว่าง — ข้ามการส่งเข้า LLM Wiki (ตั้ง path ใน config.js เพื่อเปิด)');
}

if (require.main === module) main(process.argv);
module.exports = { main };
