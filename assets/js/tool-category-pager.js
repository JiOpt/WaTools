(function () {
  'use strict';

  const pagerApi = () => window.WA_SITEMAP_PAGER;

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function pageTitleFromDocument() {
    return document.title.replace(/\s*[-–—|]\s*Kawatool\s*$/i, '').trim() || document.title.trim();
  }

  function categoryBackHref(categoryId) {
    if (window.WA_TOOL_URLS) {
      if (categoryId) return window.WA_TOOL_URLS.categoryIndexHref(categoryId);
      const fromPath = window.WA_TOOL_URLS.currentCategoryId();
      if (fromPath) return window.WA_TOOL_URLS.categoryIndexHref(fromPath);
      return window.WA_TOOL_URLS.indexHref();
    }
    return categoryId ? `/#cat-${categoryId}` : '/';
  }

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

  function renderPageBar(ctx) {
    const categoryId = ctx?.category?.id || null;
    const title = ctx?.tool?.title || pageTitleFromDocument();
    const bar = document.createElement('header');
    bar.className = 'tool-page-bar';
    bar.setAttribute('aria-label', '工具頁標題');
    bar.innerHTML = `
      <a href="${categoryBackHref(categoryId)}" class="btn btn-outline-secondary tool-page-bar-back scripture-pager-home">
        <i class="bi bi-grid" aria-hidden="true"></i>返回分類
      </a>
      <h1 class="tool-page-bar-title">${escapeHtml(title)}</h1>`;
    return bar;
  }

  function injectPageBar() {
    const container = document.querySelector('.tool-section .container');
    const app = document.getElementById('tool-app');
    if (!container || !app) return false;

    const api = pagerApi();
    const slug = api?.currentToolSlugFromPage?.() || app.dataset.tool || '';
    let ctx = null;
    if (api && window.WA_TOOLS_CATALOG && slug) {
      ctx = api.resolveToolPage?.(slug, window.WA_TOOLS_CATALOG) || null;
    }

    const title = ctx?.tool?.title || pageTitleFromDocument();
    const categoryId = ctx?.category?.id || null;
    const existing = container.querySelector('.tool-page-bar');

    if (existing) {
      const titleEl = existing.querySelector('.tool-page-bar-title');
      if (titleEl) titleEl.textContent = title;
      if (!existing.querySelector('.tool-page-bar-back')) {
        const back = document.createElement('a');
        back.href = categoryBackHref(categoryId);
        back.className = 'btn btn-outline-secondary tool-page-bar-back scripture-pager-home';
        back.innerHTML = '<i class="bi bi-grid" aria-hidden="true"></i>返回分類';
        existing.insertBefore(back, existing.firstChild);
      } else {
        existing.querySelector('.tool-page-bar-back').href = categoryBackHref(categoryId);
      }
      return true;
    }

    container.insertBefore(renderPageBar(ctx), app);
    return true;
  }

  function renderPager(ctx) {
    const { category, prev, next } = ctx;

    function linkCell(tool, kind) {
      const label = kind === 'prev' ? '上一篇' : '下一篇';
      if (!tool) {
        return `<span class="scripture-pager-link scripture-pager-${kind} is-disabled" aria-hidden="true">
          <span class="scripture-pager-label">${label}</span>
          <span class="scripture-pager-row"><span class="scripture-pager-title">—</span></span>
        </span>`;
      }
      const href = window.WA_TOOL_URLS ? window.WA_TOOL_URLS.toolHref(tool.slug) : `${tool.slug}.html`;
      const chevronPrev = '<i class="bi bi-chevron-left scripture-pager-chevron" aria-hidden="true"></i>';
      const chevronNext = '<i class="bi bi-chevron-right scripture-pager-chevron" aria-hidden="true"></i>';
      const row = kind === 'prev'
        ? `<span class="scripture-pager-row">${chevronPrev}<span class="scripture-pager-title">${escapeHtml(tool.title)}</span></span>`
        : `<span class="scripture-pager-row"><span class="scripture-pager-title">${escapeHtml(tool.title)}</span>${chevronNext}</span>`;
      const aria = kind === 'prev' ? `上一篇：${tool.title}` : `下一篇：${tool.title}`;
      return `<a href="${href}" class="scripture-pager-link scripture-pager-${kind}" aria-label="${escapeHtml(aria)}">
        <span class="scripture-pager-label">${label}</span>
        ${row}
      </a>`;
    }

    const nav = document.createElement('nav');
    nav.className = 'scripture-pager tool-category-pager scripture-pager-bottom';
    nav.setAttribute('aria-label', '分類導覽');
    nav.innerHTML = `
      ${linkCell(prev, 'prev')}
      <a href="${categoryBackHref(category.id)}" class="btn btn-outline-secondary scripture-pager-home">
        <i class="bi bi-grid me-1" aria-hidden="true"></i>返回分類
      </a>
      ${linkCell(next, 'next')}`;
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
    injectPageBar();
    ensurePagerPlaceholders();
    await ensurePagerApi();
    await pagerApi()?.ensureManifest();
    injectPageBar();
    if (injectPagers()) return;
    if (window.WA_TOOLS_CATALOG) {
      requestAnimationFrame(() => {
        injectPageBar();
        injectPagers();
      });
      return;
    }
    window.addEventListener('mytoolife:catalog-ready', () => {
      injectPageBar();
      injectPagers();
    }, { once: true });
  }

  window.__waInjectToolCategoryPager = async () => {
    await ensurePagerApi();
    await pagerApi()?.ensureManifest();
    injectPageBar();
    return injectPagers();
  };
  window.__waEnsurePagerPlaceholders = ensurePagerPlaceholders;

  window.addEventListener('mytoolife:publish-changed', () => {
    ensurePagerApi()
      .then(() => pagerApi()?.ensureManifest())
      .then(() => {
        injectPageBar();
        injectPagers();
      });
  });

  if (document.body) {
    injectPageBar();
    ensurePagerPlaceholders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      boot().catch(() => injectPagers());
    });
  } else {
    boot().catch(() => injectPagers());
  }
})();
