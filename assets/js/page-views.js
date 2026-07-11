/**
 * Tool page view counts via Firebase Cloud Function (/api/pageviews).
 * Homepage cards show total views; tool pages record once per session.
 */
(function () {
  'use strict';

  const API_PATH = '/api/pageviews';
  const VISITOR_KEY = 'mytoolife-visitor-id';
  const SESSION_PREFIX = 'mytoolife-pv-session:';
  const CACHE_KEY = 'mytoolife-pv-cache';
  const CACHE_TTL_MS = 60 * 1000;
  const SKIP_SLUGS = new Set(['settings', 'scriptures', 'index']);

  function shouldSkipSlug(slug) {
    return !slug || SKIP_SLUGS.has(slug);
  }

  function visitorId() {
    try {
      let id = localStorage.getItem(VISITOR_KEY);
      if (!id) {
        id = (typeof crypto !== 'undefined' && crypto.randomUUID)
          ? crypto.randomUUID()
          : `v${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
        localStorage.setItem(VISITOR_KEY, id);
      }
      return id;
    } catch {
      return `v${Date.now().toString(36)}`;
    }
  }

  function formatCount(n) {
    return Math.max(0, Number(n) || 0).toLocaleString('zh-Hant');
  }

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      if (!parsed?.ts || Date.now() - parsed.ts > CACHE_TTL_MS) return {};
      return parsed.counts || {};
    } catch {
      return {};
    }
  }

  function writeCache(counts) {
    try {
      const prev = readCache();
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        ts: Date.now(),
        counts: { ...prev, ...counts },
      }));
    } catch {
      /* ignore */
    }
  }

  async function fetchCounts(slugs) {
    const list = [...new Set(slugs.filter((s) => !shouldSkipSlug(s)))];
    if (!list.length) return {};

    try {
      const res = await fetch(`${API_PATH}?slugs=${encodeURIComponent(list.join(','))}`, {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!res.ok) return {};
      const data = await res.json();
      const counts = data.counts || {};
      writeCache(counts);
      return counts;
    } catch {
      return {};
    }
  }

  function applyCounts(counts) {
    document.querySelectorAll('#tools-catalog [data-tool-slug]').forEach((card) => {
      const slug = card.getAttribute('data-tool-slug');
      const row = card.querySelector('.tool-card-views');
      const numEl = card.querySelector('.tool-card-views-num');
      if (!row || !numEl || !slug) return;

      if (counts[slug] == null) {
        numEl.textContent = '—';
        row.hidden = false;
        return;
      }

      numEl.textContent = formatCount(counts[slug]);
      row.hidden = false;
      row.setAttribute('aria-label', `瀏覽 ${formatCount(counts[slug])} 人次`);
    });
  }

  async function paintCatalogCards() {
    const slugs = [...document.querySelectorAll('#tools-catalog [data-tool-slug]')]
      .map((el) => el.getAttribute('data-tool-slug'))
      .filter(Boolean);
    if (!slugs.length) return;

    document.querySelectorAll('#tools-catalog .tool-card-views-num').forEach((el) => {
      if (el.textContent === '') el.textContent = '…';
    });

    const cached = readCache();
    if (Object.keys(cached).length) applyCounts(cached);

    const counts = await fetchCounts(slugs);
    applyCounts(counts);
  }

  async function recordPageView(slug) {
    if (shouldSkipSlug(slug)) return null;

    const sessionKey = `${SESSION_PREFIX}${slug}`;
    try {
      if (sessionStorage.getItem(sessionKey)) return null;
    } catch {
      /* ignore */
    }

    try {
      const res = await fetch(API_PATH, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, visitorId: visitorId() }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      try {
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        /* ignore */
      }
      if (data.views != null) writeCache({ [slug]: data.views });
      return data;
    } catch {
      return null;
    }
  }

  function recordCurrentToolPage() {
    const slug = window.WA_TOOL_URLS?.currentToolSlug?.();
    if (!slug || !document.getElementById('tool-app')) return;
    recordPageView(slug);
  }

  function bootPageViews() {
    if (document.getElementById('tool-app')) {
      recordCurrentToolPage();
    }
    if (document.getElementById('tools-catalog')?.querySelector('[data-tool-slug]')) {
      paintCatalogCards().catch(() => {});
    }
  }

  window.__waPaintToolCardViews = paintCatalogCards;
  window.__waRecordPageView = recordPageView;

  window.addEventListener('mytoolife:catalog-rendered', () => {
    if (document.getElementById('tools-catalog')) {
      paintCatalogCards().catch(() => {});
    }
  });

  window.addEventListener('mytoolife:soft-nav', () => {
    if (document.getElementById('tools-catalog')) {
      paintCatalogCards().catch(() => {});
    }
    if (document.getElementById('tool-app')) {
      recordCurrentToolPage();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && document.getElementById('tools-catalog')) {
      paintCatalogCards().catch(() => {});
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPageViews, { once: true });
  } else {
    bootPageViews();
  }
})();
