export const SITE_URL = 'https://kawatool.com';
export const SITE_NAME = 'KaWaTool';
export const OG_IMAGE = `${SITE_URL}/assets/img/logo.png`;

export const TITLE_MIN = 45;
export const TITLE_MAX = 60;
export const DESC_MIN = 110;
export const DESC_MAX = 150;

export function pageUrl(relativePath) {
  if (!relativePath || relativePath === 'index.html' || relativePath === 'index') return `${SITE_URL}/`;
  const clean = String(relativePath).replace(/^\//, '').replace(/\.html$/i, '');
  return `${SITE_URL}/${clean}`;
}

export function clampText(text, min, max) {
  let s = String(text || '').replace(/\s+/g, ' ').trim();
  if (!s) return '';
  if (typeof max === 'number' && s.length > max) {
    s = `${s.slice(0, Math.max(1, max - 1)).trim()}…`;
  }
  return s;
}

/** Build a page title in the 45–60 character range:「頁面名稱 | KaWaTool」. */
export function normalizePageTitle(rawTitle) {
  const suffix = ` | ${SITE_NAME}`;
  let core = String(rawTitle || '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`, 'i'), '')
    .trim();
  if (!core) core = SITE_NAME;

  const expand = '｜免費線上工具，即開即用無需註冊';
  let title = `${core}${suffix}`;
  if (title.length >= TITLE_MIN && title.length <= TITLE_MAX) return title;
  if (title.length < TITLE_MIN) {
    title = `${core}${expand}${suffix}`;
  }
  if (title.length > TITLE_MAX) {
    const budget = TITLE_MAX - expand.length - suffix.length;
    if (budget >= 8) {
      core = core.slice(0, budget).trim();
      title = `${core}${expand}${suffix}`;
    }
    title = clampText(title, 0, TITLE_MAX);
  }
  if (title.length < TITLE_MIN) {
    title = clampText(`${core}${expand}・實用${suffix}`, 0, TITLE_MAX);
  }
  return title;
}

export function buildToolPageTitle(toolTitle) {
  return normalizePageTitle(toolTitle);
}

export function buildScripturePageTitle(bookTitle) {
  const suffix = ` | ${SITE_NAME}`;
  let title = `${bookTitle} - 藏經閣線上閱讀，免費誦讀經典${suffix}`;
  if (title.length < TITLE_MIN) {
    title = `${bookTitle} - 藏經閣線上閱讀，靜心祈福誦讀${suffix}`;
  }
  return normalizePageTitle(title.replace(new RegExp(`\\s*\\|\\s*${SITE_NAME}\\s*$`, 'i'), '').trim());
}

const SITE_DESC_PAD = 'KaWaTool 是免費線上工具與藏經閣平台，無需註冊、免下載，支援電腦與手機，打開即用，資料保留在您的裝置中更安全。';
const SITE_DESC_PAD_SHORT = '免安裝、免註冊，開啟瀏覽器即可使用，資料保留在本機更安心。';

export function buildPageDescription(base, extras = []) {
  const parts = [base, ...extras].filter(Boolean);
  let text = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (text.length < DESC_MIN) {
    text = `${text} ${SITE_DESC_PAD}`.replace(/\s+/g, ' ').trim();
  }
  if (text.length < DESC_MIN) {
    text = `${text} ${SITE_DESC_PAD_SHORT}`.replace(/\s+/g, ' ').trim();
  }
  if (text.length > DESC_MAX) {
    text = `${text.slice(0, DESC_MAX - 1).trim()}…`;
  }
  return text;
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
  hreflang = null,
}) {
  const safeTitle = escapeAttr(title);
  const safeDesc = escapeAttr(description);
  const url = pageUrl(path);
  const kw = keywords ? `\n  <meta name="keywords" content="${escapeAttr(keywords)}">` : '';
  let alt = '';
  if (hreflang && hreflang.zh && hreflang.en) {
    alt =
      `\n  <link rel="alternate" hreflang="zh-Hant" href="${hreflang.zh}">` +
      `\n  <link rel="alternate" hreflang="en" href="${hreflang.en}">` +
      `\n  <link rel="alternate" hreflang="x-default" href="${hreflang.zh}">`;
  }
  return `  <meta name="description" content="${safeDesc}">${kw}
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">${alt}
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
