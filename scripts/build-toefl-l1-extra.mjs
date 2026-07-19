/**
 * Generate TOEFL L1 extra vocabulary JSON.
 * Run: node scripts/build-toefl-l1-extra.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VOCAB_POOLS } from './data/toefl-l1-vocab-pools.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(__dirname, 'data');
const EXISTING_PATH = path.join(ROOT, 'assets/js/toefl-vocab-data.js');
const OUT_PATH = path.join(DATA_DIR, 'toefl-l1-extra.json');

const EXTRA_TARGETS = {
  biology: 220,
  history: 220,
  academic: 220,
  psychology: 200,
  astronomy: 180,
  geology: 180,
  medicine: 180,
  chemistry: 160,
  anthropology: 160,
  economics: 160,
  technology: 160,
  literature: 140,
  politics: 140,
  education: 140,
  statistics: 140,
};

/** @param {string} text */
function loadExistingByTheme(text) {
  /** @type {Record<string, Set<string>>} */
  const out = {};
  const blockRe = /id: '([^']+)'[\s\S]*?words: \[([\s\S]*?)\]\s*\n\s*\}/g;
  let m;
  while ((m = blockRe.exec(text)) !== null) {
    const id = m[1];
    const words = [...m[2].matchAll(/w: '([^']+)'/g)].map((x) => x[1].toLowerCase());
    out[id] = new Set(words);
  }
  return out;
}

/**
 * @param {string} theme
 * @param {Array<[string,string,string,string]>} pool
 * @param {Set<string>} existing
 * @param {number} target
 */
function pickWords(theme, pool, existing, target) {
  const seen = new Set();
  const out = [];
  for (const entry of pool) {
    if (out.length >= target) break;
    const [word, pos, zh, syn] = entry;
    const key = word.trim().toLowerCase();
    if (!key || existing.has(key) || seen.has(key)) continue;
    seen.add(key);
    out.push([word, pos, zh, syn]);
  }
  if (out.length !== target) {
    throw new Error(`${theme}: need ${target}, got ${out.length} (pool ${pool.length})`);
  }
  return out;
}

function main() {
  const existingText = fs.readFileSync(EXISTING_PATH, 'utf8');
  const existingByTheme = loadExistingByTheme(existingText);
  /** @type {Record<string, Array<[string,string,string,string]>>} */
  const result = {};
  const counts = {};

  for (const [theme, target] of Object.entries(EXTRA_TARGETS)) {
    const pool = VOCAB_POOLS[theme];
    if (!pool) throw new Error(`Missing pool for ${theme}`);
    const existing = existingByTheme[theme] || new Set();
    result[theme] = pickWords(theme, pool, existing, target);
    counts[theme] = result[theme].length;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total !== 2600) throw new Error(`Total extras ${total}, expected 2600`);

  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');

  console.log('Written:', OUT_PATH);
  console.log('Counts per key:');
  for (const [k, v] of Object.entries(counts)) console.log(`  ${k}: ${v}`);
  console.log(`  TOTAL: ${total}`);
}

main();
