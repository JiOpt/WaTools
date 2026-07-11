(function () {
  'use strict';

  function scriptureBookHref(slug) {
    if (window.WA_TOOL_URLS?.absolutePageHref) {
      return window.WA_TOOL_URLS.absolutePageHref(`scripture/${slug}.html`);
    }
    return `/scripture/${slug}.html`;
  }

  function renderHub() {
    const catalog = window.WA_SCRIPTURES_CATALOG;
    const container = document.getElementById('scriptures-hub');
    if (!catalog || !container) return;

    container.innerHTML = catalog.map((category) => `
      <section class="scriptures-category section" id="scriptures-${category.id}">
        <div class="container section-title" data-aos="fade-up">
          <h2><i class="bi ${category.icon} me-2"></i>${category.name}</h2>
          <p>${category.tagline}</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4">
            ${category.books.map((book) => `
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <a href="${scriptureBookHref(book.slug)}" class="tool-card tool-card-ready scripture-card" data-page-slug="${book.slug}">
                  <div class="tool-card-top">
                    <div class="tool-card-icon"><i class="bi bi-journal-richtext"></i></div>
                    <h3>${book.title}</h3>
                  </div>
                  <p>${book.desc}</p>
                  <div class="tool-card-foot">
                    <span class="tool-card-views" aria-label="瀏覽人次">
                      <i class="bi bi-eye" aria-hidden="true"></i>
                      <span class="tool-card-views-num">…</span>
                    </span>
                  </div>
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

    window.dispatchEvent(new CustomEvent('mytoolife:scriptures-hub-rendered'));
    if (typeof window.__waPaintViewCards === 'function') {
      window.__waPaintViewCards().catch(() => {});
    }
  }

  window.__waBootScripturesHub = renderHub;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHub, { once: true });
  } else if (document.getElementById('scriptures-hub')) {
    renderHub();
  }

  window.addEventListener('mytoolife:soft-nav', renderHub);
})();
