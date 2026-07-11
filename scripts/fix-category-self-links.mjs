/**
 * Fix self-links and re-patch tool hrefs in category folder HTML files.
 * Run after migrate-tool-folders.mjs if nav self-links were over-patched.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

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

function patchHtml(html, ownSlug, slugMap) {
  let out = html;
  for (const [slug, catId] of slugMap) {
    const abs = `${catId}/${slug}.html`;
    const target = slug === ownSlug ? `${slug}.html` : `../${abs}`;
    out = out.replace(new RegExp(`href="\\.\\./${catId}/${slug}\\.html"`, 'g'), `href="${target}"`);
    out = out.replace(new RegExp(`href='\\.\\./${catId}/${slug}\\.html'`, 'g'), `href='${target}'`);
  }
  return out;
}

const catalog = loadCatalog();
const slugMap = buildSlugMap(catalog);
let fixed = 0;

for (const [slug, catId] of slugMap) {
  const file = path.join(ROOT, catId, `${slug}.html`);
  if (!fs.existsSync(file)) continue;
  const next = patchHtml(fs.readFileSync(file, 'utf8'), slug, slugMap);
  if (next !== fs.readFileSync(file, 'utf8')) {
    fs.writeFileSync(file, next, 'utf8');
    fixed += 1;
  }
}

console.log(`Fixed self-links in ${fixed} files.`);
