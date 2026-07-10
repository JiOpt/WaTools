(function () {
  'use strict';

  const HISTORY_KEY = 'watools-nav-history';
  const RECENT_MAX = 7;

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return path;
  }

  function isInScriptureDir() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function rootPrefix() {
    return isInScriptureDir() ? '../' : '';
  }

  function currentHref() {
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;
    const name = path.split('/').pop();
    if (!name || name === '') return 'index.html';
    return name.split('?')[0].split('#')[0];
  }

  function toolHref(slug) {
    if (slug === 'scriptures') return `${rootPrefix()}scriptures.html`;
    return `${rootPrefix()}${slug}.html`;
  }

  function scriptureBookHref(slug) {
    if (isInScriptureDir()) return `${slug}.html`;
    return `scripture/${slug}.html`;
  }

  function loadScriptOnce(src) {
    const base = src.split('?')[0];
    if (document.querySelector(`script[src*="${base}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = assetUrl(src);
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadCatalogs() {
    if (!window.WA_TOOLS_CATALOG) {
      await loadScriptOnce('assets/js/tools-data.js');
    }
    if (!window.WA_SCRIPTURES_CATALOG) {
      await loadScriptOnce('assets/js/scriptures-catalog.js');
    }
    return {
      tools: window.WA_TOOLS_CATALOG || [],
      scriptures: window.WA_SCRIPTURES_CATALOG || [],
    };
  }

  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([key, val]) => {
        if (val == null) return;
        if (key === 'className') node.className = val;
        else if (key === 'text') node.textContent = val;
        else if (key.startsWith('on') && typeof val === 'function') {
          node.addEventListener(key.slice(2).toLowerCase(), val);
        } else node.setAttribute(key, val);
      });
    }
    (children || []).flat().filter(Boolean).forEach((child) => {
      if (typeof child === 'string') node.appendChild(document.createTextNode(child));
      else node.appendChild(child);
    });
    return node;
  }

  function normalizeForCompare(href, scriptureSlugs) {
    return canonicalHref(href, scriptureSlugs);
  }

  function canonicalHref(href, scriptureSlugs) {
    let h = String(href || '').replace(/^\.\.\//, '');
    if (!h.includes('/') && h.endsWith('.html') && h !== 'index.html' && h !== 'scriptures.html') {
      const slug = h.slice(0, -5);
      if (scriptureSlugs && scriptureSlugs.has(slug)) {
        return `scripture/${h}`;
      }
    }
    return h;
  }

  function isActiveHref(href, scriptureSlugs) {
    const cur = currentHref();
    const target = canonicalHref(href, scriptureSlugs);
    if (target === cur) return true;
    if (target === 'index.html' && (cur === '' || cur === 'index.html')) return true;
    return false;
  }

  function resolveHref(href) {
    if (!href) return href;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('../')) return href;

    let canonical = href;
    if (canonical.startsWith('scripture-')) {
      canonical = `scripture/${canonical.slice('scripture-'.length)}`;
    }
    if (isInScriptureDir() && canonical.startsWith('scripture/')) {
      return canonical.slice('scripture/'.length);
    }
    if (isInScriptureDir() && !canonical.startsWith('scripture/')) {
      return `../${canonical}`;
    }
    return canonical;
  }

  function scriptureSlugSet(scriptures) {
    const set = new Set();
    scriptures.forEach((cat) => cat.books.forEach((book) => set.add(book.slug)));
    return set;
  }

  function readHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }

  function linkClassNames(href, recentRank, scriptureSlugs) {
    const classes = [];
    if (isActiveHref(href, scriptureSlugs)) classes.push('is-active');
    else if (recentRank === 0) classes.push('is-recent', 'is-recent-latest');
    else if (recentRank >= 0) classes.push('is-recent');
    return classes.join(' ');
  }

  function buildToolSections(catalog, recentRankByHref, scriptureSlugs) {
    return catalog.map((category) => el('details', {
      className: 'site-sitemap-group',
      dataset: { group: category.id },
    }, [
      el('summary', { className: 'site-sitemap-group-title' }, [category.name]),
      el('ul', { className: 'site-sitemap-list' }, category.tools.map((tool) => {
        const href = toolHref(tool.slug);
        const canon = canonicalHref(href, scriptureSlugs);
        const rank = recentRankByHref.has(canon) ? recentRankByHref.get(canon) : -1;
        return el('li', null, [
          el('a', {
            href,
            className: linkClassNames(href, rank, scriptureSlugs),
            dataset: { label: `${tool.title} ${category.name}`, canon },
          }, [
            rank >= 0 && !isActiveHref(href, scriptureSlugs)
              ? el('span', { className: 'site-sitemap-recent-mark', title: '最近瀏覽' })
              : null,
            tool.title,
          ]),
        ]);
      })),
    ]));
  }

  function buildScriptureSections(catalog, recentRankByHref, scriptureSlugs) {
    return catalog.map((category) => el('details', {
      className: 'site-sitemap-group',
      dataset: { group: `scripture-${category.id}` },
    }, [
      el('summary', { className: 'site-sitemap-group-title' }, [category.name]),
      el('ul', { className: 'site-sitemap-list' }, category.books.map((book) => {
        const href = scriptureBookHref(book.slug);
        const canon = canonicalHref(href, scriptureSlugs);
        const rank = recentRankByHref.has(canon) ? recentRankByHref.get(canon) : -1;
        return el('li', null, [
          el('a', {
            href,
            className: linkClassNames(href, rank, scriptureSlugs),
            dataset: { label: `${book.title} ${category.name} 藏經閣`, canon },
          }, [
            rank >= 0 && !isActiveHref(href, scriptureSlugs)
              ? el('span', { className: 'site-sitemap-recent-mark', title: '最近瀏覽' })
              : null,
            book.title,
          ]),
        ]);
      })),
    ]));
  }

  function buildRecentSection(history, scriptureSlugs) {
    const items = history
      .filter((item) => !isActiveHref(item.href, scriptureSlugs))
      .slice(0, RECENT_MAX);
    if (!items.length) return null;

    return el('div', { className: 'site-sitemap-recent' }, [
      el('div', { className: 'site-sitemap-section-label' }, ['最近瀏覽']),
      el('ul', { className: 'site-sitemap-recent-list' }, items.map((item, index) => {
        const href = resolveHref(item.href);
        return el('li', null, [
          el('a', {
            href,
            className: linkClassNames(href, index, scriptureSlugs),
            title: item.title,
          }, [
            el('span', { className: 'site-sitemap-recent-dot', 'aria-hidden': 'true' }),
            el('span', { className: 'site-sitemap-recent-title' }, [item.title]),
            el('span', { className: 'site-sitemap-recent-time' }, [index === 0 ? '剛剛' : formatTime(item.ts)]),
          ]),
        ]);
      })),
    ]);
  }

  function recentRankMap(history, scriptureSlugs) {
    const map = new Map();
    let rank = 0;
    history.forEach((item) => {
      if (isActiveHref(item.href, scriptureSlugs)) return;
      if (rank >= RECENT_MAX) return;
      map.set(item.href, rank);
      rank += 1;
    });
    return map;
  }

  function openGroupsForContext(root, recentRankByHref) {
    root.querySelectorAll('.site-sitemap-group').forEach((group) => {
      if (group.querySelector('a.is-active')) {
        group.open = true;
        return;
      }
      const hasRecent = Array.from(group.querySelectorAll('a[data-canon]')).some((link) => {
        const rank = recentRankByHref.get(link.dataset.canon);
        return rank != null && rank >= 0;
      });
      if (hasRecent) group.open = true;
    });
  }

  function applySearch(root, query) {
    const q = query.trim().toLowerCase();
    const recent = root.querySelector('.site-sitemap-recent');
    if (recent) {
      if (!q) {
        recent.hidden = false;
      } else {
        let recentVisible = 0;
        recent.querySelectorAll('.site-sitemap-recent-list li').forEach((item) => {
          const link = item.querySelector('a');
          const label = (link?.title || link?.textContent || '').toLowerCase();
          const match = label.includes(q);
          item.hidden = !match;
          if (match) recentVisible += 1;
        });
        recent.hidden = recentVisible === 0;
      }
    }
    root.querySelectorAll('.site-sitemap-group').forEach((group) => {
      let visible = 0;
      group.querySelectorAll('.site-sitemap-list li').forEach((item) => {
        const link = item.querySelector('a');
        const label = (link?.dataset.label || link?.textContent || '').toLowerCase();
        const match = !q || label.includes(q);
        item.hidden = !match;
        if (match) visible += 1;
      });
      group.hidden = visible === 0;
      if (q && visible > 0) group.open = true;
    });
  }

  function setMobileOpen(open) {
    document.body.classList.toggle('site-sitemap-open', open);
    const panel = document.getElementById('site-sitemap');
    const fab = document.querySelector('.site-sitemap-fab');
    if (panel) panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (fab) fab.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  function buildNav(tools, scriptures, history, scriptureSlugs) {
    const recentRankByHref = recentRankMap(history, scriptureSlugs);
    const recentBlock = buildRecentSection(history, scriptureSlugs);

    return el('nav', { className: 'site-sitemap-nav', 'aria-label': '網站地圖' }, [
      recentBlock,
      el('div', { className: 'site-sitemap-head' }, [
        el('a', {
          href: `${rootPrefix()}index.html`,
          className: isActiveHref(`${rootPrefix()}index.html`, scriptureSlugs) ? 'site-sitemap-home is-active' : 'site-sitemap-home',
        }, ['工具首頁']),
        el('a', {
          href: `${rootPrefix()}scriptures.html`,
          className: isActiveHref(`${rootPrefix()}scriptures.html`, scriptureSlugs) ? 'site-sitemap-home is-active' : 'site-sitemap-home',
        }, ['藏經閣']),
      ]),
      el('div', { className: 'site-sitemap-section-label' }, ['工具分類']),
      ...buildToolSections(tools, recentRankByHref, scriptureSlugs),
      el('div', { className: 'site-sitemap-section-label' }, ['藏經閣經典']),
      ...buildScriptureSections(scriptures, recentRankByHref, scriptureSlugs),
    ]);
  }

  function refreshSitemap(root, tools, scriptures, scriptureSlugs) {
    const history = readHistory();
    const next = buildNav(tools, scriptures, history, scriptureSlugs);
    root.replaceWith(next);
    openGroupsForContext(next, recentRankMap(history, scriptureSlugs));
    next.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => setMobileOpen(false));
    });
    return next;
  }

  async function init() {
    if (!document.querySelector('#header .branding') || document.getElementById('site-sitemap')) return;

    const { tools, scriptures } = await loadCatalogs();
    const scriptureSlugs = scriptureSlugSet(scriptures);
    const history = readHistory();

    let nav = buildNav(tools, scriptures, history, scriptureSlugs);

    const search = el('input', {
      type: 'search',
      className: 'site-sitemap-search',
      placeholder: '搜尋工具或經典…',
      'aria-label': '搜尋網站地圖',
    });

    const closeBtn = el('button', {
      type: 'button',
      className: 'site-sitemap-close d-xl-none',
      'aria-label': '關閉網站地圖',
      onClick: () => setMobileOpen(false),
    }, ['×']);

    const aside = el('aside', {
      id: 'site-sitemap',
      className: 'site-sitemap',
      'aria-hidden': 'true',
    }, [
      el('div', { className: 'site-sitemap-top' }, [
        el('strong', { className: 'site-sitemap-title' }, ['網站地圖']),
        closeBtn,
      ]),
      search,
      nav,
    ]);

    const backdrop = el('button', {
      type: 'button',
      className: 'site-sitemap-backdrop',
      'aria-label': '關閉網站地圖',
      onClick: () => setMobileOpen(false),
    });

    const fab = el('button', {
      type: 'button',
      className: 'site-sitemap-fab d-xl-none',
      'aria-label': '開啟網站地圖',
      'aria-expanded': 'false',
      onClick: () => setMobileOpen(!document.body.classList.contains('site-sitemap-open')),
    }, [
      el('i', { className: 'bi bi-list-nested', 'aria-hidden': 'true' }),
      el('span', { className: 'site-sitemap-fab-text' }, ['目錄']),
    ]);

    aside.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => setMobileOpen(false));
    });

    document.body.appendChild(aside);
    document.body.appendChild(backdrop);
    document.body.appendChild(fab);
    document.body.classList.add('has-site-sitemap');

    aside.addEventListener('input', (e) => {
      if (!e.target.matches('.site-sitemap-search')) return;
      const navEl = aside.querySelector('.site-sitemap-nav');
      if (navEl) applySearch(navEl, e.target.value);
    });

    openGroupsForContext(nav, recentRankMap(history, scriptureSlugs));

    const asideEl = aside;
    window.addEventListener('load', () => {
      const currentNav = asideEl.querySelector('.site-sitemap-nav');
      if (currentNav) nav = refreshSitemap(currentNav, tools, scriptures, scriptureSlugs);
    });

    window.addEventListener('storage', (e) => {
      if (e.key !== HISTORY_KEY) return;
      const currentNav = asideEl.querySelector('.site-sitemap-nav');
      if (currentNav) {
        const q = asideEl.querySelector('.site-sitemap-search')?.value || '';
        nav = refreshSitemap(currentNav, tools, scriptures, scriptureSlugs);
        if (q) applySearch(nav, q);
      }
    });

    const mq = window.matchMedia('(min-width: 1200px)');
    function syncAria() {
      aside.setAttribute('aria-hidden', mq.matches ? 'false' : 'true');
    }
    mq.addEventListener('change', syncAria);
    syncAria();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
