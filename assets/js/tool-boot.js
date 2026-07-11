/**
 * Load only the tool implementation chunk needed for this page.
 */
(function () {
  'use strict';

  const WA_BOOT_VERSION = '0.6.29';
  const LOAD_TIMEOUT_MS = 12000;
  const scriptLoads = new Map();

  function getAssetBase() {
    const bootScript = document.currentScript
      || document.querySelector('script[src*="assets/js/tool-boot.js"]');
    if (bootScript?.src) {
      return bootScript.src.replace(/assets\/js\/tool-boot\.js(\?.*)?$/, '');
    }
    const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    const page = segs[segs.length - 1] || '';
    const depth = /\.html$/i.test(page) && segs.length > 1 ? segs.length - 1 : 0;
    return depth ? '../'.repeat(depth) : '';
  }

  const assetBase = getAssetBase();

  function assetUrl(relativePath) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(relativePath);
    const base = relativePath.split('?')[0];
    const extra = relativePath.includes('?') ? '&' + relativePath.split('?').slice(1).join('?') : '';
    return `${assetBase}${base}?v=${WA_BOOT_VERSION}${extra}`;
  }

  function alreadyLoaded(relativePath) {
    const file = relativePath.split('?')[0].split('/').pop();
    if (file === 'tool-chunks.js') return !!window.WA_TOOL_CHUNKS;
    if (file === 'tool-ui.js') return !!window.WA_TOOL_UI;
    if (file === 'tools-data.js') return !!window.WA_TOOLS_CATALOG;
    if (file === 'tool-urls.js') return !!window.WA_TOOL_URLS;
    if (file.startsWith('tools-implementations-')) return !!window.WA_TOOL_REGISTRY;
    return false;
  }

  function loadScript(relativePath) {
    const src = assetUrl(relativePath);
    const key = relativePath.split('?')[0];

    if (alreadyLoaded(key)) return Promise.resolve();
    if (scriptLoads.has(key)) return scriptLoads.get(key);

    const promise = new Promise((resolve, reject) => {
      const timer = window.setTimeout(() => {
        reject(new Error(`Timeout loading ${key}`));
      }, LOAD_TIMEOUT_MS);

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => {
        clearTimeout(timer);
        script.dataset.loaded = '1';
        resolve();
      };
      script.onerror = () => {
        clearTimeout(timer);
        reject(new Error(`Failed: ${src}`));
      };
      document.head.appendChild(script);
    }).finally(() => {
      scriptLoads.delete(key);
    });

    scriptLoads.set(key, promise);
    return promise;
  }

  function indexHref() {
    if (window.WA_TOOL_URLS) return window.WA_TOOL_URLS.indexHref();
    const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    return segs.length > 1 ? '../index.html' : 'index.html';
  }

  function showFailure(app, message) {
    app.classList.remove('is-booting');
    app.innerHTML =
      '<div class="tool-missing text-center">' +
      '<p class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>' + message + '</p>' +
      '<a href="' + indexHref() + '" class="btn btn-outline-primary rounded-pill px-4 mt-2">瀏覽其他工具</a></div>';
  }

  function mountTool(app, slug) {
    const init = window.WA_TOOL_REGISTRY?.[slug];

    if (typeof init === 'function') {
      try {
        init(app);
        app.classList.remove('is-booting');
        if (typeof window.__waInjectToolCategoryPager === 'function') {
          window.__waInjectToolCategoryPager();
        }
        window.dispatchEvent(new CustomEvent('mytoolife:tool-ready', { detail: { slug } }));
      } catch (err) {
        console.error('[MyTooLife] Tool init failed:', slug, err);
        showFailure(app, '工具載入失敗，請重新整理頁面。');
      }
      return;
    }

    app.classList.remove('is-booting');
    app.innerHTML =
      '<div class="tool-missing text-center">' +
      '<p><i class="bi bi-hourglass-split me-1"></i>這個工具還在準備中，敬請期待。</p>' +
      '<a href="' + indexHref() + '" class="btn btn-outline-primary rounded-pill px-4 mt-2">瀏覽其他工具</a></div>';
  }

  async function boot() {
    const app = document.getElementById('tool-app');
    if (!app) return;

    const slug = app.dataset.tool;
    if (!slug) return;

    app.classList.add('is-booting');

    try {
      await loadScript('assets/js/tool-chunks.js');
      const chunk = window.WA_TOOL_CHUNKS?.[slug] || { part: 3, extra: [] };
      const part = chunk.part || 3;
      const extra = chunk.extra || [];

      if (!window.WA_TOOLS_CATALOG) {
        loadScript('assets/js/tools-data.js').then(() => {
          window.dispatchEvent(new Event('mytoolife:catalog-ready'));
        }).catch(() => {});
      }

      const implFile = part === 'wawa' || part === 4
        ? 'tools-implementations-wawa.js'
        : `tools-implementations-part${part}.js`;

      await loadScript('assets/js/tool-ui.js');
      await loadScript(`assets/js/${implFile}`);

      for (const file of extra) {
        if (file === 'tools-data.js' || file === 'tool-urls.js') continue;
        await loadScript(`assets/js/${file}`);
      }

      mountTool(app, slug);
    } catch (err) {
      console.error('[MyTooLife] tool-boot failed:', slug, err);
      showFailure(app, '工具載入失敗，請重新整理。');
    }
  }

  function scheduleBoot() {
    if (!document.getElementById('tool-app')) return;
    // Run after any sibling scripts (main.js) in the same parse pass.
    queueMicrotask(boot);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot, { once: true });
  } else {
    scheduleBoot();
  }
})();
