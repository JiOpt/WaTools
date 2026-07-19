/* eslint-disable */
/**
 * Builds l2-pool-toefl-*.mjs source files from seed data.
 * Run: node scripts/build-toefl-l2-pool-files.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { awlSeeds, researchSeeds, biologySeeds } from './data/toefl-l2-vocab-seeds.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, 'data');

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

function writePool(filename, exportName, pool, minCount) {
  const deduped = dedupe(pool);
  if (deduped.length < minCount) {
    throw new Error(`${filename}: only ${deduped.length} unique entries (need ${minCount}+)`);
  }
  const lines = deduped.map((r) => `  ${JSON.stringify(r)},`).join('\n');
  const content = `/** TOEFL L2 vocabulary pool — ${exportName} (target pick ${minCount}) */\nexport const ${exportName} = [\n${lines}\n];\n`;
  fs.writeFileSync(path.join(OUT_DIR, filename), content, 'utf8');
  console.log(`${filename}: ${deduped.length} unique (min ${minCount})`);
  return deduped.length;
}

writePool('l2-pool-toefl-awl.mjs', 'awl', awlSeeds, 700);
writePool('l2-pool-toefl-research.mjs', 'research', researchSeeds, 500);
writePool('l2-pool-toefl-biology-adv.mjs', 'biologyAdv', biologySeeds, 450);
console.log('Done building TOEFL L2 pool files.');
