(function () {
  'use strict';

  const STORAGE_KEY = 'mytoolife-nav-history';
  const MAX_ITEMS = 30;
  const NAV_MAX = 7;
  const NAV_SKIP_HREFS = new Set(['index.html', 'settings.html', 'utility/settings.html']);
  const NAV_SKIP_TITLES = new Set(['工具首頁', '個人化設定']);
  let memoryStore = null;

  function isInScriptureDir() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function isInCategoryDir() {
    const path = location.pathname.replace(/\\/g, '/');
    const segs = path.split('/').filter(Boolean);
    if (segs.length < 2) return false;
    return /\.html$/i.test(segs[segs.length - 1]) && !/\/scripture\//i.test(path);
  }

  function siteRootPrefix() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.siteRootPrefix();
    const path = location.pathname.replace(/\\/g, '/');
    if (/\/scripture\/[^/]+\.html$/i.test(path)) return '../';
    const segs = path.split('/').filter(Boolean);
    if (segs.length <= 1) return '';
    return '../'.repeat(segs.length - 1);
  }

  function pageHref() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.currentPageKey();
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;

    const segs = path.split('/').filter(Boolean);
    if (segs.length >= 2) {
      return `${segs[segs.length - 2]}/${segs[segs.length - 1].split('?')[0].split('#')[0]}`;
    }
    const name = segs[0] || '';
    if (!name || name === '') return 'index.html';
    return name.split('?')[0].split('#')[0];
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

    const prefix = siteRootPrefix();
    if (canonical.includes('/')) {
      if (prefix) return `${prefix}${canonical}`;
      return canonical;
    }

    if (window.WA_TOOL_URLS && canonical.endsWith('.html')) {
      return window.WA_TOOL_URLS.toolHref(canonical.replace(/\.html$/, ''));
    }
    return prefix ? `${prefix}${canonical}` : canonical;
  }

  function pageTitle() {
    const h1 = document.querySelector('.page-title .heading h1')
      || document.querySelector('.mytoolife-hero h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    return document.title.replace(/\s*[-–—]\s*MyTooLife.*$/i, '').trim() || pageHref();
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
    };

    let list = readStore().filter((item) => item.href !== href);
    list.unshift(entry);
    if (list.length > MAX_ITEMS) list = list.slice(0, MAX_ITEMS);
    writeStore(list);
    return list;
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
      a.textContent = item.title;
      a.title = item.title;
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
