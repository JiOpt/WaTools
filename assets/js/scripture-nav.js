(function () {
  'use strict';

  const HEADER_OFFSET = 96;
  let scrollScheduled = false;

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    return rect.bottom > HEADER_OFFSET && rect.top < vh;
  }

  function shouldShowSegmentNav(article) {
    const viewport = window.innerHeight || document.documentElement.clientHeight;
    const related = article.querySelector('.scripture-related');
    const measureHeight = related ? related.offsetTop : article.scrollHeight;
    return measureHeight > viewport * 0.95;
  }

  function getSections(article) {
    return [...article.querySelectorAll(
      '.scripture-chapter[id*="-seg-"], .scripture-subhead[id*="-seg-"]'
    )].map((el) => ({
      id: el.id,
      title: el.textContent.replace(/\s+/g, ' ').trim(),
      el,
    }));
  }

  function isBeforeInDom(earlier, later) {
    return !!(earlier.compareDocumentPosition(later) & Node.DOCUMENT_POSITION_FOLLOWING);
  }

  function findNextOffscreen(nav, sections) {
    let afterNav = false;
    for (const sec of sections) {
      if (!afterNav) {
        if (isBeforeInDom(nav, sec.el)) afterNav = true;
        else continue;
      }
      if (!isInViewport(sec.el)) return sec;
    }
    return null;
  }

  function findPrevOffscreen(nav, sections) {
    const before = sections.filter((sec) => isBeforeInDom(sec.el, nav));
    for (let i = before.length - 1; i >= 0; i -= 1) {
      if (!isInViewport(before[i].el)) return before[i];
    }
    return null;
  }

  function ensureNavLink(nav, kind) {
    let link = nav.querySelector(`.scripture-segment-nav-${kind}`);
    if (link) return link;

    link = document.createElement('a');
    link.className = `scripture-segment-nav-link scripture-segment-nav-${kind}`;
    link.innerHTML = `
      <span class="scripture-segment-nav-label">${kind === 'prev' ? '上一段' : '下一段'}</span>
      <span class="scripture-segment-nav-title"></span>`;
    nav.appendChild(link);
    link.addEventListener('click', handleSegmentClick);
    return link;
  }

  function setNavLink(link, section) {
    if (!section) {
      link.hidden = true;
      link.removeAttribute('href');
      return;
    }
    link.hidden = false;
    link.href = `#${section.id}`;
    link.querySelector('.scripture-segment-nav-title').textContent = section.title;
  }

  function updateSegmentNavTargets() {
    const article = document.querySelector('.scripture-article');
    if (!article) return;

    const sections = getSections(article);
    if (sections.length < 2) return;

    const showNav = shouldShowSegmentNav(article);

    article.querySelectorAll('.scripture-segment-nav').forEach((nav) => {
      if (!showNav) {
        nav.hidden = true;
        return;
      }

      const prevSec = findPrevOffscreen(nav, sections);
      const nextSec = findNextOffscreen(nav, sections);

      const prevLink = nav.querySelector('.scripture-segment-nav-prev');
      const nextLink = nav.querySelector('.scripture-segment-nav-next');

      if (prevLink || prevSec) setNavLink(prevLink || ensureNavLink(nav, 'prev'), prevSec);
      if (nextLink || nextSec) setNavLink(nextLink || ensureNavLink(nav, 'next'), nextSec);

      const hasVisibleLink = [...nav.querySelectorAll('.scripture-segment-nav-link')]
        .some((link) => !link.hidden);
      nav.hidden = !hasVisibleLink;
    });
  }

  function handleSegmentClick(event) {
    const link = event.currentTarget;
    const id = link.getAttribute('href')?.slice(1);
    if (!id) return;

    const target = document.getElementById(id);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);

    window.setTimeout(updateSegmentNavTargets, 400);
  }

  function scheduleNavUpdate() {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      updateSegmentNavTargets();
    });
  }

  function init() {
    if (!document.body.classList.contains('scripture-page')) return;

    updateSegmentNavTargets();
    window.addEventListener('resize', updateSegmentNavTargets);
    window.addEventListener('load', updateSegmentNavTargets);
    window.addEventListener('scroll', scheduleNavUpdate, { passive: true });

    const fontObserver = new MutationObserver(updateSegmentNavTargets);
    fontObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-font-size'],
    });

    document.querySelectorAll('.scripture-segment-nav-link[href^="#"]').forEach((link) => {
      link.addEventListener('click', handleSegmentClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
