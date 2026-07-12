/**
 * Replace header text/icon logo with assets/img/logo.jpg across HTML pages.
 * Run: node scripts/stamp-nav-logo.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { WA_SITE_VERSION } from './site-version.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.firebase', 'assets', 'forms', 'scripts']);
const SKIP_FILES = new Set(['starter-page.html']);

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walkHtml(full, out);
      continue;
    }
    if (ent.isFile() && ent.name.endsWith('.html') && !SKIP_FILES.has(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

function depthOf(filePath) {
  const rel = path.relative(ROOT, path.dirname(filePath));
  if (!rel || rel === '.') return 0;
  return rel.split(path.sep).filter(Boolean).length;
}

function logoImg(depth) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return `<img src="${prefix}assets/img/logo.jpg?v=${WA_SITE_VERSION}" alt="Toolpian" class="site-logo" width="808" height="336" decoding="async">`;
}

function stampHeaderLogo(html, imgTag) {
  return html.replace(
    /(<header[^>]*>[\s\S]*?<a\s+href="[^"]*"\s+class="logo[^"]*"[^>]*>)[\s\S]*?(<\/a>)/,
    `$1\n          ${imgTag}\n        $2`,
  );
}

let changed = 0;
for (const file of walkHtml(ROOT)) {
  const before = fs.readFileSync(file, 'utf8');
  const after = stampHeaderLogo(before, logoImg(depthOf(file)));
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(path.relative(ROOT, file));
  }
}

console.log(`Stamped nav logo in ${changed} files.`);
