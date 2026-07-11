/**
 * Swap main.js before tool-boot.js on tool pages; bump tool-boot cache query.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOT_VERSION = '0.6.29';

const SKIP = new Set(['index.html', 'index_plan.html', 'copyright.html']);

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

const swapRe = /(<script src="([^"]*assets\/js\/tool-boot\.js[^"]*)"><\/script>\s*)<script src="([^"]*assets\/js\/main\.js[^"]*)"><\/script>/;
const bootRe = /assets\/js\/tool-boot\.js(\?v=[^"]*)?/;

let changed = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes('id="tool-app"')) continue;

  const next = html
    .replace(swapRe, '<script src="$3"></script>\n  <script src="$2"></script>')
    .replace(bootRe, `assets/js/tool-boot.js?v=${BOOT_VERSION}`);

  if (next !== html) {
    fs.writeFileSync(file, next, 'utf8');
    changed += 1;
  }
}

console.log(`Updated ${changed} tool pages.`);
