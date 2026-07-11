/**
 * Move tool HTML pages into category folders: {categoryId}/{slug}.html
 * Leaves redirect stubs at old root paths + writes firebase-redirects snippet.
 *
 * Run: node scripts/migrate-tool-folders.mjs
 *      node scripts/migrate-tool-folders.mjs --dry-run
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');

const ROOT_KEEP = new Set([
  'index.html',
  'index_plan.html',
  'copyright.html',
  'starter-page.html',
]);

function loadCatalog() {
  const src = fs.readFileSync(path.join(ROOT, 'assets/js/tools-data.js'), 'utf8');
  const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

function buildSlugMap(catalog) {
  const map = new Map();
  for (const category of catalog) {
    for (const tool of category.tools || []) {
      map.set(tool.slug, category.id);
    }
  }
  return map;
}

function toolAbsPath(slug, slugMap) {
  const catId = slugMap.get(slug);
  return catId ? `${catId}/${slug}.html` : `${slug}.html`;
}

function patchHtmlForCategoryFolder(html, ownSlug, slugMap) {
  let out = html;

  out = out.replace(/(\s(?:src|href))="assets\//g, '$1="../assets/');
  out = out.replace(/(\s(?:src|href))='assets\//g, "$1='../assets/");

  out = out.replace(/href="index\.html/g, 'href="../index.html');
  out = out.replace(/href='index\.html/g, "href='../index.html");
  out = out.replace(/href="copyright\.html/g, 'href="../copyright.html');
  out = out.replace(/href="index_plan\.html/g, 'href="../index_plan.html');

  out = out.replace(/href="scriptures\.html/g, `href="../${toolAbsPath('scriptures', slugMap)}`);
  out = out.replace(/href="scripture\//g, 'href="../scripture/');

  for (const [slug, catId] of slugMap) {
    const abs = `${catId}/${slug}.html`;
    const target = slug === ownSlug ? `${slug}.html` : `../${abs}`;
    out = out.replace(new RegExp(`href="${slug}\\.html`, 'g'), `href="${target}`);
    out = out.replace(new RegExp(`href='${slug}\\.html`, 'g'), `href='${target}`);
  }

  return out;
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

function main() {
  const catalog = loadCatalog();
  const slugMap = buildSlugMap(catalog);
  const redirects = [];
  let moved = 0;
  let stubs = 0;

  for (const [slug, catId] of slugMap) {
    const src = path.join(ROOT, `${slug}.html`);
    if (!fs.existsSync(src)) continue;

    const destDir = path.join(ROOT, catId);
    const dest = path.join(destDir, `${slug}.html`);
    const relTarget = `${catId}/${slug}.html`;

    if (DRY) {
      console.log(`[dry-run] ${slug}.html -> ${relTarget}`);
      continue;
    }

    fs.mkdirSync(destDir, { recursive: true });
    const html = fs.readFileSync(src, 'utf8');
    fs.writeFileSync(dest, patchHtmlForCategoryFolder(html, slug, slugMap), 'utf8');
    fs.writeFileSync(src, redirectStub(relTarget), 'utf8');

    redirects.push({ source: `/${slug}`, destination: `/${catId}/${slug}`, type: 301 });
    redirects.push({ source: `/${slug}.html`, destination: `/${relTarget}`, type: 301 });
    moved += 1;
    stubs += 1;
    console.log(`Moved ${slug}.html -> ${relTarget}`);
  }

  if (!DRY && redirects.length) {
    const outPath = path.join(ROOT, 'scripts', 'firebase-tool-redirects.json');
    fs.writeFileSync(outPath, JSON.stringify(redirects, null, 2), 'utf8');
    console.log(`\nWrote ${redirects.length} redirect rules to scripts/firebase-tool-redirects.json`);
    console.log('Merge into firebase.json hosting.redirects (before catch-all rewrites).');
  }

  console.log(`\nDone: ${moved} moved, ${stubs} redirect stubs${DRY ? ' (dry-run)' : ''}.`);
}

main();
