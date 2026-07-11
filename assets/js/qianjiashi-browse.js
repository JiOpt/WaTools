/**
 * 千家詩 — 搜尋、體裁標籤跳轉、分類收折
 */
(function () {
  'use strict';

  if (!document.body.classList.contains('qianjiashi-page')) return;

  const CATEGORIES = [
    { id: 'qianjiashi-wuyan-jueju', label: '五言絕句' },
    { id: 'qianjiashi-wuyan-lvshi', label: '五言律詩' },
    { id: 'qianjiashi-qiyan-jueju', label: '七言絕句' },
    { id: 'qianjiashi-qiyan-lvshi', label: '七言律詩' },
  ];

  function normalize(text) {
    return String(text || '').replace(/\s+/g, '').toLowerCase();
  }

  function poemSearchText(poem) {
    const title = poem.querySelector('.scripture-poem-title')?.textContent || '';
    const body = poem.querySelector('.scripture-poem-body')?.textContent || '';
    return normalize(title + body);
  }

  function buildToolbar() {
    const toolbar = document.createElement('div');
    toolbar.className = 'qianjiashi-toolbar';
    toolbar.innerHTML = `
      <label class="qianjiashi-search-label" for="qianjiashi-search">搜尋千家詩</label>
      <input type="search" class="form-control qianjiashi-search" id="qianjiashi-search"
        placeholder="搜尋詩題或內文…" autocomplete="off">
      <p class="qianjiashi-search-meta text-muted" id="qianjiashi-search-meta" hidden></p>
      <nav class="qianjiashi-category-nav" aria-label="體裁分類">
        ${CATEGORIES.map((c) => `<a href="#${c.id}" class="qianjiashi-category-tag" data-target="${c.id}">${c.label}</a>`).join('')}
      </nav>`;
    return toolbar;
  }

  function wrapCategories(article) {
    const sections = [...article.querySelectorAll('.scripture-poem-section')];
    const categories = [];

    sections.forEach((section, index) => {
      const meta = CATEGORIES.find((c) => c.id === section.id) || { id: section.id, label: section.querySelector('.scripture-highlight')?.textContent?.trim() || '詩篇' };
      const poems = [];
      let node = section.nextElementSibling;
      const nextSection = sections[index + 1] || null;

      while (node && node !== nextSection) {
        if (node.classList?.contains('scripture-poem')) poems.push(node);
        node = node.nextElementSibling;
      }

      const category = document.createElement('section');
      category.className = 'qianjiashi-category';
      category.id = meta.id;
      category.dataset.category = meta.id;

      const head = document.createElement('div');
      head.className = 'qianjiashi-category-head';

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'qianjiashi-category-toggle';
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-controls', `${meta.id}-body`);
      toggle.innerHTML = `
        <span class="qianjiashi-category-title">${meta.label}</span>
        <span class="qianjiashi-category-count">${poems.length} 首</span>
        <i class="bi bi-chevron-down qianjiashi-category-chevron" aria-hidden="true"></i>`;

      head.appendChild(toggle);

      const body = document.createElement('div');
      body.className = 'qianjiashi-category-body';
      body.id = `${meta.id}-body`;
      poems.forEach((poem) => {
        poem.dataset.searchText = poemSearchText(poem);
        body.appendChild(poem);
      });

      category.appendChild(head);
      category.appendChild(body);

      section.parentNode.insertBefore(category, section);
      section.remove();

      toggle.addEventListener('click', () => {
        const open = body.classList.toggle('is-collapsed');
        toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      });

      categories.push({ el: category, body, toggle, poems, label: meta.label });
    });

    return categories;
  }

  function setCategoryOpen(category, open) {
    category.body.classList.toggle('is-collapsed', !open);
    category.toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function filterPoems(categories, query) {
    const q = normalize(query);
    let totalVisible = 0;

    categories.forEach((category) => {
      let visible = 0;
      category.poems.forEach((poem) => {
        const show = !q || (poem.dataset.searchText || '').includes(q);
        poem.classList.toggle('is-filtered-out', !show);
        if (show) visible += 1;
      });

      const countEl = category.toggle.querySelector('.qianjiashi-category-count');
      if (countEl) {
        countEl.textContent = q ? `${visible} / ${category.poems.length} 首` : `${category.poems.length} 首`;
      }

      if (q) {
        setCategoryOpen(category, visible > 0);
        category.el.classList.toggle('is-empty', visible === 0);
      } else {
        category.el.classList.remove('is-empty');
      }

      totalVisible += visible;
    });

    return totalVisible;
  }

  function init() {
    const article = document.querySelector('.scripture-article');
    if (!article) return;

    const anchor = article.querySelector('.scripture-poem-section') || article.querySelector('h4.scripture-subhead');
    if (!anchor) return;

    const categories = wrapCategories(article);
    if (!categories.length) return;

    const toolbar = buildToolbar();
    anchor.parentNode.insertBefore(toolbar, anchor);

    const search = toolbar.querySelector('#qianjiashi-search');
    const meta = toolbar.querySelector('#qianjiashi-search-meta');

    search.addEventListener('input', () => {
      const q = search.value.trim();
      const visible = filterPoems(categories, q);
      meta.hidden = !q;
      meta.textContent = q ? `找到 ${visible} 首` : '';
    });

    toolbar.querySelectorAll('.qianjiashi-category-tag').forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const id = link.dataset.target;
        const category = categories.find((c) => c.el.id === id);
        if (!category) return;
        setCategoryOpen(category, true);
        category.el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        toolbar.querySelectorAll('.qianjiashi-category-tag').forEach((t) => {
          t.classList.toggle('is-active', t.dataset.target === id);
        });
      });
    });

    document.body.classList.add('qianjiashi-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
