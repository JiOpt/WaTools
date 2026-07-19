import fs from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// Load catalog via vm-less: tools-data is window assign
import vm from 'vm';
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync('assets/js/tools-data.js', 'utf8'), sandbox);
const catalog = sandbox.window.WA_TOOLS_CATALOG;

function findTool(slug) {
  for (const cat of catalog) {
    const t = (cat.tools || []).find((x) => x.slug === slug);
    if (t) return t;
  }
  return null;
}

const slugs = [
  'toeic-intro',
  'toeic-vocab',
  'toeic-listening',
  'toeic-reading',
  'toeic-grammar',
  'toeic-study-plan',
  'toefl-vocab',
  'toefl-listening',
  'toefl-reading',
  'toefl-grammar',
];

for (const slug of slugs) {
  const t = findTool(slug);
  if (!t) {
    console.warn('missing', slug);
    continue;
  }
  const file = `en/${slug.startsWith('toeic') ? 'toeic' : 'toefl'}/${slug}.html`;
  if (!fs.existsSync(file)) {
    console.warn('no file', file);
    continue;
  }
  const title = `${t.seoTitle?.replace(/\s*\|\s*KaWaTool\s*$/i, '') || t.title} | KaWaTool`;
  const desc = `${t.seoDescription} Free online tool — open in the browser, no install.`.slice(0, 160);
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  s = s.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${desc}">`);
  s = s.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${title}"`);
  s = s.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${desc}"`);
  s = s.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${title}"`);
  s = s.replace(/name="twitter:description" content="[^"]*"/, `name="twitter:description" content="${desc}"`);
  s = s.replace(/"description": "[^"]*"/, `"description": "${desc.replace(/"/g, '\\"')}"`);
  if (t.seoKeywords) {
    s = s.replace(
      /<meta name="keywords" content="[^"]*">/,
      `<meta name="keywords" content="${t.seoKeywords}">`
    );
  }
  if (t.seoLead) {
    if (s.includes('tool-seo-lead')) {
      s = s.replace(
        /<p class="tool-seo-lead">[\s\S]*?<\/p>/,
        `<p class="tool-seo-lead">${t.seoLead}</p>`
      );
    }
  }
  fs.writeFileSync(file, s);
  console.log('EN', slug);
}
