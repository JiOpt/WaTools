/**
 * Generate English locale shells under /en/
 * - en/index.html
 * - en/privacy.html, en/disclaimer.html
 * - en/utility/settings.html
 * - en/viral/*.html (chrome + same tool mount; UI may still be zh)
 *
 * Run: node scripts/gen-en-shells.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const VER = '0.6.39';
const SITE = 'https://kawatool.com';

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}

function write(rel, content) {
  const abs = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content, 'utf8');
  console.log('wrote', rel);
}

function assetPrefix(depth) {
  return '../'.repeat(depth);
}

function loadViralSlugs() {
  const src = read('assets/js/tools-data.js');
  const start = src.indexOf('"id": "viral"');
  if (start < 0) throw new Error('viral category not found');
  const rest = src.slice(start);
  const nextCat = rest.search(/\n  \{\s*\n\s*"id": "/);
  const block = nextCat > 0 ? rest.slice(0, nextCat) : rest.slice(0, 20000);
  const slugs = [...block.matchAll(/"slug":\s*"([^"]+)"/g)].map((x) => x[1]);
  if (!slugs.length) throw new Error('No viral slugs found');
  return slugs;
}

function attrEsc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function jsonEsc(s) {
  return JSON.stringify(String(s)).slice(1, -1);
}

async function loadEnCatalog() {
  const mod = await import('./en-catalog.mjs');
  return mod.EN_TOOLS;
}

function hreflang(zhPath, enPath) {
  return [
    `<link rel="alternate" hreflang="zh-Hant" href="${SITE}${zhPath}">`,
    `<link rel="alternate" hreflang="en" href="${SITE}${enPath}">`,
    `<link rel="alternate" hreflang="x-default" href="${SITE}${zhPath}">`,
  ].join('\n  ');
}

function shellHead({
  depth,
  title,
  description,
  canonicalPath,
  zhPath,
  keywords = 'KaWaTool,online tools,free tools',
  jsonLd,
}) {
  const ap = assetPrefix(depth);
  const enPath = canonicalPath.startsWith('/en') ? canonicalPath : `/en${canonicalPath === '/' ? '' : canonicalPath}`;
  const zh = zhPath || canonicalPath.replace(/^\/en/, '') || '/';
  return `<!DOCTYPE html>
<html lang="en" data-locale="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-F5WQ4D7R9S"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-F5WQ4D7R9S');
  </script>
  <script src="${ap}assets/js/prefs-boot.js?v=${VER}"></script>
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${SITE}${enPath}">
  ${hreflang(zh === '/' ? '/' : zh, enPath)}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="KaWaTool">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE}${enPath}">
  <meta property="og:image" content="${SITE}/assets/img/logo.png">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="zh_TW">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${SITE}/assets/img/logo.png">
  ${jsonLd || ''}
  <link href="${ap}assets/img/favicon.png?v=${VER}" rel="icon">
  <link href="https://fonts.googleapis.com" rel="preconnect">
  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="${ap}assets/vendor/bootstrap/css/bootstrap.min.css?v=${VER}" rel="stylesheet">
  <link href="${ap}assets/vendor/bootstrap-icons/bootstrap-icons.css?v=${VER}" rel="stylesheet">
  <link href="${ap}assets/vendor/aos/aos.css?v=${VER}" rel="stylesheet">
  <link href="${ap}assets/css/main.css?v=${VER}" rel="stylesheet">
</head>`;
}

function header(depth, { homeHref = '/en', settingsHref = '/en/utility/settings', logoAria = 'KaWaTool home' } = {}) {
  const ap = assetPrefix(depth);
  return `  <header id="header" class="header sticky-top">
    <div class="branding d-flex align-items-center">
      <div class="container position-relative d-flex align-items-center justify-content-between">
        <a href="${homeHref}" class="logo d-flex align-items-center me-auto" aria-label="${logoAria}">
          <span class="site-logo-frame" aria-hidden="true"><img src="${ap}assets/img/logo.jpg?v=${VER}" alt="" class="site-logo" width="136" height="136" decoding="async"></span><span class="site-logo-text"><span class="site-logo-text-full">KaWaTool</span><span class="site-logo-text-short">KaWaTool</span></span>
        </a>
        <nav id="navmenu" class="navmenu">
          <ul></ul>
          <i class="mobile-nav-toggle d-xl-none bi bi-list"></i>
        </nav>
        <a class="cta-btn" href="${settingsHref}">Settings</a>
      </div>
    </div>
  </header>`;
}

function footer() {
  return `  <footer id="footer" class="footer light-background">
    <div class="container copyright text-center py-4">
      <p data-wa-site-footer></p>
    </div>
  </footer>

  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
  <div id="preloader"></div>`;
}

function commonScripts(depth, extra = []) {
  const ap = assetPrefix(depth);
  const base = [
    `assets/vendor/bootstrap/js/bootstrap.bundle.min.js`,
    `assets/vendor/aos/aos.js`,
    `assets/js/i18n-en.js`,
    `assets/js/locale.js`,
    `assets/js/tools-data.js`,
    `assets/js/tool-urls.js`,
    `assets/js/sitemap-published.js`,
    `assets/js/sitemap-manifest.js`,
    ...extra,
    `assets/js/site-sitemap.js`,
    `assets/js/main.js`,
  ];
  return base
    .map((p, i) => {
      const defer = p.includes('main.js') ? '' : ' defer';
      // main.js intentionally without defer (matches zh pages)
      if (p.includes('main.js')) return `  <script src="${ap}${p}?v=${VER}"></script>`;
      return `  <script src="${ap}${p}?v=${VER}"${defer}></script>`;
    })
    .join('\n');
}

function genIndex() {
  const title = 'KaWaTool - Free Online Tools';
  const description = 'Mortgage calculators, creator tools, quizzes, and everyday utilities — open in the browser, no install.';
  const jsonLd = `<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "KaWaTool",
    "url": "${SITE}/en",
    "description": "${description}",
    "inLanguage": "en"
  }
  </script>`;
  const html = `${shellHead({
    depth: 1,
    title,
    description,
    canonicalPath: '/en',
    zhPath: '/',
    jsonLd,
  })}
<body class="index-page tool-page">
${header(1)}
  <main class="main">
    <div id="tools-catalog"></div>
  </main>
${footer()}
${commonScripts(1, ['assets/js/scriptures-catalog.js', 'assets/js/catalog-render.js'])}
</body>
</html>
`;
  write('en/index.html', html);
}

function genLegal(kind) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy
    ? 'Privacy Policy | Cookies & Ads | KaWaTool'
    : 'Disclaimer | Entertainment & Finance Tools | KaWaTool';
  const description = isPrivacy
    ? 'How KaWaTool uses cookies, Google Analytics, AdSense, and data when you use tools on this site.'
    : 'KaWaTool fortune, spiritual, and finance calculators are for entertainment and reference only — not legal or professional advice.';
  const h1 = isPrivacy ? 'Privacy Policy' : 'Disclaimer';
  const lead = isPrivacy
    ? 'How this site uses cookies, analytics, and ads — and how you can manage preferences.'
    : 'Tool results are for entertainment and general reference only, not legal, investment, or other professional advice.';

  const body = isPrivacy
    ? `
          <p class="legal-doc-meta">Last updated: July 2026 · Site: <a href="${SITE}/en">kawatool.com/en</a> (“we”, “this site”).</p>
          <p class="text-muted">${'English legal text. If wording differs, the Chinese version remains authoritative.'}</p>
          <section class="legal-section">
            <h2>1. Purpose</h2>
            <p>KaWaTool provides free online tools and content. To operate the site, understand usage, and (if enabled) serve Google AdSense ads, we may use cookies and similar technologies. This page explains what we collect, why, and your choices.</p>
            <p>By using this site you acknowledge this policy. If you disagree, please stop using the site or disable cookies / ad personalization in your browser.</p>
          </section>
          <section class="legal-section">
            <h2>2. Information we may process</h2>
            <h3>2.1 Information you provide</h3>
            <p>For example name, email, and message content via the <a href="/en/contact">Contact</a> form — used only to reply or handle your request.</p>
            <h3>2.2 Tool usage data (mostly on your device)</h3>
            <p>Most tools run in the browser. We usually do not upload the text, images, or files you enter. Preferences (such as font size) may be stored in your device <code>localStorage</code> and do not create a personally identifiable account profile.</p>
            <h3>2.3 Technical data</h3>
            <p>Servers or third parties may log IP address, browser type, device/OS summary, referrer, pages visited, and timestamps for security, debugging, and traffic statistics.</p>
          </section>
          <section class="legal-section">
            <h2>3. Cookies & similar technologies</h2>
            <ul>
              <li><strong>Essential / functional</strong>: basic browsing and display preferences.</li>
              <li><strong>Analytics</strong>: understand popular pages (e.g. Google Analytics).</li>
              <li><strong>Advertising</strong>: if AdSense is enabled, cookies may show ads, limit frequency, or personalize ads.</li>
            </ul>
            <p>You can delete or block cookies in your browser; some features or ad experiences may be affected.</p>
          </section>
          <section class="legal-section">
            <h2>4. Contact</h2>
            <p>Questions about privacy: use <a href="/en/contact">Contact</a>.</p>
          </section>`
    : `
          <p class="legal-doc-meta">Last updated: July 2026 · Site: <a href="${SITE}/en">kawatool.com/en</a>.</p>
          <p class="text-muted">${'English legal text. If wording differs, the Chinese version remains authoritative.'}</p>
          <section class="legal-section">
            <h2>1. General</h2>
            <p>KaWaTool provides tools and content “as is”. We try to keep them accurate, but <strong>do not guarantee</strong> that any tool, number, rate, copy, or third-party data is always correct, timely, complete, or suitable for your purpose.</p>
            <p><strong>All calculations, quiz results, and entertainment content are for entertainment and general reference only. They have no legal effect and are not professional investment, tax, accounting, insurance, medical, religious, or legal advice.</strong> For important decisions, consult qualified professionals and rely on official notices, contracts, and financial institution terms.</p>
          </section>
          <section class="legal-section">
            <h2>2. Finance & calculators</h2>
            <p>Mortgage, tax, insurance, overtime, and similar estimators use simplified assumptions. Banks, tax offices, and employers may use different rules. Results are not loan offers or tax filings.</p>
          </section>
          <section class="legal-section">
            <h2>3. Entertainment content</h2>
            <p>Fortune sticks, personality quizzes, and similar features are entertainment. Do not treat them as destiny, diagnosis, or professional counseling.</p>
          </section>
          <section class="legal-section">
            <h2>4. Contact</h2>
            <p>Questions: <a href="/en/contact">Contact</a>. Chinese disclaimer: <a href="/disclaimer">/disclaimer</a>.</p>
          </section>`;

  const html = `${shellHead({
    depth: 1,
    title,
    description,
    canonicalPath: `/en/${kind}`,
    zhPath: `/${kind}`,
  })}
<body class="tool-page legal-page">
${header(1)}
  <main class="main">
    <div class="page-title" data-aos="fade">
      <div class="heading">
        <div class="container">
          <div class="row d-flex justify-content-center text-center">
            <div class="col-lg-8">
              <h1>${h1}</h1>
              <p class="mb-0">${lead}</p>
            </div>
          </div>
        </div>
      </div>
      <nav class="breadcrumbs">
        <div class="container">
          <ol>
            <li><a href="/en">Home</a></li>
            <li class="current">${h1}</li>
          </ol>
        </div>
      </nav>
    </div>
    <section class="tool-section section light-background">
      <div class="container" data-aos="fade-up">
        <article class="legal-doc">${body}
        </article>
      </div>
    </section>
  </main>
${footer()}
${commonScripts(1)}
</body>
</html>
`;
  write(`en/${kind}.html`, html);
}

function genSettings() {
  const title = 'Settings | KaWaTool';
  const description = 'Language, dark mode, font size, eye comfort, zoom, and accessibility preferences.';
  const html = `${shellHead({
    depth: 2,
    title,
    description,
    canonicalPath: '/en/utility/settings',
    zhPath: '/utility/settings',
    keywords: 'settings,preferences,KaWaTool',
  })}
<body class="tool-page">
${header(2)}
  <main class="main">
    <section class="tool-section section light-background" aria-labelledby="tool-page-title">
      <div class="container" data-aos="fade-up">
        <header class="tool-page-bar" aria-label="Settings">
          <h1 class="tool-page-bar-title" id="tool-page-title">Settings</h1>
        </header>
        <div id="tool-app" class="tool-app" data-tool="settings"></div>
      </div>
    </section>
  </main>
${footer()}
${commonScripts(2)}
</body>
</html>
`;
  write('en/utility/settings.html', html);
}

function loadCatalogTools() {
  const src = read('assets/js/tools-data.js');
  const fn = new Function(`${src.replace('window.WA_TOOLS_CATALOG', 'var WA_TOOLS_CATALOG')}; return WA_TOOLS_CATALOG;`);
  const catalog = fn();
  const list = [];
  for (const cat of catalog) {
    for (const t of cat.tools || []) {
      list.push({ catId: cat.id, slug: t.slug, title: t.title });
    }
  }
  return list;
}

function genToolShell(catId, slug, en) {
  const zhFile = path.join(ROOT, catId, `${slug}.html`);
  if (!fs.existsSync(zhFile)) {
    console.warn('skip missing zh page', catId, slug);
    return false;
  }
  let src = fs.readFileSync(zhFile, 'utf8');
  const titleEn = en?.title || slug;
  const descEn =
    en?.desc ||
    `${titleEn} — free online tool on KaWaTool. Runs in your browser; no install.`;
  const pageTitle = `${titleEn} | KaWaTool`;
  const description =
    descEn.length >= 110
      ? descEn.length > 160
        ? `${descEn.slice(0, 159).trim()}…`
        : descEn
      : `${descEn} Free online tool — open in the browser, no install.`;
  const keywords = en?.keywords || `${titleEn},online tool,free,KaWaTool`;
  const seoLeadEn = en?.seoLead || descEn;
  const assetUp = '../../';
  const enPath = `/en/${catId}/${slug}`;
  const zhPath = `/${catId}/${slug}`;

  // Asset depth: category pages use ../assets → en needs ../../assets
  src = src.replace(/(src|href)="\.\.\/assets\//g, `$1="${assetUp}assets/`);
  src = src.replace(/(src|href)="\.\.\/\.\.\/assets\//g, `$1="${assetUp}assets/`);
  src = src.replace(/lang="zh-Hant"/, 'lang="en" data-locale="en"');

  // Prefer Latin font stack on EN shells
  src = src.replace(
    /family=Noto\+Sans\+TC:wght@400;500;600;700/,
    'family=Noto+Sans:wght@400;500;600;700'
  );

  src = src.replace(/<title>[^<]*<\/title>/, `<title>${attrEsc(pageTitle)}</title>`);
  src = src.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${attrEsc(description)}">`
  );
  src = src.replace(
    /<meta name="keywords" content="[^"]*">/,
    `<meta name="keywords" content="${attrEsc(keywords)}">`
  );

  const canonBlock = `<link rel="canonical" href="${SITE}${enPath}">\n  ${hreflang(zhPath, enPath)}`;
  if (src.includes('hreflang="en"')) {
    src = src.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${SITE}${enPath}">`);
    src = src.replace(/<link rel="alternate" hreflang="zh-Hant"[^>]*>\s*/g, '');
    src = src.replace(/<link rel="alternate" hreflang="en"[^>]*>\s*/g, '');
    src = src.replace(/<link rel="alternate" hreflang="x-default"[^>]*>\s*/g, '');
    src = src.replace(/<link rel="canonical" href="[^"]*">/, canonBlock);
  } else {
    src = src.replace(/<link rel="canonical" href="[^"]*">/, canonBlock);
  }

  src = src.replace(
    /<meta property="og:title" content="[^"]*">/,
    `<meta property="og:title" content="${attrEsc(pageTitle)}">`
  );
  src = src.replace(
    /<meta property="og:description" content="[^"]*">/,
    `<meta property="og:description" content="${attrEsc(description)}">`
  );
  src = src.replace(/og:url" content="[^"]*"/, `og:url" content="${SITE}${enPath}"`);
  src = src.replace(/og:locale" content="zh_TW"/, 'og:locale" content="en_US"');
  if (!src.includes('og:locale:alternate')) {
    src = src.replace(
      /(<meta property="og:locale" content="en_US">)/,
      `$1\n  <meta property="og:locale:alternate" content="zh_TW">`
    );
  }

  src = src.replace(
    /<meta name="twitter:title" content="[^"]*">/,
    `<meta name="twitter:title" content="${attrEsc(pageTitle)}">`
  );
  src = src.replace(
    /<meta name="twitter:description" content="[^"]*">/,
    `<meta name="twitter:description" content="${attrEsc(description)}">`
  );

  // Inject OG / Twitter / JSON-LD when the zh source omits them (e.g. torch)
  if (!/property="og:title"/.test(src)) {
    const social = `  <meta property="og:type" content="website">
  <meta property="og:site_name" content="KaWaTool">
  <meta property="og:title" content="${attrEsc(pageTitle)}">
  <meta property="og:description" content="${attrEsc(description)}">
  <meta property="og:url" content="${SITE}${enPath}">
  <meta property="og:image" content="${SITE}/assets/img/logo.png">
  <meta property="og:locale" content="en_US">
  <meta property="og:locale:alternate" content="zh_TW">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${attrEsc(pageTitle)}">
  <meta name="twitter:description" content="${attrEsc(description)}">
  <meta name="twitter:image" content="${SITE}/assets/img/logo.png">
  <script type="application/ld+json">
${JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: titleEn,
    description,
    url: `${SITE}${enPath}`,
    inLanguage: 'en',
    isPartOf: { '@type': 'WebSite', name: 'KaWaTool', url: `${SITE}/en` },
  },
  null,
  2
)}
  </script>
`;
    src = src.replace(/<\/head>/, `${social}</head>`);
  } else {
    // JSON-LD: rewrite name / description / url / inLanguage / isPartOf.url
    src = src.replace(
      /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,
      (full, open, body, close) => {
        try {
          const data = JSON.parse(body);
          data.name = titleEn;
          data.description = description;
          data.url = `${SITE}${enPath}`;
          data.inLanguage = 'en';
          if (data.isPartOf && typeof data.isPartOf === 'object') {
            data.isPartOf.url = `${SITE}/en`;
          }
          return `${open}\n${JSON.stringify(data, null, 2)}\n  ${close}`;
        } catch {
          let patched = body
            .replace(/"name":\s*"[^"]*"/, `"name": "${jsonEsc(titleEn)}"`)
            .replace(/"description":\s*"[^"]*"/, `"description": "${jsonEsc(description)}"`)
            .replace(/"inLanguage":\s*"[^"]*"/, '"inLanguage": "en"')
            .replace(
              new RegExp(
                `"url":\\s*"https://kawatool\\.com/${catId}/${slug.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}"`
              ),
              `"url": "${SITE}${enPath}"`
            );
          return `${open}${patched}${close}`;
        }
      }
    );
  }

  // Chrome / nav
  src = src.replace(/href="\/"/g, 'href="/en"');
  src = src.replace(/href="\/utility\/settings"/g, 'href="/en/utility/settings"');
  src = src.replace(/href="\.\.\/index\.html"/g, 'href="/en"');
  src = src.replace(/>設定</g, '>Settings<');
  src = src.replace(/>工具首頁</g, '>Tools home<');
  src = src.replace(/aria-label="[^"]*首頁"/, 'aria-label="KaWaTool home"');
  src = src.replace(/aria-label="頁面導覽"/, 'aria-label="Page navigation"');
  src = src.replace(/aria-label="開啟選單"/, 'aria-label="Open menu"');
  src = src.replace(/aria-label="工具頁標題"/, 'aria-label="Tool page title"');
  src = src.replace(/aria-label="回到頂部"/, 'aria-label="Back to top"');
  src = src.replace(
    /<span class="site-logo-text-full">[^<]*<\/span>/,
    '<span class="site-logo-text-full">KaWaTool</span>'
  );
  // Prefer tool-page-bar h1; else first page h1 (scriptures / torch layout)
  if (/tool-page-bar-title/.test(src)) {
    src = src.replace(
      /(<h1 class="tool-page-bar-title"[^>]*>)[^<]*(<\/h1>)/,
      `$1${titleEn}$2`
    );
  } else {
    src = src.replace(/<h1>[^<]*<\/h1>/, `<h1>${titleEn}</h1>`);
  }
  if (/tool-seo-lead/.test(src)) {
    src = src.replace(
      /<p class="tool-seo-lead">[\s\S]*?<\/p>/,
      `<p class="tool-seo-lead">${attrEsc(seoLeadEn)}</p>`
    );
  }
  src = src.replace(
    /(<div class="page-title"[\s\S]*?<h1>[^<]*<\/h1>\s*<p class="mb-0">)[^<]*(<\/p>)/,
    `$1${descEn}$2`
  );
  src = src.replace(/<li class="current">[^<]*<\/li>/, `<li class="current">${titleEn}</li>`);
  // Active nav tool label
  src = src.replace(
    /(<a href="[^"]*" class="active"[^>]*>)[^<]*(<\/a>)/,
    `$1${titleEn}$2`
  );
  // Keep category absolute links under /en/
  src = src.replace(/href="\/(?!en\/)([a-z0-9-]+\/)/g, 'href="/en/$1');

  if (slug === 'torch') {
    const torchMap = [
      ['手電筒已關閉', 'Torch is off'],
      ['暖機中，別急著找插座…', 'Warming up — hang tight…'],
      ['開啟手電筒', 'Turn on'],
      ['關閉手電筒', 'Turn off'],
      ['閃爍', 'Blink'],
      ['螢幕常亮', 'Keep screen awake'],
      ['小提醒', 'Tips'],
      [
        '手機要有閃光燈才夠亮；沒有的話螢幕也能照路，就是比較像舉著一塊發光的餅乾。',
        'A camera flash is brightest; without one, the screen still works — like holding a glowing cookie.',
      ],
      ['相機權限', 'Camera permission'],
      ['進入頁面時瀏覽器會詢問相機權限，請按「允許」。', 'When prompted, allow camera access.'],
      [
        '按錯了？點網址列左側的鎖頭圖示，把相機改為允許後再進一次本頁。',
        'Denied by mistake? Open the lock icon in the address bar, allow the camera, then reload.',
      ],
      ['沒閃光燈也沒關係，螢幕白光會自動補位。', 'No flash? Full-screen white light fills in automatically.'],
      ['開啟', 'On'],
      ['持續照明，適合找鑰匙、找貓、找勇氣。', 'steady light for keys, cats, and courage.'],
      ['亮一下、暗一下；再按一次，或按關閉，就能停。', 'on/off pulse; press again or Turn off to stop.'],
      ['沒閃光燈', 'No flash'],
      ['全螢幕白光自動補位，請勿長時間直視（會懷疑人生）。', 'full-screen white fills in — avoid staring too long.'],
    ];
    for (const [zh, en] of torchMap) src = src.split(zh).join(en);
  }

  if (!src.includes('locale.js')) {
    src = src.replace(
      /(<script src="[^"]*main\.js[^"]*"[^>]*><\/script>)/,
      `<script src="${assetUp}assets/js/i18n-en.js?v=${VER}" defer></script>\n  <script src="${assetUp}assets/js/locale.js?v=${VER}" defer></script>\n  $1`
    );
  } else if (!src.includes('i18n-en.js')) {
    src = src.replace(
      /(<script src="[^"]*locale\.js[^"]*"[^>]*><\/script>)/,
      `<script src="${assetUp}assets/js/i18n-en.js?v=${VER}" defer></script>\n  $1`
    );
  }

  write(`en/${catId}/${slug}.html`, src);
  return true;
}

function patchZhHreflang() {
  const patches = [
    { file: 'index.html', zh: '/', en: '/en' },
    { file: 'privacy.html', zh: '/privacy', en: '/en/privacy' },
    { file: 'disclaimer.html', zh: '/disclaimer', en: '/en/disclaimer' },
  ];
  for (const p of patches) {
    const abs = path.join(ROOT, p.file);
    if (!fs.existsSync(abs)) continue;
    let html = fs.readFileSync(abs, 'utf8');
    if (html.includes('hreflang="en"')) continue;
    const tag = hreflang(p.zh, p.en);
    html = html.replace(/<link rel="canonical" href="[^"]*">/, (m) => `${m}\n  ${tag}`);
    fs.writeFileSync(abs, html, 'utf8');
    console.log('hreflang', p.file);
  }
}

function patchZhIndexScripts() {
  const abs = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(abs, 'utf8');
  if (!html.includes('locale.js')) {
    html = html.replace(
      /<script src="assets\/js\/tool-urls\.js[^"]*"[^>]*><\/script>/,
      `<script src="assets/js/i18n-en.js?v=${VER}" defer></script>\n  <script src="assets/js/locale.js?v=${VER}" defer></script>\n  <script src="assets/js/tool-urls.js?v=${VER}" defer></script>`
    );
    fs.writeFileSync(abs, html, 'utf8');
    console.log('patched index.html scripts');
  }
}

async function main() {
  genIndex();
  genLegal('privacy');
  genLegal('disclaimer');
  genSettings();
  const enMap = await loadEnCatalog();
  const list = loadCatalogTools();
  let ok = 0;
  let skip = 0;
  let missing = 0;
  for (const item of list) {
    const en = enMap[item.slug];
    if (!en) {
      console.warn('no EN map for', item.slug);
      missing += 1;
    }
    if (genToolShell(item.catId, item.slug, en || { title: item.slug, desc: '' })) ok += 1;
    else skip += 1;
  }
  console.log('en tool shells', ok, 'skipped', skip, 'missing map', missing);
  patchZhHreflang();
  patchZhIndexScripts();
  console.log('done');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
