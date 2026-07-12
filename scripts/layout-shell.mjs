/**
 * Shared HTML shell for static page generators.
 * Change header / footer / asset links here — then re-run generate scripts.
 */
import { renderAnalyticsSnippet } from './site-analytics.mjs';
import { WA_SITE_VERSION, stampAssetUrl } from './site-version.mjs';

export { WA_SITE_VERSION, stampAssetUrl };

export const FONT_SIZE_BOOT = `  <script>try{var s=localStorage.getItem('mytoolife-font-size');document.documentElement.setAttribute('data-font-size',s==='sm'||s==='lg'?s:'md')}catch(e){document.documentElement.setAttribute('data-font-size','md')}</script>`;

/** Relative prefix from page depth to site root (e.g. '../' or ''). */
export function pathPrefix(depth = 0) {
  return depth > 0 ? '../'.repeat(depth) : '';
}

/** Stamp versioned asset URL from site root relative path. */
export function assetHref(relativePath, depth = 0) {
  return stampAssetUrl(`${pathPrefix(depth)}${relativePath}`, WA_SITE_VERSION);
}

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHeadOpen() {
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">`;
}

export function renderHeadCore({ depth = 0, includePrefsBoot = true, includeFontSizeBoot = true } = {}) {
  const parts = [renderAnalyticsSnippet()];
  if (includePrefsBoot) {
    parts.push(`  <script src="${assetHref('assets/js/prefs-boot.js', depth)}"></script>`);
  }
  if (includeFontSizeBoot) {
    parts.push(FONT_SIZE_BOOT);
  }
  parts.push(`  <link href="${assetHref('assets/img/favicon.png', depth)}" rel="icon">`);
  parts.push(`  <link href="https://fonts.googleapis.com" rel="preconnect">`);
  parts.push(`  <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>`);
  parts.push(`  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&display=swap" rel="stylesheet">`);
  parts.push(`  <link href="${assetHref('assets/vendor/bootstrap/css/bootstrap.min.css', depth)}" rel="stylesheet">`);
  parts.push(`  <link href="${assetHref('assets/vendor/bootstrap-icons/bootstrap-icons.css', depth)}" rel="stylesheet">`);
  parts.push(`  <link href="${assetHref('assets/vendor/aos/aos.css', depth)}" rel="stylesheet">`);
  parts.push(`  <link href="${assetHref('assets/css/main.css', depth)}" rel="stylesheet">`);
  return parts.join('\n');
}

/**
 * @param {Array<{href:string,label:string,active?:boolean,ariaCurrent?:boolean}>} navItems
 */
export function renderNavItems(navItems = []) {
  if (!navItems.length) return '';
  return navItems.map((item) => {
    const cls = item.active ? ' class="active"' : '';
    const aria = item.ariaCurrent || item.active ? ' aria-current="page"' : '';
    return `            <li><a href="${item.href}"${cls}${aria}>${escapeHtml(item.label)}</a></li>`;
  }).join('\n');
}

/**
 * Site header — nav items are per-page; sitemap is injected at runtime by site-sitemap.js.
 */
export function renderLogoInner(depth = 0) {
  return `<img src="${assetHref('assets/img/logo.jpg', depth)}" alt="Toolpian" class="site-logo" width="808" height="336" decoding="async">`;
}

export function renderHeader({
  depth = 0,
  navItems = [],
  settingsActive = false,
} = {}) {
  const logoInner = renderLogoInner(depth);

  const navBlock = navItems.length
    ? `<nav id="navmenu" class="navmenu" aria-label="頁面導覽">
          <ul>
${renderNavItems(navItems)}
          </ul>
          <i class="mobile-nav-toggle d-xl-none bi bi-list" role="button" tabindex="0" aria-label="開啟選單"></i>
        </nav>`
    : `<nav id="navmenu" class="navmenu" aria-label="頁面導覽">
          <ul></ul>
          <i class="mobile-nav-toggle d-xl-none bi bi-list" role="button" tabindex="0" aria-label="開啟選單"></i>
        </nav>`;

  const ctaCls = settingsActive
    ? 'cta-btn active'
    : 'cta-btn';
  const ctaAria = settingsActive ? ' aria-current="page"' : '';

  return `  <header id="header" class="header sticky-top">
    <div class="branding d-flex align-items-center">
      <div class="container position-relative d-flex align-items-center justify-content-between">
        <a href="/" class="logo d-flex align-items-center me-auto" aria-label="Toolpian 工具首頁">
          ${logoInner}
        </a>
        ${navBlock}
        <a class="${ctaCls}" href="/utility/settings"${ctaAria}>設定</a>
      </div>
    </div>
  </header>`;
}

export function renderFooterShell() {
  return `  <footer id="footer" class="footer light-background">
    <div class="container copyright text-center py-4">
      <p data-wa-site-footer></p>
    </div>
  </footer>`;
}

export function renderPageChrome() {
  return `  <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center" aria-label="回到頂部"><i class="bi bi-arrow-up-short" aria-hidden="true"></i></a>
  <div id="preloader" aria-hidden="true"></div>`;
}

/**
 * @param {string[]} extraScripts — site-root-relative paths, e.g. 'assets/js/tool-boot.js'
 */
export function renderBodyScripts({ depth = 0, extraScripts = [], deferMain = false } = {}) {
  const mainDefer = deferMain ? ' defer' : '';
  const lines = [
    `  <script src="${assetHref('assets/vendor/bootstrap/js/bootstrap.bundle.min.js', depth)}" defer></script>`,
    `  <script src="${assetHref('assets/vendor/aos/aos.js', depth)}" defer></script>`,
    `  <script src="${assetHref('assets/js/main.js', depth)}"${mainDefer}></script>`,
  ];
  for (const script of extraScripts) {
    lines.push(`  <script src="${assetHref(script, depth)}" defer></script>`);
  }
  return lines.join('\n');
}

/** Tool page title bar — back button injected at runtime by tool-category-pager.js */
export function renderToolPageBar(title) {
  return `        <header class="tool-page-bar" aria-label="工具頁標題">
          <h1 class="tool-page-bar-title" id="tool-page-title">${escapeHtml(title)}</h1>
        </header>`;
}

export function renderToolMain({ title, slug }) {
  return `  <main class="main">
    <section class="tool-section section light-background" aria-labelledby="tool-page-title">
      <div class="container" data-aos="fade-up">
${renderToolPageBar(title)}
        <div id="tool-app" class="tool-app" data-tool="${slug}"></div>
      </div>
    </section>
  </main>`;
}
