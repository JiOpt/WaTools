/**
 * Build TOEFL L2 Part C JSON from all pool modules.
 * Run: node scripts/data/toefl-l2-build-part-c.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { philosophy } from './toefl-l2-pool-philosophy.mjs';
import { linguistics } from './toefl-l2-pool-linguistics.mjs';
import { politicsAdv } from './toefl-l2-pool-politics-adv.mjs';
import { literatureAdv } from './toefl-l2-pool-literature-adv.mjs';
import { economicsAdv } from './toefl-l2-pool-economics-adv.mjs';
import { anthropologyAdv } from './toefl-l2-pool-anthropology-adv.mjs';
import { technologyAdv } from './toefl-l2-pool-technology-adv.mjs';
import { medicineAdv } from './toefl-l2-pool-medicine-adv.mjs';
import { chemistryAdv } from './toefl-l2-pool-chemistry-adv.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, 'toefl-l2-part-c.json');

const TARGETS = {
  'chemistry-adv': 380,
  'medicine-adv': 380,
  'anthropology-adv': 350,
  'economics-adv': 350,
  'technology-adv': 350,
  'literature-adv': 320,
  'politics-adv': 320,
  philosophy: 300,
  linguistics: 280,
};

const RAW = {
  'chemistry-adv': chemistryAdv,
  'medicine-adv': medicineAdv,
  'anthropology-adv': anthropologyAdv,
  'economics-adv': economicsAdv,
  'technology-adv': technologyAdv,
  'literature-adv': literatureAdv,
  'politics-adv': politicsAdv,
  philosophy,
  linguistics,
};

/** @param {Array<[string,string,string,string]>} pool */
function dedupe(pool) {
  const seen = new Set();
  return pool.filter(([w]) => {
    const k = w.trim().toLowerCase();
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** @param {string} theme @param {Array<[string,string,string,string]>} pool @param {number} n */
function pick(theme, pool, n) {
  const u = dedupe(pool);
  if (u.length < n) throw new Error(`${theme}: need ${n}, got ${u.length}`);
  return u.slice(0, n);
}

/** @type {Record<string, Array<[string,string,string,string]>>} */
const result = {};
const counts = {};

for (const [theme, target] of Object.entries(TARGETS)) {
  result[theme] = pick(theme, RAW[theme], target);
  counts[theme] = result[theme].length;
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
if (total !== 3030) throw new Error(`Total ${total}, expected 3030`);

fs.writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n', 'utf8');

console.log('Written:', OUT);
console.log('Counts per key:');
for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
console.log(`  TOTAL: ${total}`);
