(function () {
  'use strict';

  const pagerApi = () => window.WA_SITEMAP_PAGER;

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return path;
  }

  function placeholderPager(position) {
    const posClass = position === 'top' ? 'scripture-pager-top' : 'scripture-pager-bottom';
    const nav = document.createElement('nav');
    nav.className = `scripture-pager tool-category-pager tool-pager-placeholder ${posClass}`;
    nav.setAttribute('aria-hidden', 'true');
    nav.innerHTML = `
      <span class="scripture-pager-link scripture-pager-prev is-disabled"></span>
      <span class="scripture-pager-home btn btn-outline-secondary"></span>
      <span class="scripture-pager-link scripture-pager-next is-disabled"></span>`;
    return nav;
  }

  function ensurePagerPlaceholders() {
    const container = document.querySelector('.tool-section .container');
    const app = document.getElementById('tool-app');
    if (!container || !app) return;

    if (container.querySelector('.tool-category-pager:not(.tool-pager-placeholder)')) return;

    if (!container.querySelector('.tool-category-pager.scripture-pager-bottom')) {
      container.appendChild(placeholderPager('bottom'));
    }
  }

  function renderPager(ctx) {
    const { category, prev, next } = ctx;

    function linkCell(tool, kind, label) {
      if (!tool) {
        return `<span class="scripture-pager-link scripture-pager-${kind} is-disabled" aria-hidden="true">
          <span class="scripture-pager-label">${label}</span>
          <span class="scripture-pager-title">—</span>
        </span>`;
      }
      const chevron = kind === 'prev'
        ? '<i class="bi bi-chevron-left scripture-pager-chevron" aria-hidden="true"></i>'
        : '<i class="bi bi-chevron-right scripture-pager-chevron" aria-hidden="true"></i>';
      const titleHtml = kind === 'prev'
        ? `<span class="scripture-pager-row">${chevron}<span class="scripture-pager-title">${tool.title}</span></span>`
        : `<span class="scripture-pager-row"><span class="scripture-pager-title">${tool.title}</span>${chevron}</span>`;
      return `<a href="${tool.slug}.html" class="scripture-pager-link scripture-pager-${kind}">
        <span class="scripture-pager-label">${label}</span>
        ${titleHtml}
      </a>`;
    }

    const nav = document.createElement('nav');
    nav.className = 'scripture-pager tool-category-pager scripture-pager-bottom';
    nav.setAttribute('aria-label', '分類導覽');
    nav.innerHTML = `
      ${linkCell(prev, 'prev', '上一篇')}
      <a href="index.html#cat-${category.id}" class="btn btn-outline-secondary scripture-pager-home">
        <i class="bi bi-grid me-1"></i>${category.name}
      </a>
      ${linkCell(next, 'next', '下一篇')}`;
    return nav;
  }

  function injectPagers() {
    const api = pagerApi();
    if (!api || !window.WA_TOOLS_CATALOG) return false;

    const slug = api.currentToolSlugFromPage();
    const container = document.querySelector('.tool-section .container');
    const app = document.getElementById('tool-app');

    const ctx = api.resolveToolPager(slug, window.WA_TOOLS_CATALOG);
    if (!ctx || !container || !app) {
      container?.querySelectorAll('.tool-pager-placeholder').forEach((el) => el.remove());
      return false;
    }

    container.querySelectorAll('.tool-category-pager').forEach((el) => el.remove());
    container.appendChild(renderPager(ctx));
    return true;
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

  async function boot() {
    ensurePagerPlaceholders();
    await ensurePagerApi();
    await pagerApi()?.ensureManifest();
    if (injectPagers()) return;
    if (window.WA_TOOLS_CATALOG) {
      requestAnimationFrame(() => injectPagers());
      return;
    }
    window.addEventListener('watools:catalog-ready', () => injectPagers(), { once: true });
  }

  window.__waInjectToolCategoryPager = async () => {
    await ensurePagerApi();
    await pagerApi()?.ensureManifest();
    return injectPagers();
  };
  window.__waEnsurePagerPlaceholders = ensurePagerPlaceholders;

  window.addEventListener('watools:publish-changed', () => {
    ensurePagerApi()
      .then(() => pagerApi()?.ensureManifest())
      .then(() => injectPagers());
  });

  if (document.body) ensurePagerPlaceholders();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      boot().catch(() => injectPagers());
    });
  } else {
    boot().catch(() => injectPagers());
  }
})();
