(function () {
  'use strict';

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
                <a href="../scripture/${book.slug}.html" class="tool-card tool-card-ready scripture-card">
                  <div class="tool-card-icon"><i class="bi bi-journal-richtext"></i></div>
                  <div class="tool-card-body">
                    <h3>${book.title}</h3>
                    <p>${book.desc}</p>
                  </div>
                  <span class="tool-badge">可讀</span>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', renderHub);
})();
