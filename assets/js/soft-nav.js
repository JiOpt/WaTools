/**
 * Soft navigation — swap <main> only, keep sidebar/header shell.
 * Intercepts sitemap, cards, pager, header nav, and other same-origin page links.
 */
(function () {
  'use strict';

  const PAGE_BODY_CLASSES = ['index-page', 'tool-page', 'scripture-page', 'plan-page'];
  const PAGE_HTML_CLASSES = ['wa-tool-page'];
  const SOFT_NAV_ROOTS = '#header, main.main, #site-sitemap, #footer';
  let navigating = false;

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return path;
  }

  function loadScriptOnce(relativePath) {
    const file = relativePath.split('?')[0].split('/').pop();
    if (document.querySelector(`script[src*="${file}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = assetUrl(relativePath);
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${relativePath}`));
      document.head.appendChild(script);
    });
  }

  function isSitePagePath(pathname) {
    const path = String(pathname || '').replace(/\\/g, '/');
    if (!path || path === '/') return true;
    if (/\/assets\//i.test(path)) return false;
    if (/\.html$/i.test(path)) return true;
    const segs = path.split('/').filter(Boolean);
    if (!segs.length) return true;
    if (segs.length === 1) return true;
    if (segs[0] === 'scripture' && segs.length === 2) return true;
    if (segs.length === 2) return true;
    return false;
  }

  function shouldSoftNavigate(anchor) {
    if (!anchor) return false;
    const raw = anchor.getAttribute('href');
    if (!raw || raw.startsWith('javascript:')) return false;
    if (raw === '#') return false;
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false;
    if (!anchor.closest(SOFT_NAV_ROOTS)) return false;

    let url;
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      return false;
    }

    if (url.origin !== location.origin) return false;
    if (!/^https?:$/i.test(url.protocol)) return false;
    if (!isSitePagePath(url.pathname)) return false;

    return true;
  }

  function sameDocumentUrl(a, b) {
    return a.origin === b.origin
      && a.pathname === b.pathname
      && a.search === b.search;
  }

  function normalizeDuplicateCategoryPath(pathname) {
    const segs = String(pathname || '').split('/').filter(Boolean);
    if (segs.length < 3) return pathname;
    const file = segs[segs.length - 1];
    const cat = segs[segs.length - 2];
    const prev = segs[segs.length - 3];
    if (cat === prev && /\.html$/i.test(file)) {
      segs.splice(segs.length - 2, 1);
      return `/${segs.join('/')}`;
    }
    return pathname;
  }

  function resolveNavigationUrl(urlString) {
    let url;
    try {
      url = new URL(urlString, location.href);
    } catch {
      return null;
    }

    url.pathname = normalizeDuplicateCategoryPath(url.pathname);

    const path = url.pathname.replace(/\\/g, '/');
    const segs = path.split('/').filter(Boolean);
    const file = segs[segs.length - 1] || '';
    if (!file || file === 'index' || file === 'index.html' || path === '/') {
      url.pathname = '/';
      return url;
    }
    if (file.endsWith('.html')) {
      if (segs.length >= 2) {
        segs[segs.length - 1] = file.replace(/\.html$/i, '');
        url.pathname = `/${segs.join('/')}`;
        return url;
      }
      const slug = file.replace(/\.html$/i, '');
      if (window.WA_TOOL_URLS?.getCategoryId) {
        const catId = window.WA_TOOL_URLS.getCategoryId(slug);
        if (catId) {
          url.pathname = `/${catId}/${slug}`;
          return url;
        }
      }
      if (window.WA_TOOLS_CATALOG) {
        for (const cat of window.WA_TOOLS_CATALOG) {
          for (const tool of cat.tools || []) {
            if (tool.slug === slug) {
              url.pathname = `/${cat.id}/${slug}`;
              return url;
            }
          }
        }
      }
      if (slug && !slug.includes('/')) {
        const scriptureMatch = window.WA_SCRIPTURES_CATALOG?.some((cat) =>
          (cat.books || []).some((book) => book.slug === slug)
        );
        if (scriptureMatch) {
          url.pathname = `/scripture/${slug}`;
          return url;
        }
      }
      url.pathname = `/${slug}`;
      return url;
    }
    return url;
  }

  function fetchPageHtml(urlString) {
    const opts = {
      credentials: 'same-origin',
      headers: { Accept: 'text/html' },
    };

    return fetch(urlString, opts)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .catch(() => new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', urlString, true);
        xhr.onload = () => {
          if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 300)) {
            resolve(xhr.responseText);
            return;
          }
          reject(new Error(`HTTP ${xhr.status}`));
        };
        xhr.onerror = () => reject(new Error('xhr failed'));
        xhr.send();
      }));
  }

  function extractRedirectTarget(html, baseUrl) {
    const refresh = html.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"';>\s]+)/i);
    const replace = html.match(/location\.replace\(\s*["']([^"']+)["']\s*\)/i);
    const target = refresh?.[1] || replace?.[1];
    if (!target) return null;
    try {
      return new URL(target.trim(), baseUrl).href;
    } catch {
      return null;
    }
  }

  async function fetchPageDocument(urlString, depth) {
    const level = depth || 0;
    if (level > 3) throw new Error('redirect loop');

    const resolved = resolveNavigationUrl(urlString);
    if (!resolved) throw new Error('bad url');

    const html = await fetchPageHtml(resolved.href);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    if (doc.querySelector('main.main')) {
      return { doc, url: resolved.href };
    }

    const redirect = extractRedirectTarget(html, resolved.href);
    if (redirect && redirect !== resolved.href) {
      return fetchPageDocument(redirect, level + 1);
    }

    throw new Error('missing main');
  }

  function syncBodyClasses(sourceBody, sourceHtml) {
    PAGE_BODY_CLASSES.forEach((cls) => document.body.classList.remove(cls));
    PAGE_BODY_CLASSES.forEach((cls) => {
      if (sourceBody.classList.contains(cls)) document.body.classList.add(cls);
    });

    PAGE_HTML_CLASSES.forEach((cls) => document.documentElement.classList.remove(cls));
    PAGE_HTML_CLASSES.forEach((cls) => {
      if (sourceHtml.classList.contains(cls)) document.documentElement.classList.add(cls);
    });
  }

  function syncHeaderNav(doc) {
    const nextList = doc.querySelector('#navmenu > ul');
    const curList = document.querySelector('#navmenu > ul');
    if (nextList && curList) curList.innerHTML = nextList.innerHTML;
  }

  function syncMeta(doc) {
    const desc = doc.querySelector('meta[name="description"]');
    const curDesc = document.querySelector('meta[name="description"]');
    if (desc && curDesc && desc.getAttribute('content') != null) {
      curDesc.setAttribute('content', desc.getAttribute('content'));
    }
  }

  function setMainBusy(busy) {
    const main = document.querySelector('main.main');
    if (!main) return;
    main.classList.toggle('soft-nav-busy', busy);
    main.setAttribute('aria-busy', busy ? 'true' : 'false');
  }

  async function ensurePageScripts() {
    const hasToolApp = document.getElementById('tool-app');
    const isScripture = document.querySelector('.scripture-section');
    const hasScripturesHub = document.getElementById('scriptures-hub');
    const hasToolsCatalog = document.getElementById('tools-catalog');

    if (hasToolApp) {
      if (!document.querySelector('script[src*="tools-data.js"]')) {
        await loadScriptOnce('assets/js/tools-data.js');
      }
      if (!document.querySelector('script[src*="tool-urls.js"]')) {
        await loadScriptOnce('assets/js/tool-urls.js');
      }
      if (!document.querySelector('script[src*="sitemap-pager.js"]')) {
        await loadScriptOnce('assets/js/sitemap-pager.js');
      }
      await loadScriptOnce('assets/js/tool-boot.js');
      await loadScriptOnce('assets/js/tool-category-pager.js');
    }

    if (isScripture) {
      if (!document.querySelector('script[src*="sitemap-pager.js"]')) {
        await loadScriptOnce('assets/js/sitemap-pager.js');
      }
      if (!document.querySelector('script[src*="scriptures-catalog.js"]')) {
        await loadScriptOnce('assets/js/scriptures-catalog.js');
      }
      await loadScriptOnce('assets/js/scripture-pager.js');
    }

    if (hasScripturesHub) {
      if (!document.querySelector('script[src*="scriptures-catalog.js"]')) {
        await loadScriptOnce('assets/js/scriptures-catalog.js');
      }
      await loadScriptOnce('assets/js/scriptures-hub.js');
    }

    if (hasToolsCatalog) {
      if (!document.querySelector('script[src*="tools-data.js"]')) {
        await loadScriptOnce('assets/js/tools-data.js');
      }
      if (!document.querySelector('script[src*="tool-urls.js"]')) {
        await loadScriptOnce('assets/js/tool-urls.js');
      }
      if (!document.querySelector('script[src*="sitemap-manifest.js"]')) {
        await loadScriptOnce('assets/js/sitemap-manifest.js');
      }
      await loadScriptOnce('assets/js/catalog-render.js');
    }
  }

  async function afterNavigate() {
    if (typeof window.__waRecordNavVisit === 'function') {
      window.__waRecordNavVisit();
    }

    if (typeof window.__waPatchSitemapAfterNav === 'function') {
      window.__waPatchSitemapAfterNav();
    } else if (typeof window.__waRefreshSitemapNav === 'function') {
      window.__waRefreshSitemapNav();
    }

    await ensurePageScripts();

    if (document.getElementById('tool-app')) {
      if (typeof window.__waEnsurePagerPlaceholders === 'function') {
        window.__waEnsurePagerPlaceholders();
      }
      if (typeof window.__waBootTool === 'function') {
        await window.__waBootTool(true);
      } else if (typeof window.__waInjectToolCategoryPager === 'function') {
        await window.__waInjectToolCategoryPager();
      }
    } else if (typeof window.__waInjectToolCategoryPager === 'function') {
      document.querySelectorAll('.tool-page-bar, .tool-category-pager').forEach((el) => el.remove());
    }

    if (document.querySelector('.scripture-section')) {
      if (typeof window.__waBootScripturePager === 'function') {
        await window.__waBootScripturePager();
      }
    }

    if (document.getElementById('scriptures-hub')) {
      if (typeof window.__waBootScripturesHub === 'function') {
        window.__waBootScripturesHub();
      }
    }

    if (document.getElementById('tools-catalog')) {
      if (typeof window.__waBootToolsCatalog === 'function') {
        await window.__waBootToolsCatalog();
      }
    }

    if (typeof window.renderSiteFooter === 'function') {
      window.renderSiteFooter();
    }

    document.body.classList.remove('mobile-nav-active');
    const toggle = document.querySelector('.mobile-nav-toggle');
    if (toggle) {
      toggle.classList.add('bi-list');
      toggle.classList.remove('bi-x');
    }

    window.dispatchEvent(new CustomEvent('mytoolife:soft-nav', {
      detail: { href: location.href },
    }));
  }

  async function navigateTo(urlString, options) {
    const push = options?.push !== false;
    if (navigating) return;
    navigating = true;
    setMainBusy(true);

    if (typeof window.__waCancelToolBoot === 'function') {
      window.__waCancelToolBoot();
    }

    let targetUrl = resolveNavigationUrl(urlString) || new URL(urlString, location.href);

    try {
      const { doc, url: finalUrl } = await fetchPageDocument(targetUrl.href);
      targetUrl = new URL(finalUrl, location.href);

      const nextMain = doc.querySelector('main.main');
      const curMain = document.querySelector('main.main');
      if (!nextMain || !curMain) throw new Error('missing main');

      const importedMain = document.importNode(nextMain, true);
      curMain.replaceWith(importedMain);

      document.title = doc.title || document.title;
      syncBodyClasses(doc.body, doc.documentElement);
      syncHeaderNav(doc);
      syncMeta(doc);

      if (push) {
        history.pushState({ softNav: true }, '', targetUrl.href);
      }

      window.scrollTo(0, 0);
      await afterNavigate();

      if (targetUrl.hash) {
        const hashTarget = document.querySelector(targetUrl.hash);
        if (hashTarget) {
          hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      console.warn('[MyTooLife] soft-nav failed, falling back to full load:', err);
      location.assign(targetUrl.href);
    } finally {
      setMainBusy(false);
      navigating = false;
    }
  }

  function handleSoftNavClick(event) {
    const anchor = event.target.closest('a[href]');
    if (!anchor || !shouldSoftNavigate(anchor)) return;
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const targetUrl = new URL(anchor.href, location.href);
    const currentUrl = new URL(location.href);

    event.preventDefault();
    event.stopPropagation();

    if (anchor.closest('#site-sitemap')) {
      document.body.classList.remove('site-sitemap-open');
    }
    if (typeof anchor.blur === 'function') anchor.blur();

    if (navigating) return;

    if (sameDocumentUrl(targetUrl, currentUrl)) {
      if (targetUrl.hash && targetUrl.hash !== currentUrl.hash) {
        history.replaceState(history.state, '', targetUrl.href);
        const hashTarget = document.querySelector(targetUrl.hash);
        if (hashTarget) hashTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    navigateTo(targetUrl.href);
  }

  function onPopState() {
    if (navigating) return;
    navigateTo(location.href, { push: false });
  }

  function init() {
    if (!document.querySelector('#header .branding')) return;
    document.addEventListener('click', handleSoftNavClick, true);
    window.addEventListener('popstate', onPopState);
  }

  window.__waSoftNavigate = navigateTo;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
