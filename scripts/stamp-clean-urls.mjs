/**
 * Strip .html from internal page hrefs; use root-absolute clean URLs.
 * Run: node scripts/stamp-clean-urls.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.firebase', 'assets', 'forms', 'scripts']);
const SKIP_FILES = new Set(['starter-page.html']);

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name.startsWith('.')) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walkHtml(full, out);
      continue;
    }
    if (ent.isFile() && ent.name.endsWith('.html') && !SKIP_FILES.has(ent.name)) {
      out.push(full);
    }
  }
  return out;
}

function toCleanSitePath(resolvedFromRoot) {
  let p = resolvedFromRoot.replace(/\\/g, '/').replace(/^\/+/, '');
  if (!p || p === 'index.html' || p.endsWith('/index.html')) return '/';
  if (p.endsWith('/index.html')) p = p.slice(0, -'/index.html'.length);
  if (p.endsWith('.html')) p = p.slice(0, -5);
  return `/${p}`;
}

function cleanHref(href, fileRel) {
  if (!href || /^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) return href;
  const [pathPart, ...hashParts] = href.split('#');
  const hash = hashParts.length ? `#${hashParts.join('#')}` : '';
  const [pure, query] = pathPart.split('?');
  const querySuffix = query ? `?${query}` : '';

  if (!pure.endsWith('.html')) return href;

  const fileDir = path.dirname(fileRel);
  const resolved = path.posix.normalize(path.posix.join(fileDir, pure.replace(/\\/g, '/')));
  return `${toCleanSitePath(resolved)}${querySuffix}${hash}`;
}

function stampFile(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  let html = fs.readFileSync(filePath, 'utf8');
  const before = html;

  html = html.replace(/\b(href)=(["'])([^"']+)\2/gi, (match, attr, quote, href) => {
    const next = cleanHref(href, rel);
    return next === href ? match : `${attr}=${quote}${next}${quote}`;
  });

  html = html.replace(/(href=["']https?:\/\/[^"']+)\.html(["'])/gi, '$1$2');
  html = html.replace(/(content=["']https?:\/\/[^"']+)\.html(["'])/gi, '$1$2');
  html = html.replace(/href="\/scriptures/g, 'href="/utility/scriptures');

  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8');
    return true;
  }
  return false;
}

const files = walkHtml(ROOT);
let changed = 0;
for (const file of files) {
  if (stampFile(file)) {
    changed += 1;
    console.log(path.relative(ROOT, file));
  }
}
console.log(`Updated ${changed} HTML file(s).`);
