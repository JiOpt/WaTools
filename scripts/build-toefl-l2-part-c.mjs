/**
 * Generate TOEFL L2 Part C vocabulary JSON.
 * Run: node scripts/build-toefl-l2-part-c.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VOCAB_POOLS } from './data/toefl-l2-vocab-pools-part-c.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.join(__dirname, 'data', 'toefl-l2-part-c.json');

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

/** @param {Array<[string,string,string,string]>} pool */
function dedupe(pool) {
  const seen = new Set();
  const out = [];
  for (const entry of pool) {
    const key = entry[0].trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(entry);
  }
  return out;
}

/** @param {string} theme @param {Array<[string,string,string,string]>} pool @param {number} target */
function pick(theme, pool, target) {
  const unique = dedupe(pool);
  if (unique.length < target) {
    throw new Error(`${theme}: need ${target}, pool has ${unique.length} after dedup`);
  }
  return unique.slice(0, target);
}

function main() {
  /** @type {Record<string, Array<[string,string,string,string]>>} */
  const result = {};
  const counts = {};

  for (const [theme, target] of Object.entries(TARGETS)) {
    const pool = VOCAB_POOLS[theme];
    if (!pool) throw new Error(`Missing pool: ${theme}`);
    result[theme] = pick(theme, pool, target);
    counts[theme] = result[theme].length;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total !== 3030) throw new Error(`Total ${total}, expected 3030`);

  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');

  console.log('Written:', OUT_PATH);
  console.log('Counts per key:');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  console.log(`  TOTAL: ${total}`);
}

main();
