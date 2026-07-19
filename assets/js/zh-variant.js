(function () {
  'use strict';

  let textConverter = null;
  let openccPromise = null;
  let observer = null;
  let observerTimer = null;
  let converting = false;

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);
  const ATTRS = ['placeholder', 'aria-label', 'title'];

  function assetUrl(path) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(path);
    return path;
  }

  function currentVariant() {
    const attr = document.documentElement.getAttribute('data-zh-variant');
    if (attr === 'simp' || attr === 'trad') return attr;
    if (window.WA_USER_PREFS?.load) {
      const prefs = window.WA_USER_PREFS.load();
      return prefs.zhVariant === 'simp' ? 'simp' : 'trad';
    }
    return 'trad';
  }

  function setLang(variant) {
    if (window.WA_LOCALE?.isEn?.()) {
      document.documentElement.lang = 'en';
      return;
    }
    document.documentElement.lang = variant === 'simp' ? 'zh-CN' : 'zh-Hant';
  }

  function isSkipped(el) {
    return !el || SKIP_TAGS.has(el.tagName) || el.classList.contains('ignore-opencc');
  }

  function walkTextNodes(root, visit) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!isSkipped(node.parentElement) && node.nodeValue && node.nodeValue.trim()) {
        visit(node);
      }
      node = walker.nextNode();
    }
  }

  function walkAttrs(root, visit) {
    if (!root || !root.querySelectorAll) return;
    root.querySelectorAll(ATTRS.map((a) => '[' + a + ']').join(',')).forEach((el) => {
      if (isSkipped(el)) return;
      ATTRS.forEach((attr) => {
        if (!el.hasAttribute(attr)) return;
        visit(el, attr);
      });
    });
  }

  function loadOpenCC() {
    if (window.OpenCC) return Promise.resolve(window.OpenCC);
    if (!openccPromise) {
      openccPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = assetUrl('assets/js/vendor/opencc-t2cn.js');
        script.onload = () => resolve(window.OpenCC);
        script.onerror = () => reject(new Error('opencc load failed'));
        document.head.appendChild(script);
      });
    }
    return openccPromise;
  }

  function ensureConverter(OpenCC) {
    if (textConverter) return textConverter;
    textConverter = OpenCC.Converter({ from: 'tw', to: 'cn' });
    return textConverter;
  }

  function convertTextNode(node, converter) {
    if (node.__waZhOrig == null) node.__waZhOrig = node.nodeValue;
    node.nodeValue = converter(node.__waZhOrig);
  }

  function restoreTextNode(node) {
    if (node.__waZhOrig != null) {
      node.nodeValue = node.__waZhOrig;
      delete node.__waZhOrig;
    }
  }

  function convertAttr(el, attr, converter) {
    const key = '__waZhAttr_' + attr;
    if (el[key] == null) el[key] = el.getAttribute(attr);
    el.setAttribute(attr, converter(el[key]));
  }

  function restoreAttr(el, attr) {
    const key = '__waZhAttr_' + attr;
    if (el[key] != null) {
      el.setAttribute(attr, el[key]);
      delete el[key];
    }
  }

  function runConvert() {
    if (!textConverter || converting) return;
    converting = true;
    try {
      const root = document.documentElement;
      walkTextNodes(root, (node) => convertTextNode(node, textConverter));
      walkAttrs(root, (el, attr) => convertAttr(el, attr, textConverter));
      setLang('simp');
    } finally {
      converting = false;
    }
  }

  function runRestore() {
    const root = document.documentElement;
    walkTextNodes(root, restoreTextNode);
    walkAttrs(root, restoreAttr);
    setLang('trad');
  }

  function startObserver() {
    if (observer) return;
    observer = new MutationObserver(() => {
      if (converting || currentVariant() !== 'simp' || !textConverter) return;
      clearTimeout(observerTimer);
      observerTimer = setTimeout(runConvert, 120);
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  function stopObserver() {
    if (observer) observer.disconnect();
    observer = null;
    clearTimeout(observerTimer);
    observerTimer = null;
  }

  async function applyVariant(variant) {
    if (window.WA_LOCALE?.isEn?.() || document.documentElement.getAttribute('data-locale') === 'en') {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-locale', 'en');
      stopObserver();
      runRestore();
      return;
    }

    const next = variant === 'simp' ? 'simp' : 'trad';
    document.documentElement.setAttribute('data-zh-variant', next);
    setLang(next);

    if (next === 'simp') {
      try {
        const OpenCC = await loadOpenCC();
        ensureConverter(OpenCC);
        runConvert();
        startObserver();
      } catch (err) {
        console.error('[Kawatool] zh-variant convert failed:', err);
        document.documentElement.setAttribute('data-zh-variant', 'trad');
        setLang('trad');
      }
      return;
    }

    stopObserver();
    runRestore();
  }

  window.WA_ZH_VARIANT = {
    apply: applyVariant,
    get: currentVariant,
  };

  function boot() {
    applyVariant(currentVariant());
  }

  window.addEventListener('mytoolife:prefs-changed', (e) => {
    const variant = e.detail?.zhVariant;
    if (variant === 'simp' || variant === 'trad') applyVariant(variant);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
