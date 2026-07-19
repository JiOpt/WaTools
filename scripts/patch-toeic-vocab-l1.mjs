/**
 * Patch Level-1 metadata onto existing WA_TOEIC_VOCAB scenarios.
 * Run: node scripts/patch-toeic-vocab-l1.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const file = path.join(path.dirname(fileURLToPath(import.meta.url)), '../assets/js/toeic-vocab-data.js');
let src = fs.readFileSync(file, 'utf8');

if (!src.includes('level: 1')) {
  src = src.replace(
    /window\.WA_TOEIC_VOCAB = \{\s*scenarios:/,
    `window.WA_TOEIC_VOCAB = {
  level: 1,
  tag: 'basic',
  label: 'Level 1｜基礎高頻字（550–750）',
  scenarios:`
  );
}

// Add level/tag on each scenario object after tip line if missing
src = src.replace(
  /(id: '[^']+',\s*name: '[^']+',\s*nameEn: '[^']+',\s*tip: '[^']*',\s*)(words:)/g,
  (m, head, words) => {
    if (head.includes('level:')) return m;
    return `${head}level: 1,\n      tag: 'basic',\n      ${words}`;
  }
);

fs.writeFileSync(file, src, 'utf8');
console.log('patched L1 metadata', file);
