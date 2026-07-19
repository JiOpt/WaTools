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
  { task: 1, topic: '偏好選擇', prompt: 'Some people prefer to study alone; others prefer study groups. Which do you prefer and why?', outline: ['立場：獨自或團體', '理由一：效率或動機', '理由二：例子或結果'], sample: 'I prefer studying alone because I can focus without interruptions. When I review notes quietly, I catch gaps faster. For example, before midterms I memorize terms better in a silent library corner than in a noisy cafe.', tip: 'Task 1 用 Personal preference 模板：立場→理由→短例子；45 秒內完成。' },
  { task: 1, topic: '同意/不同意', prompt: 'Do you agree that university students should be required to take public speaking courses?', outline: ['明確 agree/disagree', '理由：職場或自信', '具體情境'], sample: 'I agree because presentation skills help in almost every career. Speaking courses teach structure and calm nerves. My roommate improved job interviews after one semester of public speaking practice.', tip: '先給 clear opinion；避免 both sides 過長。' },
  { task: 1, topic: '三選一', prompt: 'Which campus improvement would help students most: longer library hours, cheaper meals, or more gym classes?', outline: ['選一項', '兩理由', '簡短結論'], sample: 'I would choose longer library hours. Many students study late during exams, and extended access reduces stress. It also supports commuters who arrive after standard closing time.', tip: '三選一題只 defending 一項，不必詳述其他選項。' },
  { task: 2, topic: 'Campus announcement + conversation', prompt: 'Reading: art museum free for students on weekends. Listening: student supports but worries about crowds. Summarize the proposal and the speaker\'s opinion.', outline: ['公告重點一句', '學生態度', '理由'], sample: 'The announcement says the art museum will offer free student admission on weekends. The man likes the idea because it encourages cultural visits, but he worries galleries will be overcrowded and suggests timed entry tickets.', tip: 'Task 2 模板：The reading proposes... The man/woman agrees/disagrees because...' },
  { task: 2, topic: 'Library policy change', prompt: 'Reading: laptops only in silent zones. Listening: woman concerned about group projects.', outline: ['政策內容', '說話者觀點', '原因'], sample: 'The memo requires laptops in designated silent zones to reduce keyboard noise. The woman understands the goal yet argues group projects need low-voice collaboration areas with laptops allowed.', tip: '30 秒閱讀＋對話；勿加入個人觀點。' },
  { task: 3, topic: 'Academic concept + lecture', prompt: 'Reading defines cognitive dissonance. Listening: professor gives festival food example.', outline: ['定義一句', '例子', '連回概念'], sample: 'Cognitive dissonance is mental discomfort when beliefs and actions conflict. The professor describes students who value health yet eat festival junk food, then rationalize the choice to reduce discomfort.', tip: 'Task 3 必含 definition + lecture example + link。' },
  { task: 3, topic: 'Biology symbiosis', prompt: 'Reading explains mutualism. Listening: clownfish and sea anemone case.', outline: ['mutualism 定義', '雙方受益', '教授細節'], sample: 'Mutualism is a symbiotic relationship where both species benefit. The lecture explains clownfish gain protection among anemone stingers while anemones receive nutrients from fish waste and improved water flow.', tip: '記錄 reading 關鍵詞，聽力用例子具體化。' },
  { task: 4, topic: 'Lecture only: urban planning', prompt: 'Summarize the lecture on mixed-use neighborhoods and traffic reduction.', outline: ['主題', '論點一：步行', '論點二：大眾運輸'], sample: 'The lecture argues mixed-use neighborhoods cut car trips by placing shops near homes. Residents walk for daily errands, easing congestion. The professor also notes transit hubs work best when paired with affordable housing nearby.', tip: 'Task 4 無閱讀；開頭 The professor discusses... 後列 2–3 點。' },
  { task: 4, topic: 'Lecture: memory consolidation', prompt: 'Summarize how sleep consolidates procedural memory.', outline: ['主題', '研究發現', '意義'], sample: 'The professor explains sleep strengthens procedural skills like piano finger patterns. Brain replay during slow-wave sleep stabilizes motor sequences. Missing sleep delays improvement even after practice.', tip: '只 summarizing lecture；不要 insert 個人經驗。' }
];

const bank = [];
for (let i = 0; i < 60; i++) {
  const s = seeds[i % seeds.length];
  bank.push({
    task: s.task,
    topic: s.topic,
    prompt: s.prompt,
    outline: s.outline,
    sample: s.sample,
    tip: s.tip
  });
}

const items = bank.map(function (x, i) {
  return { id: i + 1, task: x.task, topic: x.topic, prompt: x.prompt, outline: x.outline, sample: x.sample, tip: x.tip };
});

writeFile('toefl-speaking-data.js', 'WA_TOEFL_SPEAKING', {
  focus: 'Independent / Integrated 口說：模板句、常見題型與精簡示範。',
  items: items
});

console.log('speaking:', items.length);
