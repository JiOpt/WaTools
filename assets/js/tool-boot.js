/**
 * Load only the tool implementation chunk needed for this page.
 */
(function () {
  'use strict';

  const WA_BOOT_VERSION = '0.6.27';

  function assetUrl(relativePath) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(relativePath);
    const base = relativePath.split('?')[0];
    const sep = base.includes('?') ? '&' : '?';
    return `${base}${sep}v=${WA_BOOT_VERSION}`;
  }

  function loadScript(src) {
    const base = src.split('?')[0];
    const existing = document.querySelector(`script[src^="${base}"], script[src*="${base}?"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') return Promise.resolve();
      return new Promise((resolve, reject) => {
        const finish = () => {
          existing.dataset.loaded = '1';
          resolve();
        };
        // Parser-inserted sync scripts may have already run without firing load.
        if (!existing.async && !existing.defer) {
          finish();
          return;
        }
        if (existing.readyState === 'complete' || existing.readyState === 'loaded') {
          finish();
          return;
        }
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', () => reject(new Error(src)), { once: true });
      });
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => {
        script.dataset.loaded = '1';
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed: ${src}`));
      document.head.appendChild(script);
    });
  }

  function showLoading(app) {
    app.classList.add('is-booting');
    if (app.querySelector('.tool-loading')) return;
    app.replaceChildren(
      Object.assign(document.createElement('div'), {
        className: 'tool-loading text-center py-4',
        innerHTML:
          '<div class="tool-loading-spinner" role="status" aria-label="載入中"></div>' +
          '<p class="text-muted small mt-3 mb-0">工具載入中…</p>',
      }),
    );
  }

  async function boot() {
    const app = document.getElementById('tool-app');
    if (!app) return;

    const slug = app.dataset.tool;
    if (!slug) return;

    showLoading(app);

    try {
      await loadScript(assetUrl('assets/js/tool-chunks.js'));
      const chunk = window.WA_TOOL_CHUNKS?.[slug] || { part: 3, extra: [] };
      const part = chunk.part || 3;
      const extra = chunk.extra || [];

      if (!window.WA_TOOLS_CATALOG) {
        loadScript(assetUrl('assets/js/tools-data.js')).then(() => {
          window.dispatchEvent(new Event('watools:catalog-ready'));
        });
      }

      await loadScript(assetUrl('assets/js/tool-ui.js'));
      await loadScript(assetUrl(`assets/js/tools-implementations-part${part}.js`));
      for (const file of extra) {
        await loadScript(assetUrl(`assets/js/${file}`));
      }
      await loadScript(assetUrl('assets/js/tool-runner.js'));
      window.dispatchEvent(new CustomEvent('watools:tool-ready', { detail: { slug } }));
    } catch (err) {
      console.error('[WaWaTools] tool-boot failed:', slug, err);
      app.innerHTML =
        '<div class="tool-missing text-center">' +
        '<p class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>工具載入失敗，請重新整理。</p>' +
        '<a href="index.html" class="btn btn-outline-primary rounded-pill px-4 mt-2">瀏覽其他工具</a></div>';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
