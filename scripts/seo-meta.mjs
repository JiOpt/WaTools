export const SITE_URL = 'https://watoolio.web.app';
export const SITE_NAME = 'WaWaTools';
export const OG_IMAGE = `${SITE_URL}/assets/img/logo.png`;

export function pageUrl(relativePath) {
  if (!relativePath || relativePath === 'index.html') return `${SITE_URL}/`;
  return `${SITE_URL}/${relativePath.replace(/^\//, '')}`;
}

export function renderSeoMeta({
  title,
  description,
  path = '',
  type = 'website',
  keywords = '',
  image = OG_IMAGE,
}) {
  const url = pageUrl(path);
  const kw = keywords ? `\n  <meta name="keywords" content="${escapeAttr(keywords)}">` : '';
  return `  <meta name="description" content="${escapeAttr(description)}">${kw}
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${SITE_NAME}">
  <meta property="og:title" content="${escapeAttr(title)}">
  <meta property="og:description" content="${escapeAttr(description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">
  <meta property="og:locale" content="zh_TW">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${escapeAttr(title)}">
  <meta name="twitter:description" content="${escapeAttr(description)}">
  <meta name="twitter:image" content="${image}">`;
}

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}
