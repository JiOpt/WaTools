(function () {
  'use strict';

  const STORAGE_KEY = 'mytoolife-nav-history';
  const MAX_ITEMS = 30;
  const NAV_MAX = 7;
  const TOP_FREQUENT_MAX = 8;
  const NAV_SKIP_HREFS = new Set([
    'index',
    'index.html',
    'index_plan',
    'index_plan.html',
    'settings',
    'settings.html',
    'utility/settings',
    'utility/settings.html',
    'copyright',
    'copyright.html',
  ]);
  const NAV_SKIP_TITLES = new Set(['工具首頁', '設定', '個人設定', '正式首頁', '版權聲明']);
  let memoryStore = null;

  function isInScriptureDir() {
    return /\/scripture\/[^/]+$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function isInCategoryDir() {
    const path = location.pathname.replace(/\\/g, '/');
    const segs = path.split('/').filter(Boolean);
    if (segs.length < 2) return false;
    if (segs[0] === 'scripture') return false;
    return !['index', 'copyright', 'contact'].includes(segs[segs.length - 1].replace(/\.html$/i, ''));
  }

  function siteRootPrefix() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.siteRootPrefix();
    const path = location.pathname.replace(/\\/g, '/');
    if (/\/scripture\/[^/]+$/i.test(path)) return '../';
    const segs = path.split('/').filter(Boolean);
    if (!segs.length) return '';
    const last = segs[segs.length - 1].replace(/\.html$/i, '');
    if (segs.length === 1 && ['index', 'copyright', 'contact'].includes(last)) return '';
    return '../'.repeat(segs.length - 1);
  }

  function pageHref() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.currentPageKey();
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+)/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1].replace(/\.html$/i, '')}`;

    const segs = path.split('/').filter(Boolean);
    if (segs.length >= 2) {
      const last = segs[segs.length - 1].split('?')[0].split('#')[0].replace(/\.html$/i, '');
      return `${segs[segs.length - 2]}/${last}`;
    }
    const name = (segs[0] || '').split('?')[0].split('#')[0].replace(/\.html$/i, '');
    if (!name || name === 'index') return 'index';
    return name;
  }

  function resolveHref(href) {
    if (!href) return href;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) return href;
    if (href.startsWith('../')) {
      const stripped = href.replace(/^\.\.\//, '');
      return stripped.startsWith('/') ? stripped : `/${stripped}`;
    }

    let canonical = href;
    if (canonical.startsWith('scripture-')) {
      canonical = `scripture/${canonical.slice('scripture-'.length)}`;
    }

    if (canonical.includes('/')) {
      return canonical.startsWith('/') ? canonical : `/${canonical}`;
    }

    if (window.WA_TOOL_URLS && canonical.endsWith('.html')) {
      return window.WA_TOOL_URLS.toolHref(canonical.replace(/\.html$/, ''));
    }
    return `/${canonical}`;
  }

  /** Short label for top nav — prefer catalog/tool bar name over SEO <title>. */
  function shortNavTitle(raw) {
    let t = String(raw || '').trim();
    if (!t) return '';
    t = t.replace(/\s*[|｜]\s*Kawatool\s*$/i, '').trim();
    t = t.replace(/\s*[-–—]\s*Kawatool.*$/i, '').trim();
    // Keep left segment before full-width/half-width pipe (SEO subtitle).
    const pipe = t.search(/\s*[|｜]\s*/);
    if (pipe > 0) t = t.slice(0, pipe).trim();
    return t;
  }

  function catalogTitleForHref(href) {
    const key = String(href || '');
    const slug = key.includes('/') ? key.split('/').pop() : key;
    if (!slug || !window.WA_TOOLS_CATALOG) return '';
    for (const category of window.WA_TOOLS_CATALOG) {
      for (const tool of category.tools || []) {
        if (tool.slug === slug && tool.title) return String(tool.title).trim();
      }
    }
    return '';
  }

  function pageTitle() {
    const bar = document.querySelector('.tool-page-bar-title');
    if (bar && bar.textContent.trim()) return shortNavTitle(bar.textContent);

    const h1 = document.querySelector('.page-title .heading h1')
      || document.querySelector('.mytoolife-hero h1');
    if (h1 && h1.textContent.trim()) return shortNavTitle(h1.textContent);

    const fromCatalog = catalogTitleForHref(pageHref());
    if (fromCatalog) return fromCatalog;

    return shortNavTitle(document.title) || pageHref();
  }

  function readStore() {
    if (memoryStore) return memoryStore;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return memoryStore || [];
    }
  }

  function writeStore(list) {
    memoryStore = list;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      /* file:// or quota — keep in memory for session */
    }
    window.dispatchEvent(new CustomEvent('mytoolife:nav-history'));
  }

  function recordVisit() {
    const href = pageHref();
    if (!href || href.startsWith('assets/')) return readStore();

    const entry = {
      href,
      title: pageTitle(),
      ts: Date.now(),
      count: 1,
    };

    let list = readStore();
    const idx = list.findIndex((item) => item.href === href);
    if (idx >= 0) {
      const prev = list[idx];
      entry.count = (prev.count || 1) + 1;
      // Prefer freshly resolved short title; fall back to shortened stored title.
      if (!entry.title && prev.title) entry.title = shortNavTitle(prev.title);
      list.splice(idx, 1);
    }
    list.unshift(entry);
    if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
    writeStore(list);
    return list;
  }

  function topFrequent(list, limit = TOP_FREQUENT_MAX) {
    return [...list]
      .filter((item) => !shouldSkipHistoryItem(item))
      .sort((a, b) => {
        const diff = (b.count || 1) - (a.count || 1);
        if (diff !== 0) return diff;
        return (b.ts || 0) - (a.ts || 0);
      })
      .slice(0, limit);
  }

  function isCurrent(href) {
    return href === pageHref();
  }

  function shouldSkipHistoryItem(item) {
    if (NAV_SKIP_HREFS.has(item.href)) return true;
    if (NAV_SKIP_TITLES.has(item.title)) return true;
    return false;
  }

  function staticNavShowsCurrent() {
    return Boolean(document.querySelector('#navmenu > ul > li:not(.nav-history-entry) a.active'));
  }

  function renderNavItems(list) {
    const nav = document.querySelector('#navmenu > ul');
    if (!nav) return;

    nav.querySelectorAll('li.nav-history-entry').forEach((el) => el.remove());

    let items = list.filter((item) => !shouldSkipHistoryItem(item));
    if (staticNavShowsCurrent()) {
      items = items.filter((item) => !isCurrent(item.href));
    }
    items = items.slice(0, NAV_MAX);
    if (!items.length) return;

    const frag = document.createDocumentFragment();
    items.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'nav-history-entry';
      const a = document.createElement('a');
      a.href = resolveHref(item.href);
      const label = catalogTitleForHref(item.href) || shortNavTitle(item.title) || item.title || item.href;
      a.textContent = label;
      a.title = label;
      if (isCurrent(item.href)) a.classList.add('active');
      li.appendChild(a);
      frag.appendChild(li);
    });

    nav.appendChild(frag);
  }

  function init() {
    if (!document.querySelector('#header .branding')) return;

    const list = recordVisit();
    renderNavItems(list);

    window.addEventListener('load', () => renderNavItems(readStore()));

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) renderNavItems(readStore());
    });

    window.addEventListener('mytoolife:catalog-ready', () => {
      renderNavItems(readStore());
    });
  }

  window.__waRecordNavVisit = function recordNavVisit() {
    const list = recordVisit();
    renderNavItems(list);
    return list;
  };

  window.WA_NAV_HISTORY = {
    STORAGE_KEY,
    readStore,
    pageHref,
    resolveHref,
    shortNavTitle,
    displayTitle(item) {
      if (!item) return '';
      return catalogTitleForHref(item.href) || shortNavTitle(item.title) || item.title || item.href || '';
    },
    shouldSkipItem: shouldSkipHistoryItem,
    topFrequent,
    settingsHref() {
      if (window.WA_TOOL_URLS?.toolHref) {
        return window.WA_TOOL_URLS.toolHref('settings');
      }
      const prefix = siteRootPrefix();
      return `${prefix}utility/settings.html`;
    },
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
