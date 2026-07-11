import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WA_SITE_VERSION, stampAssetUrl } from './site-version.mjs';
import { renderAnalyticsSnippet } from './site-analytics.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function loadCatalog() {
  const src = fs.readFileSync(path.join(root, 'assets/js/tools-data.js'), 'utf8');
  const body = src.replace(/^window\.WA_TOOLS_CATALOG\s*=\s*/, '').replace(/;\s*$/, '');
  return Function(`return ${body}`)();
}

const catalog = loadCatalog();

const skipSlugs = new Set(['torch', 'scriptures']);

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const FONT_SIZE_BOOT = `  <script>try{var s=localStorage.getItem('mytoolife-font-size');document.documentElement.setAttribute('data-font-size',s==='sm'||s==='lg'?s:'md')}catch(e){document.documentElement.setAttribute('data-font-size','md')}</script>`;
const A = (p) => stampAssetUrl(`../${p}`, WA_SITE_VERSION);

function renderPage({ title, subtitle, slug, categoryId }) {
  const selfHref = `${slug}.html`;
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
${renderAnalyticsSnippet()}
  <script src="${A('assets/js/prefs-boot.js')}"></script>
${FONT_SIZE_BOOT}
  <title>${escapeHtml(title)} - MyTooLife</title>
  <meta name="description" content="${escapeHtml(subtitle)}">
  <link href="${A('assets/img/favicon.png')}" rel="icon">
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="${A('assets/vendor/bootstrap/css/bootstrap.min.css')}" rel="stylesheet">
  <link href="${A('assets/vendor/bootstrap-icons/bootstrap-icons.css')}" rel="stylesheet">
  <link href="${A('assets/vendor/aos/aos.css')}" rel="stylesheet">
  <link href="${A('assets/css/main.css')}" rel="stylesheet">
</head>
<body class="tool-page">
  <header id="header" class="header sticky-top">
    <div class="branding d-flex align-items-center">
      <div class="container position-relative d-flex align-items-center justify-content-between">
        <a href="../index.html" class="logo d-flex align-items-center me-auto"><h1 class="sitename">MyTooLife</h1></a>
        <nav id="navmenu" class="navmenu">
          <ul>
            <li><a href="../index.html">工具首頁</a></li>
            <li><a href="${selfHref}" class="active">${escapeHtml(title)}</a></li>
          </ul>
          <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
        <a class="cta-btn d-none d-sm-block" href="../utility/settings.html">個人化設定</a>
      </div>
    </div>
  </header>
  <main class="main">
    <section class="tool-section section light-background">
      <div class="container" data-aos="fade-up">
        <div id="tool-app" class="tool-app" data-tool="${slug}"></div>
      </div>
    </section>
  </main>
  <footer id="footer" class="footer light-background">
    <div class="container copyright text-center py-4">
      <p data-wa-site-footer></p>
    </div>
  </footer>
  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <div id="preloader"></div>
  <script src="${A('assets/vendor/bootstrap/js/bootstrap.bundle.min.js')}" defer></script>
  <script src="${A('assets/vendor/aos/aos.js')}" defer></script>
  <script src="${A('assets/js/main.js')}"></script>
  <script src="${A('assets/js/tool-boot.js')}"></script>
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
    });
    fs.writeFileSync(file, html, 'utf8');
    const relTarget = `${category.id}/${tool.slug}.html`;
    fs.writeFileSync(path.join(root, `${tool.slug}.html`), redirectStub(relTarget), 'utf8');
    created += 1;
  }
}

console.log(`Generated ${created} tool pages under category folders${onlyNew ? ` (${skipped} skipped)` : ''}.`);
