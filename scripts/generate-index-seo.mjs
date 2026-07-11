/**
 * Inject a static crawler-friendly link index into index.html.
 * Complements JS-rendered #tools-catalog for search engines.
 *
 * Regenerate after sitemap.txt or tools-data.js changes:
 *   node scripts/generate-index-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanPageHref, isNoindexSlug } from './seo-meta.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INDEX = path.join(ROOT, 'index.html');
const SITEMAP_TXT = path.join(ROOT, 'sitemap.txt');
const TOOLS_DATA = path.join(ROOT, 'assets/js/tools-data.js');
const SCRIPTURES_CATALOG = path.join(ROOT, 'assets/js/scriptures-catalog.js');

const MARKER_START = '<!-- @wa-seo-crawler-nav:start -->';
const MARKER_END = '<!-- @wa-seo-crawler-nav:end -->';

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
  const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

function loadScriptureBooks() {
  if (!fs.existsSync(SCRIPTURES_CATALOG)) return [];
  const src = fs.readFileSync(SCRIPTURES_CATALOG, 'utf8');
  const body = src.replace(/^window\.WA_SCRIPTURES_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  const catalog = Function(`return ${body}`)();
  return (catalog || []).flatMap((section) => section.books || []);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderNav(published) {
  const catalog = loadCatalog();
  const parts = [
    '<nav class="seo-crawler-nav" aria-label="網站工具與經典目錄">',
    '<h2 class="seo-crawler-nav-title">MyTooLife 線上工具與藏經閣</h2>',
    '<p class="seo-crawler-nav-intro">免安裝、打開即用的免費線上工具箱與國學經典閱讀。</p>',
  ];

  parts.push('<section><h3>已開放工具</h3><ul class="seo-crawler-nav-list">');
  for (const category of catalog) {
    const tools = (category.tools || []).filter(
      (tool) => published.has(tool.slug) && !isNoindexSlug(tool.slug)
    );
    if (!tools.length) continue;
    parts.push(`<li><h4>${escapeHtml(category.name)}</h4><ul>`);
    for (const tool of tools) {
      const href = cleanPageHref(`${category.id}/${tool.slug}.html`);
      parts.push(`<li><a href="${href}">${escapeHtml(tool.title)}</a></li>`);
    }
    parts.push('</ul></li>');
  }
  parts.push('</ul></section>');

  const books = loadScriptureBooks();
  if (books.length) {
    parts.push('<section><h3>藏經閣經典</h3><ul class="seo-crawler-nav-list">');
    parts.push(`<li><a href="${cleanPageHref('utility/scriptures.html')}">藏經閣目錄</a></li>`);
    for (const book of books) {
      const href = cleanPageHref(`scripture/${book.slug}.html`);
      parts.push(`<li><a href="${href}">${escapeHtml(book.title)}</a></li>`);
    }
    parts.push('</ul></section>');
  }

  parts.push('<section><h3>網站資訊</h3><ul class="seo-crawler-nav-list">');
  parts.push(`<li><a href="/">工具首頁</a></li>`);
  parts.push(`<li><a href="${cleanPageHref('contact.html')}">聯絡我們</a></li>`);
  parts.push(`<li><a href="${cleanPageHref('copyright.html')}">版權聲明</a></li>`);
  parts.push('</ul></section>');
  parts.push('</nav>');

  return parts.join('\n');
}

function main() {
  if (!fs.existsSync(INDEX)) {
    console.error('index.html not found');
    process.exit(1);
  }

  const published = loadPublishedSlugs();
  const navHtml = `${MARKER_START}\n${renderNav(published)}\n${MARKER_END}`;
  let html = fs.readFileSync(INDEX, 'utf8');

  const blockRe = new RegExp(`${MARKER_START}[\\s\\S]*?${MARKER_END}`, 'm');
  if (blockRe.test(html)) {
    html = html.replace(blockRe, navHtml);
  } else if (html.includes('<div id="tools-catalog"></div>')) {
    html = html.replace(
      '<div id="tools-catalog"></div>',
      `<div id="tools-catalog"></div>\n\n    ${navHtml}`
    );
  } else {
    console.error('Could not find insertion point in index.html');
    process.exit(1);
  }

  fs.writeFileSync(INDEX, html, 'utf8');
  console.log(`index.html SEO crawler nav updated (${published.size} published tool slugs).`);
}

main();
