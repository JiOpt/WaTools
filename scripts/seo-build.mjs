/**
 * Run all SEO static generators in order.
 * Use before deploy or after changing sitemap.txt / tools-data.js / scriptures.
 *
 *   node scripts/seo-build.mjs
 */
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const steps = [
  ['generate-sitemap.mjs', 'sitemap.xml'],
  ['generate-index-seo.mjs', 'index.html crawler nav'],
  ['generate-tool-pages.mjs', 'tool page SEO meta'],
];

for (const [script, label] of steps) {
  console.log(`\n▶ ${label} (${script})`);
  const result = spawnSync(process.execPath, [path.join(ROOT, 'scripts', script)], {
    cwd: ROOT,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
}

console.log('\n✓ SEO build complete.');
