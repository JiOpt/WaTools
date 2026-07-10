(function () {
  'use strict';

  const STORAGE_KEY = 'watools-nav-history';

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
    if (isInScriptureDir() && !canonical.startsWith('scripture/') && !canonical.startsWith('http')) {
      return `../${canonical}`;
    }
    return canonical;
  }

  function readStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function settingsHref() {
    const cta = document.querySelector('#header .cta-btn[href*="settings"]');
    if (cta) return cta.getAttribute('href');
    return isInScriptureDir() ? '../settings.html' : 'settings.html';
  }

  function isSettingsPage() {
    return /settings\.html$/i.test(pageHref());
  }

  function formatWhen(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '';
    const now = new Date();
    const sameDay = d.toDateString() === now.toDateString();
    if (sameDay) {
      return new Intl.DateTimeFormat('zh-Hant', { hour: '2-digit', minute: '2-digit' }).format(d);
    }
    return new Intl.DateTimeFormat('zh-Hant', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }).format(d);
  }

  function initUserMenu() {
    const cta = document.querySelector('#header .branding .cta-btn[href*="settings"]');
    if (!cta || document.getElementById('user-menu')) return;

    const settingsLink = settingsHref();
    const wrap = document.createElement('div');
    wrap.className = 'user-menu';
    wrap.id = 'user-menu';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = `user-menu-toggle cta-btn${isSettingsPage() ? ' active' : ''}`;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'user-menu-panel');
    toggle.innerHTML = '個人化設定 <i class="bi bi-chevron-down user-menu-chevron" aria-hidden="true"></i>';

    const panel = document.createElement('div');
    panel.className = 'user-menu-panel';
    panel.id = 'user-menu-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'menu');

    const settingsItem = document.createElement('a');
    settingsItem.className = 'user-menu-settings';
    settingsItem.href = settingsLink;
    settingsItem.setAttribute('role', 'menuitem');
    settingsItem.innerHTML = '<i class="bi bi-sliders" aria-hidden="true"></i><span>個人化設定</span>';
    if (isSettingsPage()) settingsItem.setAttribute('aria-current', 'page');

    const historyHead = document.createElement('div');
    historyHead.className = 'user-menu-history-head';
    historyHead.textContent = '完整瀏覽紀錄';

    const historyList = document.createElement('ul');
    historyList.className = 'user-menu-history';
    historyList.setAttribute('role', 'none');

    panel.append(settingsItem, historyHead, historyList);
    wrap.append(toggle, panel);
    cta.replaceWith(wrap);

    function renderHistory() {
      const list = readStore();
      historyList.replaceChildren();
      if (!list.length) {
        const empty = document.createElement('li');
        empty.className = 'user-menu-history-empty';
        empty.textContent = '尚無瀏覽紀錄';
        historyList.appendChild(empty);
        return;
      }

      const cur = pageHref();
      list.forEach((item) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'none');
        const a = document.createElement('a');
        a.href = resolveHref(item.href);
        a.setAttribute('role', 'menuitem');
        a.title = item.title;
        if (item.href === cur) a.classList.add('is-current');
        a.innerHTML = `<span class="user-menu-history-title">${item.title}</span><time class="user-menu-history-time">${formatWhen(item.ts)}</time>`;
        li.appendChild(a);
        historyList.appendChild(li);
      });
    }

    function setOpen(open) {
      const on = Boolean(open);
      panel.hidden = !on;
      toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
      wrap.classList.toggle('is-open', on);
      if (on) renderHistory();
    }

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(panel.hidden);
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && !panel.hidden) renderHistory();
    });

    window.addEventListener('watools:nav-history', () => {
      if (!panel.hidden) renderHistory();
    });

    renderHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserMenu);
  } else {
    initUserMenu();
  }
})();
