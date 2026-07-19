/* eslint-disable */
/**
 * Generates l2-pool-toefl-*-adv.mjs source files for Part B.
 * Run: node scripts/gen-toefl-l2-part-b-pools.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

function parseBlock(text) {
  return text
    .trim()
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split('|');
      if (parts.length !== 4) throw new Error(`Bad line: ${line}`);
      return parts.map((p) => p.trim());
    });
}

function dedupe(pool) {
  const seen = new Set();
  const out = [];
  for (const row of pool) {
    const key = row[0].toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(row);
  }
  return out;
}

function writePool(filename, exportName, comment, pool, exact) {
  const unique = dedupe(pool);
  if (unique.length < exact) {
    throw new Error(`${exportName}: only ${unique.length} unique (need ${exact})`);
  }
  const final = unique.slice(0, exact);
  if (final.length !== exact) throw new Error(`${exportName}: slice failed`);
  const lines = final.map((r) => `  ${JSON.stringify(r)},`).join('\n');
  const content = `/** ${comment} (${exact} entries). */\nexport const ${exportName} = [\n${lines}\n];\n`;
  fs.writeFileSync(path.join(DATA_DIR, filename), content, 'utf8');
  console.log(`Wrote ${filename}: ${final.length}`);
  return final.length;
}

// Import raw vocab blocks from companion module
import {
  ASTRONOMY_RAW,
  HISTORY_RAW,
  PSYCHOLOGY_RAW,
  EARTH_RAW,
} from './data/_toefl-l2-part-b-raw.mjs';

function main() {
  writePool(
    'l2-pool-toefl-astronomy-adv.mjs',
    'astronomyAdv',
    'TOEFL L2 astronomy & physics (110–120)',
    parseBlock(ASTRONOMY_RAW),
    420
  );
  writePool(
    'l2-pool-toefl-history-adv.mjs',
    'historyAdv',
    'TOEFL L2 history & archaeology (110–120)',
    parseBlock(HISTORY_RAW),
    420
  );
  writePool(
    'l2-pool-toefl-psychology-adv.mjs',
    'psychologyAdv',
    'TOEFL L2 psychology & sociology (110–120)',
    parseBlock(PSYCHOLOGY_RAW),
    400
  );
  writePool(
    'l2-pool-toefl-earth-adv.mjs',
    'earthAdv',
    'TOEFL L2 earth science & environment (110–120)',
    parseBlock(EARTH_RAW),
    400
  );
  console.log('Done generating Part B pool files.');
}

main();
