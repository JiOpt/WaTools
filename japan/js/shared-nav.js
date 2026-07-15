/**
 * Japan theme pages — shared responsive navigation
 * Vanilla JS only; cleans up listeners on page hide.
 */
(function () {
  "use strict";

  var nav = document.getElementById("jp-nav");
  var toggle = document.getElementById("jp-nav-toggle");
  var menu = document.getElementById("jp-nav-menu");
  if (!nav || !toggle || !menu) return;

  var open = false;

  function setOpen(next) {
    open = !!next;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "關閉選單" : "開啟選單");
    if (open) {
      document.addEventListener("keydown", onKey);
      document.addEventListener("click", onOutside);
    } else {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onOutside);
    }
  }

  function onKey(e) {
    if (e.key === "Escape") setOpen(false);
  }

  function onOutside(e) {
    if (!nav.contains(e.target)) setOpen(false);
  }

  function onToggle(e) {
    e.stopPropagation();
    setOpen(!open);
  }

  function onResize() {
    if (window.innerWidth > 860 && open) setOpen(false);
  }

  var resizeTimer = 0;
  function throttledResize() {
    if (resizeTimer) return;
    resizeTimer = window.setTimeout(function () {
      resizeTimer = 0;
      onResize();
    }, 120);
  }

  toggle.addEventListener("click", onToggle);
  window.addEventListener("resize", throttledResize);

  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (open) setOpen(false);
    });
  });

  window.addEventListener("pagehide", function cleanup() {
    setOpen(false);
    toggle.removeEventListener("click", onToggle);
    window.removeEventListener("resize", throttledResize);
    document.removeEventListener("keydown", onKey);
    document.removeEventListener("click", onOutside);
    window.removeEventListener("pagehide", cleanup);
  });
})();
