/**
 * Prev/next pager chain driven by sitemap.txt (via WA_SITEMAP_MANIFEST).
 * Order within a category comes from catalog; membership from published slugs.
 */
(function () {
  'use strict';

  if (window.WA_SITEMAP_PAGER?.__installed) return;

  function rootPrefix() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/')) ? '../' : '';
  }

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return `${rootPrefix()}${path}`;
  }

  function ensureManifest() {
    if (window.WA_SITEMAP_MANIFEST) {
      return window.WA_SITEMAP_MANIFEST.load().catch(() => {});
    }
    return new Promise((resolve) => {
      const base = 'assets/js/sitemap-manifest.js';
      const existing = document.querySelector(`script[src*="${base.split('?')[0]}"]`);
      if (existing) {
        const finish = () => {
          window.WA_SITEMAP_MANIFEST?.load().catch(() => {}).finally(resolve);
        };
        if (existing.dataset.waLoaded === '1' || window.WA_SITEMAP_MANIFEST) {
          finish();
          return;
        }
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', () => resolve(), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = assetUrl(base);
      script.onload = () => {
        script.dataset.waLoaded = '1';
        window.WA_SITEMAP_MANIFEST?.load().catch(() => {}).finally(resolve);
      };
      script.onerror = () => resolve();
      document.head.appendChild(script);
    });
  }

  function isPublished(slug) {
    if (!slug) return false;
    if (!window.WA_SITEMAP_MANIFEST) return false;
    try {
      return window.WA_SITEMAP_MANIFEST.isPublished(slug);
    } catch {
      return false;
    }
  }

  function filterPublishedTools(tools) {
    return (tools || []).filter((tool) => isPublished(tool.slug));
  }

  function wrapNeighbors(items, index) {
    const len = items.length;
    if (len < 2) {
      return { items, index, prev: null, next: null };
    }
    return {
      items,
      index,
      prev: items[(index - 1 + len) % len],
      next: items[(index + 1) % len],
    };
  }

  function currentToolSlugFromPage() {
    const app = document.getElementById('tool-app');
    if (app?.dataset?.tool) return app.dataset.tool;
    const match = location.pathname.replace(/\\/g, '/').match(/\/([^/]+)\.html$/i);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function scriptureSlugFromPage() {
    const match = location.pathname.replace(/\\/g, '/').match(/\/scripture\/([^/]+)\.html$/i);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function findToolCategory(slug, catalog) {
    if (!catalog || !slug) return null;
    for (const category of catalog) {
      if ((category.tools || []).some((tool) => tool.slug === slug)) return category;
    }
    return null;
  }

  function findScriptureGroup(slug, catalog) {
    if (!catalog || !slug) return null;
    for (const group of catalog) {
      if ((group.books || []).some((book) => book.slug === slug)) return group;
    }
    return null;
  }

  /**
   * @param {string} slug
   * @param {Array} catalog - WA_TOOLS_CATALOG or pre-filtered subset
   * @param {{ alreadyFiltered?: boolean }} [opts]
   */
  function resolveToolPager(slug, catalog, opts) {
    if (!slug) return null;
    const category = findToolCategory(slug, catalog);
    if (!category) return null;

    const tools = opts?.alreadyFiltered
      ? (category.tools || [])
      : filterPublishedTools(category.tools);

    if (tools.length < 2) return null;
    const index = tools.findIndex((tool) => tool.slug === slug);
    if (index < 0) return null;

    return {
      category,
      tools,
      ...wrapNeighbors(tools, index),
    };
  }

  function resolveScripturePager(slug, catalog) {
    if (!slug || !isPublished('scriptures')) return null;
    const group = findScriptureGroup(slug, catalog);
    if (!group) return null;

    const books = group.books || [];
    if (books.length < 2) return null;
    const index = books.findIndex((book) => book.slug === slug);
    if (index < 0) return null;

    return {
      group,
      books,
      ...wrapNeighbors(books, index),
    };
  }

  window.WA_SITEMAP_PAGER = {
    ensureManifest,
    isPublished,
    filterPublishedTools,
    wrapNeighbors,
    currentToolSlugFromPage,
    scriptureSlugFromPage,
    resolveToolPager,
    resolveScripturePager,
    __installed: true,
  };
})();
