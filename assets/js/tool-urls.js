/**
 * Hierarchical tool URLs: /{categoryId}/{slug} (no .html; Firebase cleanUrls)
 * Requires WA_TOOLS_CATALOG (build map on first use).
 */
(function () {
  'use strict';

  if (window.WA_TOOL_URLS?.__installed) return;

  const ROOT_SLUGS = new Set([
    'index',
    'index_plan',
    'copyright',
    'contact',
    'starter-page',
  ]);

  let slugToCategory = null;

  function buildMap() {
    if (slugToCategory) return slugToCategory;
    slugToCategory = new Map();
    const catalog = window.WA_TOOLS_CATALOG || [];
    for (const category of catalog) {
      for (const tool of category.tools || []) {
        slugToCategory.set(tool.slug, category.id);
      }
    }
    return slugToCategory;
  }

  function normalizePath(pathname) {
    return String(pathname || '').replace(/\\/g, '/');
  }

  function pathSegments() {
    const path = normalizePath(location.pathname);
    return path.split('/').filter(Boolean);
  }

  function stripHtmlExt(segment) {
    return String(segment || '').split('?')[0].split('#')[0].replace(/\.html$/i, '');
  }

  function isRootSlug(slug) {
    const s = stripHtmlExt(slug);
    return !s || s === 'index' || ROOT_SLUGS.has(s);
  }

  function isInScriptureDir() {
    const segs = pathSegments();
    return segs.length >= 2 && segs[0] === 'scripture' && !isRootSlug(segs[1]);
  }

  function isInCategoryDir() {
    const segs = pathSegments();
    if (segs.length < 2) return false;
    if (segs[0] === 'scripture') return false;
    const catId = segs[segs.length - 2];
    const page = stripHtmlExt(segs[segs.length - 1]);
    if (isRootSlug(page)) return false;
    buildMap();
    return [...slugToCategory.values()].includes(catId);
  }

  /** Prefix to reach site root from current page (e.g. '../' or '../../'). */
  function siteRootPrefix() {
    const segs = pathSegments();
    if (!segs.length) return '';
    if (segs.length === 1 && isRootSlug(segs[0])) return '';
    return '../'.repeat(segs.length - 1);
  }

  function toolPath(slug) {
    buildMap();
    const catId = slugToCategory.get(slug);
    return catId ? `${catId}/${slug}` : slug;
  }

  /** Site-root absolute page URL (e.g. /utility/whois). */
  function absolutePageHref(relativePath) {
    let clean = String(relativePath || '').replace(/^\/+/, '').replace(/\.html$/i, '');
    if (!clean || clean === 'index') return '/';
    return `/${clean}`;
  }

  function currentPageKey() {
    const segs = pathSegments();
    if (!segs.length) return 'index';
    const last = stripHtmlExt(segs[segs.length - 1]);
    if (segs.length === 1) return last;
    return `${segs[segs.length - 2]}/${last}`;
  }

  function currentCategoryId() {
    const key = currentPageKey();
    if (!key.includes('/')) return null;
    return key.split('/')[0];
  }

  function currentToolSlug() {
    const app = document.getElementById('tool-app');
    if (app?.dataset?.tool) return app.dataset.tool;
    const key = currentPageKey();
    if (key.includes('/')) return decodeURIComponent(key.split('/').pop());
    return isRootSlug(key) ? '' : decodeURIComponent(key);
  }

  function toolHref(slug) {
    if (!slug) return indexHref();
    return absolutePageHref(toolPath(slug));
  }

  function indexHref() {
    return '/';
  }

  function categoryIndexHref(categoryId) {
    return `/#cat-${categoryId}`;
  }

  function scriptureHref(slug) {
    return absolutePageHref(`scripture/${slug}`);
  }

  function getCategoryId(slug) {
    buildMap();
    return slugToCategory.get(slug) || null;
  }

  window.WA_TOOL_URLS = {
    siteRootPrefix,
    absolutePageHref,
    toolPath,
    toolHref,
    indexHref,
    categoryIndexHref,
    scriptureHref,
    currentPageKey,
    currentCategoryId,
    currentToolSlug,
    isInCategoryDir,
    isInScriptureDir,
    getCategoryId,
    buildMap,
    __installed: true,
  };

  if (window.WA_TOOLS_CATALOG) buildMap();
  window.addEventListener('mytoolife:catalog-ready', () => buildMap(), { once: true });
})();
