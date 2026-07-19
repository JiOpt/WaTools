import fs from 'fs';

const files = [
  [
    'en/toeic/toeic-listening.html',
    'Listening tips | Level 1/2 traps (~120) | KaWaTool',
    'TOEIC listening tips with Level 1/2 trap cards (~120), four accents, and Part 1 preview timing.',
  ],
  [
    'en/toeic/toeic-reading.html',
    'Reading strategies | Level 1/2 drills (~120) | KaWaTool',
    'TOEIC reading pacing for Parts 5–7 plus Level 1/2 practice drills (~120 items).',
  ],
  [
    'en/toeic/toeic-grammar.html',
    'Grammar crash course | Level 1/2 (~120) | KaWaTool',
    'TOEIC Part 5/6 grammar crash course with Level 1/2 drills (~120 items).',
  ],
];

for (const [file, title, desc] of files) {
  let s = fs.readFileSync(file, 'utf8');
  s = s.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`);
  s = s.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${desc}">`
  );
  s = s.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${title}"`);
  s = s.replace(
    /property="og:description" content="[^"]*"/,
    `property="og:description" content="${desc}"`
  );
  s = s.replace(/name="twitter:title" content="[^"]*"/, `name="twitter:title" content="${title}"`);
  s = s.replace(
    /name="twitter:description" content="[^"]*"/,
    `name="twitter:description" content="${desc}"`
  );
  s = s.replace(/"description": "[^"]*"/, `"description": "${desc}"`);
  fs.writeFileSync(file, s);
  console.log('patched', file);
}
