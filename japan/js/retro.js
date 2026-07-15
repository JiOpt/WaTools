/**
 * retro.js — Time Slider with CSS clip-path morph
 */
(function () {
  "use strict";

  var slider = document.getElementById("time-slider");
  var morph = document.getElementById("time-morph");
  var output = document.getElementById("time-slider-value");
  if (!slider || !morph) return;

  var raf = 0;

  function apply(pct) {
    var v = Math.max(0, Math.min(100, Number(pct) || 0));
    morph.style.setProperty("--morph-pct", v + "%");
    if (output) {
      if (v <= 15) output.textContent = "現代東京";
      else if (v >= 85) output.textContent = "昭和風景";
      else output.textContent = "過渡中 · " + Math.round(v) + "%";
    }
  }

  function onInput() {
    var val = slider.value;
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function () {
      raf = 0;
      apply(val);
    });
  }

  apply(slider.value);
  slider.addEventListener("input", onInput);

  window.addEventListener("pagehide", function cleanup() {
    slider.removeEventListener("input", onInput);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("pagehide", cleanup);
  });
})();
