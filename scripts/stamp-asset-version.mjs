import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WA_SITE_VERSION } from './site-version.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const ASSET_ATTR_RE = /((?:href|src)=["'])((?:\.\.\/)?assets\/[^"?#]+)(?:\?v=[^"#]*)?(["'])/g;

function stampHtml(content) {
  return content.replace(ASSET_ATTR_RE, (_, prefix, assetPath, suffix) => {
    return `${prefix}${assetPath}?v=${WA_SITE_VERSION}${suffix}`;
  });
}

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
  const original = fs.readFileSync(file, 'utf8');
  const next = stampHtml(original);
  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    updated += 1;
  }
}

console.log(`Stamped assets with ?v=${WA_SITE_VERSION} on ${updated} HTML file(s) (${htmlFiles.length} scanned).`);
