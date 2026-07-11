(function () {
  'use strict';

  function toolCardHref(slug) {
    if (window.WA_TOOL_URLS?.toolHref) return window.WA_TOOL_URLS.toolHref(slug);
    return `/${slug}`;
  }

  async function renderCatalog() {
    const catalog = window.WA_TOOLS_CATALOG;
    const container = document.getElementById('tools-catalog');
    if (!catalog || !container) return;

    let visible = catalog;
    const isPlan = document.body.classList.contains('plan-page');
    if (!isPlan) {
      if (!window.WA_SITEMAP_MANIFEST) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = (window.waAssetUrl || ((p) => p))('assets/js/sitemap-manifest.js');
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      if (window.WA_SITEMAP_MANIFEST) {
        await window.WA_SITEMAP_MANIFEST.load();
        visible = window.WA_SITEMAP_MANIFEST.filterCatalog(catalog);
      }
    }

    container.innerHTML = visible.map((category) => `
      <section class="tools-category section" id="cat-${category.id}">
        <div class="container section-title" data-aos="fade-up">
          <h2>${category.name}</h2>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4">
            ${category.tools.map((tool) => `
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <a href="${toolCardHref(tool.slug)}" class="tool-card tool-card-ready">
                  <div class="tool-card-icon"><i class="bi ${tool.icon}"></i></div>
                  <div class="tool-card-body">
                    <h3>${tool.title}</h3>
                  </div>
                  <span class="tool-badge">可用</span>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('');

    if (typeof AOS !== 'undefined') {
      try { AOS.refresh(); } catch (e) { /* ignore */ }
    }
  }

  async function bootToolsCatalog() {
    await renderCatalog();
  }

  window.__waBootToolsCatalog = bootToolsCatalog;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bootToolsCatalog().catch(() => {});
    }, { once: true });
  } else if (document.getElementById('tools-catalog')) {
    bootToolsCatalog().catch(() => {});
  }

  window.addEventListener('mytoolife:soft-nav', () => {
    bootToolsCatalog().catch(() => {});
  });

  window.addEventListener('mytoolife:publish-changed', () => {
    bootToolsCatalog().catch(() => {});
  });
})();
