/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const OUT_FILE = path.join(__dirname, 'data/toefl-l2-part-a.json');

const TARGETS = {
  awl: 700,
  research: 500,
  'biology-adv': 450,
};

const POOL_FILES = {
  awl: './data/l2-pool-toefl-awl.mjs',
  research: './data/l2-pool-toefl-research.mjs',
  'biology-adv': './data/l2-pool-toefl-biology-adv.mjs',
};

const EXPORT_NAMES = {
  awl: 'awl',
  research: 'research',
  'biology-adv': 'biologyAdv',
};

function dedupe(pool) {
  const seen = new Set();
  const out = [];
  for (const row of pool) {
    if (!Array.isArray(row) || row.length < 4) {
      throw new Error(`Invalid row: ${JSON.stringify(row)}`);
    }
    const key = String(row[0]).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row.slice(0, 4));
  }
  return out;
}

function pick(pool, count) {
  const unique = dedupe(pool);
  if (unique.length < count) {
    throw new Error(`Pool short by ${count - unique.length} (got ${unique.length}/${count})`);
  }
  return unique.slice(0, count);
}

async function loadPool(theme) {
  const modPath = pathToFileURL(path.join(__dirname, POOL_FILES[theme])).href;
  const mod = await import(modPath);
  const name = EXPORT_NAMES[theme];
  const pool = mod[name];
  if (!Array.isArray(pool)) throw new Error(`Missing export ${name} in ${POOL_FILES[theme]}`);
  return pool;
}

async function main() {
  const out = {};
  for (const [theme, count] of Object.entries(TARGETS)) {
    const pool = await loadPool(theme);
    out[theme] = pick(pool, count);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log('Written:', OUT_FILE);
  for (const [k, v] of Object.entries(out)) {
    console.log(`  ${k}: ${v.length} (target ${TARGETS[k]})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
