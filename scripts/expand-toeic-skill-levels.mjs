/**
 * Tag existing TOEIC listening/reading/grammar items as Level 1,
 * append ~60 Level 2 items each, extract listening data file,
 * strip inline LISTENING_TRAPS from toeic-tools.js.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadGlobalAssign(rel, globalName) {
  const code = fs.readFileSync(path.join(root, rel), 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox);
  return sandbox.window[globalName];
}

function loadListeningTrapsFromTools() {
  const tools = fs.readFileSync(path.join(root, 'assets/js/toeic-tools.js'), 'utf8');
  const start = tools.indexOf('  const LISTENING_TRAPS = [');
  const end = tools.indexOf('  const mounts = {');
  if (start < 0 || end < 0) throw new Error('LISTENING_TRAPS not found');
  const snippet = tools.slice(start, end) + '\n;LISTENING_TRAPS';
  return vm.runInNewContext(snippet);
}

function writeJsGlobal(rel, name, obj) {
  const out = `window.${name} = ${JSON.stringify(obj, null, 2)};\n`;
  fs.writeFileSync(path.join(root, rel), out, 'utf8');
}

const L2_LISTENING = [
  { part: 'Part 1', trap: '部分遮擋物件', ex: '圖：紙箱擋住半台印表機。', wrong: 'A printer is fully visible on the desk.', right: 'Boxes are stacked in front of the printer.', tip: '遮擋物常是正確描述焦點。', level: 2 },
  { part: 'Part 1', trap: '倒影／鏡面', ex: '圖：玻璃牆反射。', wrong: 'Two identical rooms are side by side.', right: 'A glass wall reflects the lobby.', tip: '倒影≠實體第二場景。', level: 2 },
  { part: 'Part 1', trap: '遠景動作', ex: '前景坐、背景有人搬箱。', wrong: 'Everyone is seated.', right: 'Someone in the background is moving boxes.', tip: '聽寫常考背景細節。', level: 2 },
  { part: 'Part 1', trap: '工具使用中', ex: '人正用電鑽。', wrong: 'A drill is lying unused.', right: 'He is operating a power drill.', tip: '使用中 vs 閒置。', level: 2 },
  { part: 'Part 1', trap: '排隊方向', ex: '隊伍向右延伸。', wrong: 'People are walking away in different directions.', right: 'Customers are lined up facing the counter.', tip: '排隊≠散走。', level: 2 },
  { part: 'Part 1', trap: '裝卸狀態', ex: '卡車半開、貨未卸完。', wrong: 'The truck has already been emptied.', right: 'Goods are being unloaded from the truck.', tip: '進行中裝卸。', level: 2 },
  { part: 'Part 1', trap: '螢幕顯示', ex: '投影片標題可見。', wrong: 'The screen is blank.', right: 'A slide is displayed on the screen.', tip: '預讀讀螢幕文字。', level: 2 },
  { part: 'Part 1', trap: '安全裝備', ex: '工地戴安全帽背心。', wrong: 'Workers are in casual clothes only.', right: 'Workers are wearing hard hats and safety vests.', tip: '配件常考。', level: 2 },
  { part: 'Part 1', trap: '植物／景觀', ex: '室內盆栽成排。', wrong: 'They are outdoors in a forest.', right: 'Potted plants are arranged indoors.', tip: '室內外線索。', level: 2 },
  { part: 'Part 1', trap: '握手 vs 遞文件', ex: '兩人交換資料夾。', wrong: 'They are shaking hands.', right: 'They are exchanging folders.', tip: '手部動作細分。', level: 2 },
  { part: 'Part 2', trap: '附加問句', ex: 'You locked the lab, didn’t you?', wrong: 'The lab is on floor 3.', right: 'Yes, I did before leaving.', tip: '先確認／否認附加問。', level: 2 },
  { part: 'Part 2', trap: '反諷語氣', ex: 'Oh, great—another delay?', wrong: 'Yes, delays are wonderful.', right: 'I know; the shipment is late again.', tip: '抓真實態度非字面。', level: 2 },
  { part: 'Part 2', trap: '條件問', ex: 'If the client agrees, can we ship Friday?', wrong: 'Friday is a weekday.', right: 'Yes, once we get written approval.', tip: '條件達成後的行動。', level: 2 },
  { part: 'Part 2', trap: '比較問', ex: 'Is the express option faster than standard?', wrong: 'Express means coffee.', right: 'Yes, it arrives a day earlier.', tip: '比較要選相對結論。', level: 2 },
  { part: 'Part 2', trap: '雙重否定', ex: 'Isn’t it unusual that no one replied?', wrong: 'No one never replies.', right: 'It is unusual; I’ll follow up.', tip: '理清否定層數。', level: 2 },
  { part: 'Part 2', trap: '請求轉述', ex: 'Could you ask Legal to review this?', wrong: 'Legal is a TV show.', right: 'Sure, I’ll forward it to them.', tip: '接受轉交任務。', level: 2 },
  { part: 'Part 2', trap: '假設邀請', ex: 'Would you be free for a call at 4?', wrong: 'Four equals two plus two.', right: 'I can do 4:30 instead.', tip: '可改時間仍算回應。', level: 2 },
  { part: 'Part 2', trap: '程度問', ex: 'How urgent is this revision?', wrong: 'Revision means reread.', right: 'We need it before the board meeting.', tip: '給期限／優先級。', level: 2 },
  { part: 'Part 2', trap: '所有格混淆', ex: 'Whose badge is on the desk?', wrong: 'Badges are plastic.', right: 'I think it’s Mina’s.', tip: 'Whose→人。', level: 2 },
  { part: 'Part 2', trap: '建議 vs 事實', ex: 'Shouldn’t we notify the warehouse first?', wrong: 'Warehouses store goods.', right: 'Yes, let’s call them now.', tip: '建議問句用行動回應。', level: 2 },
  { part: 'Part 2', trap: '選擇含 neither', ex: 'Train or bus—either fine?', wrong: 'Trains have wheels.', right: 'Neither; I’ll drive.', tip: '可選 neither。', level: 2 },
  { part: 'Part 2', trap: '確認數字', ex: 'That’s fifteen units, correct?', wrong: 'Units means apartments only.', right: 'Actually, we ordered fifty.', tip: 'teen/ty 再確認。', level: 2 },
  { part: 'Part 2', trap: '委婉請求', ex: 'I was wondering if you could cover my shift.', wrong: 'Shifts are clothing.', right: 'I can take the evening one.', tip: 'Wondering if＝請求。', level: 2 },
  { part: 'Part 2', trap: '過去經驗問', ex: 'Have you dealt with this vendor before?', wrong: 'Vendors sell things.', right: 'Yes, last year’s trade show.', tip: '經驗→時間／場合。', level: 2 },
  { part: 'Part 2', trap: '禁止確認', ex: 'We’re not supposed to use personal email, right?', wrong: 'Email is electronic mail.', right: 'Right—use the company account only.', tip: '規則確認。', level: 2 },
  { part: 'Part 3', trap: '隱藏目的', ex: '表面上寒暄，其實要延期交貨。', wrong: 'They only greet each other.', right: 'They want to postpone delivery.', tip: '聽轉折後真正訴求。', level: 2 },
  { part: 'Part 3', trap: '多方立場', ex: '業務要折扣、財務要利潤。', wrong: 'Everyone agrees immediately.', right: 'Sales seeks a discount; finance resists.', tip: '對立立場常出題。', level: 2 },
  { part: 'Part 3', trap: '圖表趨勢', ex: '問哪季下滑最明顯。', wrong: '憑常識選最高季。', right: '對照圖中下降最陡的季度。', tip: '先讀圖軸再聽。', level: 2 },
  { part: 'Part 3', trap: '條件優惠', ex: '滿額才免運。', wrong: 'Shipping is always free.', right: 'Free shipping above a minimum order.', tip: '聽門檻條件。', level: 2 },
  { part: 'Part 3', trap: '錯誤假設被糾正', ex: '以為會議室 A，實際改 B。', wrong: 'Room A.', right: 'Room B after the change.', tip: '以更正後資訊為準。', level: 2 },
  { part: 'Part 3', trap: '語氣暗示拒絕', ex: 'That might be difficult this week…', wrong: 'They happily accept.', right: 'They are declining for this week.', tip: '委婉＝否定。', level: 2 },
  { part: 'Part 3', trap: '任務分工', ex: '一人改簡報、一人聯絡客戶。', wrong: 'Both do the same task.', right: 'They split slides and client contact.', tip: 'who does what。', level: 2 },
  { part: 'Part 3', trap: '預算上限', ex: '不得超過兩萬。', wrong: 'Spend as much as needed.', right: 'Stay under 20,000.', tip: '數字上限。', level: 2 },
  { part: 'Part 3', trap: '供應鏈延誤原因', ex: '海關抽檢。', wrong: 'The warehouse misplaced boxes only.', right: 'Customs inspection caused the delay.', tip: '聽 cause。', level: 2 },
  { part: 'Part 3', trap: '後續會議形式', ex: '改線上同步。', wrong: 'Meet in person only.', right: 'Hold a video call instead.', tip: '形式變更。', level: 2 },
  { part: 'Part 3', trap: '合約條款爭議', ex: '對自動續約有疑慮。', wrong: 'They ignore the contract.', right: 'They question the auto-renewal clause.', tip: '條款關鍵字。', level: 2 },
  { part: 'Part 3', trap: '客戶升級方案', ex: '從基本方案升到專業版。', wrong: 'Cancel the account.', right: 'Upgrade to the professional plan.', tip: 'upgrade／plan。', level: 2 },
  { part: 'Part 3', trap: '時間區混淆', ex: '對方在不同時區。', wrong: 'Meet at the same local clock time blindly.', right: 'Adjust for the time difference.', tip: '時差提醒。', level: 2 },
  { part: 'Part 3', trap: '緊急聯絡人', ex: '出差時找代理人。', wrong: 'No one covers the desk.', right: 'Contact the backup person.', tip: 'delegate／backup。', level: 2 },
  { part: 'Part 4', trap: '政策例外', ex: '一般禁止，急件可申請。', wrong: 'No exceptions ever.', right: 'Rush cases can request an exception.', tip: '例外條件。', level: 2 },
  { part: 'Part 4', trap: '分階段時程', ex: '第一期測試、第二期上線。', wrong: 'Everything launches today.', right: 'Pilot first, then full release.', tip: 'phase／pilot。', level: 2 },
  { part: 'Part 4', trap: '安全演習', ex: '週三消防演習。', wrong: 'A sales party.', right: 'A fire drill on Wednesday.', tip: 'drill／evacuation。', level: 2 },
  { part: 'Part 4', trap: '票務限制', ex: '不可退但可改期一次。', wrong: 'Fully refundable anytime.', right: 'Nonrefundable; one date change allowed.', tip: '限制條款。', level: 2 },
  { part: 'Part 4', trap: '維修影響範圍', ex: '僅東翼電梯停用。', wrong: 'The whole building is closed.', right: 'Only east-wing elevators are out.', tip: '範圍限定。', level: 2 },
  { part: 'Part 4', trap: '贊助商致詞', ex: '感謝主要贊助者。', wrong: 'No sponsors involved.', right: 'Acknowledge the main sponsor.', tip: 'opening thanks。', level: 2 },
  { part: 'Part 4', trap: '數據來源聲明', ex: '依內部調查。', wrong: 'Based on rumors.', right: 'According to an internal survey.', tip: 'according to。', level: 2 },
  { part: 'Part 4', trap: '報名截止', ex: '線上表單週五截止。', wrong: 'Register anytime next month.', right: 'Submit the form by Friday.', tip: 'deadline。', level: 2 },
  { part: 'Part 4', trap: '替代交通', ex: '地鐵維修改接駁巴士。', wrong: 'Service runs normally.', right: 'Use shuttle buses during metro work.', tip: 'replacement service。', level: 2 },
  { part: 'Part 4', trap: '產品召回', ex: '批次號碼召回。', wrong: 'All products are safe forever.', right: 'Return items from the affected batch.', tip: 'recall／batch。', level: 2 },
  { part: 'Part 4', trap: '環保規範', ex: '禁止拋棄式餐具。', wrong: 'Use more plastic.', right: 'Disposable utensils are not allowed.', tip: 'policy change。', level: 2 },
  { part: 'Part 4', trap: '獎項標準', ex: '依創新與影響力評選。', wrong: 'Random lottery only.', right: 'Judged on innovation and impact.', tip: 'criteria。', level: 2 },
  { part: 'Part 4', trap: '系統維護窗口', ex: '凌晨 2–4 點暫停服務。', wrong: 'Available 24/7 this weekend.', right: 'Downtime from 2 to 4 a.m.', tip: 'maintenance window。', level: 2 },
  { part: '口音', trap: '英式 flat', ex: 'looking for a flat', wrong: '尋找平整地面。', right: '找公寓（＝apartment）。', tip: '詞彙差異。', level: 2 },
  { part: '口音', trap: '澳式 arvo', ex: 'see you this arvo', wrong: '見一種動物。', right: '今天下午見。', tip: '口語縮寫。', level: 2 },
  { part: '口音', trap: '美式 elevator', ex: 'take the elevator', wrong: '英式一定用 lift 才對。', right: '美式電梯＝elevator。', tip: '同義可互通。', level: 2 },
  { part: '口音', trap: '連音弱讀', ex: 'could have → could’ve', wrong: '放棄整句。', right: '抓情態＋完成意。', tip: '弱讀仍表完成。', level: 2 },
  { part: '口音', trap: '重音改變詞性', ex: 'REcord vs reCORD', wrong: '詞性無關。', right: '名前動後重音。', tip: '聽重音辨詞性。', level: 2 },
  { part: '綜合', trap: '預讀選項反義', ex: '選項含 increase／decrease', wrong: '只聽第一個數字。', right: '對照升降動詞。', tip: '選項對立先標。', level: 2 },
  { part: '綜合', trap: '多題共用對話', ex: '三題一組資訊分散', wrong: '只聽開頭就答完。', right: '分段對應各題關鍵。', tip: '題號對時間軸。', level: 2 },
  { part: '綜合', trap: '圖表＋對話雙任務', ex: '邊聽邊對表', wrong: '先憑記憶填。', right: '預讀軸與圖例再聽。', tip: '雙通道處理。', level: 2 },
];

const L2_READING = [
  { part: 5, skill: '進階詞性', point: 'nearly／near 易混：nearly＝幾乎；near＝靠近。', q: 'The project is ____ finished; only the final audit remains.', choices: ['near', 'nearly', 'nearby', 'nearing'], ans: 'B', why: 'nearly finished＝幾乎完成。', level: 2 },
  { part: 5, skill: '進階詞性', point: 'considerable（形）vs considerably（副）。', q: 'Costs rose ____ after the new regulations took effect.', choices: ['considerable', 'considerably', 'consideration', 'consider'], ans: 'B', why: '修飾 rose 用副詞。', level: 2 },
  { part: 5, skill: '進階詞性', point: 'hard（副＝努力／困難）vs hardly（幾乎不）。', q: 'We could ____ hear the speaker at the back of the hall.', choices: ['hard', 'hardly', 'harder', 'hardness'], ans: 'B', why: 'hardly＝幾乎不。', level: 2 },
  { part: 5, skill: '連接詞', point: 'whereas 表對比，連接兩個子句。', q: 'Domestic sales grew, ____ exports remained flat.', choices: ['whereas', 'because', 'so that', 'unless'], ans: 'A', why: '對比用 whereas。', level: 2 },
  { part: 5, skill: '連接詞', point: 'provided that＝if。', q: 'You may telework ____ that your weekly goals are met.', choices: ['provided', 'despite', 'unless', 'during'], ans: 'A', why: 'provided that 表條件。', level: 2 },
  { part: 5, skill: '連接詞', point: 'in case 預防萬一；if 一般條件。', q: 'Bring a paper copy ____ the projector fails.', choices: ['in case', 'in spite of', 'because of', 'as if'], ans: 'A', why: '預防投影故障。', level: 2 },
  { part: 5, skill: '介系詞', point: 'consistent with。', q: 'The findings are consistent ____ last year’s survey.', choices: ['to', 'with', 'for', 'by'], ans: 'B', why: 'consistent with。', level: 2 },
  { part: 5, skill: '介系詞', point: 'capable of + V-ing。', q: 'The new line is capable ____ producing 500 units daily.', choices: ['to', 'of', 'for', 'in'], ans: 'B', why: 'capable of。', level: 2 },
  { part: 5, skill: '介系詞', point: 'on behalf of。', q: 'Ms. Wu signed the agreement ____ behalf of the board.', choices: ['in', 'on', 'at', 'for'], ans: 'B', why: 'on behalf of。', level: 2 },
  { part: 5, skill: '時態／語態', point: 'By the time + 過去，主句過去完成。', q: 'By the time the CEO arrived, the presentation ____.', choices: ['starts', 'had started', 'has started', 'will start'], ans: 'B', why: '過去完成 had started。', level: 2 },
  { part: 5, skill: '時態／語態', point: 'It is essential that + 原形（虛擬）。', q: 'It is essential that every visitor ____ a badge.', choices: ['wears', 'wear', 'wore', 'wearing'], ans: 'B', why: '虛擬語氣用原形 wear。', level: 2 },
  { part: 5, skill: '時態／語態', point: '被動完成：has been + p.p.', q: 'The prototype ____ thoroughly before shipment.', choices: ['has tested', 'has been tested', 'was testing', 'tests'], ans: 'B', why: '被動完成。', level: 2 },
  { part: 5, skill: '同義詞替換', point: 'compel ≈ force／require。', q: 'Safety rules compel workers to wear goggles. compel is closest to:', choices: ['force', 'forbid', 'allow', 'ignore'], ans: 'A', why: 'compel＝強制。', level: 2 },
  { part: 5, skill: '同義詞替換', point: 'unprecedented ≈ never seen before。', q: 'Demand reached an unprecedented level. closest meaning:', choices: ['record-breaking / never before', 'ordinary', 'declining', 'seasonal only'], ans: 'A', why: '前所未有。', level: 2 },
  { part: 5, skill: '數量／主詞一致', point: 'Neither A nor B 動詞靠近原則。', q: 'Neither the managers nor the director ____ available.', choices: ['are', 'is', 'were', 'be'], ans: 'B', why: '靠近 director 用 is。', level: 2 },
  { part: 6, skill: '文意連貫', point: '轉折後才是重點。', q: 'Sales looked strong in Q1. ____, returns surged in March and erased gains.', choices: ['However', 'Likewise', 'For example', 'In addition'], ans: 'A', why: '語意轉折。', level: 2 },
  { part: 6, skill: '文意連貫', point: '因果：as a result。', q: 'Suppliers raised prices. ____, we revised the retail list.', choices: ['As a result', 'Even though', 'In spite of', 'Whereas'], ans: 'A', why: '因果結果。', level: 2 },
  { part: 6, skill: '文意連貫', point: '舉例：for instance。', q: 'Some departments already hybridize. ____, Design works from home on Fridays.', choices: ['For instance', 'Nevertheless', 'Otherwise', 'Meanwhile only as contrast'], ans: 'A', why: '舉例。', level: 2 },
  { part: 6, skill: '指涉', point: 'this／these 指前文整件事。', q: 'Overtime spiked during launch week. ____ put pressure on the support desk.', choices: ['This', 'Those people without antecedent', 'Them', 'Such employees alone'], ans: 'A', why: 'This 指加班激增一事。', level: 2 },
  { part: 6, skill: '詞彙精準', point: 'allocate vs distribute 語境。', q: 'The CFO will ____ funds to R&D and marketing proportionally.', choices: ['allocate', 'accuse', 'abandon', 'admire'], ans: 'A', why: '分配預算 allocate。', level: 2 },
  { part: 6, skill: '語氣正式', point: '商務信：kindly／please。', q: '____ submit the signed NDA by Friday.', choices: ['Kindly', 'Wanna', 'Gonna', 'Kinda'], ans: 'A', why: '正式請求。', level: 2 },
  { part: 6, skill: '段落邏輯', point: '先問題後解決。', q: 'Best order: (1) describe outage (2) apologize (3) offer remedy', choices: ['1-2-3', '3-1-2', '2-3-1 only if no outage', 'Random'], ans: 'A', why: '客訴信標準順序。', level: 2 },
  { part: 6, skill: '連接副詞', point: 'meanwhile 同時。', q: 'Team A rebuilds the database; ____, Team B migrates archives.', choices: ['meanwhile', 'instead of', 'unless', 'despite'], ans: 'A', why: '同時進行。', level: 2 },
  { part: 6, skill: '省略與平行', point: 'not only A but also B 平行。', q: 'The update improves not only speed but also ____.', choices: ['security', 'secure', 'securely', 'securing'], ans: 'A', why: '與 speed 平行用名詞。', level: 2 },
  { part: 6, skill: '語氣轉折', point: 'admittedly… yet…', q: 'Admittedly the fee is high; ____ clients renew for support quality.', choices: ['yet', 'so that', 'because of', 'during'], ans: 'A', why: '讓步後轉折。', level: 2 },
  { part: 7, skill: '細節定位', point: '掃專有名詞與數字。', q: 'Memo: Training is in Room 12B at 9:30. Where?', choices: ['Room 12B', 'Room 21B', 'Lobby only', 'Online only'], ans: 'A', why: '原文 Room 12B。', level: 2 },
  { part: 7, skill: '細節定位', point: '注意例外小字。', q: 'Free shipping except oversized items. A sofa ships how?', choices: ['Possibly with a fee', 'Always free', 'Never ships', 'Only internationally free'], ans: 'A', why: 'oversized 例外。', level: 2 },
  { part: 7, skill: '推論', point: '言外之意。', q: '“We may revisit hiring in Q4 if revenue stabilizes.” Implication?', choices: ['Hiring now is unlikely', 'Hiring starts tomorrow', 'Revenue already stable', 'Company is closing'], ans: 'A', why: '條件未滿暫不聘。', level: 2 },
  { part: 7, skill: '推論', point: '作者態度。', q: 'Review: “Ambitious roadmap, yet execution risks remain.” Tone?', choices: ['Cautiously balanced', 'Fully enthusiastic', 'Hostile', 'Indifferent'], ans: 'A', why: '肯定但保留風險。', level: 2 },
  { part: 7, skill: '同義詞替換', point: 'remedy ≈ solution／fix。', q: 'The vendor proposed a remedy for the defect. closest:', choices: ['fix / solution', 'complaint', 'discount only', 'advertisement'], ans: 'A', why: '補救方案。', level: 2 },
  { part: 7, skill: '同義詞替換', point: 'forthcoming ≈ upcoming／willing to share。', q: 'Details will be forthcoming next week. closest here:', choices: ['coming soon', 'already deleted', 'confidential forever', 'incorrect'], ans: 'A', why: '即將公布。', level: 2 },
  { part: 7, skill: '雙篇對照', point: '找兩篇共同主題。', q: 'Email A schedules audit; Notice B lists document checklist. Shared purpose?', choices: ['Prepare for the audit', 'Cancel the audit', 'Hire auditors only', 'Unrelated parties'], ans: 'A', why: '皆為稽核準備。', level: 2 },
  { part: 7, skill: '雙篇對照', point: '找衝突資訊。', q: 'Flyer: doors open 10:00. App push: doors open 10:30. Conflict?', choices: ['Opening time', 'Venue city', 'Ticket price', 'No conflict'], ans: 'A', why: '開門時間不一致。', level: 2 },
  { part: 7, skill: '圖表題', point: '讀軸與單位。', q: 'Chart unit is thousands. Bar at 3 means?', choices: ['3,000', '3', '30', '300,000'], ans: 'A', why: '單位 thousands。', level: 2 },
  { part: 7, skill: '圖表題', point: '比較兩系列。', q: 'Product A above B in all months except June. When is B higher?', choices: ['June', 'Every month', 'Never', 'December only always'], ans: 'A', why: '僅六月例外。', level: 2 },
  { part: 7, skill: '主旨', point: '主旨≠細節。', q: 'Article covers remote-work policy changes company-wide. Main idea?', choices: ['Policy update for remote work', 'One employee’s commute', 'Cafeteria menu', 'Parking fees only'], ans: 'A', why: '全公司政策。', level: 2 },
  { part: 7, skill: '主旨', point: '廣告目的。', q: 'Ad highlights early-bird discount ending Sunday. Purpose?', choices: ['Drive quick registrations', 'Announce bankruptcy', 'Recruit lawyers only', 'Cancel the event'], ans: 'A', why: '促短期報名。', level: 2 },
  { part: 7, skill: '訊息對象', point: '誰該採取行動。', q: 'Memo to team leads: submit OT forms. Who acts?', choices: ['Team leads', 'Customers', 'Competitors', 'Visitors'], ans: 'A', why: '收件對象。', level: 2 },
  { part: 7, skill: '流程順序', point: '步驟題。', q: 'Steps: verify ID → pay fee → collect badge. What is second?', choices: ['Pay fee', 'Collect badge', 'Verify ID', 'Exit building'], ans: 'A', why: '第二步付費。', level: 2 },
  { part: 7, skill: '排除題', point: 'NOT／EXCEPT。', q: 'Benefits include gym, transit, and meals—EXCEPT?', choices: ['Unlimited stock options stated nowhere', 'Gym', 'Transit', 'Meals'], ans: 'A', why: '未列股票選擇權。', level: 2 },
  { part: 7, skill: '指涉人物', point: '代名詞回指。', q: 'Ms. Cho hired Mr. Lin; he will report to her. Who is supervisor?', choices: ['Ms. Cho', 'Mr. Lin', 'Unknown', 'Both equal'], ans: 'A', why: 'report to her＝Cho。', level: 2 },
  { part: 7, skill: '時間推算', point: 'deadline 前推。', q: 'Submit 48 hours before May 10 event. Latest submit day?', choices: ['May 8', 'May 10', 'May 12', 'May 9 evening after event'], ans: 'A', why: '活動前 48 小時。', level: 2 },
  { part: 7, skill: '語氣正式信', point: 'closing。', q: 'Best closing for complaint to vendor?', choices: ['We look forward to your prompt resolution.', 'Whatever.', 'Lol thanks', 'Bye forever'], ans: 'A', why: '正式結語。', level: 2 },
  { part: 7, skill: '多篇整合', point: '三篇找共同截止日。', q: 'A: due Mon; B: reminder Mon; C: portal closes Mon 5 p.m. Shared?', choices: ['Monday deadline', 'Wednesday only', 'No date', 'Friday'], ans: 'A', why: '皆指向週一。', level: 2 },
  { part: 5, skill: '進階詞性', point: 'late（遲）vs lately（近來）。', q: '____, customer complaints have declined.', choices: ['Late', 'Lately', 'Later', 'Latest'], ans: 'B', why: 'lately＝近來。', level: 2 },
  { part: 5, skill: '連接詞', point: 'lest＋原形（以免）。', q: 'Back up files lest the drive ____.', choices: ['fail', 'fails', 'failed', 'failing'], ans: 'A', why: 'lest 後常用原形。', level: 2 },
  { part: 5, skill: '介系詞', point: 'in accordance with。', q: 'Operate ____ accordance with safety codes.', choices: ['in', 'on', 'at', 'by'], ans: 'A', why: 'in accordance with。', level: 2 },
  { part: 5, skill: '時態／語態', point: '未來完成：will have + p.p.', q: 'By Friday we ____ the migration.', choices: ['will have completed', 'complete', 'completed', 'are complete'], ans: 'A', why: '未來完成。', level: 2 },
  { part: 6, skill: '文意連貫', point: 'on the contrary 相反。', q: 'Some feared losses. ____, profits rose.', choices: ['On the contrary', 'Similarly', 'In the meantime as same', 'For instance only'], ans: 'A', why: '相反結果。', level: 2 },
  { part: 6, skill: '詞彙精準', point: 'mitigate risk。', q: 'Insurance helps ____ financial risk.', choices: ['mitigate', 'magnify', 'ignore', 'invent'], ans: 'A', why: '降低風險。', level: 2 },
  { part: 7, skill: '細節定位', point: '附件提示。', q: 'See Attachment B for pricing. Where is pricing?', choices: ['Attachment B', 'Attachment A', 'Email body only', 'Not provided'], ans: 'A', why: '附件 B。', level: 2 },
  { part: 7, skill: '推論', point: '下一步最合理。', q: 'Invite says RSVP by mail. Reader should?', choices: ['Reply by the deadline', 'Ignore', 'Show up without notice only', 'Call a competitor'], ans: 'A', why: '依指示回覆。', level: 2 },
  { part: 7, skill: '雙篇對照', point: '因果跨篇。', q: 'News: bridge closed. Email: shuttle added. Relation?', choices: ['Shuttle responds to closure', 'Unrelated', 'Bridge rebuilt already', 'Email cancels news'], ans: 'A', why: '接駁因封閉。', level: 2 },
  { part: 7, skill: '同義詞替換', point: 'oversee ≈ supervise。', q: 'She will oversee the rollout. closest:', choices: ['supervise', 'oppose', 'delay', 'hide'], ans: 'A', why: '監督。', level: 2 },
  { part: 5, skill: '數量／主詞一致', point: 'The number of + 複數名詞 → 單數動詞。', q: 'The number of applicants ____ rising.', choices: ['is', 'are', 'were', 'have'], ans: 'A', why: 'the number 當主詞用 is。', level: 2 },
  { part: 5, skill: '同義詞替換', point: 'feasible ≈ possible／workable。', q: 'The timeline is not feasible. closest:', choices: ['workable / possible', 'decorative', 'mandatory', 'ancient'], ans: 'A', why: '可行的。', level: 2 },
  { part: 6, skill: '段落邏輯', point: '總→分。', q: 'Topic sentence states cost cuts; next sentences should?', choices: ['Give specific cut examples', 'Change to sports news', 'Repeat greeting', 'End abruptly without support'], ans: 'A', why: '細節支撐主旨。', level: 2 },
  { part: 7, skill: '排除題', point: 'which is NOT true。', q: 'Store open Mon–Sat 10–8; closed Sun. NOT true?', choices: ['Open Sunday 10–8', 'Open Saturday', 'Opens at 10', 'Closes at 8'], ans: 'A', why: '週日公休。', level: 2 },
  { part: 5, skill: '進階詞性', point: 'presently＝soon／currently（依語境）。', q: 'The CEO is ____ overseas and will return next week.', choices: ['presently', 'present', 'presence', 'presented'], ans: 'A', why: 'presently＝目前。', level: 2 },
  { part: 7, skill: '細節定位', point: '註腳條件。', q: 'Prices exclude tax unless noted. A $100 item usually means?', choices: ['Tax may be added', 'Tax always included', 'Free', 'Discount guaranteed'], ans: 'A', why: '未含稅另計。', level: 2 },
];

const L2_GRAMMAR = [
  { topic: '詞性', point: 'alike 作主詞補語；like 作介系詞。', q: 'The two proposals are ____ in structure.', choices: ['like', 'alike', 'likely', 'likeness'], ans: 'B', why: 'be alike。', level: 2 },
  { topic: '詞性', point: 'alone／lonely； lone 作形容詞置名詞前。', q: 'She was the ____ applicant with bilingual certification.', choices: ['alone', 'lonely', 'lone', 'loneliness'], ans: 'C', why: 'lone + 名詞。', level: 2 },
  { topic: '詞性', point: 'economic（經濟的）vs economical（節約的）。', q: 'Switching vendors was an ____ decision for the firm’s growth.', choices: ['economic', 'economical', 'economy', 'economically'], ans: 'A', why: '總體／商業經濟面用 economic。', level: 2 },
  { topic: '詞性', point: 'historic／historical。', q: 'The merger was a ____ moment for the industry.', choices: ['historic', 'historical', 'history', 'historically'], ans: 'A', why: '歷史性／重要時刻用 historic。', level: 2 },
  { topic: '介系詞', point: 'averse to。', q: 'The board is averse ____ taking on more debt.', choices: ['to', 'with', 'for', 'at'], ans: 'A', why: 'averse to。', level: 2 },
  { topic: '介系詞', point: 'prevail on／upon someone to V。', q: 'They prevailed ____ the supplier to extend credit.', choices: ['on', 'in', 'at', 'for'], ans: 'A', why: 'prevail on。', level: 2 },
  { topic: '介系詞', point: 'in lieu of＝instead of。', q: 'She received vouchers ____ lieu of a cash refund.', choices: ['in', 'on', 'at', 'by'], ans: 'A', why: 'in lieu of。', level: 2 },
  { topic: '介系詞', point: 'pertain to。', q: 'Please attach documents that pertain ____ the claim.', choices: ['to', 'with', 'for', 'on'], ans: 'A', why: 'pertain to。', level: 2 },
  { topic: '介系詞', point: 'on a par with。', q: 'Local wages are on a par ____ regional averages.', choices: ['with', 'to', 'for', 'by'], ans: 'A', why: 'on a par with。', level: 2 },
  { topic: '連接詞', point: 'inasmuch as。', q: 'The plan was revised ____ as market data shifted.', choices: ['inasmuch', 'despite', 'unless', 'during'], ans: 'A', why: 'inasmuch as＝因為／鑑於。', level: 2 },
  { topic: '連接詞', point: 'lest。', q: 'Label chemicals clearly lest accidents ____.', choices: ['occur', 'occurs', 'occurred', 'occurring'], ans: 'A', why: 'lest + 原形。', level: 2 },
  { topic: '連接詞', point: 'notwithstanding。', q: '____ the delay, the launch proceeded.', choices: ['Notwithstanding', 'Because', 'So that', 'If only'], ans: 'A', why: '儘管。', level: 2 },
  { topic: '假設語氣', point: 'If I were…（與現在事實相反）。', q: 'If I ____ the manager, I would approve flex hours.', choices: ['am', 'was', 'were', 'be'], ans: 'C', why: '虛擬用 were。', level: 2 },
  { topic: '假設語氣', point: 'wish + 過去完成（遺憾過去）。', q: 'I wish we ____ the contract earlier.', choices: ['signed', 'had signed', 'sign', 'have signed'], ans: 'B', why: 'wish 過去遺憾用 had signed。', level: 2 },
  { topic: '假設語氣', point: 'as if + 過去／過去完成。', q: 'He speaks as if he ____ the owner.', choices: ['is', 'were', 'was being', 'be'], ans: 'B', why: 'as if 虛擬 were。', level: 2 },
  { topic: '假設語氣', point: 'without／but for＋名詞＝if not for。', q: '____ your help, we would have missed the deadline.', choices: ['But for', 'Because', 'During', 'Unless'], ans: 'A', why: 'But for＝若非。', level: 2 },
  { topic: '假設語氣', point: 'It’s time + 過去式。', q: 'It’s time the committee ____ a decision.', choices: ['make', 'makes', 'made', 'making'], ans: 'C', why: 'It’s time + 過去式。', level: 2 },
  { topic: '關係代名詞', point: '介系詞＋which。', q: 'The warehouse ____ which goods are stored is climate-controlled.', choices: ['in', 'on', 'at', 'by'], ans: 'A', why: 'stored in the warehouse。', level: 2 },
  { topic: '關係代名詞', point: 'the extent to which。', q: 'We measured the extent ____ which costs fell.', choices: ['to', 'for', 'in', 'at'], ans: 'A', why: 'to which。', level: 2 },
  { topic: '關係代名詞', point: 'whose vs of which。', q: 'A firm ____ CEO resigned saw shares drop.', choices: ['whose', 'who', 'which', 'whom'], ans: 'A', why: 'whose CEO。', level: 2 },
  { topic: '關係代名詞', point: 'what＝the thing that。', q: '____ matters most is data integrity.', choices: ['What', 'Which', 'Who', 'Where'], ans: 'A', why: 'What matters。', level: 2 },
  { topic: '分詞構句', point: 'Having + p.p. 表先後。', q: '____ the audit, she submitted the report.', choices: ['Having completed', 'Have completed', 'Completed having', 'Completes'], ans: 'A', why: '完成後再提交。', level: 2 },
  { topic: '分詞構句', point: '分詞主詞一致。', q: 'Walking into the lobby, ____.', choices: ['visitors see the mural', 'the mural is seen by itself wrongly', 'a mural hangs alone as walker', 'security was'], ans: 'A', why: 'walking 主詞＝visitors。', level: 2 },
  { topic: '分詞構句', point: '被動分詞 Combined with…', q: '____ with new firmware, the device runs faster.', choices: ['Combined', 'Combining', 'Combine', 'Combines'], ans: 'A', why: '裝置被結合韌體。', level: 2 },
  { topic: '分詞形容詞', point: 'much／very 與過去分詞。', q: 'We were ____ encouraged by the pilot results.', choices: ['much', 'many', 'more of', 'most of them'], ans: 'A', why: 'much encouraged。', level: 2 },
  { topic: '代名詞', point: 'one…another；the other。', q: 'Keep one sample and send ____ to the lab.', choices: ['the other', 'others', 'another one of many unspecified', 'the others'], ans: 'A', why: '兩者之另一。', level: 2 },
  { topic: '代名詞', point: 'those who。', q: '____ who arrive early may collect badges first.', choices: ['Those', 'Them', 'These people of', 'That'], ans: 'A', why: 'Those who。', level: 2 },
  { topic: '代名詞', point: 'each other／one another。', q: 'Partner firms share leads with ____.', choices: ['each other', 'themselves only wrongly', 'it', 'one'], ans: 'A', why: '彼此。', level: 2 },
  { topic: '不定詞／動名詞', point: 'regret to V／V-ing。', q: 'We regret ____ you that the flight is canceled.', choices: ['to inform', 'informing', 'inform', 'informed'], ans: 'A', why: '遺憾要告知用 regret to inform。', level: 2 },
  { topic: '不定詞／動名詞', point: 'go on to V／V-ing。', q: 'After the intro she went on ____ the results.', choices: ['to present', 'presenting as continue same', 'present', 'presented'], ans: 'A', why: '接下去做另一事用 to V。', level: 2 },
  { topic: '不定詞／動名詞', point: 'mean to V／V-ing。', q: 'Missing the call meant ____ the deal.', choices: ['losing', 'to lose as intention only', 'lose', 'lost'], ans: 'A', why: '意味著→ mean V-ing。', level: 2 },
  { topic: '不定詞／動名詞', point: 'need + V-ing（被動意味）。', q: 'The filters need ____.', choices: ['replacing', 'replace', 'to replacing', 'replaced by need wrongly'], ans: 'A', why: 'need replacing＝需要被換。', level: 2 },
  { topic: '比較', point: 'superior to（不用 than）。', q: 'This model is superior ____ the previous one.', choices: ['to', 'than', 'for', 'with'], ans: 'A', why: 'superior to。', level: 2 },
  { topic: '比較', point: 'the + 比較級… the + 比較級。', q: 'The sooner we ship, ____.', choices: ['the better', 'better', 'best', 'the best than'], ans: 'A', why: 'the sooner… the better。', level: 2 },
  { topic: '比較', point: 'no sooner… than。', q: 'No sooner had we arrived ____ the power failed.', choices: ['than', 'when as only', 'that', 'then'], ans: 'A', why: 'no sooner… than。', level: 2 },
  { topic: '比較', point: 'prefer A to B。', q: 'Clients prefer online demos ____ onsite visits.', choices: ['to', 'than', 'for', 'more'], ans: 'A', why: 'prefer A to B。', level: 2 },
  { topic: '時態', point: '現在完成進行。', q: 'Engineers ____ the bug since Monday.', choices: ['have been tracking', 'track', 'are track', 'had track'], ans: 'A', why: '持續到現在。', level: 2 },
  { topic: '時態', point: '過去完成進行。', q: 'They ____ for hours when the fix arrived.', choices: ['had been waiting', 'wait', 'are waiting', 'have wait'], ans: 'A', why: '過去完成進行。', level: 2 },
  { topic: '語態', point: '使役 get + O + p.p.', q: 'We got the brochure ____ overnight.', choices: ['printed', 'print', 'printing', 'to print as only'], ans: 'A', why: 'get O p.p.。', level: 2 },
  { topic: '語態', point: 'have + O + p.p.', q: 'They had the servers ____ before launch.', choices: ['upgraded', 'upgrade', 'upgrading', 'to upgrade only'], ans: 'A', why: 'have O p.p.。', level: 2 },
  { topic: '主詞一致', point: 'along with 不影響動詞。', q: 'The director, along with aides, ____ arriving today.', choices: ['is', 'are', 'were', 'have'], ans: 'A', why: '主詞 director。', level: 2 },
  { topic: '主詞一致', point: 'a series of + 複數 → 單數動詞。', q: 'A series of tests ____ scheduled.', choices: ['is', 'are', 'were being many', 'have'], ans: 'A', why: 'a series 單數。', level: 2 },
  { topic: '倒裝', point: 'Only after… 倒裝。', q: 'Only after the audit ____ we restart shipping.', choices: ['do', 'did', 'we do wrongly mid', 'done'], ans: 'A', why: 'Only after 助動詞倒裝 do we…（現在）或依時態；此處用 do。', level: 2 },
  { topic: '倒裝', point: 'Not until… 倒裝。', q: 'Not until Friday ____ the results released.', choices: ['were', 'the results were wrongly', 'was results', 'are'], ans: 'A', why: 'Not until 倒裝 were the results…', level: 2 },
  { topic: '易混字', point: 'affect／effect。', q: 'How will the tariff ____ margins?', choices: ['affect', 'effect', 'affection', 'effective'], ans: 'A', why: '動詞影響用 affect。', level: 2 },
  { topic: '易混字', point: 'principal／principle。', q: 'Repayment of ____ begins next month.', choices: ['principal', 'principle', 'principally', 'prince'], ans: 'A', why: '本金 principal。', level: 2 },
  { topic: '易混字', point: 'complement／compliment。', q: 'The new UI is a perfect ____ to the brand.', choices: ['complement', 'compliment', 'complementary only adj', 'comply'], ans: 'A', why: '互補 complement。', level: 2 },
  { topic: '易混字', point: 'ensure／insure／assure。', q: 'Please ____ that backups run nightly.', choices: ['ensure', 'insure', 'assure me as object missing', 'sure'], ans: 'A', why: '確保 ensure。', level: 2 },
  { topic: '易混字', point: 'imply／infer。', q: 'From the memo we can ____ budget cuts are likely.', choices: ['infer', 'imply', 'import', 'inspire'], ans: 'A', why: '讀者推論 infer。', level: 2 },
  { topic: '進階結構', point: 'so… as to V。', q: 'Demand rose so sharply as ____ overtime.', choices: ['to require', 'requiring', 'require', 'required'], ans: 'A', why: 'so… as to V。', level: 2 },
  { topic: '進階結構', point: 'too… to V。', q: 'The file is too large ____ by email.', choices: ['to send', 'sending', 'send', 'sent'], ans: 'A', why: 'too… to V。', level: 2 },
  { topic: '進階結構', point: 'enough to V。', q: 'The sample is large enough ____ statistical tests.', choices: ['to run', 'running', 'run', 'ran'], ans: 'A', why: 'enough to V。', level: 2 },
  { topic: '進階結構', point: 'would rather + 原形。', q: 'I’d rather ____ the onsite option.', choices: ['keep', 'keeping', 'kept', 'to keep'], ans: 'A', why: 'would rather + 原形。', level: 2 },
  { topic: '進階結構', point: 'would sooner… than…', q: 'I’d sooner delay ____ ship defective units.', choices: ['than', 'then', 'to', 'that'], ans: 'A', why: 'sooner… than。', level: 2 },
  { topic: '詞性', point: 'respective／respectively。', q: 'Teams A and B handle design and QA, ____.', choices: ['respectively', 'respective', 'respect', 'respectful'], ans: 'A', why: '分別地 respectively。', level: 2 },
  { topic: '介系詞', point: 'in compliance with。', q: 'Operate ____ compliance with export laws.', choices: ['in', 'on', 'at', 'by'], ans: 'A', why: 'in compliance with。', level: 2 },
  { topic: '假設語氣', point: 'If it were not for…', q: 'If it were not for overtime, we ____ the launch.', choices: ['would have missed', 'miss', 'missed', 'have miss'], ans: 'A', why: '與過去事實相反。', level: 2 },
  { topic: '關係代名詞', point: 'whereby。', q: 'They signed a pact ____ profits are shared equally.', choices: ['whereby', 'where', 'which', 'who'], ans: 'A', why: 'whereby＝藉此。', level: 2 },
  { topic: '分詞構句', point: 'With + O + p.p./V-ing。', q: 'With the servers ____, users saw errors.', choices: ['down', 'downed wrongly verb', 'are down mid clause', 'be down'], ans: 'A', why: 'with + O + 形容／狀態。', level: 2 },
  { topic: '比較', point: 'second to none。', q: 'Their support is second ____ none.', choices: ['to', 'than', 'for', 'with'], ans: 'A', why: 'second to none。', level: 2 },
];

function stripListeningFromTools() {
  const p = path.join(root, 'assets/js/toeic-tools.js');
  let tools = fs.readFileSync(p, 'utf8');
  const start = tools.indexOf('  /** 60 listening trap flashcards */');
  const end = tools.indexOf('  const mounts = {');
  if (start < 0 || end < 0) {
    console.log('LISTENING_TRAPS already removed or missing');
    return;
  }
  tools = tools.slice(0, start) + tools.slice(end);
  fs.writeFileSync(p, tools);
  console.log('stripped LISTENING_TRAPS from toeic-tools.js');
}

function main() {
  const trapsRaw = loadListeningTrapsFromTools();
  const listeningItems = trapsRaw.map((t, i) => ({
    id: i + 1,
    part: t.part,
    trap: t.trap,
    ex: t.ex,
    wrong: t.wrong,
    right: t.right,
    tip: t.tip,
    level: 1,
  }));
  let nextId = listeningItems.length + 1;
  for (const t of L2_LISTENING) {
    listeningItems.push({ id: nextId++, ...t, level: 2 });
  }
  writeJsGlobal('assets/js/toeic-listening-data.js', 'WA_TOEIC_LISTENING', {
    focus: 'Parts 1–4 陷阱速記：Level 1 基礎高頻、Level 2 金色證書進階。',
    items: listeningItems,
  });
  console.log('listening', listeningItems.filter((x) => x.level === 1).length, '+', listeningItems.filter((x) => x.level === 2).length);

  const reading = loadGlobalAssign('assets/js/toeic-reading-data.js', 'WA_TOEIC_READING');
  reading.focus =
    'Parts 5–7：填空語感、段落邏輯、單雙篇定位。Level 1 基礎高頻、Level 2 金色證書進階。';
  reading.items = reading.items.map((it) => ({ ...it, level: it.level === 2 ? 2 : 1 }));
  let rid = Math.max(...reading.items.map((x) => x.id)) + 1;
  for (const it of L2_READING) {
    reading.items.push({ ...it, id: rid++, level: 2 });
  }
  writeJsGlobal('assets/js/toeic-reading-data.js', 'WA_TOEIC_READING', reading);
  console.log('reading', reading.items.filter((x) => x.level === 1).length, '+', reading.items.filter((x) => x.level === 2).length);

  const grammar = loadGlobalAssign('assets/js/toeic-grammar-data.js', 'WA_TOEIC_GRAMMAR');
  grammar.focus =
    '鎖定 Part 5／6 常考：詞性、介系詞／連接詞、分詞等。Level 1 基礎高頻、Level 2 金色證書進階。';
  grammar.items = grammar.items.map((it) => ({ ...it, level: it.level === 2 ? 2 : 1 }));
  let gid = Math.max(...grammar.items.map((x) => x.id)) + 1;
  for (const it of L2_GRAMMAR) {
    grammar.items.push({ ...it, id: gid++, level: 2 });
  }
  writeJsGlobal('assets/js/toeic-grammar-data.js', 'WA_TOEIC_GRAMMAR', grammar);
  console.log('grammar', grammar.items.filter((x) => x.level === 1).length, '+', grammar.items.filter((x) => x.level === 2).length);

  stripListeningFromTools();
}

main();
