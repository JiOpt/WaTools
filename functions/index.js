const { onRequest } = require('firebase-functions/v2/https');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

initializeApp();

const db = getFirestore();
const COLLECTION = 'pageviews';

function setCors(req, res) {
  const origin = req.get('Origin') || '';
  if (
    origin === 'https://mytoolife.com'
    || origin === 'https://www.mytoolife.com'
    || origin.startsWith('http://127.0.0.1:')
    || origin.startsWith('http://localhost:')
  ) {
    res.set('Access-Control-Allow-Origin', origin);
  }
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
}

function normalizeSlug(raw) {
  const slug = String(raw || '').trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,62}$/.test(slug)) return null;
  return slug;
}

function normalizeVisitorId(raw) {
  const id = String(raw || '').trim();
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(id)) return null;
  return id;
}

exports.pageviews = onRequest(
  {
    region: 'asia-east1',
    maxInstances: 20,
    cors: false,
  },
  async (req, res) => {
    setCors(req, res);
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      if (req.method === 'GET') {
        const raw = String(req.query.slugs || '');
        const slugs = [...new Set(
          raw.split(',')
            .map(normalizeSlug)
            .filter(Boolean),
        )].slice(0, 80);

        const counts = {};
        await Promise.all(slugs.map(async (slug) => {
          const snap = await db.collection(COLLECTION).doc(slug).get();
          counts[slug] = snap.exists ? Number(snap.data().views || 0) : 0;
        }));

        res.json({ counts });
        return;
      }

      if (req.method === 'POST') {
        const slug = normalizeSlug(req.body?.slug);
        const visitorId = normalizeVisitorId(req.body?.visitorId);
        if (!slug || !visitorId) {
          res.status(400).json({ error: 'invalid slug or visitorId' });
          return;
        }

        const pageRef = db.collection(COLLECTION).doc(slug);
        const seenRef = pageRef.collection('seen').doc(visitorId);

        const result = await db.runTransaction(async (tx) => {
          const [pageSnap, seenSnap] = await Promise.all([
            tx.get(pageRef),
            tx.get(seenRef),
          ]);

          const prev = pageSnap.exists ? pageSnap.data() : {};
          let unique = Number(prev.unique || 0);
          const views = Number(prev.views || 0) + 1;

          if (!seenSnap.exists) {
            tx.set(seenRef, { ts: FieldValue.serverTimestamp() });
            unique += 1;
          }

          tx.set(pageRef, {
            unique,
            views,
            updatedAt: FieldValue.serverTimestamp(),
          }, { merge: true });

          return { slug, unique, views };
        });

        res.json(result);
        return;
      }

      res.status(405).json({ error: 'method not allowed' });
    } catch (err) {
      console.error('[pageviews]', err);
      res.status(500).json({ error: 'internal' });
    }
  },
);
