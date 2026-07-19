import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'scripts/data/toefl-l1-extra.json'), 'utf8'));
const existingText = fs.readFileSync(path.join(root, 'assets/js/toefl-vocab-data.js'), 'utf8');
const existing = {};
const blockRe = /id: '([^']+)'[\s\S]*?words: \[([\s\S]*?)\]\s*\n\s*\}/g;
let m;
while ((m = blockRe.exec(existingText)) !== null) {
  existing[m[1]] = [...m[2].matchAll(/w: '([^']+)'/g)].map((x) => x[1].toLowerCase());
}

const targets = {
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

let total = 0;
let ok = true;
for (const [k, target] of Object.entries(targets)) {
  const arr = data[k];
  if (!arr) {
    console.log('MISSING', k);
    ok = false;
    continue;
  }
  if (arr.length !== target) {
    console.log('COUNT', k, arr.length, '!=', target);
    ok = false;
  }
  total += arr.length;
  const seen = new Set();
  for (const e of arr) {
    if (!Array.isArray(e) || e.length !== 4) {
      console.log('FORMAT', k, e);
      ok = false;
    }
    const w = e[0].toLowerCase();
    if (seen.has(w)) {
      console.log('DUP extra', k, w);
      ok = false;
    }
    seen.add(w);
    if ((existing[k] || []).includes(w)) {
      console.log('OVERLAP existing', k, w);
      ok = false;
    }
  }
}
console.log('total', total, 'ok', ok);
