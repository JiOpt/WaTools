/**
 * Local dev server: static files + auto-write sitemap.txt for index_plan.html
 * Run: node scripts/plan-dev-server.mjs
 */
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 3000;
const SITEMAP = path.join(ROOT, 'sitemap.txt');
const BUILD = path.join(ROOT, 'scripts', 'build-sitemap-js.mjs');

function isLocalRequest(req) {
  const addr = req.socket.remoteAddress || '';
  return addr === '127.0.0.1' || addr === '::1' || addr === '::ffff:127.0.0.1';
}

function contentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
  };
  return map[ext] || 'application/octet-stream';
}

function rebuildPublishedJs() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [BUILD], { cwd: ROOT, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`build exit ${code}`))));
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const rel = decoded.replace(/^\/+/, '');
  const abs = path.normalize(path.join(ROOT, rel));
  if (!abs.startsWith(ROOT)) return null;
  return abs;
}

/** Match Firebase Hosting cleanUrls: /foo/bar → foo/bar.html */
function resolveStaticFile(urlPath) {
  const direct = safePath(urlPath);
  if (!direct) return null;

  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;

  const withHtml = `${direct}.html`;
  if (fs.existsSync(withHtml) && fs.statSync(withHtml).isFile()) return withHtml;

  const indexHtml = path.join(direct, 'index.html');
  if (fs.existsSync(indexHtml) && fs.statSync(indexHtml).isFile()) return indexHtml;

  return null;
}

const server = http.createServer(async (req, res) => {
  if (!isLocalRequest(req)) {
    if (req.url?.startsWith('/api/plan')) {
      sendJson(res, 403, { ok: false, error: 'forbidden' });
      return;
    }
  }

  if (req.url === '/api/plan/ping' && req.method === 'GET') {
    sendJson(res, 200, { ok: true, writable: true });
    return;
  }

  if (req.url === '/api/sitemap' && req.method === 'GET') {
    if (!isLocalRequest(req)) {
      sendJson(res, 403, { ok: false, error: 'forbidden' });
      return;
    }
    try {
      const text = fs.existsSync(SITEMAP) ? fs.readFileSync(SITEMAP, 'utf8') : '';
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(text);
    } catch (err) {
      sendJson(res, 500, { ok: false, error: String(err.message || err) });
    }
    return;
  }

  if (req.url === '/api/sitemap' && (req.method === 'PUT' || req.method === 'POST')) {
    if (!isLocalRequest(req)) {
      sendJson(res, 403, { ok: false, error: 'forbidden' });
      return;
    }
    try {
      const text = await readBody(req);
      fs.writeFileSync(SITEMAP, text, 'utf8');
      await rebuildPublishedJs();
      sendJson(res, 200, { ok: true, path: 'sitemap.txt' });
    } catch (err) {
      sendJson(res, 500, { ok: false, error: String(err.message || err) });
    }
    return;
  }

  const pathname = (req.url || '/').split('?')[0];
  const filePath = pathname === '/' ? safePath('/index.html') : resolveStaticFile(pathname);
  if (!filePath) {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType(filePath) });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`MyTooLife plan server: http://127.0.0.1:${PORT}/index_plan.html`);
  console.log('Toggle tools → auto-writes sitemap.txt + sitemap-published.js');
});
