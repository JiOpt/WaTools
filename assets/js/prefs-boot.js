(function () {
  'use strict';

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  var root = document.documentElement;
  var DEF = {
    theme: 'light',
    fontSize: 'md',
    lineHeight: 'normal',
    eyeSaver: 'off',
    reducedMotion: false,
    focusVisible: false,
    highContrast: false,
    pageZoom: 100,
  };

  function migrateKey(nextKey, legacyKey) {
    try {
      if (localStorage.getItem(nextKey) != null) return;
      var legacy = localStorage.getItem(legacyKey);
      if (legacy == null) return;
      localStorage.setItem(nextKey, legacy);
      localStorage.removeItem(legacyKey);
    } catch (e) {
      /* file:// or quota */
    }
  }

  function readPrefs() {
    migrateKey('mytoolife-user-prefs', 'watools-user-prefs');
    migrateKey('mytoolife-font-size', 'watools-font-size');

    var prefs = {};
    try {
      var raw = localStorage.getItem('mytoolife-user-prefs');
      if (raw) prefs = JSON.parse(raw) || {};
    } catch (e) {
      prefs = {};
    }

    if (!prefs.fontSize) {
      try {
        var legacy = localStorage.getItem('mytoolife-font-size')
          || localStorage.getItem('watools-font-size');
        prefs.fontSize = legacy === 'sm' || legacy === 'lg' ? legacy : 'md';
      } catch (err) {
        prefs.fontSize = 'md';
      }
    }

    return prefs;
  }

  function pick(prefs, key) {
    var val = prefs[key];
    return val == null ? DEF[key] : val;
  }

  function resolveTheme(theme) {
    if (theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  }

  function apply(prefs) {
    var theme = resolveTheme(pick(prefs, 'theme'));
    var fontSize = pick(prefs, 'fontSize');
    var lineHeight = pick(prefs, 'lineHeight');
    var eyeSaver = pick(prefs, 'eyeSaver');
    var reducedMotion = Boolean(pick(prefs, 'reducedMotion'));
    var focusVisible = Boolean(pick(prefs, 'focusVisible'));
    var highContrast = Boolean(pick(prefs, 'highContrast'));
    var pageZoom = Number(pick(prefs, 'pageZoom')) || 100;

    root.setAttribute('data-theme', theme);
    root.setAttribute('data-theme-mode', pick(prefs, 'theme'));
    root.setAttribute('data-font-size', fontSize === 'sm' || fontSize === 'lg' ? fontSize : 'md');
    root.setAttribute('data-line-height', lineHeight === 'relaxed' || lineHeight === 'loose' ? lineHeight : 'normal');
    root.setAttribute('data-eye-saver', eyeSaver === 'mild' || eyeSaver === 'strong' ? eyeSaver : 'off');
    root.setAttribute('data-reduced-motion', reducedMotion ? 'true' : 'false');
    root.setAttribute('data-focus-visible', focusVisible ? 'true' : 'false');
    root.setAttribute('data-high-contrast', highContrast ? 'true' : 'false');
    root.setAttribute('data-page-zoom', String(Math.min(200, Math.max(80, Math.round(pageZoom)))));
    root.style.zoom = pageZoom === 100 ? '' : String(pageZoom / 100);
  }

  apply(readPrefs());

  function isToolPagePath() {
    var path = location.pathname.replace(/\\/g, '/');
    if (/\/scripture\//i.test(path)) return false;
    var segs = path.split('/').filter(Boolean);
    var page = (segs.pop() || 'index.html').split('#')[0].split('?')[0];
    if (!/\.html$/i.test(page)) return false;
    if (page === 'index.html' || page === 'index_plan.html' || page === 'copyright.html') return false;
    if (page === 'settings.html' && segs.length === 0) return false;
    return segs.length >= 1;
  }

  if (isToolPagePath()) {
    root.classList.add('wa-tool-page');
    window.scrollTo(0, 0);
    document.addEventListener('DOMContentLoaded', function () {
      window.scrollTo(0, 0);
    }, { once: true });
  }
})();
