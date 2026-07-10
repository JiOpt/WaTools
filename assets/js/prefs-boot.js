(function () {
  'use strict';

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

  function readPrefs() {
    var prefs = {};
    try {
      var raw = localStorage.getItem('watools-user-prefs');
      if (raw) prefs = JSON.parse(raw) || {};
    } catch (e) {
      prefs = {};
    }

    if (!prefs.fontSize) {
      try {
        var legacy = localStorage.getItem('watools-font-size');
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
})();
