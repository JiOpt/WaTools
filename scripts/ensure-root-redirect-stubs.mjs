/**
 * Create root {slug}.html redirect stubs for tools that live under {categoryId}/{slug}.html
 * Run: node scripts/ensure-root-redirect-stubs.mjs
 *      node scripts/ensure-root-redirect-stubs.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const skipSlugs = new Set(['torch', 'scriptures']);

function loadCatalog() {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf8');
  const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

function redirectStub(targetPath) {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0;url=${targetPath}">
  <link rel="canonical" href="${targetPath}">
  <title>Redirecting…</title>
  <script>location.replace(${JSON.stringify(targetPath)});</script>
</head>
<body><p>頁面已移至 <a href="${targetPath}">${targetPath}</a></p></body>
</html>
`;
}

const catalog = loadCatalog();
let created = 0;
let skipped = 0;
const missingPage = [];

for (const category of catalog) {
  for (const tool of category.tools || []) {
    if (skipSlugs.has(tool.slug)) continue;
    const relTarget = `${category.id}/${tool.slug}.html`;
    const pagePath = path.join(ROOT, relTarget);
    const stubPath = path.join(ROOT, `${tool.slug}.html`);

    if (!fs.existsSync(pagePath)) {
      missingPage.push(relTarget);
      continue;
    }

    if (fs.existsSync(stubPath)) {
      const text = fs.readFileSync(stubPath, 'utf8');
      if (text.includes(`url=${relTarget}`) || text.includes(`"${relTarget}"`)) {
        skipped += 1;
        continue;
      }
    }

    if (DRY) {
      console.log(`[dry-run] create ${tool.slug}.html -> ${relTarget}`);
      created += 1;
      continue;
    }

    fs.writeFileSync(stubPath, redirectStub(relTarget), 'utf8');
    console.log(`Created ${tool.slug}.html -> ${relTarget}`);
    created += 1;
  }
}

console.log(`\nDone: ${created} stub(s)${DRY ? ' (dry-run)' : ''}, ${skipped} already OK`);
if (missingPage.length) {
  console.warn(`Warning: ${missingPage.length} catalog page(s) missing on disk:`);
  missingPage.forEach((p) => console.warn('  ', p));
}
