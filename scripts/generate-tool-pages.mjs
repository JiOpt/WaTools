import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  escapeHtml,
  renderBodyScripts,
  renderFooterShell,
  renderHeadCore,
  renderHeadOpen,
  renderHeader,
  renderPageChrome,
  renderToolMain,
} from './layout-shell.mjs';
import {
  buildPageDescription,
  buildToolKeywords,
  normalizePageTitle,
  renderSeoMeta,
  renderWebApplicationSchema,
} from './seo-meta.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const PAGE_DEPTH = 1;

function loadCatalog() {
  const src = fs.readFileSync(path.join(root, 'assets/js/tools-data.js'), 'utf8');
  const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

const catalog = loadCatalog();

const skipSlugs = new Set(['torch', 'scriptures']);

function renderPage({ title, subtitle, slug, categoryId, categoryName, seoTitle, seoDescription, seoKeywords }) {
  const selfHref = `${slug}.html`;
  const pagePath = `${categoryId}/${slug}.html`;
  const pageTitle = normalizePageTitle(seoTitle || title);
  const description = seoDescription
    ? buildPageDescription(seoDescription)
    : buildPageDescription(subtitle, [`${title}線上工具，${categoryName}分類。`]);
  const keywords = seoKeywords || buildToolKeywords(title, categoryName, slug);

  return `${renderHeadOpen()}
${renderHeadCore({ depth: PAGE_DEPTH })}
  <title>${escapeHtml(pageTitle)}</title>
${renderSeoMeta({
    title: pageTitle,
    description,
    path: pagePath,
    type: 'website',
    keywords,
  })}
${renderWebApplicationSchema({ name: title, description, url: pagePath })}
</head>
<body class="tool-page">
${renderHeader({
    depth: PAGE_DEPTH,
    navItems: [
      { href: '../index.html', label: '工具首頁' },
      { href: selfHref, label: title, active: true, ariaCurrent: true },
    ],
  })}
${renderToolMain({ title, slug })}
${renderFooterShell()}
${renderPageChrome()}
${renderBodyScripts({ depth: PAGE_DEPTH, extraScripts: ['assets/js/tool-boot.js'] })}
</body>
</html>`;
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
</html>`;
}

let created = 0;
let skipped = 0;
const onlyNew = process.argv.includes('--only-new');
const forceSlugs = process.argv
  .find((a) => a.startsWith('--slugs='))
  ?.slice('--slugs='.length)
  .split(',')
  .filter(Boolean);
const slugFilter = forceSlugs?.length ? new Set(forceSlugs) : null;

for (const category of catalog) {
  for (const tool of category.tools) {
    if (skipSlugs.has(tool.slug)) continue;
    if (slugFilter && !slugFilter.has(tool.slug)) continue;
    const dir = path.join(root, category.id);
    const file = path.join(dir, `${tool.slug}.html`);
    if (onlyNew && fs.existsSync(file) && !slugFilter) {
      skipped += 1;
      continue;
    }
    fs.mkdirSync(dir, { recursive: true });
    const html = renderPage({
      title: tool.title,
      subtitle: tool.desc,
      slug: tool.slug,
      categoryId: category.id,
      categoryName: category.name,
      seoTitle: tool.seoTitle,
      seoDescription: tool.seoDescription,
      seoKeywords: tool.seoKeywords,
    });
    fs.writeFileSync(file, html, 'utf8');
    const relTarget = `${category.id}/${tool.slug}.html`;
    fs.writeFileSync(path.join(root, `${tool.slug}.html`), redirectStub(relTarget), 'utf8');
    created += 1;
  }
}

console.log(`Generated ${created} tool pages under category folders${onlyNew ? ` (${skipped} skipped)` : ''}.`);
