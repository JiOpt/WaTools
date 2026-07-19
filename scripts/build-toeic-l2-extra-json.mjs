/**
 * Generate TOEIC L2 extra vocabulary JSON files.
 * Run: node scripts/build-toeic-l2-extra-json.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { VOCAB_POOLS } from './data/toeic-l2-vocab-pools.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

const EXTRA_C_TARGETS = {
  'real-estate': 280,
  'insurance-benefits': 280,
  rnd: 240,
  governance: 220,
  ma: 200,
  esg: 200,
};

const NEW_THEMES_TARGETS = {
  banking: 220,
  hospitality: 180,
};

const EXTRA_C_THEMES = Object.keys(EXTRA_C_TARGETS);
const EXISTING_THEMES = [...EXTRA_C_THEMES];

/** @param {string} theme */
function loadExistingWords(theme) {
  const file = path.join(DATA_DIR, `_existing-${theme}.txt`);
  if (!fs.existsSync(file)) {
    console.warn(`Warning: missing ${file}, treating as empty`);
    return new Set();
  }
  const words = fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim().toLowerCase())
    .filter(Boolean);
  return new Set(words);
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
  const skippedExisting = [];
  const skippedDup = [];

  for (const entry of pool) {
    if (out.length >= target) break;
    const [word, pos, zh, syn] = entry;
    const key = word.trim().toLowerCase();
    if (!key) continue;
    if (existing.has(key)) {
      skippedExisting.push(word);
      continue;
    }
    if (seen.has(key)) {
      skippedDup.push(word);
      continue;
    }
    seen.add(key);
    out.push([word, pos, zh, syn]);
  }

  if (out.length !== target) {
    throw new Error(
      `${theme}: need ${target} words, got ${out.length} (pool ${pool.length}, skipped existing ${skippedExisting.length}, skipped dup ${skippedDup.length})`
    );
  }
  return out;
}

/**
 * @param {Record<string, number>} targets
 * @param {string[]} themes
 * @param {Record<string, Set<string>>} existingByTheme
 */
function buildOutput(targets, themes, existingByTheme) {
  /** @type {Record<string, Array<[string,string,string,string]>>} */
  const result = {};
  for (const theme of themes) {
    const pool = VOCAB_POOLS[theme];
    if (!pool) throw new Error(`Missing vocab pool for theme: ${theme}`);
    const existing = existingByTheme[theme] || new Set();
    result[theme] = pickWords(theme, pool, existing, targets[theme]);
  }
  return result;
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function countKeys(data) {
  return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v.length]));
}

function deleteExistingFiles() {
  for (const theme of EXISTING_THEMES) {
    const file = path.join(DATA_DIR, `_existing-${theme}.txt`);
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
      console.log(`Deleted ${file}`);
    }
  }
}

function main() {
  const existingByTheme = Object.fromEntries(
    EXISTING_THEMES.map((t) => [t, loadExistingWords(t)])
  );

  const extraC = buildOutput(EXTRA_C_TARGETS, EXTRA_C_THEMES, existingByTheme);
  const newThemes = buildOutput(NEW_THEMES_TARGETS, Object.keys(NEW_THEMES_TARGETS), {});

  const extraCPath = path.join(DATA_DIR, 'toeic-l2-extra-c.json');
  const newThemesPath = path.join(DATA_DIR, 'toeic-l2-new-themes.json');

  writeJson(extraCPath, extraC);
  writeJson(newThemesPath, newThemes);

  console.log('\n=== toeic-l2-extra-c.json ===');
  const extraCounts = countKeys(extraC);
  for (const [k, v] of Object.entries(extraCounts)) {
    const ok = v === EXTRA_C_TARGETS[k] ? 'OK' : 'MISMATCH';
    console.log(`  ${k}: ${v} (target ${EXTRA_C_TARGETS[k]}) ${ok}`);
  }

  console.log('\n=== toeic-l2-new-themes.json ===');
  const newCounts = countKeys(newThemes);
  for (const [k, v] of Object.entries(newCounts)) {
    const ok = v === NEW_THEMES_TARGETS[k] ? 'OK' : 'MISMATCH';
    console.log(`  ${k}: ${v} (target ${NEW_THEMES_TARGETS[k]}) ${ok}`);
  }

  console.log('\nFiles written:');
  console.log(`  ${extraCPath}`);
  console.log(`  ${newThemesPath}`);

  deleteExistingFiles();
  console.log('\nDone.');
}

main();
