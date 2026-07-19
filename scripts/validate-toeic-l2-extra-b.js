/* eslint-disable */
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/toeic-l2-extra-b.json'), 'utf8'));
const l2 = fs.readFileSync(path.join(__dirname, '../assets/js/toeic-vocab-l2-data.js'), 'utf8');

function existingWords(themeId) {
  const marker = `id: '${themeId}'`;
  const start = l2.indexOf(marker);
  const wordsStart = l2.indexOf('words: [', start);
  const wordsEnd = l2.indexOf('\n      ]', wordsStart);
  const block = l2.slice(wordsStart, wordsEnd);
  return new Set([...block.matchAll(/w: '([^']+)'/g)].map((m) => m[1].toLowerCase()));
}

let ok = true;
for (const [k, rows] of Object.entries(data)) {
  const words = rows.map((r) => r[0].toLowerCase());
  const dup = words.filter((w, i) => words.indexOf(w) !== i);
  const existing = existingWords(k);
  const overlap = words.filter((w) => existing.has(w));
  const badFmt = rows.filter((r) => !Array.isArray(r) || r.length !== 4);
  console.log(`${k}: count=${rows.length} dup=${dup.length} overlap=${overlap.length} badFmt=${badFmt.length}`);
  if (dup.length || overlap.length || badFmt.length) ok = false;
}
process.exit(ok ? 0 : 1);
