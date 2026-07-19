/**
 * Fix Japan extra themes: verified Unsplash IDs + bright theme CSS + typography.
 * Run: node scripts/fix-japan-extra-visuals.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const OK = [
  'photo-1524413840807-0c3cb6fa808d',
  'photo-1493976040374-85c8e12f0c0e',
  'photo-1506905925346-21bda4d32df4',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1480796927426-f609979314bd',
  'photo-1519681393784-d120267933ba',
  'photo-1522383225653-ed111181a951',
  'photo-1545569341-9eb8b30979d9',
  'photo-1551632811-561732d1e306',
  'photo-1528360983277-13d401cdc186',
  'photo-1536098561742-ca998e48cbcc',
  'photo-1507400492013-162706c8c05e',
  'photo-1441974231531-c6227db76b6e',
  'photo-1514933651103-005eec06c04b',
  'photo-1544025162-d76694265947',
  'photo-1507525428034-b723cf961d3e',
  'photo-1540555700478-4be289fbecef',
  'photo-1582719478250-c89cae4dc85b',
  'photo-1488477181946-6428a0291777',
  'photo-1563805042-7684c019e1cb',
  'photo-1441986300917-64674bd600d8',
  'photo-1474487548417-781cb71495f3',
  'photo-1515562141207-7a88fb7ce338',
  'photo-1540959733332-eab4deabeeaf',
  'photo-1569718212165-3a8278d5f624',
  'photo-1527477396000-e27163b481c2',
];

function url(id) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=75`;
}

let js = fs.readFileSync(path.join(ROOT, 'assets/js/japan-theme-extra.js'), 'utf8');

// Replace every unsplash image URL with a rotating verified one
let i = 0;
js = js.replace(
  /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?auto=format&fit=crop&w=\d+&q=\d+/g,
  () => url(OK[i++ % OK.length]),
);

// Force bright mode for all themes
js = js.replace(/dark:\s*true/g, 'dark: false');

// Improve card image markup: always show something on error
js = js.replace(
  "img.addEventListener('error', done, { once: true });",
  `img.addEventListener('error', function () {
            img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#dbeafe"/><stop offset="1" stop-color="#bfdbfe"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><text x="50%" y="52%" text-anchor="middle" fill="#2c4964" font-family="sans-serif" font-size="28">Japan</text></svg>');
            done();
          }, { once: true });`,
);

fs.writeFileSync(path.join(ROOT, 'assets/js/japan-theme-extra.js'), js, 'utf8');

const css = `/* Shared pack for extra Japan themes — bright catalog style */
.wa-jp-theme .jp-x-filters{display:flex;flex-wrap:wrap;gap:.45rem;margin:0 0 1.15rem}
.wa-jp-theme .jp-x-chip{
  border:1px solid rgba(25,119,204,.28);
  background:#fff;
  border-radius:999px;
  padding:.4rem .9rem;
  font-size:.88rem;
  line-height:1.35;
  cursor:pointer;
  color:#2c4964;
  font-weight:500;
}
.wa-jp-theme .jp-x-chip.is-on{
  background:#1977cc;
  border-color:#1977cc;
  color:#fff;
  font-weight:600;
}
.wa-jp-theme .jp-x-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:1.05rem}
.wa-jp-theme .jp-x-card{
  background:#fff;
  border:1px solid rgba(25,119,204,.16);
  border-radius:12px;
  overflow:hidden;
  box-shadow:0 6px 20px rgba(41,99,160,.07);
}
.wa-jp-theme .jp-x-card__media{position:relative;aspect-ratio:16/10;background:#eaf4fc;overflow:hidden}
.wa-jp-theme .jp-x-skel{position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.55),transparent);animation:jpXSk 1.2s infinite}
@keyframes jpXSk{0%{transform:translateX(-40%)}100%{transform:translateX(40%)}}
.wa-jp-theme .jp-x-card__media img{width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .35s ease}
.wa-jp-theme .jp-x-card__media img.is-loaded{opacity:1}
.wa-jp-theme .jp-x-card__media.is-ready .jp-x-skel{display:none}
.wa-jp-theme .jp-x-card__body{padding:1rem 1.05rem 1.15rem}
.wa-jp-theme .jp-x-place{
  margin:0 0 .3rem;
  font-size:.8rem;
  letter-spacing:.04em;
  color:#1977cc;
  font-weight:600;
}
.wa-jp-theme .jp-x-card__body h3{
  margin:0 0 .45rem;
  font-size:1.08rem;
  line-height:1.35;
  font-family:var(--jp-font-serif);
  color:#2c4964;
  font-weight:700;
}
.wa-jp-theme .jp-x-card__body p{
  margin:0;
  font-size:.94rem;
  line-height:1.7;
  color:#444;
}
.wa-jp-theme .jp-hero__eyebrow{
  color:#1977cc;
  font-weight:600;
  opacity:1;
}
.wa-jp-theme .jp-hero__lead{
  color:#2c4964;
  opacity:1;
  line-height:1.75;
  font-size:1.06rem;
}
.wa-jp-theme .jp-section h2{
  color:#2c4964;
  line-height:1.35;
}
.wa-jp-theme .jp-section__intro{
  color:#5a6b7d;
  opacity:1;
  line-height:1.7;
}
.wa-jp-theme .jp-x-toggle-wrap{display:flex;flex-wrap:wrap;align-items:center;gap:.75rem;margin:0 0 1rem}
.wa-jp-theme .jp-x-toggle{
  border:0;border-radius:999px;background:#1977cc;color:#fff;
  padding:.55rem 1.05rem;cursor:pointer;font-weight:600;font-size:.92rem;
}
.wa-jp-theme .jp-x-status{font-size:.9rem;color:#5a6b7d}
.wa-jp-theme .jp-x-compare{position:relative;height:min(42vw,280px);border-radius:12px;overflow:hidden;margin:0 0 .75rem;border:1px solid rgba(25,119,204,.2)}
.wa-jp-theme .jp-x-compare__a,.wa-jp-theme .jp-x-compare__b{position:absolute;inset:0;background-size:cover;background-position:center}
.wa-jp-theme .jp-x-compare__a{background-image:url('${url(OK[1])}')}
.wa-jp-theme .jp-x-compare__b{background-image:url('${url(OK[23])}');clip-path:inset(0 0 0 var(--cmp,50%))}
.wa-jp-theme .jp-x-compare__line{position:absolute;top:0;bottom:0;left:var(--cmp,50%);width:3px;background:#fff;box-shadow:0 0 0 1px rgba(25,119,204,.35);transform:translateX(-50%)}
.wa-jp-theme .jp-x-slider-label{display:flex;gap:.75rem;align-items:center;margin:0 0 1.25rem;font-size:.9rem;color:#2c4964}
.wa-jp-theme .jp-x-slider-label input{flex:1}

/* Torii: soft spotlight, do not hide cards */
.tool-app.theme-torii-tunnel{--spot-x:50%;--spot-y:40%}
.theme-torii-tunnel .jp-x-grid{
  position:relative;
}
.theme-torii-tunnel .jp-x-grid::before{
  content:"";
  pointer-events:none;
  position:absolute;
  inset:-.5rem;
  z-index:2;
  border-radius:12px;
  background:radial-gradient(circle at var(--spot-x) var(--spot-y), transparent 12%, rgba(255,246,242,.15) 38%, rgba(255,236,230,.35) 70%);
}

.tool-app.theme-fuji-views{background:linear-gradient(180deg,#e8f4fc 0%,#f7fbfe 45%,#eef6fb 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-fuji-views .jp-hero{background:linear-gradient(135deg,rgba(56,120,180,.18),transparent 55%)}
.tool-app.theme-sakura-front{background:linear-gradient(180deg,#fff5f8 0%,#fffafb 50%,#fde8ef 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-sakura-front .jp-hero{background:linear-gradient(135deg,rgba(232,120,160,.2),transparent 55%)}
.tool-app.theme-momiji-trail{background:linear-gradient(180deg,#fff4e8 0%,#fffaf5 50%,#ffe8d6 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-momiji-trail .jp-hero{background:linear-gradient(135deg,rgba(220,100,40,.18),transparent 55%)}
.tool-app.theme-matsuri-calendar{background:linear-gradient(180deg,#fff8ef 0%,#fffdf9 50%,#ffe9d2 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-matsuri-calendar .jp-hero{background:linear-gradient(135deg,rgba(200,60,40,.15),transparent 55%)}

/* Formerly dark themes → bright atmospheric */
.tool-app.theme-hanabi-guide{background:linear-gradient(180deg,#eef3ff 0%,#f7f9ff 50%,#e8eeff 100%);color:#2c4964;border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-hanabi-guide .jp-hero{background:linear-gradient(135deg,rgba(90,120,220,.16),transparent 55%)}
.tool-app.theme-torii-tunnel{background:linear-gradient(180deg,#fff5f2 0%,#fffaf8 50%,#ffe8e0 100%);color:#2c4964;border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-torii-tunnel .jp-hero{background:linear-gradient(135deg,rgba(220,70,50,.14),transparent 55%)}
.tool-app.theme-kabukicho-neon{background:linear-gradient(180deg,#f7f0ff 0%,#fcf8ff 50%,#efe6ff 100%);color:#2c4964;border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-kabukicho-neon .jp-hero{background:linear-gradient(135deg,rgba(150,80,200,.14),transparent 55%)}

.tool-app.theme-karesansui{background:linear-gradient(180deg,#f3f6f2 0%,#fafbf9 50%,#e8eee6 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-karesansui .jp-hero{background:linear-gradient(135deg,rgba(80,110,70,.12),transparent 55%)}
.tool-app.theme-kenrokuen{background:linear-gradient(180deg,#eef6f4 0%,#f7fbfa 50%,#e5f0ec 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-kenrokuen .jp-hero{background:linear-gradient(135deg,rgba(40,120,100,.14),transparent 55%)}
.tool-app.theme-otaru-canal{background:linear-gradient(180deg,#e9eef5 0%,#f5f7fb 50%,#dde6f2 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-otaru-canal .jp-hero{background:linear-gradient(135deg,rgba(60,90,140,.16),transparent 55%)}
.tool-app.theme-nagoya-castle{background:linear-gradient(180deg,#fff7e8 0%,#fffdf8 50%,#f5e6c8 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-nagoya-castle .jp-hero{background:linear-gradient(135deg,rgba(200,150,40,.18),transparent 55%)}
.tool-app.theme-onsen-kyo{background:linear-gradient(180deg,#f8efe8 0%,#fffaf7 50%,#f0e0d4 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-onsen-kyo .jp-hero{background:linear-gradient(135deg,rgba(180,90,50,.14),transparent 55%)}
.tool-app.theme-wagashi-scroll{background:linear-gradient(180deg,#fff9f2 0%,#fffefb 50%,#f7ebe0 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-wagashi-scroll .jp-hero{background:linear-gradient(135deg,rgba(200,120,80,.12),transparent 55%)}
.tool-app.theme-aizome-kimono{background:linear-gradient(180deg,#e8eef8 0%,#f5f7fc 50%,#d9e3f5 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-aizome-kimono .jp-hero{background:linear-gradient(135deg,rgba(40,70,140,.16),transparent 55%)}
.tool-app.theme-railway-views{background:linear-gradient(180deg,#eef3f8 0%,#f8fafc 50%,#e4ebf3 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-railway-views .jp-hero{background:linear-gradient(135deg,rgba(50,90,130,.14),transparent 55%)}
.tool-app.theme-ama-shima{background:linear-gradient(180deg,#e6f4f6 0%,#f5fbfc 50%,#d9eef1 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-ama-shima .jp-hero{background:linear-gradient(135deg,rgba(30,140,150,.14),transparent 55%)}
.tool-app.theme-ghost-stations{background:linear-gradient(180deg,#eef2f6 0%,#f7f9fb 50%,#e4e9ef 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-ghost-stations .jp-hero{background:linear-gradient(135deg,rgba(70,90,110,.12),transparent 55%)}
.tool-app.theme-inari-fox{background:linear-gradient(180deg,#fff1eb 0%,#fffaf8 50%,#ffe4d6 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-inari-fox .jp-hero{background:linear-gradient(135deg,rgba(220,80,40,.14),transparent 55%)}
.tool-app.theme-samurai-armor{background:linear-gradient(180deg,#f4efe6 0%,#fbf8f2 50%,#ebe2d3 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-samurai-armor .jp-hero{background:linear-gradient(135deg,rgba(120,80,40,.14),transparent 55%)}
.tool-app.theme-ukiyo-e-now{background:linear-gradient(180deg,#f7f1e8 0%,#fcf9f4 50%,#efe6d8 100%);border-radius:12px;padding:1rem 1.1rem 1.5rem}
.theme-ukiyo-e-now .jp-hero{background:linear-gradient(135deg,rgba(160,100,50,.12),transparent 55%)}
`;

fs.writeFileSync(path.join(ROOT, 'japan/css/extra-pack.css'), css, 'utf8');

// Bump CSS cache key in JS if present
let js2 = fs.readFileSync(path.join(ROOT, 'assets/js/japan-theme-extra.js'), 'utf8');
if (!js2.includes('extra-pack.css?v=')) {
  js2 = js2.replace(
    "ensureCss('./css/extra-pack.css');",
    "ensureCss('./css/extra-pack.css?v=jp-bright-2');",
  );
  fs.writeFileSync(path.join(ROOT, 'assets/js/japan-theme-extra.js'), js2, 'utf8');
}

console.log('Fixed images + bright CSS. Replaced', i, 'image URLs.');
