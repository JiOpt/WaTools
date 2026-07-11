/**
 * 全站版本號（唯一來源）。
 *
 * 規則：
 * - 上市前維持 0.6.x，只遞增第三位：0.6.1 → 0.6.2 → 0.6.3 …
 * - 正式上線改 1.0
 * - 變更後執行：node scripts/stamp-asset-version.mjs
 *
 * 請勿由工具自動跳號；每次發佈前由使用者指定版本。
 */
export const WA_SITE_VERSION = '0.6.43';

export function assetQuery(version = WA_SITE_VERSION) {
  return `?v=${version}`;
}

export function stampAssetUrl(url, version = WA_SITE_VERSION) {
  if (!url || !url.includes('assets/') || url.startsWith('http')) return url;
  const base = url.split('?')[0];
  return `${base}?v=${version}`;
}
