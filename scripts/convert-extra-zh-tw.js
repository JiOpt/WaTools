/* eslint-disable */
const fs = require('fs');
const path = require('path');
const OpenCC = require('../assets/js/vendor/opencc-t2cn.js');

function reverseDictString(dict) {
  return dict
    .split('|')
    .map((pair) => {
      const i = pair.indexOf(' ');
      if (i < 0) return pair;
      return `${pair.slice(i + 1)} ${pair.slice(0, i)}`;
    })
    .join('|');
}

// t2s uses [[v,m]]; build simplified -> traditional TW (twp phrase + char maps)
const [y, p, h] = OpenCC.Locale.from.twp[0];
const [v, m] = OpenCC.Locale.to.cn[0];

const s2twp = OpenCC.CustomConverter(
  [reverseDictString(y), reverseDictString(p), reverseDictString(h), reverseDictString(m), reverseDictString(v)].join(
    '|'
  )
);

const file = path.join(__dirname, 'data/toeic-l2-extra-b.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

for (const key of ['procurement', 'legal-ip']) {
  for (const row of data[key]) {
    row[2] = s2twp(row[2]);
  }
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Converted zh to Traditional TW for procurement and legal-ip');
