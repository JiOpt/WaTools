/**
* Template Name: Medilab
* Template URL: https://bootstrapmade.com/medilab-free-medical-bootstrap-theme/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  const WA_SITE_VERSION = '0.6.39';

  function waAssetUrl(relativePath) {
    const base = relativePath.split('?')[0];
    const prefix = assetBase || (function () {
      const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
      const page = segs[segs.length - 1] || '';
      const depth = /\.html$/i.test(page) && segs.length > 1 ? segs.length - 1 : 0;
      return depth ? '../'.repeat(depth) : '';
    })();
    return prefix + base + '?v=' + WA_SITE_VERSION;
  }

  function footerRootPrefix() {
    if (window.WA_TOOL_URLS?.siteRootPrefix) {
      return window.WA_TOOL_URLS.siteRootPrefix();
    }
    const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    if (!segs.length) return '';
    const last = segs[segs.length - 1].replace(/\.html$/i, '');
    const rootSlugs = new Set(['index', 'copyright', 'contact', 'privacy', 'disclaimer', 'index_plan', 'starter-page']);
    if (segs.length === 1 && rootSlugs.has(last)) return '';
    return '../'.repeat(segs.length - 1);
  }

  function renderSiteFooter() {
    const slot = document.querySelector('#footer .copyright p');
    if (!slot) return;

    const cfg = window.WA_SITE_FOOTER || {};
    const en = window.WA_LOCALE?.isEn?.() || document.documentElement.getAttribute('data-locale') === 'en';
    const t = (key, fallback) => (window.WA_LOCALE?.t ? window.WA_LOCALE.t(key, fallback) : fallback);
    const siteName = cfg.siteName || 'KaWaTool';
    const tagline = en ? t('footer.tagline', cfg.taglineEn || 'Tools for everyday life.') : (cfg.tagline || '讓工具生活，簡化每一天。');
    const parts = [`© <strong class="sitename">${siteName}</strong> — ${tagline}`];
    parts.push(` · <span class="site-version">v${WA_SITE_VERSION}</span>`);

    const abs = (path) => (window.WA_TOOL_URLS?.absolutePageHref
      ? window.WA_TOOL_URLS.absolutePageHref(path)
      : (window.WA_LOCALE?.href ? window.WA_LOCALE.href(path) : `/${path}`));

    if (cfg.showCopyrightLink !== false) {
      const href = cfg.copyrightHref || abs('copyright');
      const label = en ? t('footer.copyright', 'Copyright') : (cfg.copyrightLabel || '版權聲明');
      parts.push(` · <a href="${href}">${label}</a>`);
    }

    if (cfg.showPrivacyLink !== false) {
      const href = cfg.privacyHref || abs('privacy');
      const label = en ? t('footer.privacy', 'Privacy Policy') : (cfg.privacyLabel || '隱私權政策');
      parts.push(` · <a href="${href}">${label}</a>`);
    }

    if (cfg.showDisclaimerLink !== false) {
      const href = cfg.disclaimerHref || abs('disclaimer');
      const label = en ? t('footer.disclaimer', 'Disclaimer') : (cfg.disclaimerLabel || '免責聲明');
      parts.push(` · <a href="${href}">${label}</a>`);
    }

    if (cfg.showContactLink !== false) {
      const href = cfg.contactHref || abs('contact');
      const label = en ? t('footer.contact', 'Contact') : (cfg.contactLabel || '聯絡我們');
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
    if (script?.src) {
      const base = script.src.replace(/assets\/js\/main\.js(\?.*)?$/, '');
      if (base && base !== script.src) return base;
    }
    if (window.WA_TOOL_URLS?.siteRootPrefix) {
      return window.WA_TOOL_URLS.siteRootPrefix();
    }
    const segs = location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    if (!segs.length) return '';
    const last = segs[segs.length - 1].replace(/\.html$/i, '');
    const rootSlugs = new Set(['index', 'copyright', 'contact', 'privacy', 'disclaimer', 'index_plan', 'starter-page']);
    if (segs.length === 1 && rootSlugs.has(last)) return '';
    return '../'.repeat(segs.length - 1);
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
    injectScript('assets/js/i18n-en.js', { defer: true });
    injectScript('assets/js/locale.js', { defer: true });
    injectScript('assets/js/user-preferences.js', { defer: true });
    injectScript('assets/js/zh-variant.js', { defer: true });
  }

  /**
   * Nav browsing history — load early, before optional template plugins
   */
  if (document.querySelector('#header .branding')) {
    injectScript('assets/js/nav-history.js', { defer: true });
    injectScript('assets/js/user-menu.js', { defer: true });
    injectScript('assets/js/soft-nav.js');
  }

  if (document.querySelector('#header .branding')) {
    const scheduleBootSitemap = () => {
      if (document.querySelector('script[src*="site-sitemap.js"]')) return;
      const bootSitemap = () => injectScript('assets/js/site-sitemap.js', { target: document.body, defer: true });
      if (window.WA_TOOLS_CATALOG || !document.getElementById('tool-app')) {
        bootSitemap();
      } else {
        window.addEventListener('mytoolife:catalog-ready', bootSitemap, { once: true });
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
    if (!document.querySelector('script[src*="tool-urls.js"]')) {
      injectScript('assets/js/tool-urls.js');
    }
    if (!document.querySelector('script[src*="sitemap-manifest.js"]')) {
      injectScript('assets/js/sitemap-manifest.js', { defer: true });
    }
    if (!document.querySelector('script[src*="sitemap-pager.js"]')) {
      injectScript('assets/js/sitemap-pager.js');
    }
  }

  const isScripturePage = /\/scripture\/[^/]+$/i.test(location.pathname.replace(/\\/g, '/'));
  if (isScripturePage) {
    if (!document.querySelector('script[src*="sitemap-manifest.js"]')) {
      injectScript('assets/js/sitemap-manifest.js', { defer: true });
    }
    if (!document.querySelector('script[src*="sitemap-pager.js"]')) {
      injectScript('assets/js/sitemap-pager.js');
    }
    if (!document.querySelector('script[src*="scripture-pager.js"]')) {
      injectScript('assets/js/scripture-pager.js');
    }
  }

  if (document.querySelector('#header .branding') && !document.querySelector('script[src*="tool-urls.js"]')) {
    injectScript('assets/js/tool-urls.js', { defer: true });
  }

  if (document.querySelector('#header .branding') && !document.querySelector('script[src*="sitemap-pager.js"]')) {
    injectScript('assets/js/sitemap-pager.js', { defer: true });
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
        window.dispatchEvent(new Event('mytoolife:catalog-ready'));
      };
      (document.head || document.body).appendChild(catalogScript);
    } else {
      window.dispatchEvent(new Event('mytoolife:catalog-ready'));
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
    if ((document.body.classList.contains('tool-page') && !document.body.classList.contains('plan-page'))
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
