/**
 * 聯絡我們頁 — 依 site-footer.js 的 googleFormEmbedUrl 嵌入 Google 表單
 */
(function () {
  'use strict';

  let bootPromise = null;

  function externalFormUrl(embedUrl) {
    if (!embedUrl) return '';
    return String(embedUrl).replace('?embedded=true', '').replace(/\/viewform.*/, '/viewform');
  }

  function assetUrl(relativePath) {
    if (typeof window.waAssetUrl === 'function') return window.waAssetUrl(relativePath);
    return relativePath;
  }

  function isContactPage() {
    return !!document.getElementById('contact-form-slot');
  }

  function loadSiteFooterConfig() {
    if (window.WA_SITE_FOOTER) return Promise.resolve(window.WA_SITE_FOOTER);
    if (document.querySelector('script[src*="site-footer.js"]')) {
      return Promise.resolve(window.WA_SITE_FOOTER || {});
    }
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = assetUrl('assets/js/site-footer.js');
      script.onload = () => resolve(window.WA_SITE_FOOTER || {});
      script.onerror = () => resolve({});
      document.head.appendChild(script);
    });
  }

  function mountForm(cfg) {
    const slot = document.getElementById('contact-form-slot');
    const external = document.getElementById('contact-form-external');
    if (!slot) return;

    const embedUrl = (cfg && cfg.googleFormEmbedUrl) || '';
    const publicUrl = (cfg && cfg.googleFormPublicUrl) || externalFormUrl(embedUrl);

    if (external && publicUrl) {
      external.href = publicUrl;
      external.hidden = false;
    }

    if (!embedUrl) {
      slot.innerHTML = '<p class="text-muted mb-0">表單連結尚未設定。請站方於 <code>assets/js/site-footer.js</code> 填入 <code>googleFormEmbedUrl</code>（Google 表單 → 傳送 → 嵌入 HTML → 複製 iframe 的 src）。</p>';
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.src = embedUrl;
    iframe.title = 'Kawatool 聯絡表單';
    iframe.loading = 'lazy';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('marginheight', '0');
    iframe.setAttribute('marginwidth', '0');
    iframe.textContent = '載入中…';
    slot.replaceChildren(iframe);
  }

  async function boot() {
    if (!isContactPage()) return;
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      const cfg = await loadSiteFooterConfig();
      mountForm(cfg);
    })();

    try {
      await bootPromise;
    } finally {
      bootPromise = null;
    }
  }

  window.__waBootContact = boot;
  window.addEventListener('mytoolife:soft-nav', boot);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
