/**
 * Dynamic prev/next for scripture/*.html — gated by sitemap.txt (scriptures slug).
 */
(function () {
  'use strict';

  const pagerApi = () => window.WA_SITEMAP_PAGER;

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    const prefix = /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/')) ? '../' : '';
    return `${prefix}${path}`;
  }

  function loadScriptOnce(relativePath) {
    const base = relativePath.split('?')[0];
    if (document.querySelector(`script[src*="${base}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = assetUrl(relativePath);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${relativePath}`));
      document.head.appendChild(script);
    });
  }

  async function ensurePagerApi() {
    if (window.WA_SITEMAP_PAGER) return window.WA_SITEMAP_PAGER;
    await loadScriptOnce('assets/js/sitemap-pager.js');
    return window.WA_SITEMAP_PAGER;
  }

  function renderPagerNav(ctx) {
    const { group, prev, next } = ctx;

    function linkCell(book, kind, label) {
      if (!book) {
        return `<span class="scripture-pager-link scripture-pager-${kind} is-disabled" aria-hidden="true">
          <span class="scripture-pager-label">${label}</span>
          <span class="scripture-pager-title">—</span>
        </span>`;
      }
      const chevron = kind === 'prev'
        ? '<i class="bi bi-chevron-left scripture-pager-chevron" aria-hidden="true"></i>'
        : '<i class="bi bi-chevron-right scripture-pager-chevron" aria-hidden="true"></i>';
      const titleHtml = kind === 'prev'
        ? `<span class="scripture-pager-row">${chevron}<span class="scripture-pager-title">${book.title}</span></span>`
        : `<span class="scripture-pager-row"><span class="scripture-pager-title">${book.title}</span>${chevron}</span>`;
      return `<a href="${book.slug}.html" class="scripture-pager-link scripture-pager-${kind}">
        <span class="scripture-pager-label">${label}</span>
        ${titleHtml}
      </a>`;
    }

    return `
      ${linkCell(prev, 'prev', '上一篇')}
      <a href="../scriptures.html#scriptures-${group.id}" class="btn btn-outline-secondary scripture-pager-home">
        <i class="bi bi-grid me-1"></i>返回分類
      </a>
      ${linkCell(next, 'next', '下一篇')}`;
  }

  function updatePagerElement(el, ctx, position) {
    if (!el || !ctx) return;
    el.setAttribute('aria-label', '篇章導覽');
    el.classList.add('scripture-pager', position === 'top' ? 'scripture-pager-top' : 'scripture-pager-bottom');
    el.innerHTML = renderPagerNav(ctx);
  }

  function injectPagers() {
    const api = pagerApi();
    const catalog = window.WA_SCRIPTURES_CATALOG;
    if (!api || !catalog) return false;

    const slug = api.scriptureSlugFromPage();
    const ctx = api.resolveScripturePager(slug, catalog);
    const top = document.querySelector('.scripture-section .scripture-pager-top');
    const bottom = document.querySelector('.scripture-section .scripture-pager-bottom');

    if (!ctx) {
      top?.remove();
      bottom?.remove();
      return false;
    }

    updatePagerElement(top, ctx, 'top');
    updatePagerElement(bottom, ctx, 'bottom');
    return true;
  }

  async function boot() {
    await ensurePagerApi();
    await pagerApi()?.ensureManifest();
    if (injectPagers()) return;
    if (window.WA_SCRIPTURES_CATALOG) {
      requestAnimationFrame(() => injectPagers());
    }
  }

  window.addEventListener('watools:publish-changed', () => {
    ensurePagerApi()
      .then(() => pagerApi()?.ensureManifest())
      .then(() => injectPagers());
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      boot().catch(() => injectPagers());
    });
  } else {
    boot().catch(() => injectPagers());
  }
})();
