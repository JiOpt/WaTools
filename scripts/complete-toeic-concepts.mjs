/**
 * Complete TOEIC listening/reading/grammar concept coverage:
 * - add full concept checklists
 * - append gap-fill drills (battlefield-ready)
 */
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function load(rel, name) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(root, rel), 'utf8'), sandbox);
  return sandbox.window[name];
}

function save(rel, name, obj) {
  fs.writeFileSync(path.join(root, rel), `window.${name} = ${JSON.stringify(obj, null, 2)};\n`, 'utf8');
}

const LISTEN_CONCEPTS = [
  { id: 'l-p1-action', part: 'Part 1', title: '進行中動作 vs 完成狀態', tip: 'is V-ing ≠ has V-ed／is open。', level: 1 },
  { id: 'l-p1-object', part: 'Part 1', title: '物件辨識與相似物', tip: '先看清楚再聽同義描述。', level: 1 },
  { id: 'l-p1-prep', part: 'Part 1', title: '位置介系詞', tip: 'behind／in front of／beside／between。', level: 1 },
  { id: 'l-p1-count', part: 'Part 1', title: '人數／數量', tip: '預讀先數，聽 three／several。', level: 1 },
  { id: 'l-p1-lr', part: 'Part 1', title: '左右與方位', tip: 'left／right／near the window。', level: 1 },
  { id: 'l-p1-indoor', part: 'Part 1', title: '室內外與背景', tip: 'meeting room ≠ park。', level: 1 },
  { id: 'l-p1-tool', part: 'Part 1', title: '工具／配件使用中', tip: 'wearing headset／using drill。', level: 1 },
  { id: 'l-p1-passive', part: 'Part 1', title: '被動狀態敘述', tip: 'The door is open. 無人推門。', level: 1 },
  { id: 'l-p1-partial', part: 'Part 1', title: '遮擋／遠景細節', tip: '背景搬箱、前景遮擋常考。', level: 2 },
  { id: 'l-p1-reflect', part: 'Part 1', title: '倒影／螢幕顯示', tip: '反射≠第二場景；讀螢幕字。', level: 2 },
  { id: 'l-p1-safety', part: 'Part 1', title: '工安裝備', tip: 'hard hat／vest／goggles。', level: 2 },
  { id: 'l-p1-load', part: 'Part 1', title: '裝卸進行中', tip: 'being unloaded ≠ already emptied。', level: 2 },
  { id: 'l-p2-wh', part: 'Part 2', title: '疑問詞對應', tip: 'who→人；where→地；when→時；why→因；how→方式。', level: 1 },
  { id: 'l-p2-yn', part: 'Part 2', title: 'Yes/No 與補充', tip: '先答是否再補資訊。', level: 1 },
  { id: 'l-p2-sound', part: 'Part 2', title: '相似音陷阱', tip: 'noon／moon；勿被諧音帶走。', level: 1 },
  { id: 'l-p2-echo', part: 'Part 2', title: '重複原字誘答', tip: '複誦原字常是錯的。', level: 1 },
  { id: 'l-p2-neg', part: 'Part 2', title: '否定語意一致', tip: 'Has…? → No, not yet.／Yes, it has.', level: 1 },
  { id: 'l-p2-or', part: 'Part 2', title: '選擇問 A or B', tip: '要選邊或 neither／both。', level: 1 },
  { id: 'l-p2-offer', part: 'Part 2', title: '建議／請求／邀請', tip: 'Should we…?／Can you…? 給明確回應。', level: 1 },
  { id: 'l-p2-indirect', part: 'Part 2', title: '間接拒絕與改約', tip: 'I have another appointment.', level: 1 },
  { id: 'l-p2-tag', part: 'Part 2', title: '附加問句', tip: '…, isn’t it? 先確認或否認。', level: 2 },
  { id: 'l-p2-embed', part: 'Part 2', title: '間接／嵌入問句', tip: 'Do you know where…? 答地點。', level: 2 },
  { id: 'l-p2-cond', part: 'Part 2', title: '條件問 If…', tip: '條件達成後的行動。', level: 2 },
  { id: 'l-p2-tone', part: 'Part 2', title: '語氣／反諷', tip: '抓真實態度非字面。', level: 2 },
  { id: 'l-p2-ty', part: 'Part 2', title: 'teen／ty 數字', tip: 'thirteen／thirty 重音不同。', level: 2 },
  { id: 'l-p3-purpose', part: 'Part 3', title: '對話目的', tip: 'why they called／met。', level: 1 },
  { id: 'l-p3-who', part: 'Part 3', title: '身份與關係', tip: 'supplier／client／coworker。', level: 1 },
  { id: 'l-p3-time', part: 'Part 3', title: '時間變更', tip: '以最後確認為準。', level: 1 },
  { id: 'l-p3-req', part: 'Part 3', title: '請求與下一步', tip: 'I’ll／Could you／next step。', level: 1 },
  { id: 'l-p3-place', part: 'Part 3', title: '地點與專有名詞', tip: 'warehouse／Hall B。', level: 1 },
  { id: 'l-p3-syn', part: 'Part 3', title: '同義替換選項', tip: 'cut costs＝reduce expenses。', level: 1 },
  { id: 'l-p3-turn', part: 'Part 3', title: '轉折 however／actually', tip: '轉折後常是答案。', level: 1 },
  { id: 'l-p3-num', part: 'Part 3', title: '數字與數量', tip: '40 vs 14。', level: 1 },
  { id: 'l-p3-graph', part: 'Part 3', title: '圖表題', tip: '先讀軸與問句再聽。', level: 2 },
  { id: 'l-p3-three', part: 'Part 3', title: '三人對話', tip: '注意第三個聲音的方案。', level: 2 },
  { id: 'l-p3-vm', part: 'Part 3', title: '電話留言', tip: '回撥分機／截止時間。', level: 2 },
  { id: 'l-p3-deal', part: 'Part 3', title: '優惠條件與門檻', tip: '滿額免運／至月底。', level: 2 },
  { id: 'l-p3-stance', part: 'Part 3', title: '多方立場衝突', tip: '業務要折扣、財務要利潤。', level: 2 },
  { id: 'l-p3-correct', part: 'Part 3', title: '錯誤假設被糾正', tip: 'Room A→改 B。', level: 2 },
  { id: 'l-p4-purpose', part: 'Part 4', title: '獨白目的', tip: '開頭常講目的。', level: 1 },
  { id: 'l-p4-tour', part: 'Part 4', title: '導覽／行程下一站', tip: 'next stop／next。', level: 1 },
  { id: 'l-p4-ad', part: 'Part 4', title: '廣告優惠', tip: '折扣與期限。', level: 1 },
  { id: 'l-p4-news', part: 'Part 4', title: '新聞升跌', tip: 'rose／fell。', level: 1 },
  { id: 'l-p4-flight', part: 'Part 4', title: '航班延誤', tip: 'delayed＋時長。', level: 1 },
  { id: 'l-p4-menu', part: 'Part 4', title: '語音選單指示', tip: 'Press 2。', level: 1 },
  { id: 'l-p4-policy', part: 'Part 4', title: '政策變更', tip: '新舊對照（退貨天數）。', level: 2 },
  { id: 'l-p4-except', part: 'Part 4', title: '規則例外', tip: '一般禁止，急件可申請。', level: 2 },
  { id: 'l-p4-phase', part: 'Part 4', title: '分階段時程', tip: 'pilot → full release。', level: 2 },
  { id: 'l-p4-maint', part: 'Part 4', title: '維修／改道範圍', tip: '僅東翼／接駁巴士。', level: 2 },
  { id: 'l-p4-recall', part: 'Part 4', title: '召回／批次', tip: 'affected batch。', level: 2 },
  { id: 'l-acc-usuk', part: '口音', title: '美英澳加詞彙差異', tip: 'elevator／lift；flat＝apartment。', level: 1 },
  { id: 'l-acc-sched', part: '口音', title: 'schedule 等發音差異', tip: '辨義不辨腔。', level: 1 },
  { id: 'l-acc-link', part: '口音', title: '連音弱讀', tip: '抓實詞重音。', level: 2 },
  { id: 'l-acc-stress', part: '口音', title: '重音改變詞性', tip: 'REcord／reCORD。', level: 2 },
  { id: 'l-all-preview', part: '綜合', title: 'Directions 預讀', tip: '劃關鍵字＝送分時間。', level: 1 },
  { id: 'l-all-multi', part: '綜合', title: '一組多題對應', tip: '題號對時間軸分段聽。', level: 2 },
  { id: 'l-all-opt', part: '綜合', title: '選項反義對立', tip: 'increase／decrease 先標。', level: 2 },
];

const READ_CONCEPTS = [
  { id: 'r5-pos', part: '5', title: '詞性：名／動／形／副', tip: '修飾誰決定詞性。', level: 1 },
  { id: 'r5-conj', part: '5', title: '連接詞與轉折', tip: 'however／although／because。', level: 1 },
  { id: 'r5-prep', part: '5', title: '介系詞固定搭配', tip: 'depend on／interested in。', level: 1 },
  { id: 'r5-pron', part: '5', title: '代名詞一致', tip: 'they＝複數前文。', level: 1 },
  { id: 'r5-syn', part: '5', title: '同義詞替換', tip: 'postpone＝delay。', level: 1 },
  { id: 'r5-time', part: '5', title: '時間數字用語', tip: 'no later than＝by。', level: 1 },
  { id: 'r5-agree', part: '5', title: '主詞動詞一致', tip: 'neither…nor 靠近原則；the number of。', level: 2 },
  { id: 'r5-tense', part: '5', title: '時態與語態', tip: '完成式、被動、未來完成。', level: 2 },
  { id: 'r5-virt', part: '5', title: '虛擬／It is essential that', tip: '原形動詞。', level: 2 },
  { id: 'r5-adv', part: '5', title: '易混副詞', tip: 'hard／hardly；late／lately；near／nearly。', level: 2 },
  { id: 'r5-art', part: '5', title: '冠詞 a／an／the', tip: '首次提及／特指。', level: 1 },
  { id: 'r5-rel', part: '5', title: '關係子句填空', tip: 'who／which／that／whose。', level: 2 },
  { id: 'r6-cohere', part: '6', title: '文意連貫轉折', tip: 'However／As a result／For instance。', level: 1 },
  { id: 'r6-ref', part: '6', title: '段落指涉 this／these', tip: '指前文整件事。', level: 1 },
  { id: 'r6-vocab', part: '6', title: '語境選詞', tip: 'allocate／mitigate。', level: 2 },
  { id: 'r6-parallel', part: '6', title: '平行結構', tip: 'not only A but also B。', level: 2 },
  { id: 'r6-order', part: '6', title: '段落邏輯順序', tip: '問題→道歉→補救。', level: 2 },
  { id: 'r6-tone', part: '6', title: '正式語氣', tip: 'Kindly／We look forward to…', level: 2 },
  { id: 'r6-insert', part: '6', title: '句子銜接功能', tip: '承上啟下、舉例、對比。', level: 2 },
  { id: 'r7-detail', part: '7', title: '細節定位', tip: '專有名詞、數字、小字例外。', level: 1 },
  { id: 'r7-infer', part: '7', title: '推論', tip: '言外之意與條件句。', level: 1 },
  { id: 'r7-syn', part: '7', title: '文中同義詞', tip: 'allocated≈assigned。', level: 1 },
  { id: 'r7-main', part: '7', title: '主旨／目的', tip: '主旨≠單一細節。', level: 1 },
  { id: 'r7-dual', part: '7', title: '雙篇對照', tip: '共同主題與衝突資訊。', level: 1 },
  { id: 'r7-not', part: '7', title: 'NOT／EXCEPT', tip: '找未被提及者。', level: 2 },
  { id: 'r7-chart', part: '7', title: '圖表單位與比較', tip: 'thousands；哪月較高。', level: 2 },
  { id: 'r7-triple', part: '7', title: '多篇整合', tip: '三篇找共同截止日／因果。', level: 2 },
  { id: 'r7-audience', part: '7', title: '對象與下一步', tip: '誰該行動；RSVP。', level: 2 },
  { id: 'r7-genre', part: '7', title: '文類辨識', tip: 'email／notice／ad／article。', level: 1 },
  { id: 'r7-vocabctx', part: '7', title: '詞彙依語境', tip: 'forthcoming＝即將公布。', level: 2 },
  { id: 'r7-foot', part: '7', title: '註腳與附件', tip: 'Attachment B；tax excluded。', level: 2 },
];

const GRAM_CONCEPTS = [
  { id: 'g-pos', topic: '詞性', title: '四大詞性轉換', tip: '修飾對象決定名動形副。', level: 1 },
  { id: 'g-pos2', topic: '詞性', title: '易混形副／經貿字', tip: 'economic／economical；historic／historical。', level: 2 },
  { id: 'g-prep', topic: '介系詞', title: '高頻固定搭配', tip: 'on／in／at；depend on；by＋時間。', level: 1 },
  { id: 'g-prep2', topic: '介系詞', title: '進階片語介系詞', tip: 'in accordance with；on behalf of；in lieu of。', level: 2 },
  { id: 'g-conj', topic: '連接詞', title: '對等／從屬連接', tip: 'and／but／although／despite＋N。', level: 1 },
  { id: 'g-conj2', topic: '連接詞', title: '進階連接', tip: 'whereas；provided that；lest；notwithstanding。', level: 2 },
  { id: 'g-partadj', topic: '分詞形容詞', title: 'interested／interesting', tip: '人多用 -ed；物／事多用 -ing。', level: 1 },
  { id: 'g-pron', topic: '代名詞', title: '格與指涉', tip: '主格受格；one…the other。', level: 1 },
  { id: 'g-cond', topic: '假設語氣', title: 'If 三種基本', tip: '現在／過去／過去完成虛擬。', level: 1 },
  { id: 'g-cond2', topic: '假設語氣', title: 'wish／as if／It’s time／but for', tip: '進階虛擬句型。', level: 2 },
  { id: 'g-rel', topic: '關係代名詞', title: 'who／which／that／whose', tip: '人事物與所有格。', level: 1 },
  { id: 'g-rel2', topic: '關係代名詞', title: '介系詞＋which／what／whereby', tip: '進階關係結構。', level: 2 },
  { id: 'g-participle', topic: '分詞構句', title: 'V-ing／p.p. 構句', tip: '主詞一致；Having＋p.p.。', level: 1 },
  { id: 'g-tense', topic: '時態', title: '常見時態一致', tip: '現在完成、過去完成、未來。', level: 1 },
  { id: 'g-tense2', topic: '時態', title: '完成進行', tip: 'have been V-ing；had been V-ing。', level: 2 },
  { id: 'g-voice', topic: '語態', title: '被動與使役', tip: 'be＋p.p.；have／get＋O＋p.p.。', level: 2 },
  { id: 'g-compare', topic: '比較', title: '比較級最高級', tip: 'than；the…the…；superior to。', level: 1 },
  { id: 'g-toing', topic: '不定詞／動名詞', title: 'to V vs V-ing', tip: 'decide to；enjoy V-ing；remember 差異。', level: 1 },
  { id: 'g-agree', topic: '主詞一致', title: '一致規則', tip: 'along with；a series of；either…or。', level: 2 },
  { id: 'g-inv', topic: '倒裝', title: '否定／Only 倒裝', tip: 'Not until；Only after；No sooner。', level: 2 },
  { id: 'g-confuse', topic: '易混字', title: 'affect／effect 等', tip: 'principal／principle；imply／infer。', level: 2 },
  { id: 'g-adv', topic: '進階結構', title: 'too／enough／so…as to', tip: '程度結構。', level: 2 },
  { id: 'g-art', topic: '冠詞', title: 'a／an／the／零冠詞', tip: '可數首次；特指；物質／抽象常零冠詞。', level: 1 },
  { id: 'g-modal', topic: '語氣助動詞', title: 'can／must／should／may', tip: '義務、推測、許可。', level: 1 },
  { id: 'g-count', topic: '可數不可數', title: 'much／many／little／few', tip: 'advice／information 不可數。', level: 1 },
  { id: 'g-corr', topic: '相關連接', title: 'both…and／either…or／not only…but also', tip: '結構平行。', level: 2 },
  { id: 'g-reduce', topic: '關係子句省略', title: '省略 be＋分詞', tip: 'the man sitting…＝who is sitting。', level: 2 },
  { id: 'g-lie', topic: '易混動詞', title: 'rise／raise；lie／lay', tip: '及物不及物分清。', level: 2 },
];

// Extra drills to cover missing battlefield concepts
const EXTRA_LISTEN = [
  { part: 'Part 1', trap: '陰影與光線', ex: '圖：強光下物品有長影。', wrong: 'It is completely dark inside.', right: 'Objects cast long shadows in bright light.', tip: '光線線索輔助場景。', level: 1 },
  { part: 'Part 1', trap: '坐姿 vs 站姿', ex: '圖：全員站立簡報。', wrong: 'Everyone is seated at desks.', right: 'People are standing during a presentation.', tip: '姿勢常考。', level: 1 },
  { part: 'Part 1', trap: '書寫 vs 打字', ex: '圖：手寫簽名。', wrong: 'She is typing on a keyboard.', right: 'She is signing a document.', tip: '手部精細動作。', level: 1 },
  { part: 'Part 1', trap: '指向圖表', ex: '圖：人指投影螢幕。', wrong: 'He is looking out the window.', right: 'He is pointing at the screen.', tip: '指示動作。', level: 1 },
  { part: 'Part 1', trap: '清潔進行中', ex: '圖：拖地。', wrong: 'The floor has already dried.', right: 'Someone is mopping the floor.', tip: '清潔進行式。', level: 1 },
  { part: 'Part 1', trap: '雨天室外裝備', ex: '圖：撐傘排隊。', wrong: 'People are sunbathing.', right: 'People are holding umbrellas in the rain.', tip: '天氣＋配件。', level: 2 },
  { part: 'Part 1', trap: '堆疊高度', ex: '圖：箱子堆很高。', wrong: 'Boxes are scattered flat.', right: 'Boxes are stacked high.', tip: 'stacked vs scattered。', level: 2 },
  { part: 'Part 2', trap: 'How about 建議', ex: 'How about meeting after lunch?', wrong: 'Lunch is a meal.', right: 'Sure, around 1:30.', tip: 'How about＝建議。', level: 1 },
  { part: 'Part 2', trap: 'What do you think', ex: 'What do you think of the draft?', wrong: 'Drafts are cold.', right: 'It looks solid overall.', tip: '給評價。', level: 1 },
  { part: 'Part 2', trap: 'Would you mind', ex: 'Would you mind closing the window?', wrong: 'Windows are glass.', right: 'Not at all.', tip: 'mind＋V-ing；Not at all＝願意。', level: 1 },
  { part: 'Part 2', trap: '嵌入問句 where', ex: 'Do you know where the forms are?', wrong: 'Forms are paperwork.', right: 'In the top drawer.', tip: '答地點。', level: 2 },
  { part: 'Part 2', trap: 'How come', ex: 'How come the lab is locked?', wrong: 'Labs do research.', right: 'There’s a safety drill.', tip: 'How come＝為什麼。', level: 2 },
  { part: 'Part 2', trap: '同意附和', ex: 'This queue is endless.', wrong: 'Queues are lines.', right: 'Tell me about it.', tip: '附和用語。', level: 2 },
  { part: 'Part 3', trap: '抱怨＋補償', ex: '延誤後給折扣。', wrong: 'No compensation offered.', right: 'They offer a discount for the delay.', tip: 'complaint＋remedy。', level: 1 },
  { part: 'Part 3', trap: '預約改期', ex: '原週二改週四。', wrong: 'Tuesday.', right: 'Thursday after rescheduling.', tip: 'reschedule。', level: 1 },
  { part: 'Part 3', trap: '設備故障回報', ex: '影印機卡紙。', wrong: 'Everything works.', right: 'The copier has a paper jam.', tip: 'problem report。', level: 1 },
  { part: 'Part 3', trap: '圖表最高點', ex: '問哪月營收最高。', wrong: '猜第一月。', right: '對照圖中最高長條。', tip: '讀圖再聽。', level: 2 },
  { part: 'Part 3', trap: '隱藏截止', ex: '表面上寒暄，其實提醒 Friday due。', wrong: 'No deadline mentioned.', right: 'The due date is Friday.', tip: '細節藏在後段。', level: 2 },
  { part: 'Part 3', trap: '跨部門協調', ex: '行銷需設計先交檔。', wrong: 'Work in isolation.', right: 'Design must deliver assets first.', tip: 'dependency。', level: 2 },
  { part: 'Part 4', trap: '會議議程宣佈', ex: '先財務後產品。', wrong: 'Party agenda.', right: 'Finance first, then product updates.', tip: 'agenda order。', level: 1 },
  { part: 'Part 4', trap: '開放時間異動', ex: '週日改休息。', wrong: 'Open every day.', right: 'Closed on Sundays now.', tip: 'hours change。', level: 1 },
  { part: 'Part 4', trap: '停車指引', ex: '訪客停 B2。', wrong: 'Park anywhere.', right: 'Visitor parking is on B2.', tip: 'parking instruction。', level: 1 },
  { part: 'Part 4', trap: '票種限制', ex: '學生票需證件。', wrong: 'Any ticket works without ID.', right: 'Student tickets require ID.', tip: 'eligibility。', level: 2 },
  { part: 'Part 4', trap: '緊急疏散', ex: '火災往東門。', wrong: 'Stay at desks.', right: 'Exit through the east doors.', tip: 'evacuation。', level: 2 },
  { part: 'Part 4', trap: '贊助感謝＋抽獎', ex: '聽完抽獎規則。', wrong: 'Ignore the sponsor.', right: 'Thanks sponsors; raffle rules follow.', tip: 'closing segment。', level: 2 },
  { part: '口音', trap: '英式 holiday', ex: 'on holiday', wrong: '一定是宗教節日。', right: '＝on vacation（休假）。', tip: '詞彙差異。', level: 1 },
  { part: '口音', trap: '美式 cell phone', ex: 'call my cell', wrong: '監獄牢房。', right: '手機。', tip: 'mobile＝cell。', level: 1 },
  { part: '綜合', trap: '先題後文預讀', ex: 'Part 3／4 先看題', wrong: '閉眼等播完。', right: '預讀問句與選項關鍵。', tip: '預讀節奏。', level: 1 },
  { part: '綜合', trap: '同義選項掃描', ex: '選項用不同動詞', wrong: '只聽原字才選。', right: '對應同義替換。', tip: 'synonym options。', level: 2 },
];

const EXTRA_READ = [
  { part: 5, skill: '冠詞', point: 'a／an 依母音發音；the 表特指。', q: 'She submitted ____ unusual proposal to the board.', choices: ['a', 'an', 'the only wrong always', 'no article required wrongly'], ans: 'B', why: 'unusual 母音開頭用 an。', level: 1 },
  { part: 5, skill: '冠詞', point: 'the＋獨一無二／前文已提。', q: 'Please close ____ door behind you.', choices: ['the', 'a', 'an', 'any'], ans: 'A', why: '雙方知道的那扇門。', level: 1 },
  { part: 5, skill: '主詞動詞一致', point: 'each／every＋單數動詞。', q: 'Each of the applicants ____ a writing sample.', choices: ['submit', 'submits', 'submitting', 'have submitted wrongly as plural'], ans: 'B', why: 'each 當主詞用單數。', level: 1 },
  { part: 5, skill: '關係子句', point: '修飾人用 who／that。', q: 'The engineer ____ designed the prototype joined us.', choices: ['who', 'which', 'whose', 'whom as subject wrongly'], ans: 'A', why: '主格 who。', level: 2 },
  { part: 5, skill: '關係子句', point: '介系詞＋whom／which。', q: 'The client with ____ we negotiated left early.', choices: ['whom', 'who', 'which', 'whose'], ans: 'A', why: 'with whom。', level: 2 },
  { part: 5, skill: '語氣助動詞', point: 'must＝義務；may＝可能／許可。', q: 'Visitors ____ wear badges at all times.', choices: ['must', 'might as weak', 'maybe', 'must to'], ans: 'A', why: '規定義務 must。', level: 1 },
  { part: 5, skill: '語氣助動詞', point: 'should have＋p.p. 過去該做未做。', q: 'We ____ have notified the client earlier.', choices: ['should', 'should to', 'must be', 'can'], ans: 'A', why: 'should have。', level: 2 },
  { part: 5, skill: '可數不可數', point: 'advice 不可數。', q: 'She gave me useful ____ on pricing.', choices: ['advice', 'advices', 'advise', 'advising'], ans: 'A', why: 'advice 不可數。', level: 1 },
  { part: 5, skill: '平行結構', point: 'and 連接同詞性。', q: 'The role requires analyzing data and ____ reports.', choices: ['writing', 'write', 'to write only mid', 'wrote'], ans: 'A', why: '與 analyzing 平行。', level: 1 },
  { part: 6, skill: '句子銜接', point: '舉例銜接 for example。', q: 'Several metrics improved. ____, response time fell by 20%.', choices: ['For example', 'Nevertheless as contrast only', 'Otherwise', 'In spite of'], ans: 'A', why: '舉例。', level: 1 },
  { part: 6, skill: '句子銜接', point: '對比 on the other hand。', q: 'Costs rose. ____, customer satisfaction also rose.', choices: ['On the other hand', 'Because', 'So that', 'During'], ans: 'A', why: '另一面／對比。', level: 1 },
  { part: 6, skill: '句子銜接', point: '總結 in summary／overall。', q: '____, the pilot met all success criteria.', choices: ['Overall', 'Unless', 'Despite of', 'Near'], ans: 'A', why: '總結。', level: 2 },
  { part: 6, skill: '詞彙精準', point: 'comply with 法規。', q: 'All vendors must ____ with local regulations.', choices: ['comply', 'complain', 'complete', 'compile'], ans: 'A', why: 'comply with。', level: 2 },
  { part: 6, skill: '詞彙精準', point: 'revise＝修改。', q: 'Please ____ the draft before Friday.', choices: ['revise', 'reverse', 'revert only', 'reveal'], ans: 'A', why: 'revise。', level: 1 },
  { part: 7, skill: '文類辨識', point: '辨識公告 notice。', q: 'Text posts building hours and closures. Genre?', choices: ['Notice / announcement', 'Novel', 'Poem', 'Invoice only always'], ans: 'A', why: '公告。', level: 1 },
  { part: 7, skill: '文類辨識', point: '辨識廣告。', q: 'Text pushes discount codes and call-to-action. Genre?', choices: ['Advertisement', 'Police report', 'Dictionary', 'Contract appendix only'], ans: 'A', why: '廣告。', level: 1 },
  { part: 7, skill: '作者目的', point: '為何寫這封信。', q: 'Email asks to reschedule a demo. Purpose?', choices: ['Change the meeting time', 'Cancel the company', 'Order lunch', 'Hire staff only'], ans: 'A', why: '改期。', level: 1 },
  { part: 7, skill: '排除題', point: 'Which is NOT mentioned', q: 'Benefits: gym, meals, transit. NOT mentioned?', choices: ['Stock options', 'Gym', 'Meals', 'Transit'], ans: 'A', why: '未提股票。', level: 1 },
  { part: 7, skill: '圖表題', point: '讀圖例 legend', q: 'Dashed line = online sales. Solid = store. Q asks online in May.', choices: ['Read the dashed May point', 'Ignore legend', 'Always pick solid', 'Average both blindly'], ans: 'A', why: '對圖例。', level: 2 },
  { part: 7, skill: '多篇整合', point: '因果跨三篇', q: 'A: storm warning. B: event moved indoors. C: new room map. Link?', choices: ['Indoor move due to weather', 'Unrelated', 'Storm canceled forever', 'Map is a menu'], ans: 'A', why: '天氣→改室內。', level: 2 },
  { part: 7, skill: '詞彙依語境', point: 'outstanding＝未付清／傑出（依文）', q: 'Invoice: outstanding balance due. Meaning?', choices: ['Unpaid amount', 'Excellent quality', 'Canceled', 'Gift'], ans: 'A', why: '帳單語境＝未付。', level: 2 },
  { part: 7, skill: '訊息對象', point: '誰是收件人', q: 'Memo to warehouse supervisors… Who acts?', choices: ['Warehouse supervisors', 'Customers', 'Competitors', 'Tourists'], ans: 'A', why: '收件對象。', level: 1 },
  { part: 7, skill: '細節定位', point: '小字例外', q: 'Free wifi except guest rooms on Floor 12. Floor 12?', choices: ['Possibly no free wifi', 'Always free', 'Only paid wifi worldwide', 'No internet ever'], ans: 'A', why: '例外樓層。', level: 2 },
  { part: 5, skill: '時態／語態', point: '過去完成早於過去。', q: 'When we arrived, the meeting ____.', choices: ['had started', 'starts', 'will start', 'starting'], ans: 'A', why: 'had started。', level: 1 },
  { part: 5, skill: '連接詞', point: 'despite＋名詞；although＋子句。', q: '____ the rain, the tour continued.', choices: ['Despite', 'Although', 'Because', 'So'], ans: 'A', why: 'despite＋N。', level: 1 },
  { part: 6, skill: '文意連貫', point: 'therefore 因果。', q: 'Inventory was low; ____ we reordered.', choices: ['therefore', 'although', 'despite', 'unless'], ans: 'A', why: 'therefore。', level: 1 },
  { part: 7, skill: '推論', point: '下一步最合理', q: 'Portal: upload ID by Monday. Reader should?', choices: ['Upload before Monday', 'Wait until next year', 'Ignore', 'Call a rival firm'], ans: 'A', why: '依指示行動。', level: 1 },
  { part: 7, skill: '雙篇對照', point: '找一致資訊', q: 'A and B both list Gate 9. Shared fact?', choices: ['Gate 9', 'Gate 6', 'No gate', 'Canceled flight only in one'], ans: 'A', why: '共同 Gate 9。', level: 1 },
  { part: 5, skill: '介系詞', point: 'responsible for。', q: 'She is responsible ____ vendor onboarding.', choices: ['for', 'of', 'to as only', 'at'], ans: 'A', why: 'responsible for。', level: 1 },
  { part: 6, skill: '指涉', point: 'such 指前文類型。', q: 'Delays hurt trust. ____ issues must be fixed.', choices: ['Such', 'Them', 'It only singular wrong', 'Those people'], ans: 'A', why: 'such issues。', level: 2 },
];

const EXTRA_GRAM = [
  { topic: '冠詞', point: '不可數名詞前通常不加 a。', q: 'We need ____ information about the shipment.', choices: ['— (no article)', 'an', 'a', 'many'], ans: 'A', why: 'information 不可數，此處零冠詞。', level: 1 },
  { topic: '冠詞', point: 'the＋最高級。', q: 'This is ____ most efficient method we tested.', choices: ['the', 'a', 'an', 'no'], ans: 'A', why: 'the most。', level: 1 },
  { topic: '語氣助動詞', point: 'must not＝禁止；need not＝不必。', q: 'You ____ enter the lab without goggles.', choices: ['must not', 'must', 'need', 'can to'], ans: 'A', why: '禁止 must not。', level: 1 },
  { topic: '語氣助動詞', point: 'might／may 表推測。', q: 'The package ____ arrive tomorrow.', choices: ['may', 'must to', 'shoulds', 'cans'], ans: 'A', why: '可能 may。', level: 1 },
  { topic: '可數不可數', point: 'few／a few；little／a little。', q: 'There is ____ time left before the deadline.', choices: ['little', 'few', 'many', 'several'], ans: 'A', why: 'time 不可數用 little。', level: 1 },
  { topic: '可數不可數', point: 'equipment 不可數。', q: 'New ____ was installed last night.', choices: ['equipment', 'equipments', 'equip', 'equipping'], ans: 'A', why: 'equipment 不可數。', level: 1 },
  { topic: '相關連接', point: 'either…or 動詞靠近。', q: 'Either the reports or the summary ____ missing.', choices: ['is', 'are', 'be', 'were being'], ans: 'A', why: '靠近 summary 用 is。', level: 2 },
  { topic: '相關連接', point: 'not only…but also 倒裝可選。', q: 'Not only the CEO but also the directors ____ present.', choices: ['were', 'was', 'is', 'be'], ans: 'A', why: '靠近 directors 用 were。', level: 2 },
  { topic: '相關連接', point: 'both…and 複數動詞。', q: 'Both design and QA ____ responsible.', choices: ['are', 'is', 'was', 'be'], ans: 'A', why: 'both…and→複數。', level: 1 },
  { topic: '關係子句省略', point: '主動省略 who is→V-ing。', q: 'Applicants ____ the form online will get a code.', choices: ['submitting', 'submit', 'submitted who', 'submits'], ans: 'A', why: '＝who submit→submitting。', level: 2 },
  { topic: '關係子句省略', point: '被動省略 which is→p.p.。', q: 'Products ____ in Japan ship next week.', choices: ['made', 'making', 'make', 'makes'], ans: 'A', why: '＝which are made。', level: 2 },
  { topic: '易混動詞', point: 'raise（及物）／rise（不及物）。', q: 'The company will ____ prices next quarter.', choices: ['raise', 'rise', 'arise', 'rose'], ans: 'A', why: 'raise＋受詞 prices。', level: 2 },
  { topic: '易混動詞', point: 'lie（躺／位於）／lay（放置）。', q: 'Please ____ the samples on the tray.', choices: ['lay', 'lie', 'lain', 'lying as imperative'], ans: 'A', why: 'lay＋受詞。', level: 2 },
  { topic: '易混動詞', point: 'borrow／lend。', q: 'Could you ____ me your adaptor?', choices: ['lend', 'borrow', 'lease as only', 'rent always'], ans: 'A', why: '借出 lend。', level: 1 },
  { topic: '易混動詞', point: 'remind／remember。', q: 'Please ____ me to lock the lab.', choices: ['remind', 'remember', 'reminisce', 'recall me wrongly'], ans: 'A', why: 'remind someone to。', level: 1 },
  { topic: '語態', point: '被動 by＋施事。', q: 'The memo was written ____ the director.', choices: ['by', 'from', 'with', 'of'], ans: 'A', why: 'by。', level: 1 },
  { topic: '語態', point: 'get＋O＋p.p.。', q: 'We got the contract ____ yesterday.', choices: ['signed', 'sign', 'signing', 'to sign only'], ans: 'A', why: 'get O p.p.。', level: 2 },
  { topic: '比較', point: 'as…as 同等比較。', q: 'This model is as reliable ____ the previous one.', choices: ['as', 'than', 'then', 'so'], ans: 'A', why: 'as…as。', level: 1 },
  { topic: '比較', point: 'one of the＋最高級＋複數。', q: 'It is one of the ____ plants in the region.', choices: ['largest', 'larger', 'large', 'most large'], ans: 'A', why: 'one of the largest。', level: 1 },
  { topic: '時態', point: '現在簡單表事實／時刻表。', q: 'The shuttle ____ every 20 minutes.', choices: ['leaves', 'leave', 'leaving', 'left always'], ans: 'A', why: '時刻表用現在簡單。', level: 1 },
  { topic: '時態', point: '過去進行＋when。', q: 'I ____ when the alarm rang.', choices: ['was working', 'worked', 'work', 'am working'], ans: 'A', why: '過去進行。', level: 1 },
  { topic: '分詞形容詞', point: 'excited／exciting。', q: 'Staff were ____ about the bonus.', choices: ['excited', 'exciting', 'excite', 'excitement'], ans: 'A', why: '人用 excited。', level: 1 },
  { topic: '介系詞', point: 'by＋期限；until＋持續到。', q: 'Submit the form ____ Friday.', choices: ['by', 'until as only ongoing', 'during', 'since'], ans: 'A', why: '截止用 by。', level: 1 },
  { topic: '介系詞', point: 'between／among。', q: 'Negotiations between the two firms ended well. Among is for ____.', choices: ['more than two typically', 'exactly two only always wrong', 'zero', 'verbs'], ans: 'A', why: 'among 多者之間。', level: 2 },
  { topic: '假設語氣', point: 'If＋過去完成，would have＋p.p.。', q: 'If we had left earlier, we ____ the traffic.', choices: ['would have avoided', 'will avoid', 'avoid', 'avoided'], ans: 'A', why: '與過去事實相反。', level: 1 },
  { topic: '關係代名詞', point: 'where 表地點。', q: 'This is the site ____ the factory will be built.', choices: ['where', 'which', 'who', 'whose'], ans: 'A', why: 'where。', level: 1 },
  { topic: '關係代名詞', point: 'when 表時間。', q: 'I remember the day ____ we launched.', choices: ['when', 'which', 'who', 'whom'], ans: 'A', why: 'when。', level: 1 },
  { topic: '不定詞／動名詞', point: 'stop to V／V-ing。', q: 'She stopped ____ coffee before the meeting. (停下來去喝)', choices: ['to drink', 'drinking', 'drink', 'drank'], ans: 'A', why: 'stop to V＝停下來去做。', level: 2 },
  { topic: '倒裝', point: 'Seldom／Rarely 倒裝。', q: 'Rarely ____ such strong demand.', choices: ['do we see', 'we see', 'we does see', 'sees we'], ans: 'A', why: '否定副詞倒裝。', level: 2 },
  { topic: '進階結構', point: 'would rather＋過去（寧願他人）。', q: 'I’d rather you ____ the draft tonight.', choices: ['finished', 'finish', 'finishing', 'to finish'], ans: 'A', why: 'would rather＋主詞＋過去式。', level: 2 },
];

function nextId(items) {
  return Math.max(0, ...items.map((x) => Number(x.id) || 0)) + 1;
}

function appendItems(items, extras) {
  let id = nextId(items);
  for (const it of extras) {
    items.push({ ...it, id: id++, level: it.level === 2 ? 2 : 1 });
  }
  return items;
}

function main() {
  const listening = load('assets/js/toeic-listening-data.js', 'WA_TOEIC_LISTENING');
  listening.focus =
    '考場完整概念＋Parts 1–4 陷阱：Level 1 基礎、Level 2 金色證書。練完可上戰場。';
  listening.concepts = LISTEN_CONCEPTS;
  appendItems(listening.items, EXTRA_LISTEN);
  save('assets/js/toeic-listening-data.js', 'WA_TOEIC_LISTENING', listening);

  const reading = load('assets/js/toeic-reading-data.js', 'WA_TOEIC_READING');
  reading.focus =
    '考場完整概念＋Parts 5–7：詞性／連貫／雙多篇／圖表。Level 分級練題，練完可上戰場。';
  reading.concepts = READ_CONCEPTS;
  appendItems(reading.items, EXTRA_READ);
  save('assets/js/toeic-reading-data.js', 'WA_TOEIC_READING', reading);

  const grammar = load('assets/js/toeic-grammar-data.js', 'WA_TOEIC_GRAMMAR');
  grammar.focus =
    '考場完整文法概念：詞性、介系詞、假設、關係、倒裝、易混字等。Level 分級例題，練完可上戰場。';
  grammar.concepts = GRAM_CONCEPTS;
  appendItems(grammar.items, EXTRA_GRAM);
  save('assets/js/toeic-grammar-data.js', 'WA_TOEIC_GRAMMAR', grammar);

  const c = (arr, lv) => arr.filter((x) => (x.level || 1) === lv).length;
  console.log({
    listening: { total: listening.items.length, concepts: listening.concepts.length, L1: c(listening.items, 1), L2: c(listening.items, 2) },
    reading: { total: reading.items.length, concepts: reading.concepts.length, L1: c(reading.items, 1), L2: c(reading.items, 2) },
    grammar: { total: grammar.items.length, concepts: grammar.concepts.length, L1: c(grammar.items, 1), L2: c(grammar.items, 2) },
  });
}

main();
