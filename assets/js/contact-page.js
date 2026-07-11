/**
 * 聯絡我們頁 — 依 site-footer.js 的 googleFormEmbedUrl 嵌入 Google 表單
 */
(function () {
  'use strict';

  function externalFormUrl(embedUrl) {
    if (!embedUrl) return '';
    return String(embedUrl).replace('?embedded=true', '').replace(/\/viewform.*/, '/viewform');
  }

  function mountForm(cfg) {
    const slot = document.getElementById('contact-form-slot');
    const external = document.getElementById('contact-form-external');
    if (!slot) return;

    const embedUrl = (cfg && cfg.googleFormEmbedUrl) || '';
    if (!embedUrl) {
      slot.innerHTML = '<p class="text-muted mb-0">表單連結尚未設定。請站方於 <code>assets/js/site-footer.js</code> 填入 <code>googleFormEmbedUrl</code>（Google 表單 → 傳送 → 嵌入 HTML → 複製 iframe 的 src）。</p>';
      if (external) external.hidden = true;
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = 'MyTooLife 聯絡表單';
    iframe.loading = 'lazy';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('marginwidth', '0');
    iframe.textContent = '載入中…';
    slot.replaceChildren(iframe);

    if (external) {
      const openUrl = externalFormUrl(embedUrl);
      if (openUrl) {
        external.href = openUrl;
        external.hidden = false;
      }
    }
  }

  function boot() {
    mountForm(window.WA_SITE_FOOTER || {});
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
