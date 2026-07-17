/**
 * Stamp header logo (bunny icon + brand text) across HTML pages.
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

function logoInner(depth) {
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  return `<span class="site-logo-frame" aria-hidden="true"><img src="${prefix}assets/img/logo.jpg?v=${WA_SITE_VERSION}" alt="" class="site-logo" width="136" height="136" decoding="async"></span><span class="site-logo-text"><span class="site-logo-text-full">KaWaTool 卡哇兔線上工具</span><span class="site-logo-text-short">KaWaTool</span></span>`;
}

function stampHeaderLogo(html, inner) {
  return html
    .replace(
      /(<a\s+href="[^"]*"\s+class="logo[^"]*"[^>]*aria-label=")[^"]*(")/,
      `$1KaWaTool 卡哇兔線上工具首頁$2`,
    )
    .replace(
      /(<a\s+href="[^"]*"\s+class="logo[^"]*"[^>]*>)[\s\S]*?(<\/a>)/,
      `$1\n          ${inner}\n        $2`,
    );
}

let changed = 0;
for (const file of walkHtml(ROOT)) {
  const before = fs.readFileSync(file, 'utf8');
  if (!/<a\s+href="[^"]*"\s+class="logo/.test(before)) continue;
  const after = stampHeaderLogo(before, logoInner(depthOf(file)));
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed += 1;
    console.log(path.relative(ROOT, file));
  }
}

console.log(`Stamped nav logo in ${changed} files.`);
