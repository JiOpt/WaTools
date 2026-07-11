/**
 * Hierarchical tool URLs: /{categoryId}/{slug}.html
 * Requires WA_TOOLS_CATALOG (build map on first use).
 */
(function () {
  'use strict';

  if (window.WA_TOOL_URLS?.__installed) return;

  const ROOT_PAGES = new Set([
    'index.html',
    'index_plan.html',
    'copyright.html',
    'starter-page.html',
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

  function isInScriptureDir() {
    return /\/scripture\/[^/]+\.html$/i.test(normalizePath(location.pathname));
  }

  function isInCategoryDir() {
    const segs = pathSegments();
    if (segs.length < 2) return false;
    const file = segs[segs.length - 1];
    if (!/\.html$/i.test(file)) return false;
    if (isInScriptureDir()) return false;
    if (ROOT_PAGES.has(file)) return false;
    const catId = segs[segs.length - 2];
    buildMap();
    return [...slugToCategory.values()].includes(catId);
  }

  /** Prefix to reach site root from current page (e.g. '../' or '../../'). */
  function siteRootPrefix() {
    if (isInScriptureDir()) return '../';
    const segs = pathSegments();
    if (segs.length <= 1) return '';
    return '../'.repeat(segs.length - 1);
  }

  function toolPath(slug) {
    buildMap();
    const catId = slugToCategory.get(slug);
    return catId ? `${catId}/${slug}.html` : `${slug}.html`;
  }

  /** Site-root absolute page URL (e.g. /utility/whois.html). */
  function absolutePageHref(relativePath) {
    const clean = String(relativePath || '').replace(/^\/+/, '');
    return `/${clean}`;
  }

  function currentPageKey() {
    const segs = pathSegments();
    if (!segs.length) return 'index.html';
    if (segs.length === 1) return segs[0].split('?')[0].split('#')[0];
    return `${segs[segs.length - 2]}/${segs[segs.length - 1].split('?')[0].split('#')[0]}`;
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
    if (key.includes('/')) return decodeURIComponent(key.split('/').pop().replace(/\.html$/i, ''));
    const m = key.match(/^(.+)\.html$/i);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function toolHref(slug) {
    if (!slug) return absolutePageHref('index.html');
    if (slug === 'scriptures') {
      return absolutePageHref(toolPath('scriptures'));
    }
    buildMap();
    return absolutePageHref(toolPath(slug));
  }

  function indexHref() {
    return absolutePageHref('index.html');
  }

  function categoryIndexHref(categoryId) {
    return `${absolutePageHref('index.html')}#cat-${categoryId}`;
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
