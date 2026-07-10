(function () {
  'use strict';

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

  function renderPager(category, index, position) {
    const tools = category.tools;
    const prev = tools[(index - 1 + tools.length) % tools.length];
    const next = tools[(index + 1) % tools.length];
    const posClass = position === 'top' ? 'scripture-pager-top' : 'scripture-pager-bottom';

    const nav = document.createElement('nav');
    nav.className = `scripture-pager tool-category-pager ${posClass}`;
    nav.setAttribute('aria-label', '分類導覽');
    nav.innerHTML = `
      <a href="${prev.slug}.html" class="scripture-pager-link scripture-pager-prev">
        <span class="scripture-pager-label">上一頁</span>
        <span class="scripture-pager-title">${prev.title}</span>
      </a>
      <a href="index.html#cat-${category.id}" class="btn btn-outline-secondary scripture-pager-home">
        <i class="bi bi-grid me-1"></i>返回分類
      </a>
      <a href="${next.slug}.html" class="scripture-pager-link scripture-pager-next">
        <span class="scripture-pager-label">下一頁</span>
        <span class="scripture-pager-title">${next.title}</span>
      </a>`;
    return nav;
  }

  function injectPagers() {
    const slug = currentToolSlug();
    const category = findCategory(slug);
    if (!category || category.id !== 'world' || category.tools.length < 2) return;

    const index = category.tools.findIndex((tool) => tool.slug === slug);
    if (index < 0) return;

    const container = document.querySelector('.tool-section .container');
    const app = document.getElementById('tool-app');
    if (!container || !app || container.querySelector('.tool-category-pager')) return;

    container.insertBefore(renderPager(category, index, 'top'), app);
    container.appendChild(renderPager(category, index, 'bottom'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPagers);
  } else {
    injectPagers();
  }
})();
