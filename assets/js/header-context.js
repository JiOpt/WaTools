(function () {
  'use strict';

  const GEO_CACHE_KEY = 'watools-header-geo';
  const WEATHER_CACHE_KEY = 'watools-header-weather';
  const WEATHER_TTL_MS = 30 * 60 * 1000;
  const DEFAULT_GEO = { lat: 25.033, lon: 121.565, label: '臺北' };

  const WMO_ICONS = [
    [0, 'bi-sun-fill', '晴'],
    [3, 'bi-cloud-sun-fill', '多雲'],
    [48, 'bi-cloud-fog2-fill', '霧'],
    [57, 'bi-cloud-drizzle-fill', '毛毛雨'],
    [67, 'bi-cloud-rain-fill', '雨'],
    [77, 'bi-cloud-snow-fill', '雪'],
    [82, 'bi-cloud-rain-heavy-fill', '陣雨'],
    [86, 'bi-cloud-snow-fill', '陣雪'],
    [99, 'bi-cloud-lightning-rain-fill', '雷雨'],
  ];

  function weatherMeta(code) {
    const n = Number(code);
    for (const [max, icon, label] of WMO_ICONS) {
      if (n <= max) return { icon, label };
    }
    return { icon: 'bi-cloud-fill', label: '多雲' };
  }

  function readJson(key) {
    try {
      const raw = sessionStorage.getItem(key) || localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function writeJson(key, value, persist) {
    const raw = JSON.stringify(value);
    try {
      sessionStorage.setItem(key, raw);
      if (persist) localStorage.setItem(key, raw);
    } catch {
      /* quota / file:// */
    }
  }

  function formatGregorian(date) {
    return new Intl.DateTimeFormat('zh-Hant', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  function formatGregorianShort(date) {
    return new Intl.DateTimeFormat('zh-Hant', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }).format(date);
  }

  function formatLunar(date) {
    try {
      const parts = new Intl.DateTimeFormat('zh-Hant-u-ca-chinese', {
        month: 'long',
        day: 'numeric',
      }).formatToParts(date);
      const month = parts.find((p) => p.type === 'month')?.value || '';
      const day = parts.find((p) => p.type === 'day')?.value || '';
      if (month && day) return `農曆${month}${day}`;
      return new Intl.DateTimeFormat('zh-Hant-u-ca-chinese', {
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return '農曆 —';
    }
  }

  function formatWeekday(date) {
    return new Intl.DateTimeFormat('zh-Hant', { weekday: 'long' }).format(date);
  }

  function formatWeekdayShort(date) {
    return new Intl.DateTimeFormat('zh-Hant', { weekday: 'short' }).format(date);
  }

  function roundTemp(n) {
    return Math.round(Number(n));
  }

  function syncHeaderOffset() {
    const header = document.getElementById('header');
    if (!header) return;
    const navHidden = document.body.classList.contains('header-nav-hidden');
    const h = navHidden ? 0 : header.offsetHeight;
    document.documentElement.style.setProperty('--header-offset', `${h}px`);
    document.documentElement.style.setProperty('--site-sitemap-top', `${h}px`);
    document.documentElement.style.setProperty('--wf-sticky-top', `${h}px`);
    window.dispatchEvent(new CustomEvent('watools:header-offset', { detail: { height: h } }));
  }

  function setupHeaderNavAutoHide() {
    const header = document.getElementById('header');
    if (!header || !header.classList.contains('sticky-top')) return;

    document.body.classList.add('header-nav-auto');

    let lastY = window.scrollY;
    let ticking = false;
    const SCROLL_DELTA = 10;
    const TOP_SHOW = 72;

    function setNavHidden(hidden) {
      const on = Boolean(hidden);
      if (document.body.classList.contains('header-nav-hidden') === on) return;
      document.body.classList.toggle('header-nav-hidden', on);
      syncHeaderOffset();
      window.setTimeout(syncHeaderOffset, 320);
    }

    function update() {
      const y = window.scrollY;
      const delta = y - lastY;

      if (y <= TOP_SHOW) {
        setNavHidden(false);
      } else if (delta > SCROLL_DELTA) {
        setNavHidden(true);
      } else if (delta < -SCROLL_DELTA) {
        setNavHidden(false);
      }

      lastY = y;
    }

    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }, { passive: true });
  }

  function buildBar() {
    const header = document.getElementById('header');
    if (!header || header.querySelector('.header-context-bar')) return null;

    const bar = document.createElement('div');
    bar.className = 'header-context-bar';
    bar.setAttribute('aria-label', '今日日期與天氣');
    bar.innerHTML = `
      <div class="container header-context-inner">
        <div class="header-context-dateblock">
          <time class="header-context-gregorian" datetime=""></time>
          <span class="header-context-sep" aria-hidden="true">·</span>
          <span class="header-context-lunar"></span>
          <span class="header-context-sep" aria-hidden="true">·</span>
          <span class="header-context-weekday"></span>
        </div>
        <div class="header-context-weather" aria-live="polite">
          <span class="header-context-weather-loading">定位天氣中…</span>
        </div>
      </div>
    `;

    header.insertBefore(bar, header.firstChild);
    document.body.classList.add('has-header-context');
    return bar;
  }

  function renderDate(bar) {
    const now = new Date();
    const greg = bar.querySelector('.header-context-gregorian');
    const lunar = bar.querySelector('.header-context-lunar');
    const weekday = bar.querySelector('.header-context-weekday');
    if (!greg || !lunar || !weekday) return;

    greg.dateTime = now.toISOString().slice(0, 10);
    greg.textContent = formatGregorian(now);
    greg.dataset.short = formatGregorianShort(now);
    lunar.textContent = formatLunar(now);
    weekday.textContent = formatWeekday(now);
    weekday.dataset.short = formatWeekdayShort(now);
  }

  function renderWeather(bar, payload) {
    const box = bar.querySelector('.header-context-weather');
    if (!box) return;

    if (!payload) {
      box.innerHTML = '<span class="header-context-weather-muted">天氣無法取得</span>';
      return;
    }

    const { icon, label } = weatherMeta(payload.code);
    const now = roundTemp(payload.current);
    const min = roundTemp(payload.min);
    const max = roundTemp(payload.max);
    const place = payload.label || '';

    box.innerHTML = `
      <span class="header-context-weather-main" title="${label}">
        <i class="bi ${icon} header-context-weather-icon" aria-hidden="true"></i>
        <span class="header-context-weather-now">現在 ${now}°</span>
        <span class="header-context-weather-range">今日 ${min}–${max}°</span>
      </span>
      <span class="header-context-weather-place">${place}</span>
    `;
    box.setAttribute('aria-label', `${place} ${label}，現在 ${now} 度，今日 ${min} 到 ${max} 度`);
  }

  async function reverseLabel(lat, lon) {
    try {
      const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&language=zh&count=1`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('reverse geocode failed');
      const data = await res.json();
      const hit = data.results?.[0];
      if (!hit) return null;
      return hit.name || hit.admin1 || null;
    } catch {
      return null;
    }
  }

  async function fetchWeather(lat, lon) {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', String(lat));
    url.searchParams.set('longitude', String(lon));
    url.searchParams.set('current', 'temperature_2m,weather_code');
    url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,weather_code');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '1');

    const res = await fetch(url);
    if (!res.ok) throw new Error('weather failed');
    const data = await res.json();
    return {
      current: data.current?.temperature_2m,
      code: data.current?.weather_code ?? data.daily?.weather_code?.[0],
      min: data.daily?.temperature_2m_min?.[0],
      max: data.daily?.temperature_2m_max?.[0],
    };
  }

  function readGeoCache() {
    const hit = readJson(GEO_CACHE_KEY);
    if (!hit || hit.lat == null || hit.lon == null) return null;
    return hit;
  }

  function readWeatherCache(lat, lon) {
    const hit = readJson(WEATHER_CACHE_KEY);
    if (!hit || hit.lat !== lat || hit.lon !== lon) return null;
    if (Date.now() - hit.ts > WEATHER_TTL_MS) return null;
    return hit;
  }

  function geolocationPromise() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('no geolocation'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          source: 'gps',
        }),
        reject,
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 }
      );
    });
  }

  async function ipGeoPromise() {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('ip geo failed');
    const data = await res.json();
    if (data.latitude == null || data.longitude == null) throw new Error('ip geo incomplete');
    return {
      lat: data.latitude,
      lon: data.longitude,
      label: data.city || data.region || data.country_name,
      source: 'ip',
    };
  }

  async function resolveGeo() {
    const cached = readGeoCache();
    if (cached?.label) return cached;

    try {
      const gps = await geolocationPromise();
      const label = await reverseLabel(gps.lat, gps.lon);
      const geo = { ...gps, label: label || '目前位置', ts: Date.now() };
      writeJson(GEO_CACHE_KEY, geo, true);
      return geo;
    } catch {
      /* fall through */
    }

    if (cached) return cached;

    try {
      const ip = await ipGeoPromise();
      const geo = { ...ip, ts: Date.now() };
      writeJson(GEO_CACHE_KEY, geo, true);
      return geo;
    } catch {
      return { ...DEFAULT_GEO, source: 'default', ts: Date.now() };
    }
  }

  async function loadWeather(bar) {
    const geo = await resolveGeo();
    if (!geo.label && geo.lat != null) {
      geo.label = await reverseLabel(geo.lat, geo.lon) || DEFAULT_GEO.label;
      writeJson(GEO_CACHE_KEY, geo, true);
    }

    const cached = readWeatherCache(geo.lat, geo.lon);
    if (cached) {
      renderWeather(bar, { ...cached, label: geo.label });
      syncHeaderOffset();
      return;
    }

    try {
      const wx = await fetchWeather(geo.lat, geo.lon);
      const payload = {
        lat: geo.lat,
        lon: geo.lon,
        label: geo.label,
        ts: Date.now(),
        ...wx,
      };
      writeJson(WEATHER_CACHE_KEY, payload, false);
      renderWeather(bar, payload);
    } catch {
      renderWeather(bar, null);
    }
    syncHeaderOffset();
  }

  function init() {
    const header = document.getElementById('header');
    if (!header) return;

    let bar = header.querySelector('.header-context-bar');
    if (!bar) bar = buildBar();

    if (bar) {
      renderDate(bar);
      loadWeather(bar);

      window.setInterval(() => {
        renderDate(bar);
      }, 60000);

      window.setInterval(() => {
        loadWeather(bar);
      }, WEATHER_TTL_MS);
    }

    syncHeaderOffset();
    setupHeaderNavAutoHide();

    window.addEventListener('resize', syncHeaderOffset);
    window.addEventListener('load', syncHeaderOffset);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
