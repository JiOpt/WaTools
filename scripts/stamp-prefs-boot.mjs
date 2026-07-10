import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WA_SITE_VERSION } from './site-version.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const INLINE_BOOT_RE = /<script>try\{var s=localStorage\.getItem\('watools-font-size'\);document\.documentElement\.setAttribute\('data-font-size',s==='sm'\|\|s==='lg'\?s:'md'\)\}catch\(e\)\{document\.documentElement\.setAttribute\('data-font-size','md'\)\}<\/script>/g;

function collectHtmlFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      files.push(...collectHtmlFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

const skipDirs = new Set(['node_modules', 'scripts', 'forms', 'assets']);
const htmlFiles = collectHtmlFiles(root).filter((file) => {
  const rel = path.relative(root, file);
  const top = rel.split(path.sep)[0];
  return !skipDirs.has(top);
});

let updated = 0;
for (const file of htmlFiles) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'settings.html') continue;

  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const bootSrc = `${prefix}assets/js/prefs-boot.js?v=${WA_SITE_VERSION}`;

  const original = fs.readFileSync(file, 'utf8');
  if (!INLINE_BOOT_RE.test(original)) {
    INLINE_BOOT_RE.lastIndex = 0;
    continue;
  }
  INLINE_BOOT_RE.lastIndex = 0;

  const next = original.replace(
    INLINE_BOOT_RE,
    `<script src="${bootSrc}"></script>`
  );

  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    updated += 1;
  }
}

console.log(`Replaced inline prefs boot with prefs-boot.js in ${updated} HTML file(s) (${htmlFiles.length} scanned).`);
