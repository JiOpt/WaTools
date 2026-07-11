export const SITE_URL = 'https://mytoolife.com';
export const SITE_NAME = 'MyTooLife';
export const OG_IMAGE = `${SITE_URL}/assets/img/logo.png`;

const TITLE_MIN = 45;
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 150;

export function pageUrl(relativePath) {
  if (!relativePath || relativePath === 'index.html' || relativePath === 'index') return `${SITE_URL}/`;
  const clean = String(relativePath).replace(/^\//, '').replace(/\.html$/i, '');
  return `${SITE_URL}/${clean}`;
}

export function clampText(text, min, max) {
  let s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  if (s.length > max) {
    s = `${s.slice(0, Math.max(1, max - 1)).trim()}…`;
  }
  if (min && s.length < min) return s;
  return s;
}

export function buildToolPageTitle(toolTitle) {
  const suffix = ` | ${SITE_NAME}`;
  let title = `${toolTitle} - 免費線上工具，即開即用無需註冊${suffix}`;
  if (title.length < TITLE_MIN) {
    title = `${toolTitle} - MyTooLife 免費線上實用工具，打開就能用${suffix}`;
  }
  return clampText(title, TITLE_MIN, TITLE_MAX);
}

export function buildScripturePageTitle(bookTitle) {
  const suffix = ` | ${SITE_NAME}`;
  let title = `${bookTitle} - 藏經閣線上閱讀，免費誦讀經典${suffix}`;
  if (title.length < TITLE_MIN) {
    title = `${bookTitle} - MyTooLife 藏經閣線上閱讀，靜心祈福${suffix}`;
  }
  return clampText(title, TITLE_MIN, TITLE_MAX);
}

const SITE_DESC_PAD = 'MyTooLife 是免費線上工具與藏經閣平台，無需註冊、免下載，支援電腦與手機，打開即用，資料保留在您的裝置中更安全。';

export function buildPageDescription(base, extras = []) {
  const parts = [base, ...extras].filter(Boolean);
  let text = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < DESC_MIN) {
    text = `${text} ${SITE_DESC_PAD}`.replace(/\s+/g, ' ').trim();
  }
  return clampText(text, DESC_MIN, DESC_MAX);
}

export function buildToolKeywords(toolTitle, categoryName, slug) {
  return [toolTitle, categoryName, '線上工具', '免費工具', slug, SITE_NAME].filter(Boolean).join(',');
}

export function renderSeoMeta({
  title,
  description,
  path = '',
  type = 'website',
  keywords = '',
  image = OG_IMAGE,
}) {
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);
  const url = pageUrl(path);
  const kw = keywords ? `\n  <meta name="keywords" content="${escapeAttr(keywords)}">` : '';
  return `  <meta name="description" content="${safeDesc}">${kw}
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDesc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:locale" content="zh_TW">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDesc}">
  <meta name="twitter:image" content="${image}">`;
}

export function renderJsonLd(data) {
  const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  return `  <script type="application/ld+json">\n${json}\n  </script>`;
}

export function renderWebApplicationSchema({ name, description, url }) {
  return renderJsonLd({
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url: pageUrl(url),
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'TWD' },
    inLanguage: 'zh-Hant',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
  });
}

export function renderArticleSchema({ headline, description, url }) {
  return renderJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url: pageUrl(url),
    inLanguage: 'zh-Hant',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: `${SITE_URL}/` },
  });
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
