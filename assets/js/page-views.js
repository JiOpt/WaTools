/**
 * Page view counts via Firebase Cloud Function (/api/pageviews).
 * Homepage cards show unique visitors; tool pages record a hit once per session.
 */
(function () {
  'use strict';

  const API_PATH = '/api/pageviews';
  const VISITOR_KEY = 'mytoolife-visitor-id';
  const SESSION_PREFIX = 'mytoolife-pv-session:';
  const SKIP_SLUGS = new Set(['settings', 'scriptures', 'index']);

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
    const num = Number(n) || 0;
    if (num >= 100000) return `${Math.round(num / 10000)} 萬`;
    if (num >= 10000) return `${(num / 10000).toFixed(1)} 萬`;
    return num.toLocaleString('zh-Hant');
  }

  function shouldSkipSlug(slug) {
    return !slug || SKIP_SLUGS.has(slug);
  }

  async function fetchCounts(slugs) {
    const list = [...new Set(slugs.filter((s) => !shouldSkipSlug(s)))];
    if (!list.length) return {};

    try {
      const res = await fetch(`${API_PATH}?slugs=${encodeURIComponent(list.join(','))}`, {
        credentials: 'same-origin',
      });
      if (!res.ok) return {};
      const data = await res.json();
      return data.counts || {};
    } catch {
      return {};
    }
  }

  function applyCounts(counts) {
    document.querySelectorAll('#tools-catalog [data-tool-slug]').forEach((card) => {
      const slug = card.getAttribute('data-tool-slug');
      const slot = card.querySelector('.tool-card-views');
      if (!slot || !slug) return;

      const n = counts[slug];
      if (n == null || n === 0) {
        slot.textContent = '';
        slot.hidden = true;
        return;
      }

      slot.textContent = `${formatCount(n)} 人瀏覽`;
      slot.hidden = false;
    });
  }

  async function paintCatalogCards() {
    const slugs = [...document.querySelectorAll('#tools-catalog [data-tool-slug]')]
      .map((el) => el.getAttribute('data-tool-slug'))
      .filter(Boolean);
    if (!slugs.length) return;
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

  window.__waPaintToolCardViews = paintCatalogCards;
  window.__waRecordPageView = recordPageView;

  if (document.getElementById('tools-catalog')) {
    window.addEventListener('mytoolife:catalog-rendered', () => {
      paintCatalogCards().catch(() => {});
    });
    window.addEventListener('mytoolife:soft-nav', () => {
      if (document.getElementById('tools-catalog')) {
        paintCatalogCards().catch(() => {});
      }
    });
  }

  if (document.getElementById('tool-app')) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', recordCurrentToolPage, { once: true });
    } else {
      recordCurrentToolPage();
    }
    window.addEventListener('mytoolife:soft-nav', recordCurrentToolPage);
  }
})();
