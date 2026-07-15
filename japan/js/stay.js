/**
 * stay.js — Day / Night ambient previewer on stay cards
 */
(function () {
  "use strict";

  var cards = document.querySelectorAll(".stay-card");
  if (!cards.length) return;

  function setMode(card, night) {
    card.classList.toggle("is-night", night);
    var btn = card.querySelector(".stay-toggle");
    if (btn) {
      btn.setAttribute("aria-pressed", night ? "true" : "false");
      btn.textContent = night ? "切換日間視角" : "切換夜間視角";
    }
    var live = card.querySelector(".stay-card__live");
    if (live) {
      live.textContent = night ? "目前：夜間氛圍" : "目前：日間氛圍";
    }
  }

  function onToggle(e) {
    var btn = e.currentTarget;
    var card = btn.closest(".stay-card");
    if (!card) return;
    setMode(card, !card.classList.contains("is-night"));
  }

  cards.forEach(function (card) {
    var btn = card.querySelector(".stay-toggle");
    if (!btn) return;
    setMode(card, false);
    btn.addEventListener("click", onToggle);
  });

  // Prep lazy images with error fallback
  document.querySelectorAll(".stay-card__img").forEach(function (img) {
    img.addEventListener(
      "error",
      function () {
        img.style.background = "#3a453e";
        img.removeAttribute("src");
        img.alt = (img.alt || "旅宿") + "（圖片無法載入）";
      },
      { once: true }
    );
  });

  window.addEventListener("pagehide", function cleanup() {
    cards.forEach(function (card) {
      var btn = card.querySelector(".stay-toggle");
      if (btn) btn.removeEventListener("click", onToggle);
    });
    window.removeEventListener("pagehide", cleanup);
  });
})();
