(function () {
  'use strict';

  function runTool() {
    const app = document.getElementById('tool-app');
    if (!app) return;

    const slug = app.dataset.tool;
    if (!slug) return;

    const registry = window.WA_TOOL_REGISTRY || {};
    const init = registry[slug];

    if (typeof init === 'function') {
      try {
        init(app);
        app.classList.remove('is-booting');
        if (typeof window.__waInjectToolCategoryPager === 'function') {
          window.__waInjectToolCategoryPager();
        }
      } catch (err) {
        console.error('[Toolpian] Tool init failed:', slug, err);
        app.innerHTML =
          '<div class="tool-missing text-center">' +
          '<p class="text-danger"><i class="bi bi-exclamation-triangle me-1"></i>工具載入失敗，請重新整理頁面。</p>' +
          '<a href="' + (window.WA_TOOL_URLS ? window.WA_TOOL_URLS.indexHref() : 'index.html') + '" class="btn btn-outline-primary rounded-pill px-4 mt-2">瀏覽其他工具</a>' +
          '</div>';
      }
      return;
    }

    app.innerHTML =
      '<div class="tool-missing text-center">' +
      '<p><i class="bi bi-hourglass-split me-1"></i>這個工具還在準備中，敬請期待。</p>' +
      '<a href="' + (window.WA_TOOL_URLS ? window.WA_TOOL_URLS.indexHref() : 'index.html') + '" class="btn btn-outline-primary rounded-pill px-4 mt-2">瀏覽其他工具</a>' +
      '</div>';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runTool);
  } else {
    runTool();
  }
})();
