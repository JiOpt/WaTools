/**
 * Plan page: read/write/watch root sitemap.txt (plan server, fetch, or File System Access).
 */
(function () {
  'use strict';

  const POLL_MS = 2000;
  const IDB_NAME = 'watools-plan';
  const IDB_STORE = 'kv';
  const HANDLE_KEY = 'sitemap-handle';

  let mode = 'none';
  let fileHandle = null;
  let pollTimer = null;
  let lastSnapshot = '';
  let suppressPollUntil = 0;
  let onExternalChange = null;

  function isFileProtocol() {
    return location.protocol === 'file:';
  }

  function sitemapFetchUrl() {
    return `sitemap.txt?t=${Date.now()}`;
  }

  function snapshot(text) {
    return String(text || '').replace(/\r\n/g, '\n').trim();
  }

  function openDb() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) {
          req.result.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbGet(key) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  async function idbSet(key, value) {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async function probePlanApi() {
    try {
      const res = await fetch('/api/plan/ping', { cache: 'no-store' });
      return res.ok;
    } catch {
      return false;
    }
  }

  async function readViaFetch() {
    const res = await fetch(sitemapFetchUrl(), { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    return res.text();
  }

  async function readViaHandle() {
    if (!fileHandle) throw new Error('no handle');
    const file = await fileHandle.getFile();
    return file.text();
  }

  async function writeViaApi(text) {
    const res = await fetch('/api/sitemap', {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: text,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || 'api write failed');
    return 'api';
  }

  async function writeViaHandle(text) {
    if (!fileHandle) throw new Error('no handle');
    const writable = await fileHandle.createWritable();
    await writable.write(text);
    await writable.close();
    return 'handle';
  }

  async function restoreHandle() {
    if (!('showOpenFilePicker' in window)) return false;
    try {
      const stored = await idbGet(HANDLE_KEY);
      if (!stored) return false;
      const perm = await stored.queryPermission({ mode: 'readwrite' });
      if (perm === 'granted') {
        fileHandle = stored;
        mode = 'handle';
        return true;
      }
      if (perm === 'prompt') {
        const next = await stored.requestPermission({ mode: 'readwrite' });
        if (next === 'granted') {
          fileHandle = stored;
          mode = 'handle';
          return true;
        }
      }
    } catch {
      /* ignore */
    }
    return false;
  }

  async function linkLocalFile() {
    if (!('showOpenFilePicker' in window)) {
      throw new Error('此瀏覽器不支援直接寫入本機檔案');
    }
    const [handle] = await window.showOpenFilePicker({
      multiple: false,
      types: [{ description: 'sitemap.txt', accept: { 'text/plain': ['.txt'] } }],
      suggestedName: 'sitemap.txt',
    });
    fileHandle = handle;
    mode = 'handle';
    await idbSet(HANDLE_KEY, handle);
    return true;
  }

  async function init() {
    if (await probePlanApi()) {
      mode = 'api';
      return mode;
    }

    if (await restoreHandle()) {
      return mode;
    }

    try {
      await readViaFetch();
      mode = 'fetch';
      return mode;
    } catch {
      mode = 'none';
      return mode;
    }
  }

  async function read() {
    if (mode === 'api' || mode === 'fetch') {
      return readViaFetch();
    }
    if (mode === 'handle') {
      return readViaHandle();
    }
    throw new Error('sitemap.txt 尚未連結');
  }

  async function write(text) {
    const body = String(text || '').endsWith('\n') ? text : `${text}\n`;
    suppressPollUntil = Date.now() + 3000;
    lastSnapshot = snapshot(body);

    if (mode === 'api') {
      await writeViaApi(body);
      return 'api';
    }
    if (mode === 'handle') {
      await writeViaHandle(body);
      return 'handle';
    }
    if (mode === 'fetch' && isFileProtocol()) {
      if (await restoreHandle()) {
        await writeViaHandle(body);
        return 'handle';
      }
      if ('showOpenFilePicker' in window) {
        await linkLocalFile();
        await writeViaHandle(body);
        return 'handle';
      }
    }
    throw new Error('無法寫入 sitemap.txt');
  }

  async function pollOnce() {
    if (Date.now() < suppressPollUntil) return;
    if (!onExternalChange || mode === 'none') return;

    try {
      const text = await read();
      const next = snapshot(text);
      if (!next || next === lastSnapshot) return;
      lastSnapshot = next;
      onExternalChange(text, 'watch');
    } catch {
      /* ignore transient read errors while polling */
    }
  }

  function startPolling(callback) {
    onExternalChange = callback;
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = window.setInterval(() => {
      pollOnce();
    }, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = null;
    onExternalChange = null;
  }

  async function refreshSnapshot() {
    try {
      const text = await read();
      lastSnapshot = snapshot(text);
      return text;
    } catch {
      lastSnapshot = '';
      return null;
    }
  }

  window.WA_SITEMAP_FILE_SYNC = {
    init,
    read,
    write,
    linkLocalFile,
    restoreHandle,
    startPolling,
    stopPolling,
    refreshSnapshot,
    getMode: () => mode,
    isFileProtocol,
  };
})();
