/**
 * yokai.js — Spotlight flashlight reveal (throttled mousemove)
 */
(function () {
  "use strict";

  var stage = document.getElementById("spotlight-stage");
  var beam = document.getElementById("spotlight-beam");
  var cursor = document.getElementById("yokai-cursor");
  var spirits = stage ? stage.querySelectorAll(".yokai-hidden") : [];
  if (!stage) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;
  var raf = 0;
  var lastX = 0;
  var lastY = 0;
  var active = false;
  var revealR = 100;

  if (reduceMotion || coarse || !window.requestAnimationFrame) {
    stage.classList.add("is-fallback");
    spirits.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  function revealNear(x, y) {
    var rect = stage.getBoundingClientRect();
    spirits.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var cx = r.left + r.width / 2 - rect.left;
      var cy = r.top + r.height / 2 - rect.top;
      var dx = cx - x;
      var dy = cy - y;
      var near = dx * dx + dy * dy < revealR * revealR;
      el.classList.toggle("is-revealed", near);
    });
  }

  function paint() {
    raf = 0;
    stage.style.setProperty("--spot-x", lastX + "px");
    stage.style.setProperty("--spot-y", lastY + "px");
    if (beam) {
      beam.style.left = lastX + "px";
      beam.style.top = lastY + "px";
    }
    revealNear(lastX, lastY);
  }

  function onMove(e) {
    var rect = stage.getBoundingClientRect();
    var clientX = e.touches ? e.touches[0].clientX : e.clientX;
    var clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastX = clientX - rect.left;
    lastY = clientY - rect.top;
    if (cursor) {
      cursor.style.left = clientX + "px";
      cursor.style.top = clientY + "px";
    }
    if (!raf) raf = requestAnimationFrame(paint);
  }

  function onEnter() {
    active = true;
    if (beam) beam.classList.add("is-on");
    if (cursor) cursor.classList.add("is-on");
  }

  function onLeave() {
    active = false;
    if (beam) beam.classList.remove("is-on");
    if (cursor) cursor.classList.remove("is-on");
    spirits.forEach(function (el) {
      el.classList.remove("is-revealed");
    });
  }

  stage.addEventListener("pointerenter", onEnter);
  stage.addEventListener("pointerleave", onLeave);
  stage.addEventListener("pointermove", onMove, { passive: true });

  document.addEventListener("mousemove", function docMove(e) {
    if (!cursor || !active) return;
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  window.addEventListener("pagehide", function cleanup() {
    stage.removeEventListener("pointerenter", onEnter);
    stage.removeEventListener("pointerleave", onLeave);
    stage.removeEventListener("pointermove", onMove);
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("pagehide", cleanup);
  });
})();
