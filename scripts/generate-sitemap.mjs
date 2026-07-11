import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';
import { NOINDEX_SLUGS } from './seo-meta.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://mytoolife.com';
const SITEMAP_TXT = path.join(ROOT, 'sitemap.txt');
const TOOLS_DATA = path.join(ROOT, 'assets', 'js', 'tools-data.js');

const STATIC_PAGES = new Set(['index.html', 'copyright.html', 'contact.html']);
const EXCLUDE = new Set(['starter-page.html', 'index_plan.html']);

function loadPublishedSlugs() {
  if (!fs.existsSync(SITEMAP_TXT)) return new Set();
  const set = new Set();
  fs.readFileSync(SITEMAP_TXT, 'utf8').split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    set.add(trimmed);
  });
  return set;
}

function loadCatalog() {
  const src = fs.readFileSync(TOOLS_DATA, 'utf8');
  const ctx = { window: {} };
  vm.runInNewContext(src, ctx);
  return ctx.window.WA_TOOLS_CATALOG || [];
}

function slugToToolPath(catalog) {
  const map = new Map();
  for (const category of catalog) {
    for (const tool of category.tools || []) {
      map.set(tool.slug, `${category.id}/${tool.slug}.html`);
    }
  }
  return map;
}

function collectScripturePages() {
  const dir = path.join(ROOT, 'scripture');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.html'))
    .map((name) => `scripture/${name}`);
}

function collectPublishedToolPages(published, slugPaths) {
  const files = [];
  for (const slug of published) {
    if (NOINDEX_SLUGS.has(slug)) continue;
    const rel = slugPaths.get(slug);
    if (!rel) continue;
    const abs = path.join(ROOT, rel);
    if (fs.existsSync(abs)) files.push(rel);
  }
  return files;
}

function priorityFor(file) {
  if (file === 'index.html') return '1.0';
  if (file.endsWith('/scriptures.html')) return '0.9';
  if (file.startsWith('scripture/')) return '0.85';
  return '0.7';
}

function changefreqFor(file) {
  if (file === 'index.html' || file.endsWith('/scriptures.html')) return 'weekly';
  if (file.startsWith('scripture/')) return 'monthly';
  return 'monthly';
}

function toLoc(file) {
  if (file === 'index.html') return `${SITE_URL}/`;
  return `${SITE_URL}/${file.replace(/\.html$/i, '')}`;
}

const published = loadPublishedSlugs();
const catalog = loadCatalog();
const slugPaths = slugToToolPath(catalog);

const files = new Set();
for (const page of STATIC_PAGES) {
  if (fs.existsSync(path.join(ROOT, page))) files.add(page);
}
for (const page of collectScripturePages()) files.add(page);
for (const page of collectPublishedToolPages(published, slugPaths)) files.add(page);

const sorted = [...files].filter((f) => !EXCLUDE.has(f)).sort();
const today = new Date().toISOString().slice(0, 10);
const urls = sorted.map((file) => {
  const loc = toLoc(file);
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreqFor(file)}</changefreq>
    <priority>${priorityFor(file)}</priority>
  </url>`;
});

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml written (${sorted.length} URLs, ${published.size} published slugs in sitemap.txt)`);
