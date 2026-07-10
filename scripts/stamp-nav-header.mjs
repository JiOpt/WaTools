import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

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

const HOME_LINK_RE = /\s*<li><a href="(?:\.\.\/)?index\.html"(?: class="active")?>工具首頁<\/a><\/li>\n?/g;
const SETTINGS_NAV_RE = /\s*<li><a href="(?:\.\.\/)?settings\.html"(?: class="active")?>個人化設定<\/a><\/li>\n?/g;

let updated = 0;

for (const file of htmlFiles) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  if (rel === 'scripts/_world-source.html') continue;

  const depth = rel.split('/').length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';
  const isSettings = rel === 'settings.html';

  let next = fs.readFileSync(file, 'utf8');
  const original = next;

  next = next.replace(HOME_LINK_RE, '');
  next = next.replace(SETTINGS_NAV_RE, '');

  if (isSettings) {
    next = next.replace(
      /<a class="cta-btn(?: d-none d-sm-block)?" href="[^"]*">[^<]*<\/a>/,
      `<a class="cta-btn active" href="${prefix}settings.html" aria-current="page">個人化設定</a>`
    );
  } else {
    next = next.replace(
      /<a class="cta-btn(?: d-none d-sm-block)?" href="[^"]*">[^<]*<\/a>/,
      `<a class="cta-btn" href="${prefix}settings.html">個人化設定</a>`
    );
  }

  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    updated += 1;
  }
}

console.log(`Normalized nav header in ${updated} HTML file(s) (${htmlFiles.length} scanned).`);
