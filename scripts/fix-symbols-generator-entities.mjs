/**
 * Decode HTML entities in existing symbols-generator-data.js
 * Run: node scripts/fix-symbols-generator-entities.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { decodeHtmlEntities } from './html-decode.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const FILE = path.join(ROOT, 'assets', 'js', 'symbols-generator-data.js');

const src = fs.readFileSync(FILE, 'utf8');
const m = src.match(/window\.WA_SYMBOLS_GENERATOR = (\{[\s\S]*\});/);
if (!m) throw new Error('Data block not found');

const data = eval(`(${m[1]})`);
let fixed = 0;
data.sections.forEach((sec) => {
  sec.items = sec.items.map((item) => {
    const decoded = decodeHtmlEntities(item);
    if (decoded !== item) fixed += 1;
    return decoded;
  });
});

const body = `/* Auto-generated — ifreesite symbols generator */
window.WA_SYMBOLS_GENERATOR = ${JSON.stringify(data, null, 2)};
`;
fs.writeFileSync(FILE, body, 'utf8');
console.log(`Fixed ${fixed} entity strings in symbols-generator-data.js`);
