(function () {
  'use strict';

  function renderCatalog() {
    const catalog = window.WA_TOOLS_CATALOG;
    const container = document.getElementById('tools-catalog');
    if (!catalog || !container) return;

    container.innerHTML = catalog.map((category) => `
      <section class="tools-category section" id="cat-${category.id}">
        <div class="container section-title" data-aos="fade-up">
          <h2>${category.name}</h2>
          <p>${category.tagline}</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row gy-4">
            ${category.tools.map((tool) => `
              <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <a href="${tool.slug}.html" class="tool-card tool-card-ready">
                  <div class="tool-card-icon"><i class="bi ${tool.icon}"></i></div>
                  <div class="tool-card-body">
                    <h3>${tool.title}</h3>
                    <p>${tool.desc}</p>
                  </div>
                  <span class="tool-badge">可用</span>
                </a>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `).join('');
  }

  document.addEventListener('DOMContentLoaded', renderCatalog);
})();
