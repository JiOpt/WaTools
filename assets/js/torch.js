/**
 * Torch / Flashlight controller
 * Uses camera flash when available, falls back to full-screen white overlay.
 */
(function () {
  'use strict';

  const BLINK_INTERVAL_MS = 500;

  let els = {};
  let eventsBound = false;
  let bootPromise = null;
  let lastBootAt = 0;

  const state = {
    stream: null,
    track: null,
    hasTorch: false,
    mode: 'none', // 'camera' | 'screen' | 'none'
    isOn: false,
    isBlinking: false,
    blinkTimer: null,
    blinkOn: false,
    wakeLockSentinel: null,
  };

  function isEn() {
    return document.documentElement.getAttribute('data-locale') === 'en' ||
      (window.WA_LOCALE && window.WA_LOCALE.isEn && window.WA_LOCALE.isEn());
  }

  const MSG = {
    zh: {
      blinking: '閃爍中',
      blinkCam: '閃光燈在蹦迪',
      blinkScreen: '螢幕在呼吸',
      on: '手電筒已開啟',
      onCam: '閃光燈全開，請對準需要照的地方',
      onScreen: '螢幕全白，請勿直視太久',
      off: '手電筒已關閉',
      standbyCam: '閃光燈待命中',
      standbyScreen: '螢幕照明待命中',
      allowOrScreen: '允許相機，或直接用螢幕頂上',
      noCamOk: '沒相機？沒關係，螢幕也能當手電筒',
      requesting: '正在請求相機權限…',
      readyCam: '閃光燈已就位，隨時可開',
      noFlashScreen: '這支手機沒閃光燈，螢幕將代班',
      deniedTryScreen: '相機權限還沒給，先試試螢幕照明？',
    },
    en: {
      blinking: 'Blinking',
      blinkCam: 'Flash is strobing',
      blinkScreen: 'Screen is pulsing',
      on: 'Torch is on',
      onCam: 'Flash at full power — aim where you need light',
      onScreen: 'Screen is white — avoid staring too long',
      off: 'Torch is off',
      standbyCam: 'Flash on standby',
      standbyScreen: 'Screen light on standby',
      allowOrScreen: 'Allow the camera, or use the screen light',
      noCamOk: 'No camera? The screen still works as a torch',
      requesting: 'Requesting camera permission…',
      readyCam: 'Flash ready — turn on anytime',
      noFlashScreen: 'No flash on this phone — screen light will cover',
      deniedTryScreen: 'Camera still denied — try screen light?',
    },
  };

  function t(key) {
    return (isEn() ? MSG.en : MSG.zh)[key] || MSG.zh[key] || key;
  }

  function isTorchPage() {
    return !!document.getElementById('torch-section');
  }

  function queryElements() {
    return {
      screenLight: document.getElementById('torch-screen-light'),
      status: document.getElementById('torch-status'),
      statusDetail: document.getElementById('torch-status-detail'),
      btnOn: document.getElementById('torch-btn-on'),
      btnOff: document.getElementById('torch-btn-off'),
      btnBlink: document.getElementById('torch-btn-blink'),
      wakeLock: document.getElementById('torch-wake-lock'),
      helpCamera: document.getElementById('torch-help-camera'),
    };
  }

  function ensureScreenLightOverlay() {
    let el = document.getElementById('torch-screen-light');
    if (!el) {
      el = document.createElement('div');
      el.id = 'torch-screen-light';
      el.setAttribute('aria-hidden', 'true');
      document.body.appendChild(el);
    }
    return el;
  }

  function setStatus(text, detail) {
    if (els.status) els.status.textContent = text;
    if (els.statusDetail) els.statusDetail.textContent = detail || '';
  }

  function updateButtons() {
    if (state.isBlinking) {
      if (els.btnOn) els.btnOn.disabled = true;
      if (els.btnOff) els.btnOff.disabled = false;
    } else {
      if (els.btnOn) els.btnOn.disabled = state.isOn;
      if (els.btnOff) els.btnOff.disabled = !state.isOn;
    }
    if (els.btnBlink) {
      els.btnBlink.classList.toggle('active', state.isBlinking);
      els.btnBlink.setAttribute('aria-pressed', state.isBlinking ? 'true' : 'false');
    }
    document.body.classList.toggle('torch-active', state.isOn || state.isBlinking);
  }

  function setScreenLight(on) {
    if (els.screenLight) {
      els.screenLight.classList.toggle('is-on', on);
      els.screenLight.setAttribute('aria-hidden', on ? 'false' : 'true');
    }
  }

  async function setCameraTorch(on) {
    if (!state.hasTorch || !state.track) return false;
    try {
      await state.track.applyConstraints({ advanced: [{ torch: on }] });
      return true;
    } catch (err) {
      console.warn('Torch constraint failed:', err);
      return false;
    }
  }

  async function applyLight(on) {
    let cameraOk = false;

    if (state.mode === 'camera' || state.mode === 'none') {
      cameraOk = await setCameraTorch(on);
    }

    if (cameraOk) {
      state.mode = 'camera';
      setScreenLight(false);
    } else {
      state.mode = 'screen';
      setScreenLight(on);
    }

    state.isOn = on;
    updateButtons();
    refreshStatusLabel();
  }

  function refreshStatusLabel() {
    if (state.isBlinking) {
      setStatus(t('blinking'), state.mode === 'camera' ? t('blinkCam') : t('blinkScreen'));
      return;
    }
    if (state.isOn) {
      setStatus(t('on'), state.mode === 'camera' ? t('onCam') : t('onScreen'));
      return;
    }
    if (state.mode === 'camera') {
      setStatus(t('off'), t('standbyCam'));
    } else if (state.mode === 'screen') {
      setStatus(t('off'), t('standbyScreen'));
    } else {
      setStatus(t('off'), t('allowOrScreen'));
    }
  }

  function stopBlinking() {
    if (state.blinkTimer) {
      clearInterval(state.blinkTimer);
      state.blinkTimer = null;
    }
    state.isBlinking = false;
    state.blinkOn = false;
  }

  async function turnOn() {
    stopBlinking();
    await applyLight(true);
    await requestWakeLockIfEnabled();
  }

  async function turnOff() {
    stopBlinking();
    await applyLight(false);
    await releaseWakeLock();
    updateButtons();
    refreshStatusLabel();
  }

  async function toggleBlink() {
    if (state.isBlinking) {
      stopBlinking();
      await applyLight(false);
      await releaseWakeLock();
      updateButtons();
      refreshStatusLabel();
      return;
    }

    stopBlinking();
    state.isBlinking = true;
    state.blinkOn = true;
    await applyLight(true);
    await requestWakeLockIfEnabled();
    updateButtons();
    refreshStatusLabel();

    state.blinkTimer = setInterval(async () => {
      state.blinkOn = !state.blinkOn;
      await applyLight(state.blinkOn);
    }, BLINK_INTERVAL_MS);
  }

  async function requestWakeLockIfEnabled() {
    if (!els.wakeLock?.checked || !('wakeLock' in navigator)) return;
    try {
      state.wakeLockSentinel = await navigator.wakeLock.request('screen');
      state.wakeLockSentinel.addEventListener('release', () => {
        state.wakeLockSentinel = null;
      });
    } catch (err) {
      console.warn('Wake lock failed:', err);
    }
  }

  async function releaseWakeLock() {
    if (state.wakeLockSentinel) {
      try {
        await state.wakeLockSentinel.release();
      } catch (err) {
        console.warn('Wake lock release failed:', err);
      }
      state.wakeLockSentinel = null;
    }
  }

  function resetRuntimeState() {
    state.stream = null;
    state.track = null;
    state.hasTorch = false;
    state.mode = 'none';
    state.isOn = false;
    stopBlinking();
  }

  async function initCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      state.mode = 'screen';
      if (els.helpCamera) els.helpCamera.hidden = false;
      setStatus(t('off'), t('noCamOk'));
      return;
    }

    setStatus(t('off'), t('requesting'));

    try {
      state.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      state.track = state.stream.getVideoTracks()[0];
      const capabilities = state.track.getCapabilities?.() || {};
      state.hasTorch = capabilities.torch === true;
      state.mode = state.hasTorch ? 'camera' : 'screen';

      if (els.helpCamera) els.helpCamera.hidden = state.hasTorch;

      setStatus(t('off'), state.hasTorch ? t('readyCam') : t('noFlashScreen'));
    } catch (err) {
      state.mode = 'screen';
      if (els.helpCamera) els.helpCamera.hidden = false;
      setStatus(t('off'), t('deniedTryScreen'));
      console.warn('Camera init failed:', err);
    }
  }

  function cleanup() {
    stopBlinking();
    releaseWakeLock();
    if (state.track) {
      state.track.stop();
      state.track = null;
    }
    if (state.stream) {
      state.stream.getTracks().forEach((t) => t.stop());
      state.stream = null;
    }
    setScreenLight(false);
    document.body.classList.remove('torch-active');
    resetRuntimeState();
  }

  function bindEvents() {
    if (eventsBound) return;
    eventsBound = true;

    document.addEventListener('click', (event) => {
      if (event.target.closest('#torch-btn-on')) turnOn();
      else if (event.target.closest('#torch-btn-off')) turnOff();
      else if (event.target.closest('#torch-btn-blink')) toggleBlink();
    });

    document.addEventListener('change', (event) => {
      if (event.target.id !== 'torch-wake-lock') return;
      if (els.wakeLock?.checked && (state.isOn || state.isBlinking)) {
        requestWakeLockIfEnabled();
      } else if (!els.wakeLock?.checked) {
        releaseWakeLock();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (!isTorchPage()) return;
      if (document.visibilityState === 'visible' && els.wakeLock?.checked && (state.isOn || state.isBlinking)) {
        requestWakeLockIfEnabled();
      }
    });

    window.addEventListener('pagehide', cleanup);
    window.addEventListener('mytoolife:soft-nav', scheduleBoot);
  }

  async function boot() {
    if (!isTorchPage()) {
      cleanup();
      return;
    }

    const now = Date.now();
    if (state.stream && now - lastBootAt < 500) return;
    if (bootPromise) return bootPromise;

    bootPromise = (async () => {
      bindEvents();
      cleanup();
      els = queryElements();
      ensureScreenLightOverlay();
      els.screenLight = document.getElementById('torch-screen-light');
      updateButtons();
      await initCamera();
      refreshStatusLabel();
      lastBootAt = Date.now();
    })();

    try {
      await bootPromise;
    } finally {
      bootPromise = null;
    }
  }

  function scheduleBoot() {
    boot();
  }

  window.__waBootTorch = boot;
  window.__waCleanupTorch = cleanup;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleBoot);
  } else {
    scheduleBoot();
  }
})();
