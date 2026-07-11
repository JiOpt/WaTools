/**
 * Replace hard-coded footer copy with a JS-rendered placeholder.
 * Run: node scripts/patch-site-footers.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FOOTER_P = '      <p data-wa-site-footer></p>';
const FOOTER_BLOCK = `<footer id="footer" class="footer light-background">
    <div class="container copyright text-center py-4">
${FOOTER_P}
    </div>
  </footer>`;

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (name === 'node_modules' || name === 'assets') continue;
      walk(full, out);
    } else if (name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file);
  if (rel.startsWith('scripts' + path.sep) || rel.startsWith('.tmp')) continue;

  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="footer"')) continue;

  const next = html.replace(
    /<footer id="footer" class="footer light-background">\s*<div class="container copyright text-center py-4">\s*<p>[\s\S]*?<\/p>\s*<\/div>\s*<\/footer>/,
    FOOTER_BLOCK,
  );

  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
    console.log('patched', rel);
  }
}

console.log(`Done. ${changed} file(s) updated.`);
