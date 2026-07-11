/**
 * Page view counts via Firebase Cloud Function (/api/pageviews).
 * Homepage tools + scriptures hub cards show total views; pages record once per session.
 */
(function () {
  'use strict';

  const API_PATH = '/api/pageviews';
  const VISITOR_KEY = 'mytoolife-visitor-id';
  const SESSION_PREFIX = 'mytoolife-pv-session:';
  const CACHE_KEY = 'mytoolife-pv-cache';
  const CACHE_TTL_MS = 60 * 1000;
  const VIEW_POLL_MS = 30 * 1000;
  const CARD_SELECTOR = '#tools-catalog [data-tool-slug], #scriptures-hub [data-page-slug]';
  const SKIP_SLUGS = new Set(['settings', 'scriptures', 'index']);

  let viewPollTimer = null;

  function shouldSkipSlug(slug) {
    return !slug || SKIP_SLUGS.has(slug);
  }

  function cardSlug(card) {
    return card.getAttribute('data-tool-slug') || card.getAttribute('data-page-slug') || '';
  }

  function hasViewCards() {
    return !!document.querySelector(CARD_SELECTOR);
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

  function updateCardCount(slug, views) {
    const esc = typeof CSS !== 'undefined' && CSS.escape ? CSS.escape(slug) : slug;
    const card = document.querySelector(`#tools-catalog [data-tool-slug="${esc}"], #scriptures-hub [data-page-slug="${esc}"]`);
    const numEl = card?.querySelector('.tool-card-views-num');
    const row = card?.querySelector('.tool-card-views');
    if (!numEl || !row || views == null) return;
    numEl.textContent = formatCount(views);
    row.hidden = false;
    row.setAttribute('aria-label', `瀏覽 ${formatCount(views)} 人次`);
  }

  function applyCounts(counts) {
    document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
      const slug = cardSlug(card);
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

  async function paintViewCards() {
    const slugs = [...document.querySelectorAll(CARD_SELECTOR)]
      .map(cardSlug)
      .filter(Boolean);
    if (!slugs.length) return;

    document.querySelectorAll(`${CARD_SELECTOR} .tool-card-views-num`).forEach((el) => {
      if (el.textContent === '') el.textContent = '…';
    });

    const cached = readCache();
    if (Object.keys(cached).length) applyCounts(cached);

    const counts = await fetchCounts(slugs);
    applyCounts(counts);
  }

  function startViewPolling() {
    if (viewPollTimer || !hasViewCards()) return;
    viewPollTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible' && hasViewCards()) {
        paintViewCards().catch(() => {});
      }
    }, VIEW_POLL_MS);
  }

  function stopViewPolling() {
    if (!viewPollTimer) return;
    window.clearInterval(viewPollTimer);
    viewPollTimer = null;
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
      if (data.views != null) {
        writeCache({ [slug]: data.views });
        updateCardCount(slug, data.views);
      }
      return data;
    } catch {
      return null;
    }
  }

  function currentScriptureSlug() {
    const match = location.pathname.replace(/\\/g, '/').match(/\/scripture\/([^/]+)/i);
    return match ? match[1].replace(/\.html$/i, '') : '';
  }

  function recordCurrentPageView() {
    const app = document.getElementById('tool-app');
    if (app) {
      const slug = app.dataset.tool || window.WA_TOOL_URLS?.currentToolSlug?.();
      if (slug) return recordPageView(slug);
    }

    const scriptureSlug = currentScriptureSlug();
    if (scriptureSlug && document.querySelector('.scripture-section')) {
      return recordPageView(scriptureSlug);
    }

    return null;
  }

  function refreshViewCards() {
    if (!hasViewCards()) {
      stopViewPolling();
      return;
    }
    paintViewCards().catch(() => {});
    startViewPolling();
  }

  function bootPageViews() {
    recordCurrentPageView();
    refreshViewCards();
  }

  window.__waPaintViewCards = paintViewCards;
  window.__waPaintToolCardViews = paintViewCards;
  window.__waRecordPageView = recordPageView;
  window.__waRecordCurrentPageView = recordCurrentPageView;

  window.addEventListener('mytoolife:catalog-rendered', refreshViewCards);
  window.addEventListener('mytoolife:scriptures-hub-rendered', refreshViewCards);
  window.addEventListener('mytoolife:soft-nav', () => {
    recordCurrentPageView();
    refreshViewCards();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && hasViewCards()) {
      paintViewCards().catch(() => {});
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPageViews, { once: true });
  } else {
    bootPageViews();
  }
})();
