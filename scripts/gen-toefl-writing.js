/* eslint-disable */
const fs = require('fs');
const path = require('path');

function writeFile(filename, varName, obj) {
  const lines = ['window.' + varName + ' = {'];
  lines.push("  focus: '" + obj.focus.replace(/'/g, "\\'") + "',");
  lines.push('  items: [');
  obj.items.forEach(function (item, i) {
    lines.push('    {');
    Object.keys(item).forEach(function (k) {
      const v = item[k];
      if (Array.isArray(v)) {
        lines.push('      ' + k + ': [' + v.map(function (x) { return "'" + String(x).replace(/'/g, "\\'") + "'"; }).join(', ') + '],');
      } else if (typeof v === 'number') {
        lines.push('      ' + k + ': ' + v + ',');
      } else {
        lines.push("      " + k + ": '" + String(v).replace(/'/g, "\\'") + "',");
      }
    });
    lines.push('    }' + (i < obj.items.length - 1 ? ',' : ''));
  });
  lines.push('  ]');
  lines.push('};');
  lines.push('');
  fs.writeFileSync(path.join(__dirname, '..', 'assets', 'js', filename), lines.join('\n'), 'utf8');
}

const seeds = [
  { task: 'integrated', point: 'Integrated：閱讀主張 vs 聽力反駁。', prompt: 'Reading claims urban trees lower summer energy use; lecture cites maintenance cost and uneven shade.', outline: ['Intro: reading claim', 'Lecture point 1: costs', 'Lecture point 2: uneven benefits'], sample: 'The reading argues city trees cut cooling bills by shading buildings. The lecturer counters that planting and pruning costs strain budgets. She adds benefits concentrate in wealthy districts, so savings are uneven across neighborhoods.', tip: 'Integrated 段落：閱讀一句＋However, the professor challenges... 各點對照。' },
  { task: 'integrated', point: 'Integrated：三點反駁結構。', prompt: 'Reading supports four-day workweek; lecture questions productivity, customer service, and scheduling.', outline: ['Thesis: reading supports', 'Counter 1–3 from lecture', 'Brief wrap'], sample: 'The passage claims a four-day week boosts morale without hurting output. The professor doubts productivity on long days and warns customer coverage gaps appear. He also notes shared schedules complicate meetings across teams.', tip: '每段一個 lecture counter；避免混入 reading 未提細節。' },
  { task: 'discussion', point: 'Academic Discussion：回應同學並延伸。', prompt: 'Professor: Should AI tools be allowed in writing drafts? Student A: yes with disclosure. Student B: no, harms skill.', outline: ['立場', '回應 A/B 之一', '新例子或條件'], sample: 'I partly agree with Student A that AI can brainstorm outlines if students disclose use. However, like Student B, I worry over-reliance weakens revision skills. In my journalism class, teachers require AI logs so drafts stay accountable.', tip: 'Discussion 要 name classmates + add your angle，非只選邊。' },
  { task: 'discussion', point: 'Discussion：讓步＋限制條件。', prompt: 'Professor: Mandatory community service for graduation? Kelly: builds empathy. Marco: burdens low-income students.', outline: ['Position with nuance', 'Engage Kelly/Marco', 'Policy suggestion'], sample: 'I support optional service with credit, not a rigid requirement. Kelly is right that service builds empathy, yet Marco highlights time costs for workers. Schools could partner with paid summer programs instead of unpaid hours.', tip: '高分寫作常 partially agree + concrete alternative。' },
  { task: 'integrated', point: 'Integrated：定義＋例子反駁。', prompt: 'Reading defines biofuels as carbon-neutral; lecture explains land-use emissions.', outline: ['Define reading view', 'Lecture evidence 1', 'Lecture evidence 2'], sample: 'The reading presents biofuels as carbon-neutral because plants absorb CO2 while growing. The lecturer argues clearing land for crops releases stored carbon. He also notes fertilizer production adds hidden emissions.', tip: '科學 integrated 抓 energy balance 與 hidden cost 關鍵字。' },
  { task: 'discussion', point: 'Discussion：课堂参与 vs 线上。', prompt: 'Professor: Grade class participation? Anna: motivates shy students. Luis: favors outgoing voices.', outline: ['Your stance', 'Reference Anna/Luis', 'Fair metric'], sample: 'I would grade participation lightly using varied formats. Anna notes structured prompts help shy students, while Luis warns loud voices dominate. Weekly written reflections could balance oral bias.', tip: '提出 measurable fair alternative 加分。' }
];

const bank = [];
for (let i = 0; i < 60; i++) {
  const s = seeds[i % seeds.length];
  bank.push({
    task: s.task,
    point: s.point,
    prompt: s.prompt,
    outline: s.outline,
    sample: s.sample,
    tip: s.tip
  });
}

const items = bank.map(function (x, i) {
  return { id: i + 1, task: x.task, point: x.point, prompt: x.prompt, outline: x.outline, sample: x.sample, tip: x.tip };
});

writeFile('toefl-writing-data.js', 'WA_TOEFL_WRITING', {
  focus: 'Integrated / Academic Discussion 寫作：結構、轉折、常見論點與句型。',
  items: items
});

console.log('writing:', items.length);
