/**
 * Site locale helpers — URL prefix /en/ for English, default zh-Hant at root.
 */
(function () {
  'use strict';

  if (window.WA_LOCALE?.__installed) return;

  var STORAGE_KEY = 'mytoolife-user-prefs';
  var LOCALES = { zh: 'zh', en: 'en' };

  function normalizePath(pathname) {
    return String(pathname || '').replace(/\\/g, '/');
  }

  function pathSegments(pathname) {
    return normalizePath(pathname || location.pathname).split('/').filter(Boolean);
  }

  function fromPath(pathname) {
    var segs = pathSegments(pathname);
    return segs[0] === 'en' ? LOCALES.en : LOCALES.zh;
  }

  function current() {
    return fromPath(location.pathname);
  }

  function isEn(pathname) {
    return fromPath(pathname) === LOCALES.en;
  }

  function stripLocaleSegments(segs) {
    var list = Array.isArray(segs) ? segs.slice() : pathSegments();
    if (list[0] === 'en') list.shift();
    return list;
  }

  function pageKeyFromPath(pathname) {
    var segs = stripLocaleSegments(pathSegments(pathname));
    if (!segs.length) return 'index';
    var last = String(segs[segs.length - 1]).replace(/\.html$/i, '').split('?')[0].split('#')[0];
    if (segs.length === 1) return last === 'index' ? 'index' : last;
    return segs[segs.length - 2] + '/' + last;
  }

  function prefix(locale) {
    return (locale || current()) === LOCALES.en ? '/en' : '';
  }

  /** Absolute site path with optional locale prefix. relativePath like "privacy" or "viral/foo". */
  function href(relativePath, locale) {
    var loc = locale || current();
    var clean = String(relativePath || '').replace(/^\/+/, '').replace(/\.html$/i, '');
    if (clean.indexOf('en/') === 0) clean = clean.slice(3);
    // Scripture content has no English pages — always zh path
    if (clean === 'scripture' || clean.indexOf('scripture/') === 0) {
      return '/' + clean;
    }
    var pre = prefix(loc);
    if (!clean || clean === 'index') return pre || '/';
    return pre + '/' + clean;
  }

  function switchUrl(targetLocale, pathname) {
    var key = pageKeyFromPath(pathname || location.pathname);
    if (key === 'index') return href('', targetLocale);
    return href(key, targetLocale);
  }

  function readStoredLocale() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var prefs = JSON.parse(raw);
      if (prefs && (prefs.locale === 'en' || prefs.locale === 'zh')) return prefs.locale;
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function syncDocument(locale) {
    var loc = locale || current();
    document.documentElement.setAttribute('data-locale', loc);
    document.documentElement.lang = loc === 'en' ? 'en' : 'zh-Hant';
  }

  function t(key, fallback) {
    var pack = window.WA_I18N_EN;
    if (current() !== 'en' || !pack) return fallback != null ? fallback : key;
    var parts = String(key).split('.');
    var cur = pack;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null || typeof cur !== 'object') return fallback != null ? fallback : key;
      cur = cur[parts[i]];
    }
    return cur != null ? cur : (fallback != null ? fallback : key);
  }

  function catalogLabel(category, tool) {
    if (current() !== 'en') {
      return tool ? tool.title : category.name;
    }
    var pack = window.WA_I18N_EN || {};
    if (tool) {
      var toolMap = pack.tools || {};
      return toolMap[tool.slug] || tool.titleEn || tool.title;
    }
    var catMap = pack.categories || {};
    return catMap[category.id] || category.nameEn || category.name;
  }

  syncDocument(current());

  window.WA_LOCALE = {
    LOCALES: LOCALES,
    current: current,
    isEn: isEn,
    fromPath: fromPath,
    prefix: prefix,
    href: href,
    switchUrl: switchUrl,
    pageKeyFromPath: pageKeyFromPath,
    stripLocaleSegments: stripLocaleSegments,
    pathSegments: pathSegments,
    readStoredLocale: readStoredLocale,
    syncDocument: syncDocument,
    t: t,
    catalogLabel: catalogLabel,
    __installed: true,
  };
})();
