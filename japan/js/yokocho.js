/**
 * yokocho.js — Ambient Soundboard with HTML5 <audio>
 * Procedural Web Audio fallback when remote files fail.
 */
(function () {
  "use strict";

  var buttons = document.querySelectorAll("[data-sound]");
  var statusEl = document.getElementById("soundboard-status");
  if (!buttons.length) return;

  var audioMap = {};
  var ctx = null;
  var nodes = {};

  function setStatus(msg, isError) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("is-error", !!isError);
  }

  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    return ctx;
  }

  function makeNoiseBuffer(ac, seconds) {
    var len = ac.sampleRate * seconds;
    var buf = ac.createBuffer(1, len, ac.sampleRate);
    var data = buf.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  function startProcedural(id) {
    var ac = ensureCtx();
    if (!ac) {
      setStatus("此瀏覽器不支援音訊播放。", true);
      return false;
    }
    if (ac.state === "suspended") ac.resume().catch(function () {});

    stopProcedural(id);
    var gain = ac.createGain();
    gain.gain.value = 0.12;
    gain.connect(ac.destination);

    if (id === "rain") {
      var src = ac.createBufferSource();
      src.buffer = makeNoiseBuffer(ac, 2);
      src.loop = true;
      var filter = ac.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 900;
      src.connect(filter);
      filter.connect(gain);
      src.start();
      nodes[id] = { src: src, gain: gain };
    } else if (id === "grill") {
      var src2 = ac.createBufferSource();
      src2.buffer = makeNoiseBuffer(ac, 1);
      src2.loop = true;
      var bp = ac.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800;
      bp.Q.value = 0.6;
      var g2 = ac.createGain();
      g2.gain.value = 0.08;
      src2.connect(bp);
      bp.connect(g2);
      g2.connect(ac.destination);
      src2.start();
      nodes[id] = { src: src2, gain: g2 };
    } else if (id === "glasses") {
      var osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 2200;
      var g3 = ac.createGain();
      g3.gain.value = 0;
      osc.connect(g3);
      g3.connect(ac.destination);
      osc.start();
      var tick = function () {
        if (!nodes[id]) return;
        var t = ac.currentTime;
        g3.gain.cancelScheduledValues(t);
        g3.gain.setValueAtTime(0, t);
        g3.gain.linearRampToValueAtTime(0.06, t + 0.01);
        g3.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);
      };
      tick();
      var iv = window.setInterval(tick, 2800 + Math.random() * 1200);
      nodes[id] = { src: osc, gain: g3, interval: iv };
    }
    return true;
  }

  function stopProcedural(id) {
    var n = nodes[id];
    if (!n) return;
    try {
      if (n.interval) clearInterval(n.interval);
      if (n.src.stop) n.src.stop();
      if (n.src.disconnect) n.src.disconnect();
      if (n.gain) n.gain.disconnect();
    } catch (e) { /* ignore */ }
    delete nodes[id];
  }

  function getAudio(id) {
    if (audioMap[id]) return audioMap[id];
    var el = document.getElementById("audio-" + id);
    if (el) audioMap[id] = el;
    return audioMap[id] || null;
  }

  function play(id, btn) {
    var audio = getAudio(id);
    var usedFallback = false;

    function ok() {
      btn.classList.add("is-on");
      btn.setAttribute("aria-pressed", "true");
      setStatus("環境音開啟：" + (btn.querySelector(".sound-btn__label") || {}).textContent);
    }

    if (audio) {
      audio.loop = true;
      audio.volume = 0.45;
      var p = audio.play();
      if (p && typeof p.then === "function") {
        p.then(ok).catch(function () {
          usedFallback = startProcedural(id);
          if (usedFallback) ok();
          else setStatus("無法播放音訊，請檢查瀏覽器權限。", true);
        });
      } else {
        ok();
      }
      audio.onerror = function () {
        usedFallback = startProcedural(id);
        if (usedFallback) ok();
        else setStatus("音訊載入失敗，已嘗試本機合成後援。", true);
      };
    } else {
      if (startProcedural(id)) ok();
    }
  }

  function stop(id, btn) {
    var audio = getAudio(id);
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (e) { /* ignore */ }
    }
    stopProcedural(id);
    btn.classList.remove("is-on");
    btn.setAttribute("aria-pressed", "false");
    setStatus("已關閉：" + (btn.querySelector(".sound-btn__label") || {}).textContent);
  }

  function onClick(e) {
    var btn = e.currentTarget;
    var id = btn.getAttribute("data-sound");
    if (!id) return;
    if (btn.classList.contains("is-on")) stop(id, btn);
    else play(id, btn);
  }

  buttons.forEach(function (btn) {
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", onClick);
  });

  window.addEventListener("pagehide", function cleanup() {
    buttons.forEach(function (btn) {
      var id = btn.getAttribute("data-sound");
      if (id && btn.classList.contains("is-on")) stop(id, btn);
      btn.removeEventListener("click", onClick);
    });
    if (ctx && ctx.close) ctx.close().catch(function () {});
    window.removeEventListener("pagehide", cleanup);
  });
})();
