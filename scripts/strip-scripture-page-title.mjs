/**
 * Remove page-title hero block from scripture/*.html pages.
 * Run: node scripts/strip-scripture-page-title.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPTURE_DIR = path.join(ROOT, 'scripture');

const PAGE_TITLE_RE =
  /\r?\n\s*<div class="page-title"[\s\S]*?\r?\n\s*<\/div>\r?\n(?=\s*<section class="scripture-section)/;

let changed = 0;
for (const name of fs.readdirSync(SCRIPTURE_DIR)) {
  if (!name.endsWith('.html')) continue;
  const file = path.join(SCRIPTURE_DIR, name);
  const html = fs.readFileSync(file, 'utf8');
  if (!html.includes('class="page-title"')) continue;
  const next = html.replace(PAGE_TITLE_RE, '\n');
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}

console.log(`Removed page-title from ${changed} scripture pages.`);
