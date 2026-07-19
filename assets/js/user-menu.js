(function () {
  'use strict';

  const TOP_MAX = 8;
  let menuApi = null;

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

  function isSettingsPage() {
    const href = pageHref();
    return href === 'settings.html'
      || href === 'utility/settings.html'
      || href === 'settings'
      || href === 'utility/settings';
  }

  function pageHref() {
    if (window.WA_TOOL_URLS?.currentPageKey) return window.WA_TOOL_URLS.currentPageKey();
    const api = navApi();
    if (api?.pageHref) return api.pageHref();
    const path = location.pathname.replace(/\\/g, '/');
    const segs = path.split('/').filter(Boolean);
    if (segs[0] === 'en') segs.shift();
    const scriptureMatch = path.match(/\/scripture\/([^/?#]+\.html)$/);
    if (scriptureMatch) return `scripture/${scriptureMatch[1]}`;
    if (segs.length >= 2) {
      return `${segs[segs.length - 2]}/${segs[segs.length - 1].split('?')[0].split('#')[0].replace(/\.html$/i, '')}`;
    }
    const name = segs[0] || '';
    if (!name) return 'index.html';
    return name.split('?')[0].split('#')[0];
  }

  function resolveHref(href) {
    if (!href) return href;
    if (href.startsWith('http://') || href.startsWith('https://')) return href;
    if (window.WA_TOOL_URLS?.absolutePageHref) {
      return window.WA_TOOL_URLS.absolutePageHref(String(href).replace(/^\/+/, '').replace(/\.html$/i, ''));
    }
    if (window.WA_LOCALE?.href) {
      return window.WA_LOCALE.href(String(href).replace(/^\/+/, '').replace(/\.html$/i, ''));
    }
    const api = navApi();
    if (api?.resolveHref) return api.resolveHref(href);
    if (href.startsWith('/')) return href;
    const prefix = (() => {
      const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
      const depth = segs.length > 1 ? segs.length - 1 : 0;
      return depth ? '../'.repeat(depth) : '';
    })();
    if (href.startsWith('../')) return href;
    return prefix + href;
  }

  function settingsHref() {
    if (window.WA_TOOL_URLS?.absolutePageHref) {
      return window.WA_TOOL_URLS.absolutePageHref('utility/settings');
    }
    if (window.WA_LOCALE?.href) return window.WA_LOCALE.href('utility/settings');
    const api = navApi();
    if (api?.settingsHref) return api.settingsHref();
    const cta = document.querySelector('#header .cta-btn[href*="settings"], #header a.cta-btn');
    if (cta && cta.getAttribute('href')) return cta.getAttribute('href');
    return '/utility/settings';
  }

  function topFrequent(list) {
    const api = navApi();
    if (api?.topFrequent) return api.topFrequent(list, TOP_MAX);
    return [...list]
      .sort((a, b) => (b.count || 1) - (a.count || 1) || (b.ts || 0) - (a.ts || 0))
      .slice(0, TOP_MAX);
  }

  function isEn() {
    return window.WA_LOCALE?.isEn?.() || document.documentElement.getAttribute('data-locale') === 'en';
  }

  function isSimp() {
    return !isEn() && document.documentElement.getAttribute('data-zh-variant') === 'simp';
  }

  function t(key, fallback) {
    if (isEn() && window.WA_LOCALE?.t) return window.WA_LOCALE.t(key, fallback);
    return fallback;
  }

  function toggleLabelText() {
    if (isEn()) return t('chrome.settings', 'Settings');
    return isSimp() ? '设定' : '設定';
  }

  function personalSettingsLabel() {
    if (isEn()) return t('chrome.personalSettings', 'Personal settings');
    return isSimp() ? '个人设定' : '個人設定';
  }

  function mostVisitedLabel() {
    if (isEn()) return t('chrome.mostVisited', 'Most visited');
    return isSimp() ? '最常浏览' : '最常瀏覽';
  }

  function noHistoryLabel() {
    if (isEn()) return t('chrome.noHistory', 'No browsing history yet — visit a few tools and they will show up here.');
    return isSimp() ? '还没有浏览纪录，多逛几个工具就会出现啰' : '還沒有瀏覽紀錄，多逛幾個工具就會出現囉';
  }

  function countLabel(count) {
    if (isEn()) return `${count} ${t('chrome.times', 'views')}`;
    return isSimp() ? `${count} 次` : `${count} 次`;
  }

  function closeMenu() {
    if (menuApi?.setOpen) menuApi.setOpen(false);
  }

  function initUserMenu() {
    const existing = document.getElementById('user-menu');
    if (existing && menuApi) {
      menuApi.refreshChrome();
      return;
    }

    const cta = document.querySelector('#header .branding .cta-btn:not(.user-menu-toggle)')
      || document.querySelector('#header .branding a.cta-btn');
    if (!cta && !existing) return;
    if (existing) return;

    const wrap = document.createElement('div');
    wrap.className = 'user-menu ignore-opencc';
    wrap.id = 'user-menu';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = `user-menu-toggle cta-btn d-inline-flex${isSettingsPage() ? ' active' : ''}`;
    toggle.setAttribute('aria-haspopup', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'user-menu-panel');
    toggle.innerHTML = `${toggleLabelText()} <i class="bi bi-chevron-down user-menu-chevron" aria-hidden="true"></i>`;

    const panel = document.createElement('div');
    panel.className = 'user-menu-panel';
    panel.id = 'user-menu-panel';
    panel.hidden = true;
    panel.setAttribute('role', 'menu');

    const settingsItem = document.createElement('a');
    settingsItem.className = 'user-menu-settings';
    settingsItem.href = settingsHref();
    settingsItem.setAttribute('role', 'menuitem');
    settingsItem.innerHTML = '<i class="bi bi-sliders" aria-hidden="true"></i><span></span>';
    settingsItem.querySelector('span').textContent = personalSettingsLabel();
    if (isSettingsPage()) settingsItem.setAttribute('aria-current', 'page');

    const historyHead = document.createElement('div');
    historyHead.className = 'user-menu-history-head';
    historyHead.textContent = mostVisitedLabel();

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
        empty.textContent = noHistoryLabel();
        historyList.appendChild(empty);
        return;
      }

      const cur = pageHref();
      const displayTitle = (item) => {
        const api = navApi();
        if (api?.displayTitle) return api.displayTitle(item);
        return String(item?.title || item?.href || '').trim();
      };
      const escapeHtml = (s) => String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
      list.forEach((item, index) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'none');
        const a = document.createElement('a');
        a.href = resolveHref(item.href);
        a.setAttribute('role', 'menuitem');
        const label = displayTitle(item);
        a.title = label;
        if (item.href === cur || resolveHref(item.href) === location.pathname) {
          a.classList.add('is-current');
        }
        const count = item.count || 1;
        a.innerHTML = `<span class="user-menu-history-rank">${index + 1}</span><span class="user-menu-history-title">${escapeHtml(label)}</span><span class="user-menu-history-count">${countLabel(count)}</span>`;
        li.appendChild(a);
        historyList.appendChild(li);
      });
    }

    function setOpen(open) {
      const on = Boolean(open);
      panel.hidden = !on;
      toggle.setAttribute('aria-expanded', on ? 'true' : 'false');
      wrap.classList.toggle('is-open', on);
      document.getElementById('header')?.classList.toggle('user-menu-open', on);
      if (on) {
        settingsItem.href = settingsHref();
        renderHistory();
      }
    }

    function refreshChrome() {
      toggle.classList.toggle('active', isSettingsPage());
      toggle.innerHTML = `${toggleLabelText()} <i class="bi bi-chevron-down user-menu-chevron" aria-hidden="true"></i>`;
      settingsItem.href = settingsHref();
      const span = settingsItem.querySelector('span');
      if (span) span.textContent = personalSettingsLabel();
      if (isSettingsPage()) settingsItem.setAttribute('aria-current', 'page');
      else settingsItem.removeAttribute('aria-current');
      historyHead.textContent = mostVisitedLabel();
      if (!panel.hidden) renderHistory();
    }

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(panel.hidden);
    });

    // Capture phase: soft-nav also uses capture and would otherwise leave the menu open.
    panel.addEventListener('click', (e) => {
      const link = e.target.closest('a[href]');
      if (link && panel.contains(link)) setOpen(false);
    }, true);

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    menuApi = { setOpen, refreshChrome, wrap, panel, toggle };
    window.WA_USER_MENU = { close: () => setOpen(false), refresh: refreshChrome };

    renderHistory();
  }

  function onSoftNav() {
    closeMenu();
    if (!document.getElementById('user-menu')) {
      initUserMenu();
      return;
    }
    menuApi?.refreshChrome?.();
  }

  function boot() {
    if (window.WA_NAV_HISTORY) {
      initUserMenu();
    } else {
      window.addEventListener('mytoolife:nav-history', initUserMenu, { once: true });
      window.setTimeout(initUserMenu, 0);
    }
    window.addEventListener('mytoolife:soft-nav', onSoftNav);
    window.addEventListener('mytoolife:prefs-changed', () => {
      // Language/theme may change labels; keep menu closed and refresh chrome.
      closeMenu();
      menuApi?.refreshChrome?.();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
