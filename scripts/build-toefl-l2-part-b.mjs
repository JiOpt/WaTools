/**
 * Build TOEFL L2 Part B vocabulary JSON from theme pools.
 * Run: node scripts/build-toefl-l2-part-b.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { astronomyAdv } from './data/l2-pool-toefl-astronomy-adv.mjs';
import { historyAdv } from './data/l2-pool-toefl-history-adv.mjs';
import { psychologyAdv } from './data/l2-pool-toefl-psychology-adv.mjs';
import { earthAdv } from './data/l2-pool-toefl-earth-adv.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, 'data', 'toefl-l2-part-b.json');

const TARGETS = {
  'astronomy-adv': { pool: astronomyAdv, count: 420 },
  'history-adv': { pool: historyAdv, count: 420 },
  'psychology-adv': { pool: psychologyAdv, count: 400 },
  'earth-adv': { pool: earthAdv, count: 400 },
};

/** @param {string} theme @param {Array<[string,string,string,string]>} pool @param {number} target */
function validatePool(theme, pool, target) {
  if (!Array.isArray(pool)) throw new Error(`${theme}: pool is not an array`);
  if (pool.length !== target) {
    throw new Error(`${theme}: expected ${target} entries, got ${pool.length}`);
  }

  const seen = new Set();
  const dupes = [];

  for (const entry of pool) {
    if (!Array.isArray(entry) || entry.length !== 4) {
      throw new Error(`${theme}: invalid entry format (need [word,pos,zh,syn])`);
    }
    const [word, pos, zh, syn] = entry;
    if (!word?.trim() || !pos?.trim() || !zh?.trim() || !syn?.trim()) {
      throw new Error(`${theme}: empty field in entry "${word}"`);
    }
    const key = word.trim().toLowerCase();
    if (seen.has(key)) dupes.push(word);
    else seen.add(key);
  }

  if (dupes.length) {
    throw new Error(`${theme}: duplicate words (case-insensitive): ${dupes.slice(0, 5).join(', ')}${dupes.length > 5 ? '...' : ''}`);
  }
}

function main() {
  /** @type {Record<string, Array<[string,string,string,string]>>} */
  const result = {};
  const counts = {};

  for (const [theme, { pool, count }] of Object.entries(TARGETS)) {
    validatePool(theme, pool, count);
    result[theme] = pool.map(([word, pos, zh, syn]) => [word.trim(), pos.trim(), zh.trim(), syn.trim()]);
    counts[theme] = result[theme].length;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total !== 1640) throw new Error(`Total ${total}, expected 1640`);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, `${JSON.stringify(result, null, 2)}\n`, 'utf8');

  console.log('Written:', OUT_PATH);
  console.log('Counts per theme:');
  for (const [k, v] of Object.entries(counts)) {
    const target = TARGETS[k].count;
    const ok = v === target ? 'OK' : 'MISMATCH';
    console.log(`  ${k}: ${v} (target ${target}) ${ok}`);
  }
  console.log(`  TOTAL: ${total}`);
}

main();
