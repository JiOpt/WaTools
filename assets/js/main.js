/**
* Template Name: Medilab
* Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  const WA_SITE_VERSION = '0.6.27';

  function waAssetUrl(relativePath) {
    const base = relativePath.split('?')[0];
    return assetBase + base + '?v=' + WA_SITE_VERSION;
  }

  function footerRootPrefix() {
    return /\/scripture\/[^/]+\.html$/i.test(location.pathname.replace(/\\/g, '/')) ? '../' : '';
  }

  function renderSiteFooter() {
    const slot = document.querySelector('#footer .copyright p');
    if (!slot) return;

    const cfg = window.WA_SITE_FOOTER || {};
    const siteName = cfg.siteName || 'WaWaTools';
    const tagline = cfg.tagline || '實用小工具，解決小麻煩';
    const parts = [`© <strong class="sitename">${siteName}</strong> — ${tagline}`];
    parts.push(` · <span class="site-version">v${WA_SITE_VERSION}</span>`);

    if (cfg.showCopyrightLink !== false) {
      const href = cfg.copyrightHref || `${footerRootPrefix()}copyright.html`;
      const label = cfg.copyrightLabel || '版權聲明';
      parts.push(` · <a href="${href}">${label}</a>`);
    }

    slot.innerHTML = parts.join('');
  }

  function bootSiteFooter() {
    if (window.WA_SITE_FOOTER) {
      renderSiteFooter();
      return;
    }
    const script = document.createElement('script');
    script.src = waAssetUrl('assets/js/site-footer.js');
    script.onload = renderSiteFooter;
    script.onerror = renderSiteFooter;
    document.head.appendChild(script);
  }

  window.renderSiteFooter = renderSiteFooter;

  function getAssetBase() {
    const script = document.querySelector('script[src*="assets/js/main.js"]');
    if (!script || !script.src) return '';
    return script.src.replace(/assets\/js\/main\.js(\?.*)?$/, '');
  }

  const assetBase = getAssetBase();

  window.WA_SITE_VERSION = WA_SITE_VERSION;
  window.waAssetUrl = waAssetUrl;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootSiteFooter, { once: true });
  } else {
    bootSiteFooter();
  }

  function injectScript(relativePath, opts) {
    const script = document.createElement('script');
    script.src = waAssetUrl(relativePath);
    if (opts?.defer) script.defer = true;
    if (opts?.async) script.async = true;
    (opts?.target || document.head).appendChild(script);
    return script;
  }

  function runWhenIdle(fn, timeoutMs) {
    if (typeof requestIdleCallback === 'function') {
      requestIdleCallback(fn, { timeout: timeoutMs || 2000 });
    } else {
      setTimeout(fn, 1);
    }
  }

  /**
   * User preferences — theme, reading, accessibility
   */
  if (document.querySelector('#header .branding')) {
    injectScript('assets/js/user-preferences.js', { defer: true });
  }

  /**
   * Nav browsing history — load early, before optional template plugins
   */
  if (document.querySelector('#header .branding')) {
    injectScript('assets/js/nav-history.js', { defer: true });
    injectScript('assets/js/user-menu.js', { defer: true });
  }

  if (document.querySelector('#header .branding')) {
    const scheduleBootSitemap = () => {
      if (document.querySelector('script[src*="site-sitemap.js"]')) return;
      const bootSitemap = () => injectScript('assets/js/site-sitemap.js', { target: document.body, defer: true });
      if (window.WA_TOOLS_CATALOG || !document.getElementById('tool-app')) {
        bootSitemap();
      } else {
        window.addEventListener('watools:catalog-ready', bootSitemap, { once: true });
        window.setTimeout(bootSitemap, 15000);
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scheduleBootSitemap, { once: true });
    } else {
      scheduleBootSitemap();
    }
  }

  if (document.getElementById('tool-app')) {
    if (!document.querySelector('script[src*="tools-data.js"]')) {
      injectScript('assets/js/tools-data.js');
    }
    if (!document.querySelector('script[src*="sitemap-manifest.js"]')) {
      injectScript('assets/js/sitemap-manifest.js', { defer: true });
    }
  }

  if (document.querySelector('#header .branding')) {
    runWhenIdle(() => {
      injectScript('assets/js/header-context.js', { defer: true });
    }, 1500);
  }

  if (document.getElementById('tool-app')) {
    if (!document.querySelector('script[src*="tool-category-pager.js"]')) {
      const pagerScript = document.createElement('script');
      pagerScript.src = waAssetUrl('assets/js/tool-category-pager.js');
      (document.head || document.body).appendChild(pagerScript);
    }

    if (!window.WA_TOOLS_CATALOG) {
      const catalogScript = document.createElement('script');
      catalogScript.src = waAssetUrl('assets/js/tools-data.js');
      catalogScript.onload = () => {
        window.dispatchEvent(new Event('watools:catalog-ready'));
      };
      (document.head || document.body).appendChild(catalogScript);
    } else {
      window.dispatchEvent(new Event('watools:catalog-ready'));
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
   * Preloader — hide as soon as DOM is ready (don't wait for all images/fonts)
   */
  const preloader = document.querySelector('#preloader');
  let preloaderDone = false;

  function dismissPreloader() {
    if (!preloader || preloaderDone) return;
    preloaderDone = true;
    preloader.classList.add('preloader-done');
    window.setTimeout(() => preloader.remove(), 450);
  }

  if (preloader) {
    const skipPreloader = document.body.classList.contains('tool-page')
      || document.documentElement.classList.contains('wa-tool-page');
    if (skipPreloader) {
      dismissPreloader();
    } else if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', dismissPreloader, { once: true });
      window.setTimeout(dismissPreloader, 2800);
    } else {
      dismissPreloader();
      window.setTimeout(dismissPreloader, 2800);
    }
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
    if (document.body.classList.contains('tool-page')
      || document.documentElement.classList.contains('wa-tool-page')) {
      return;
    }
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => runWhenIdle(aosInit, 1200), { once: true });
  } else {
    runWhenIdle(aosInit, 1200);
  }

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
