/**
 * Load sitemap.txt (local/plan) or sitemap-published.js (production).
 */
(function () {
  'use strict';

  if (window.WA_SITEMAP_MANIFEST?.__installed) return;

  let published = null;
  let loadPromise = null;
  let updatedLine = '';

  function rootPrefix() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.siteRootPrefix();
    const path = location.pathname.replace(/\\/g, '/');
    if (/\/scripture\/[^/]+$/i.test(path)) return '../';
    const segs = path.split('/').filter(Boolean);
    if (!segs.length) return '';
    const last = segs[segs.length - 1].replace(/\.html$/i, '');
    if (segs.length === 1 && ['index', 'copyright', 'contact'].includes(last)) return '';
    return '../'.repeat(segs.length - 1);
  }

  function manifestUrl() {
    const v = window.WA_SITE_VERSION || '1';
    return `${rootPrefix()}sitemap.txt?v=${encodeURIComponent(v)}`;
  }

  function assetUrl(relativePath) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(relativePath);
    return `${rootPrefix()}${relativePath}`;
  }

  function isPlanPage() {
    return document.body?.classList.contains('plan-page')
      || /index_plan\.html$/i.test(location.pathname.replace(/\\/g, '/'));
  }

  function isLocalPreview() {
    const h = location.hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
  }

  function shouldUsePublicTxt() {
    return isPlanPage() || isLocalPreview();
  }

  function shouldFilterNav() {
    // localhost / production: filter nav + index catalog by published slugs.
    // Unpublished tools stay reachable via direct URL.
    return true;
  }

  function setsEqual(a, b) {
    if (!a || !b || a.size !== b.size) return false;
    for (const slug of a) {
      if (!b.has(slug)) return false;
    }
    return true;
  }

  let localPollTimer = null;

  function startLocalPoll() {
    if (!isLocalPreview() || isPlanPage() || localPollTimer) return;
    localPollTimer = window.setInterval(async () => {
      try {
        const res = await fetch(manifestUrl(), { cache: 'no-store' });
        if (!res.ok) return;
        const next = parseText(await res.text());
        if (published && setsEqual(next, published)) return;
        published = next;
        loadPromise = Promise.resolve(published);
        window.dispatchEvent(new CustomEvent('mytoolife:publish-changed'));
      } catch {
        /* ignore */
      }
    }, 2000);
  }

  function parseText(text) {
    const set = new Set();
    updatedLine = '';
    String(text || '').split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('#')) {
        const m = trimmed.match(/^#\s*updated:\s*(.+)$/i);
        if (m) updatedLine = m[1].trim();
        return;
      }
      set.add(trimmed);
    });
    return set;
  }

  function applyEmbedded() {
    const data = window.WA_PUBLISHED_SLUGS;
    if (!data?.slugs) return false;
    published = new Set(data.slugs);
    updatedLine = data.updated || '';
    return true;
  }

  function loadEmbeddedScript() {
    if (window.WA_PUBLISHED_SLUGS) {
      applyEmbedded();
      return Promise.resolve(true);
    }
    return new Promise((resolve) => {
      const base = 'assets/js/sitemap-published.js';
      if (document.querySelector(`script[src*="${base.split('?')[0]}"]`)) {
        resolve(applyEmbedded());
        return;
      }
      const script = document.createElement('script');
      script.src = assetUrl(base);
      script.onload = () => resolve(applyEmbedded());
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  function serialize(slugs, note) {
    const sorted = [...slugs].sort((a, b) => a.localeCompare(b, 'zh-Hant'));
    const ts = note || new Date().toISOString();
    return [
      '# Kawatool 發布清單',
      '# 在此檔案中的 slug 會出現在左側網站地圖與首頁工具目錄。',
      '# 以 # 開頭為註解；空行略過。一行一個 slug。',
      `# updated: ${ts}`,
      '',
      ...sorted,
      '',
    ].join('\n');
  }

  function load(force) {
    if (force) {
      published = null;
      loadPromise = null;
    }
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
      if (shouldUsePublicTxt()) {
        try {
          const res = await fetch(manifestUrl(), { cache: 'no-store' });
          if (res.ok) {
            published = parseText(await res.text());
            startLocalPoll();
            return published;
          }
        } catch {
          /* fall through */
        }
        if (applyEmbedded()) {
          startLocalPoll();
          return published;
        }
        published = null;
        return published;
      }

      await loadEmbeddedScript();
      if (!published) applyEmbedded();
      if (!published) published = new Set();
      return published;
    })();

    return loadPromise;
  }

  function setPublishedPreview(slugs) {
    published = slugs instanceof Set ? new Set(slugs) : new Set(slugs || []);
    loadPromise = Promise.resolve(published);
  }

  function isPublished(slug) {
    if (!shouldFilterNav()) return true;
    if (!published) return false;
    return published.has(slug);
  }

  function filterCatalog(catalog) {
    const list = Array.isArray(catalog) ? catalog : [];
    if (!shouldFilterNav()) return list;
    if (!published) applyEmbedded();
    if (!published) return [];
    return list
      .map((category) => ({
        ...category,
        tools: (category.tools || []).filter((tool) => published.has(tool.slug)),
      }))
      .filter((category) => category.tools.length > 0);
  }

  window.WA_SITEMAP_MANIFEST = {
    load,
    parseText,
    serialize,
    isPublished,
    filterCatalog,
    isPlanPage,
    isLocalPreview,
    setPublishedPreview,
    getPublished: () => (published ? new Set(published) : null),
    getUpdated: () => updatedLine,
    __installed: true,
  };
})();
