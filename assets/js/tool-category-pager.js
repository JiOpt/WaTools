(function () {
  'use strict';

  /** Slugs excluded from 上一篇／下一篇 chain (page may still exist in catalog). */
  const PAGER_SKIP = new Set(['monster']);

  function currentToolSlug() {
    const app = document.getElementById('tool-app');
    if (app?.dataset?.tool) return app.dataset.tool;
    const match = location.pathname.match(/\/([^/]+)\.html$/i);
    return match ? decodeURIComponent(match[1]) : '';
  }

  function findCategory(slug) {
    const catalog = window.WA_TOOLS_CATALOG;
    if (!catalog || !slug) return null;
    for (const category of catalog) {
      if (category.tools.some((tool) => tool.slug === slug)) return category;
    }
    return null;
  }

  function visibleTools(category) {
    return category.tools.filter((tool) => !PAGER_SKIP.has(tool.slug));
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

    if (!container.querySelector('.tool-category-pager.scripture-pager-top')) {
      container.insertBefore(placeholderPager('top'), app);
    }
    if (!container.querySelector('.tool-category-pager.scripture-pager-bottom')) {
      container.appendChild(placeholderPager('bottom'));
    }
  }

  function renderPager(category, tools, index, position) {
    const prev = index > 0 ? tools[index - 1] : null;
    const next = index < tools.length - 1 ? tools[index + 1] : null;
    const posClass = position === 'top' ? 'scripture-pager-top' : 'scripture-pager-bottom';

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
    nav.className = `scripture-pager tool-category-pager ${posClass}`;
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
    const slug = currentToolSlug();
    const container = document.querySelector('.tool-section .container');
    const app = document.getElementById('tool-app');

    if (!slug || PAGER_SKIP.has(slug)) {
      container?.querySelectorAll('.tool-pager-placeholder').forEach((el) => el.remove());
      return false;
    }

    const category = findCategory(slug);
    const tools = category ? visibleTools(category) : [];
    if (!category || tools.length < 2) {
      container?.querySelectorAll('.tool-pager-placeholder').forEach((el) => el.remove());
      return false;
    }

    const index = tools.findIndex((tool) => tool.slug === slug);
    if (index < 0) {
      container?.querySelectorAll('.tool-pager-placeholder').forEach((el) => el.remove());
      return false;
    }

    if (!container || !app) return false;

    container.querySelectorAll('.tool-category-pager').forEach((el) => el.remove());

    const topPager = renderPager(category, tools, index, 'top');
    const bottomPager = renderPager(category, tools, index, 'bottom');
    container.insertBefore(topPager, app);
    container.appendChild(bottomPager);
    return true;
  }

  function boot() {
    ensurePagerPlaceholders();
    if (injectPagers()) return;
    if (window.WA_TOOLS_CATALOG) {
      requestAnimationFrame(() => injectPagers());
      return;
    }
    window.addEventListener('watools:catalog-ready', () => injectPagers(), { once: true });
  }

  window.__waInjectToolCategoryPager = injectPagers;
  window.__waEnsurePagerPlaceholders = ensurePagerPlaceholders;

  if (document.body) {
    ensurePagerPlaceholders();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
