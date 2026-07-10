/** Bump this when JS/CSS changes should reach cached clients. */
export const WA_SITE_VERSION = '0.4';

export function assetQuery(version = WA_SITE_VERSION) {
  return `?v=${version}`;
}

export function stampAssetUrl(url, version = WA_SITE_VERSION) {
  if (!url || !url.includes('assets/') || url.startsWith('http')) return url;
  const base = url.split('?')[0];
  return `${base}?v=${version}`;
}
