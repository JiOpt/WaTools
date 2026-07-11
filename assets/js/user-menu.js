(function () {
  'use strict';

  const TOP_MAX = 8;

  function navApi() {
    return window.WA_NAV_HISTORY || null;
  }

  function readStore() {
    const api = navApi();
    if (api?.readStore) return api.readStore();
    try {
      const raw = localStorage.getItem('mytoolife-nav-history');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function pageHref() {
    const api = navApi();
    if (api?.pageHref) return api.pageHref();
    const path = location.pathname.replace(/\\/g, '/');
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;
    const segs = path.split('/').filter(Boolean);
    if (segs.length >= 2) {
      return `${segs[segs.length - 2]}/${segs[segs.length - 1].split('?')[0].split('#')[0]}`;
    }
    const name = segs[0] || '';
    if (!name) return 'index.html';
    return name.split('?')[0].split('#')[0];
  }

  function resolveHref(href) {
    const api = navApi();
    if (api?.resolveHref) return api.resolveHref(href);
    if (!href) return href;
    if (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/')) return href;
    const prefix = (() => {
      const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
      const depth = segs.length > 1 ? segs.length - 1 : 0;
      return depth ? '../'.repeat(depth) : '';
    })();
    if (href.startsWith('../')) return href;
    return prefix + href;
  }

  function settingsHref() {
    const api = navApi();
    if (api?.settingsHref) return api.settingsHref();
    const cta = document.querySelector('#header .cta-btn[href*="settings"]');
    if (cta) return cta.getAttribute('href');
    return 'utility/settings.html';
  }

  function isSettingsPage() {
    const href = pageHref();
    return href === 'settings.html' || href === 'utility/settings.html';
  }

  function topFrequent(list) {
    const api = navApi();
    if (api?.topFrequent) return api.topFrequent(list, TOP_MAX);
    return [...list]
      .sort((a, b) => (b.count || 1) - (a.count || 1) || (b.ts || 0) - (a.ts || 0))
      .slice(0, TOP_MAX);
  }

  function toggleLabel(cta) {
    const text = (cta.textContent || '').trim();
    if (/設定/.test(text)) return '設定';
    if (/首頁/.test(text)) return '我的選單';
    return text || '我的選單';
  }

  function initUserMenu() {
    const cta = document.querySelector('#header .branding .cta-btn');
    if (!cta || document.getElementById('user-menu')) return;

    const settingsLink = settingsHref();
    const wrap = document.createElement('div');
    wrap.className = 'user-menu';
    wrap.id = 'user-menu';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = `user-menu-toggle cta-btn d-none d-sm-inline-flex${isSettingsPage() ? ' active' : ''}`;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'user-menu-panel');
    toggle.innerHTML = `${toggleLabel(cta)} <i class="bi bi-chevron-down user-menu-chevron" aria-hidden="true"></i>`;

    const panel = document.createElement('div');
    panel.className = 'user-menu-panel';
    panel.id = 'user-menu-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'menu');

    const settingsItem = document.createElement('a');
    settingsItem.className = 'user-menu-settings';
    settingsItem.href = settingsLink;
    settingsItem.setAttribute('role', 'menuitem');
    settingsItem.innerHTML = '<i class="bi bi-sliders" aria-hidden="true"></i><span>個人設定</span>';
    if (isSettingsPage()) settingsItem.setAttribute('aria-current', 'page');

    const historyHead = document.createElement('div');
    historyHead.className = 'user-menu-history-head';
    historyHead.textContent = '最常瀏覽';

    const historyList = document.createElement('ul');
    historyList.className = 'user-menu-history';
    historyList.setAttribute('role', 'none');

    panel.append(settingsItem, historyHead, historyList);
    wrap.append(toggle, panel);
    cta.replaceWith(wrap);

    function renderHistory() {
      const list = topFrequent(readStore());
      historyList.replaceChildren();
      if (!list.length) {
        const empty = document.createElement('li');
        empty.className = 'user-menu-history-empty';
        empty.textContent = '還沒有瀏覽紀錄，多逛幾個工具就會出現囉';
        historyList.appendChild(empty);
        return;
      }

      const cur = pageHref();
      list.forEach((item, index) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'none');
        const a = document.createElement('a');
        a.href = resolveHref(item.href);
        a.setAttribute('role', 'menuitem');
        a.title = item.title;
        if (item.href === cur) a.classList.add('is-current');
        const count = item.count || 1;
        a.innerHTML = `<span class="user-menu-history-rank">${index + 1}</span><span class="user-menu-history-title">${item.title}</span><span class="user-menu-history-count">${count} 次</span>`;
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
      if (e.key === 'mytoolife-nav-history' && !panel.hidden) renderHistory();
    });

    window.addEventListener('mytoolife:nav-history', () => {
      if (!panel.hidden) renderHistory();
    });

    renderHistory();
  }

  function boot() {
    if (window.WA_NAV_HISTORY) {
      initUserMenu();
      return;
    }
    window.addEventListener('mytoolife:nav-history', initUserMenu, { once: true });
    window.setTimeout(initUserMenu, 0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
