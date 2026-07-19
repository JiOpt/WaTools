/* eslint-disable */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets', 'js');

function emit(name, obj) {
  const body = JSON.stringify(obj, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
  const js = 'window.' + name + ' = ' + body.replace(/'/g, function (m, offset, s) {
    const prev = s[offset - 1];
    if (prev === '\\') return "'";
    return "'";
  }) + ';\n';
  fs.writeFileSync(path.join(OUT, name.replace('WA_', 'toefl-').replace(/_/g, '-').toLowerCase().replace('toefl-', 'toefl-').split('-').slice(0, 2).join('-') + '-data.js'), js, 'utf8');
}

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
  fs.writeFileSync(path.join(OUT, filename), lines.join('\n'), 'utf8');
}

// ── GRAMMAR (60) ──
const grammarTopics = ['詞性', '主詞動詞一致', '關係子句', '名詞子句', '分詞構句', '虛擬語氣', '倒裝', '平行結構', '冠詞', '介系詞', '時態'];
const grammarBank = [
  { topic: '詞性', point: '形容詞修飾名詞，不可用副詞。', q: 'The committee proposed a ____ solution to reduce traffic congestion.', choices: ['practical', 'practically', 'practice', 'practiced'], ans: 'A', why: '修飾名詞 solution 需形容詞 practical。' },
  { topic: '詞性', point: '副詞修飾動詞或形容詞。', q: 'The experiment was ____ designed to control for bias.', choices: ['careful', 'carefully', 'care', 'caring'], ans: 'B', why: '修飾過去分詞 designed 用副詞 carefully。' },
  { topic: '詞性', point: '名詞作為主詞補語。', q: 'Her primary goal is ____ a sustainable business model.', choices: ['create', 'creating', 'creation', 'creative'], ans: 'B', why: 'be 動詞後表「目標內容」常用動名詞 creating。' },
  { topic: '詞性', point: '-tion/-sion 常為名詞後綴。', q: 'The rapid ____ of digital tools changed classroom practice.', choices: ['adopt', 'adopted', 'adoption', 'adoptive'], ans: 'C', why: '形容詞 rapid 後接名詞 adoption。' },
  { topic: '詞性', point: '及物動詞後接名詞作受詞。', q: 'Researchers must ____ the hypothesis before publishing.', choices: ['validation', 'validate', 'valid', 'validity'], ans: 'B', why: 'must 後接動詞原形 validate。' },
  { topic: '詞性', point: '介系詞後接名詞或動名詞。', q: 'Success depends on ____ accurate data.', choices: ['collect', 'collecting', 'collection', 'collective'], ans: 'B', why: '介系詞 on 後接動名詞 collecting。' },
  { topic: '主詞動詞一致', point: 'Each/Every/Neither 視為單數主詞。', q: 'Each of the samples ____ tested twice.', choices: ['were', 'was', 'are', 'have been'], ans: 'B', why: 'Each 為單數，動詞用 was。' },
  { topic: '主詞動詞一致', point: '主詞與動詞被介系詞片語隔開仍須一致。', q: 'The list of required readings ____ on the syllabus.', choices: ['appear', 'appears', 'appearing', 'have appeared'], ans: 'B', why: '主詞是 list（單數），不是 readings。' },
  { topic: '主詞動詞一致', point: 'There is/are 依真正主詞單複數。', q: 'There ____ several unresolved issues in the draft.', choices: ['is', 'was', 'are', 'has been'], ans: 'C', why: '真正主詞 issues 為複數，用 are。' },
  { topic: '主詞動詞一致', point: '集合名詞表整體時用單數動詞。', q: 'The faculty ____ agreed to revise the grading policy.', choices: ['has', 'have', 'are', 'were'], ans: 'A', why: 'faculty 在此表整體單位，用 has。' },
  { topic: '主詞動詞一致', point: 'Either...or 動詞依最近主詞。', q: 'Either the manager or the assistants ____ responsible.', choices: ['is', 'are', 'was', 'has been'], ans: 'B', why: '最近主詞 assistants 為複數，用 are。' },
  { topic: '主詞動詞一致', point: '不可數名詞視為單數。', q: 'Recent evidence ____ that the theory needs revision.', choices: ['show', 'shows', 'showing', 'have shown'], ans: 'B', why: 'evidence 不可數，動詞用 shows。' },
  { topic: '關係子句', point: 'who 指人作主詞。', q: 'The professor ____ led the seminar will join us tomorrow.', choices: ['who', 'which', 'whom', 'whose'], ans: 'A', why: '修飾人 professor 且在子句中作主詞，用 who。' },
  { topic: '關係子句', point: 'which 指物，不可指人。', q: 'The article ____ appeared in Nature sparked debate.', choices: ['who', 'which', 'whom', 'whose'], ans: 'B', why: 'article 為物，用 which。' },
  { topic: '關係子句', point: 'whose 表所有關係。', q: 'Students ____ projects were selected will present first.', choices: ['who', 'whom', 'whose', 'which'], ans: 'C', why: 'projects 屬於 students，用 whose。' },
  { topic: '關係子句', point: 'where 修飾地點。', q: 'The library is the place ____ we found the archive.', choices: ['which', 'where', 'that', 'when'], ans: 'B', why: 'place 表地點，子句用 where。' },
  { topic: '關係子句', point: 'that 可修飾人或物，限 restrictive 子句。', q: 'The theory ____ he proposed challenged old assumptions.', choices: ['who', 'whom', 'that', 'where'], ans: 'C', why: 'theory 為物且在子句中作 proposed 的受詞，用 that。' },
  { topic: '關係子句', point: '介系詞 + whom/which 較正式。', q: 'The colleague with ____ I collaborated moved abroad.', choices: ['who', 'whom', 'which', 'that'], ans: 'B', why: 'with 後接受格 whom。' },
  { topic: '名詞子句', point: 'whether 表「是否」，後可接 or not。', q: 'The panel debated ____ the grant should be renewed.', choices: ['if', 'whether', 'that', 'what'], ans: 'B', why: 'debate 後接 whether 較正式且可接 or not。' },
  { topic: '名詞子句', point: 'that 引導名詞子句時常可省略（受詞位置）。', q: 'Scientists believe ____ climate patterns are shifting.', choices: ['what', 'that', 'which', 'where'], ans: 'B', why: 'believe 後接 that 子句作受詞。' },
  { topic: '名詞子句', point: 'what = the thing that。', q: '____ surprised the team was the sudden drop in sales.', choices: ['That', 'What', 'Which', 'Where'], ans: 'B', why: '主詞子句缺「物」用 what。' },
  { topic: '名詞子句', point: 'how 引導方式子句。', q: 'Researchers explained ____ the device stores energy.', choices: ['how', 'what', 'which', 'where'], ans: 'A', why: 'explain how 表說明方式。' },
  { topic: '名詞子句', point: 'whoever = anyone who。', q: '____ submits the form by Friday will be considered.', choices: ['Whoever', 'Whomever', 'Whatever', 'Wherever'], ans: 'A', why: '主詞子句指「任何人」用 whoever。' },
  { topic: '分詞構句', point: '現在分詞表主動／進行。', q: '____ the results, the team revised the model.', choices: ['Analyze', 'Analyzing', 'Analyzed', 'To analyze'], ans: 'B', why: 'team 主動分析，用現在分詞 Analyzing。' },
  { topic: '分詞構句', point: '過去分詞表被動／完成。', q: '____ by peer review, the paper was accepted.', choices: ['Approving', 'Approved', 'Approve', 'To approve'], ans: 'B', why: 'paper 被審核，用過去分詞 Approved。' },
  { topic: '分詞構句', point: '分詞邏輯主詞須與主句主詞一致。', q: '____ for the exam, Maria reviewed her notes.', choices: ['Prepare', 'Preparing', 'Prepared', 'To prepare'], ans: 'B', why: 'Maria 準備考試，用 Preparing。' },
  { topic: '分詞構句', point: 'Having + pp 表較早完成的動作。', q: '____ the data, we began drafting the report.', choices: ['Collect', 'Collecting', 'Having collected', 'Collected'], ans: 'C', why: '先收集資料再撰寫，用 Having collected。' },
  { topic: '分詞構句', point: '分詞片語不可與主句主詞邏輯衝突。', q: 'While ____ the lecture, students took detailed notes.', choices: ['attend', 'attending', 'attended', 'to attend'], ans: 'B', why: 'students 聽課，用 attending。' },
  { topic: '虛擬語氣', point: 'If I were... 表與現在事實相反。', q: 'If I ____ more time, I would rewrite the introduction.', choices: ['have', 'had', 'will have', 'would have'], ans: 'B', why: '與現在相反假設，if 子句用過去式 had。' },
  { topic: '虛擬語氣', point: 'wish + 過去式表現在不滿。', q: 'I wish the software ____ easier to navigate.', choices: ['is', 'were', 'will be', 'has been'], ans: 'B', why: 'wish 表現在不滿，用 were。' },
  { topic: '虛擬語氣', point: 'suggest/recommend + (should) V 原形。', q: 'The advisor recommended that he ____ the methodology section.', choices: ['revises', 'revise', 'revised', 'revising'], ans: 'B', why: 'recommend that 後用動詞原形 revise。' },
  { topic: '虛擬語氣', point: 'It is essential that + 原形。', q: 'It is essential that every participant ____ informed consent.', choices: ['signs', 'sign', 'signed', 'signing'], ans: 'B', why: 'essential that 後用原形 sign。' },
  { topic: '虛擬語氣', point: 'If + had pp, would have pp 表與過去相反。', q: 'If they had arrived earlier, they ____ the keynote.', choices: ['would hear', 'would have heard', 'heard', 'hear'], ans: 'B', why: '與過去相反，主句用 would have heard。' },
  { topic: '倒裝', point: '否定副詞句首引起部分倒裝。', q: 'Rarely ____ such a clear pattern in the data.', choices: ['we see', 'do we see', 'we saw', 'have seen'], ans: 'B', why: 'Rarely 句首，助動詞 do 提前。' },
  { topic: '倒裝', point: 'Not only... but also 前段倒裝。', q: 'Not only ____ the hypothesis, but it also predicted outcomes.', choices: ['the model tested', 'did the model test', 'the model did test', 'testing the model'], ans: 'B', why: 'Not only 後需倒裝 did the model test。' },
  { topic: '倒裝', point: 'Only + 時間片語句首倒裝。', q: 'Only after replication ____ the findings credible.', choices: ['the results became', 'did the results become', 'became the results', 'the results did become'], ans: 'B', why: 'Only after... 句首，主句倒裝 did...become。' },
  { topic: '倒裝', point: 'So + adj + that 句首可倒裝。', q: 'So complex ____ that few readers finished it.', choices: ['the argument was', 'was the argument', 'the argument', 'did the argument be'], ans: 'B', why: 'So complex 句首，倒裝 was the argument。' },
  { topic: '倒裝', point: 'Under no circumstances 句首倒裝。', q: 'Under no circumstances ____ confidential data be shared.', choices: ['should', 'should confidential', 'confidential data should', 'data should'], ans: 'A', why: 'Under no circumstances 後倒裝 should...be shared。' },
  { topic: '平行結構', point: 'and/or 連接相同詞性形式。', q: 'The course emphasizes reading, writing, and ____ critically.', choices: ['to think', 'thinking', 'think', 'thought'], ans: 'B', why: 'reading, writing 與 thinking 並列動名詞。' },
  { topic: '平行結構', point: 'both...and 兩邊結構對稱。', q: 'The plan benefits ____ students and faculty.', choices: ['both', 'not only', 'either', 'neither'], ans: 'A', why: 'both...and 固定搭配，結構對稱。' },
  { topic: '平行結構', point: 'not only...but also 平行。', q: 'The device is not only efficient but also ____ to maintain.', choices: ['easy', 'easily', 'ease', 'easier'], ans: 'A', why: 'efficient 與 easy 並列形容詞。' },
  { topic: '平行結構', point: 'either...or 連接平行成分。', q: 'Applicants must submit either a transcript ____ a certificate.', choices: ['and', 'or', 'nor', 'but'], ans: 'B', why: 'either...or 固定搭配。' },
  { topic: '平行結構', point: '比較結構 than 兩側對稱。', q: 'Online courses require more self-discipline than ____ in person.', choices: ['traditional classes do', 'traditional classes', 'do traditional classes', 'classes traditional'], ans: 'A', why: 'than 後需完整子句 traditional classes do。' },
  { topic: '冠詞', point: '元音音素前用 an。', q: 'The team proposed ____ alternative explanation.', choices: ['a', 'an', 'the', '—'], ans: 'B', why: 'alternative 以母音音素開頭，用 an。' },
  { topic: '冠詞', point: '首次提及用 a/an，再次提及用 the。', q: 'We conducted ____ survey. ____ survey included 500 participants.', choices: ['a / A', 'a / The', 'the / The', 'an / The'], ans: 'B', why: '首次 a survey，再次 the survey。' },
  { topic: '冠詞', point: '不可數/複數泛指可不用冠詞。', q: '____ Water is essential for plant growth.', choices: ['A', 'An', 'The', '—'], ans: 'D', why: '泛指不可數 water 不用冠詞。' },
  { topic: '冠詞', point: 'the + 形容詞表複數人群。', q: 'Policy should protect ____ elderly in rural areas.', choices: ['an', 'a', 'the', '—'], ans: 'C', why: 'the elderly 表「老年人」這一群人。' },
  { topic: '冠詞', point: '专有/独一无二事物前用 the。', q: '____ sun provides energy for photosynthesis.', choices: ['A', 'An', 'The', '—'], ans: 'C', why: 'sun 為独一无二，用 the。' },
  { topic: '冠詞', point: '学科名泛指不用冠词（美式）。', q: 'She majored in ____ economics at the university.', choices: ['a', 'an', 'the', '—'], ans: 'D', why: '学科 economics 泛指不用冠词。' },
  { topic: '介系詞', point: 'depend on / rely on 固定搭配。', q: 'Outcomes depend ____ accurate measurements.', choices: ['in', 'on', 'at', 'for'], ans: 'B', why: 'depend on 為固定片語。' },
  { topic: '介系詞', point: 'interested in / capable of 等形容詞+介系詞。', q: 'The lab is capable ____ processing large datasets.', choices: ['for', 'to', 'of', 'with'], ans: 'C', why: 'capable of 固定搭配。' },
  { topic: '介系詞', point: 'between 兩者；among 三者以上。', q: 'Agreement was reached ____ the three departments.', choices: ['between', 'among', 'within', 'across'], ans: 'B', why: '三個部門用 among。' },
  { topic: '介系詞', point: 'despite / in spite of 後接名詞，不接子句。', q: '____ the delay, the project stayed within budget.', choices: ['Although', 'Despite', 'Because', 'Unless'], ans: 'B', why: 'Despite 後接名詞片語 the delay。' },
  { topic: '介系詞', point: 'by + 時間點表「不遲於」。', q: 'Submit revisions ____ Friday at noon.', choices: ['until', 'by', 'since', 'during'], ans: 'B', why: 'by Friday 表最晚週五中午前。' },
  { topic: '介系詞', point: 'different from（美式）/ different to（英式）。', q: 'The revised policy is different ____ the original.', choices: ['than', 'from', 'with', 'of'], ans: 'B', why: 'different from 為常見學術寫法。' },
  { topic: '時態', point: '現在完成式表到目前為止的結果。', q: 'Researchers ____ significant progress since January.', choices: ['made', 'have made', 'make', 'had made'], ans: 'B', why: 'since January 提示現在完成式 have made。' },
  { topic: '時態', point: '過去完成式表過去之前的動作。', q: 'By the time the lecture ended, most students ____ notes.', choices: ['take', 'took', 'had taken', 'have taken'], ans: 'C', why: 'lecture ended 前先 had taken notes。' },
  { topic: '時態', point: '一般現在式表普遍事實。', q: 'Water ____ at 100°C at sea level.', choices: ['boiled', 'boils', 'is boiling', 'has boiled'], ans: 'B', why: '科學事實用一般現在式 boils。' },
  { topic: '時態', point: '過去進行式表過去某刻進行中。', q: 'While the team ____ data, the server crashed.', choices: [' analyzes', 'was analyzing', 'has analyzed', 'had analyzed'], ans: 'B', why: 'While 表同時進行，用 was analyzing。' },
  { topic: '時態', point: 'will / be going to 表未來（依上下文）。', q: 'The conference ____ place next month in Boston.', choices: ['takes', 'will take', 'took', 'has taken'], ans: 'B', why: 'next month 表未來，用 will take。' }
];

const grammarItems = grammarBank.slice(0, 60).map(function (g, i) {
  return { id: i + 1, topic: g.topic, point: g.point, q: g.q, choices: g.choices, ans: g.ans, why: g.why };
});

writeFile('toefl-grammar-data.js', 'WA_TOEFL_GRAMMAR', {
  focus: '托福閱讀／寫作常考文法：詞性、從句、主詞動詞一致、分詞、倒裝、虛擬等。',
  items: grammarItems
});

console.log('grammar:', grammarItems.length);
