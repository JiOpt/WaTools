/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { supplyChain } = require('./data/l2-pool-supply-chain-a');
const { hrLabor } = require('./data/l2-pool-hr-labor-a');
const { auditing } = require('./data/l2-pool-auditing-a');
const { marketingPr } = require('./data/l2-pool-marketing-pr-a');

const L2_FILE = path.join(__dirname, '../assets/js/toeic-vocab-l2-data.js');
const OUT_FILE = path.join(__dirname, 'data/toeic-l2-extra-a.json');

const TARGETS = {
  'supply-chain': 340,
  'hr-labor': 340,
  auditing: 320,
  'marketing-pr': 320,
};

const POOLS = {
  'supply-chain': supplyChain,
  'hr-labor': hrLabor,
  auditing,
  'marketing-pr': marketingPr,
};

function parseExistingWords(themeId) {
  const src = fs.readFileSync(L2_FILE, 'utf8');
  const marker = `id: '${themeId}'`;
  const start = src.indexOf(marker);
  if (start < 0) throw new Error(`Theme not found: ${themeId}`);
  const wordsStart = src.indexOf('words: [', start);
  const wordsEnd = src.indexOf('\n      ]', wordsStart);
  const block = src.slice(wordsStart, wordsEnd);
  return new Set([...block.matchAll(/w: '([^']+)'/g)].map((m) => m[1].toLowerCase()));
}

function pick(pool, existing, count) {
  const seen = new Set(existing);
  const out = [];
  for (const row of pool) {
    const key = row[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
    if (out.length >= count) break;
  }
  if (out.length < count) {
    throw new Error(`Pool short by ${count - out.length} (got ${out.length}/${count})`);
  }
  return out;
}

function main() {
  const out = {};
  for (const [theme, count] of Object.entries(TARGETS)) {
    out[theme] = pick(POOLS[theme], parseExistingWords(theme), count);
  }
  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, `${JSON.stringify(out, null, 2)}\n`, 'utf8');
  console.log('Written:', OUT_FILE);
  for (const [k, v] of Object.entries(out)) {
    console.log(`  ${k}: ${v.length} (target ${TARGETS[k]})`);
  }
}

main();
