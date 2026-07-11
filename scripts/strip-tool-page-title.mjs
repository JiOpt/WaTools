/**
 * Remove page-title hero block from tool pages (title already in nav + <title>).
 * Run: node scripts/strip-tool-page-title.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP = new Set(['index.html', 'index_plan.html', 'copyright.html']);

const PAGE_TITLE_RE = /\r?\n\s*<div class="page-title"[\s\S]*?\r?\n\s*<\/div>\r?\n(?=\s*<section class="tool-section)/;

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (['node_modules', '.git', '.firebase'].includes(ent.name)) continue;
      walk(full, out);
    } else if (ent.name.endsWith('.html') && !SKIP.has(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="tool-app"') || !html.includes('class="page-title"')) continue;
  const next = html.replace(PAGE_TITLE_RE, '\n');
  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}

console.log(`Removed page-title from ${changed} tool pages.`);
