(function () {
  'use strict';

  const STORAGE_KEY = 'watools-nav-history';
  const MAX_ITEMS = 30;
  const NAV_MAX = 7;
  let memoryStore = null;

  function isInScriptureDir() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function pageHref() {
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;

    const name = path.split('/').pop();
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
    return canonical;
  }

  function pageTitle() {
    const h1 = document.querySelector('.page-title .heading h1')
      || document.querySelector('.watools-hero h1');
    if (h1 && h1.textContent.trim()) return h1.textContent.trim();
    return document.title.replace(/\s*[-–—]\s*WaTools.*$/i, '').trim() || pageHref();
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

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isCurrent(href) {
    return href === pageHref();
  }

  function getIcon(href) {
    if (href === 'index.html') return 'bi-house';
    if (href === 'scriptures.html') return 'bi-yin-yang';
    if (href === 'torch.html') return 'bi-lightbulb-fill';
    if (href.startsWith('scripture/') || href.startsWith('scripture-')) return 'bi-journal-richtext';

    const slug = href.replace(/^scripture\/|^scripture-|\.html$/g, '');
    const catalog = window.WA_TOOLS_CATALOG;
    if (catalog) {
      for (const cat of catalog) {
        const tool = cat.tools.find((t) => t.slug === slug);
        if (tool) return tool.icon;
      }
    }

    const scriptures = window.WA_SCRIPTURES_CATALOG;
    if (scriptures) {
      for (const cat of scriptures) {
        const book = cat.books.find((b) => b.slug === slug);
        if (book) return 'bi-journal-richtext';
      }
    }

    return 'bi-bookmark';
  }

  function formatTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return d.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
  }

  function renderNavItems(list) {
    const nav = document.querySelector('#navmenu > ul');
    if (!nav) return;

    nav.querySelectorAll('li.nav-history-entry').forEach((el) => el.remove());

    const items = list.slice(0, NAV_MAX);
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

  function renderHistoryPanel(list) {
    const cards = document.getElementById('nav-history-cards');
    if (!cards) return;

    if (!list.length) {
      cards.innerHTML = '<p class="nav-history-panel-empty">尚無瀏覽紀錄，多逛幾個工具就會出現了。</p>';
      return;
    }

    cards.innerHTML = list.map((item, index) => {
      const icon = getIcon(item.href);
      const current = isCurrent(item.href) ? ' nav-history-card-current' : '';
      return `
        <a href="${escapeHtml(resolveHref(item.href))}" class="nav-history-card${current}" title="${escapeHtml(item.title)}">
          <div class="nav-history-card-icon"><i class="bi ${icon}"></i></div>
          <div class="nav-history-card-body">
            <span class="nav-history-card-title">${escapeHtml(item.title)}</span>
            <span class="nav-history-card-time">${index === 0 ? '剛剛' : formatTime(item.ts)}</span>
          </div>
        </a>
      `;
    }).join('');
  }

  function setupHistoryButton() {
    const cta = document.querySelector('#header .branding .cta-btn');
    if (!cta || document.getElementById('nav-history-toggle')) return;

    const wrap = document.createElement('div');
    wrap.className = 'nav-history-cta-wrap';
    wrap.innerHTML = `
      <button type="button" class="cta-btn nav-history-toggle" id="nav-history-toggle" aria-expanded="false" aria-controls="nav-history-panel" aria-label="歷史紀錄">
        <i class="bi bi-clock-history nav-history-toggle-icon" aria-hidden="true"></i><span class="nav-history-toggle-label">歷史紀錄</span>
      </button>
      <div class="nav-history-panel" id="nav-history-panel" hidden>
        <div class="nav-history-panel-header">
          <strong>完整瀏覽紀錄</strong>
          <span class="nav-history-panel-hint">新 → 舊</span>
        </div>
        <div class="nav-history-cards" id="nav-history-cards"></div>
      </div>
    `;
    cta.replaceWith(wrap);

    const toggle = document.getElementById('nav-history-toggle');
    const panel = document.getElementById('nav-history-panel');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = panel.hidden;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.classList.toggle('is-open', open);
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
      }
    });

    panel.addEventListener('click', (e) => {
      if (e.target.closest('.nav-history-card')) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        toggle.classList.remove('is-open');
      }
    });
  }

  function renderAll(list) {
    renderNavItems(list);
    renderHistoryPanel(list);
  }

  function init() {
    if (!document.querySelector('#header .branding')) return;

    setupHistoryButton();
    const list = recordVisit();

    renderAll(list);

    window.addEventListener('load', () => renderAll(readStore()));

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) renderAll(readStore());
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
