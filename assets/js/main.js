/**
* Template Name: Medilab
* Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  const WA_SITE_VERSION = '0.6.1';

  function waAssetUrl(relativePath) {
    const base = relativePath.split('?')[0];
    return assetBase + base + '?v=' + WA_SITE_VERSION;
  }

  function applySiteVersionFooter() {
    const footer = document.querySelector('#footer .copyright p');
    if (!footer || footer.querySelector('.site-version')) return;
    footer.insertAdjacentHTML('beforeend', ` · <span class="site-version">v${WA_SITE_VERSION}</span>`);
  }

  window.WA_SITE_VERSION = WA_SITE_VERSION;
  window.waAssetUrl = waAssetUrl;
  window.addEventListener('load', applySiteVersionFooter);

  function getAssetBase() {
    const script = document.querySelector('script[src*="assets/js/main.js"]');
    if (!script || !script.src) return '';
    return script.src.replace(/assets\/js\/main\.js(\?.*)?$/, '');
  }

  const assetBase = getAssetBase();

  /**
   * User preferences — theme, reading, accessibility
   */
  if (document.querySelector('#header .branding')) {
    const prefsScript = document.createElement('script');
    prefsScript.src = waAssetUrl('assets/js/user-preferences.js');
    document.head.appendChild(prefsScript);
  }

  /**
   * Nav browsing history — load early, before optional template plugins
   */
  if (document.querySelector('#header .branding')) {
    const navHistoryScript = document.createElement('script');
    navHistoryScript.src = waAssetUrl('assets/js/nav-history.js');
    document.head.appendChild(navHistoryScript);

    const userMenuScript = document.createElement('script');
    userMenuScript.src = waAssetUrl('assets/js/user-menu.js');
    document.head.appendChild(userMenuScript);
  }

  if (document.querySelector('#header .branding')) {
    const sitemapScript = document.createElement('script');
    sitemapScript.src = waAssetUrl('assets/js/site-sitemap.js');
    document.body.appendChild(sitemapScript);
  }

  if (document.querySelector('#header .branding')) {
    const headerContextScript = document.createElement('script');
    headerContextScript.src = waAssetUrl('assets/js/header-context.js');
    document.head.appendChild(headerContextScript);
  }

  if (document.getElementById('tool-app')) {
    const loadPager = () => {
      const pagerScript = document.createElement('script');
      pagerScript.src = waAssetUrl('assets/js/tool-category-pager.js');
      document.body.appendChild(pagerScript);
    };
    if (window.WA_TOOLS_CATALOG) {
      loadPager();
    } else {
      const catalogScript = document.createElement('script');
      catalogScript.src = waAssetUrl('assets/js/tools-data.js');
      catalogScript.onload = loadPager;
      document.body.appendChild(catalogScript);
    }
  }

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader || (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top'))) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      });
    }
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate glightbox
   */
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }

  /**
   * Initiate Pure Counter
   */
  if (typeof PureCounter !== 'undefined') {
    new PureCounter();
  }

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      const configEl = swiperElement.querySelector(".swiper-config");
      if (!configEl) return;
      let config = JSON.parse(configEl.innerHTML.trim());

      if (swiperElement.classList.contains("swiper-tab")) {
        if (typeof initSwiperWithCustomPagination === 'function') {
          initSwiperWithCustomPagination(swiperElement, config);
        }
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();
