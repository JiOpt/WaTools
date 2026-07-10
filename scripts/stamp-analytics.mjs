import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GA_MEASUREMENT_ID, renderAnalyticsSnippet } from './site-analytics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const MARKER = 'googletagmanager.com/gtag/js';

function injectAnalytics(content) {
  if (!GA_MEASUREMENT_ID || content.includes(MARKER)) return content;
  const snippet = renderAnalyticsSnippet();
  const viewportRe = /(<meta content="width=device-width, initial-scale=1\.0" name="viewport">)/;
  if (viewportRe.test(content)) {
    return content.replace(viewportRe, `$1\n${snippet}`);
  }
  const charsetRe = /(<meta charset="utf-8">)/i;
  if (charsetRe.test(content)) {
    return content.replace(charsetRe, `$1\n${snippet}`);
  }
  return content;
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
  const next = injectAnalytics(original);
  if (next !== original) {
    fs.writeFileSync(file, next, 'utf8');
    updated += 1;
  }
}

console.log(`Analytics ${GA_MEASUREMENT_ID} injected into ${updated} HTML file(s) (${htmlFiles.length} scanned).`);
