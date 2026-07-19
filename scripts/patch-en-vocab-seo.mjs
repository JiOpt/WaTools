/**
 * Patch EN vocab shells from copied ZH pages.
 * Run: node scripts/patch-en-vocab-seo.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { EN_TOOLS } from './en-catalog.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://kawatool.com';
const VER = '0.6.39';

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function patch(catId, slug) {
  const en = EN_TOOLS[slug];
  if (!en) throw new Error('missing EN_TOOLS.' + slug);
  const rel = path.join('en', catId, `${slug}.html`);
  let src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const titleEn = en.title;
  const pageTitle = `${titleEn} | KaWaTool`;
  const description = en.desc.length > 160 ? `${en.desc.slice(0, 159).trim()}…` : en.desc;
  const keywords = en.keywords || `${titleEn},online tool,free,KaWaTool`;
  const seoLead = en.seoLead || en.desc;
  const enPath = `/en/${catId}/${slug}`;
  const zhPath = `/${catId}/${slug}`;

  src = src.replace(/(src|href)="\.\.\/assets\//g, '$1="../../assets/');
  src = src.replace(/lang="zh-Hant"/, 'lang="en" data-locale="en"');
  src = src.replace(
    /family=Noto\+Sans\+TC:wght@400;500;600;700/,
    'family=Noto+Sans:wght@400;500;600;700'
  );
  src = src.replace(/<title>[^<]*<\/title>/, `<title>${esc(pageTitle)}</title>`);
  src = src.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${esc(description)}">`
  );
  src = src.replace(
    /<meta name="keywords" content="[^"]*">/,
    `<meta name="keywords" content="${esc(keywords)}">`
  );
  src = src.replace(
    /<link rel="canonical" href="[^"]*">/,
    `<link rel="canonical" href="${SITE}${enPath}">`
  );
  src = src.replace(
    /<link rel="alternate" hreflang="zh-Hant" href="[^"]*">/,
    `<link rel="alternate" hreflang="zh-Hant" href="${SITE}${zhPath}">`
  );
  src = src.replace(
    /<link rel="alternate" hreflang="en" href="[^"]*">/,
    `<link rel="alternate" hreflang="en" href="${SITE}${enPath}">`
  );
  src = src.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*">/,
    `<link rel="alternate" hreflang="x-default" href="${SITE}${zhPath}">`
  );
  src = src.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(pageTitle)}">`);
  src = src.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  src = src.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${SITE}${enPath}">`);
  src = src.replace(/<meta property="og:locale" content="[^"]*">/, `<meta property="og:locale" content="en_US">`);
  if (!src.includes('og:locale:alternate')) {
    src = src.replace(
      /<meta property="og:locale" content="en_US">/,
      `<meta property="og:locale" content="en_US">\n  <meta property="og:locale:alternate" content="zh_TW">`
    );
  }
  src = src.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(pageTitle)}">`);
  src = src.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(description)}">`);

  src = src.replace(/"name":\s*"[^"]*"/, `"name": ${JSON.stringify(titleEn)}`);
  src = src.replace(/"description":\s*"[^"]*"/, `"description": ${JSON.stringify(description)}`);
  src = src.replace(/"url":\s*"https:\/\/kawatool\.com\/[^"]*"/, `"url": "${SITE}${enPath}"`);
  src = src.replace(/"inLanguage":\s*"[^"]*"/, `"inLanguage": "en"`);
  src = src.replace(/"url":\s*"https:\/\/kawatool\.com\/"/, `"url": "${SITE}/en"`);

  src = src.replace(/aria-label="KaWaTool[^"]*"/, 'aria-label="KaWaTool home"');
  src = src.replace(/href="\.\.\/index\.html"/g, 'href="/en"');
  src = src.replace(/href="\/"/g, 'href="/en"');
  src = src.replace(/href="\/utility\/settings"/g, 'href="/en/utility/settings"');
  src = src.replace(/>設定</g, '>Settings<');
  src = src.replace(/工具首頁/g, 'Tools home');
  src = src.replace(/aria-label="頁面導覽"/, 'aria-label="Page navigation"');
  src = src.replace(/aria-label="開啟選單"/, 'aria-label="Open menu"');
  src = src.replace(/aria-label="工具頁標題"/, 'aria-label="Tool page title"');
  src = src.replace(/aria-label="回到頂部"/, 'aria-label="Back to top"');
  src = src.replace(
    /<span class="site-logo-text-full">[^<]*<\/span>/,
    '<span class="site-logo-text-full">KaWaTool</span>'
  );
  src = src.replace(
    /(<h1 class="tool-page-bar-title"[^>]*>)[^<]*(<\/h1>)/,
    `$1${titleEn}$2`
  );
  src = src.replace(
    /<p class="tool-seo-lead">[\s\S]*?<\/p>/,
    `<p class="tool-seo-lead">${esc(seoLead)}</p>`
  );
  src = src.replace(
    /(<a href="[^"]*" class="active"[^>]*>)[^<]*(<\/a>)/,
    `$1${titleEn}$2`
  );

  if (!src.includes('i18n-en.js')) {
    src = src.replace(
      /(<script src="\.\.\/\.\.\/assets\/js\/main\.js[^"]*"><\/script>)/,
      `<script src="../../assets/js/i18n-en.js?v=${VER}" defer></script>\n  <script src="../../assets/js/locale.js?v=${VER}" defer></script>\n  $1`
    );
  }

  fs.writeFileSync(path.join(ROOT, rel), src, 'utf8');
  console.log('patched', rel, 'title=', pageTitle);
}

patch('toeic', 'toeic-vocab');
patch('toefl', 'toefl-vocab');
