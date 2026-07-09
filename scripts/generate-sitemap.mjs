import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE_URL = 'https://watoolio.web.app';
const EXCLUDE = new Set(['starter-page.html']);

function collectHtmlFiles(dir, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'assets' || entry.name === 'scripts' || entry.name === 'forms') continue;
      files.push(...collectHtmlFiles(abs, rel));
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    if (EXCLUDE.has(rel.replace(/\\/g, '/'))) continue;
    files.push(rel.replace(/\\/g, '/'));
  }
  return files;
}

function priorityFor(file) {
  if (file === 'index.html') return '1.0';
  if (file === 'scriptures.html') return '0.9';
  if (file.startsWith('scripture/')) return '0.85';
  return '0.7';
}

function changefreqFor(file) {
  if (file === 'index.html' || file === 'scriptures.html') return 'weekly';
  if (file.startsWith('scripture/')) return 'monthly';
  return 'monthly';
}

function toLoc(file) {
  if (file === 'index.html') return `${SITE_URL}/`;
  return `${SITE_URL}/${file.replace(/index\.html$/, '')}`;
}

const files = collectHtmlFiles(ROOT).sort();
const today = new Date().toISOString().slice(0, 10);
const urls = files.map((file) => {
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
console.log(`sitemap.xml written (${files.length} URLs)`);
