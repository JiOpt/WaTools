var moonglk=new Array('孟春','仲春','季春','孟夏','仲夏','季夏','孟秋','仲秋','季秋','孟冬','仲冬','季冬');
var dayglk = new Array('寅','卯','巳','午','巳','午','申','酉','亥','子');
var Kou = new Array(3);
var Sek = new Array(3);
var hour,min;
var nlm = new Array('寅','卯','辰','巳','午','未','申','酉','戌','亥','子','丑');
var Sukuyou = new Array('東方','東方','東方','東方','東方','東方','東方','北方','北方','北方','北方','北方','北方','北方','西方','西方','西方','西方','西方','西方','西方','南方','南方','南方','南方','南方','南方','南方'); 
var Sukuyou2 = new Array('角木蛟-吉','亢金龍-凶','氐土貉-凶','房日兔-吉','心月狐-凶','尾火虎-吉','箕水豹-吉','斗木獬-吉','牛金牛-凶','女土蝠-凶','虛日鼠-凶','危月燕-凶','室火豬-吉','壁水貐-吉','奎木狼-凶','婁金狗-吉','胃土雉-吉','昴日雞-凶','畢月烏-吉','觜火猴-凶','參水猿-凶','井木犴-吉','鬼金羊-凶','柳土獐-凶','星日馬-凶','張月鹿-吉','翼火蛇-凶','軫水蚓-吉'); 
var Sukuyou4 = new Array('角','亢','氐','房','心','尾','箕','斗','牛','女','虛','危','室','壁','奎','婁','胃','昴','畢','觜','參','井','鬼','柳','星','張','翼','軫'); 
var KyuuseiJD = new Array(2404030,2404600,2404810,2408800,2409010,2413000,2413210,2417200,2417410,2421220,2421400,2421610,2425420,2425630,2429620,2429800,2430010,2433820,2434030,2438020,2438230,2442220,2442430,2446420,2446630,2450620,2450830,2454820,2455030,2458840,2459020,2459230,2463250,2467240,2467420,2467630,2471440,2471650,2475640,2475850,2477650); 
var KyuuseiJDF= new Array(1,-3,1,7,-9,-3,1,7,-9,7,-3,1,-3,1,7,-3,1,-3,1,7,-9,-3,1,7,-9,-3,1,7,-9,7,-3,1,1,7,-3,1,-3,1,7,-9,-9); 
var KyuuseiName = new Array('一白','二黑','三碧','四綠','五黃','六白','七赤','八白','九紫'); 
var KyuuseiName2= new Array('-太乙星(水)-吉神','-攝提星(土)-凶神','-軒轅星(木)-安神','-招搖星(木)-安神','-天符星(土)-凶神','-青龍星(金)-吉神','-咸池星(金)-凶神','-太陰星(土)-吉神','-天乙星(火)-吉神'); 
var NKyuusei = new Array(-1,-1,-1);
var Rokuyou = new Array("<font color=#804000>先勝</font>","<font color=#804000>友引</font>","<font color=#804000>先負</font>","<FONT color=#0000A0>佛滅</font>","<FONT color=#FF8C1A>大安</font>","<font color=#804000>赤口</font>");
var NongliData=new Array("19416","19168","42352","21717","53856","55632","21844","22191","39632","21970","19168","42422","42192","53840","53909","46415","54944","44450","38320","18807","18815","42160","46261","27216","27968","43860","11119","38256","21234","18800","25958","54432","59984","27285","23263","11104","34531","37615","51415","51551","54432","55462","46431","22176","42420","9695","37584","53938","43344","46423","27808","46416","21333","19887","42416","17779","21183","43432","59728","27296","44710","43856","19296","43748","42352","21088","62051","55632","23383","22176","38608","19925","19152","42192","54484","53840","54616","46400","46752","38310","38335","18864","43380","42160","45690","27216","27968","44870","43872","38256","19189","18800","25776","29859","59984","27480","23232","43872","38613","37600","51552","55636","54432","55888","30034","22176","43959","9680","37584","51893","43344","46240","47780","44368","21977","19360","42416","20854","21183","43312","31060","27296","44368","23378","19296","42726","42208","53856","60005","54576","23200","30371","38608","19195","19152","42192","53430","53855","54560","56645","46496","22224","21938","18864","42359","42160","43600","45653","27951","44448","19299","37759","18936","18800","25776","26790","59999","27424","42692","43759","37600","53987","51552","54615","54432","55888","23893","22176","42704","21972","21200","43448","43344","46240","46758","44368","21920","43940","42416","21168","45683","26928","29495","27296","44368","19285","19311","42352","21732","53856","59752","54560","55968","27302","22239","19168","43476","42192","53584","62034","54560"); 
var solarMonth=new Array(31,28,31,30,31,30,31,31,30,31,30,31); 
var Gan=new Array("甲","乙","丙","丁","戊","己","庚","辛","壬","癸"); 
var Gan5=new Array("戊","己","庚","辛","壬","癸","甲","乙","丙","丁"); 
var sfw=new Array("南","東","北","西","南","東","北","西","南","東","北","西"); 
var Zhi=new Array("子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"); 
var Zhi3=new Array("午","未","申","酉","戌","亥","子","丑","寅","卯","辰","巳"); 
AnimalIdx=["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"]; 
AnimalIdx2=["馬","羊","猴","雞","狗","豬","鼠","牛","虎","兔","龍","蛇"]; 
var Gan3=new Array("甲子 乙丑 丙寅 丁卯 戊辰 己巳 庚午 辛未 壬申 癸酉 甲戌 乙亥","丙子 丁丑 戊寅 己卯 庚辰 辛巳 壬午 癸未 甲申 乙酉 丙戌 丁亥","戊子 己丑 庚寅 辛卯 壬辰 癸巳 甲午 乙未 丙申 丁酉 戊戌 己亥","庚子 辛丑 壬寅 癸卯 甲辰 乙巳 丙午 丁未 戊申 己酉 庚戌 辛亥","壬子 癸丑 甲寅 乙卯 丙辰 丁巳 戊午 己未 庚申 辛酉 壬戌 癸亥","甲子 乙丑 丙寅 丁卯 戊辰 己巳 庚午 辛未 壬申 癸酉 甲戌 乙亥","丙子 丁丑 戊寅 己卯 庚辰 辛巳 壬午 癸未 甲申 乙酉 丙戌 丁亥","戊子 己丑 庚寅 辛卯 壬辰 癸巳 甲午 乙未 丙申 丁酉 戊戌 己亥","庚子 辛丑 壬寅 癸卯 甲辰 乙巳 丙午 丁未 戊申 己酉 庚戌 辛亥","壬子 癸丑 甲寅 乙卯 丙辰 丁巳 戊午 己未 庚申 辛酉 壬戌 癸亥"); 
var Gan2=new Array('甲不開倉','乙不栽植','丙不修灶','丁不剃頭','戊不受田','己不破券','庚不經絡','辛不合醬','壬不泱水','癸不詞訟');
var Gan4=new Array("<font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font>","<FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font>","<font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font>","<FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font>","<FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font>","<FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font>","<font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font>","<FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font>","<font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font>","<FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font>","<FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font> <FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font>","<FONT color=#0000A0>白虎</font> <font color=#FF8C1A>玉堂</font> <FONT color=#0000A0>天牢</font> <FONT color=#0000A0>玄武</font> <FONT color=#FF8C1A>司命</font> <FONT color=#0000A0>勾陳</font> <font color=#FF8C1A>青龍</font> <font color=#FF8C1A>明堂</font> <FONT color=#0000A0>天刑</font> <FONT color=#0000A0>朱雀</font> <font color=#FF8C1A>金匱</font> <font color=#FF8C1A>天德</font>");
var jcName0 = new Array('建','除','滿','平','定','執','破','危','成','收','開','閉'); 
var jcName1 = new Array('閉','建','除','滿','平','定','執','破','危','成','收','開'); 
var jcName2 = new Array('開','閉','建','除','滿','平','定','執','破','危','成','收'); 
var jcName3 = new Array('收','開','閉','建','除','滿','平','定','執','破','危','成'); 
var jcName4 = new Array('成','收','開','閉','建','除','滿','平','定','執','破','危'); 
var jcName5 = new Array('危','成','收','開','閉','建','除','滿','平','定','執','破'); 
var jcName6 = new Array('破','危','成','收','開','閉','建','除','滿','平','定','執'); 
var jcName7 = new Array('執','破','危','成','收','開','閉','建','除','滿','平','定'); 
var jcName8 = new Array('定','執','破','危','成','收','開','閉','建','除','滿','平'); 
var jcName9 = new Array('平','定','執','破','危','成','收','開','閉','建','除','滿'); 
var jcName10 = new Array('滿','平','定','執','破','危','成','收','開','閉','建','除'); 
var jcName11 = new Array('除','滿','平','定','執','破','危','成','收','開','閉','建');
var Zhi2=new Array('子不問卜','丑不冠帶','寅不祭祀','卯不穿井','辰不哭泣','巳不遠行','午不苫蓋','未不服藥','申不安床','酉不會客','戌不吃犬','亥不嫁娶');
var Animals=new Array("<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖鼠]個性：富幽默感及敏銳的觀察力，行事積極，對工作或異性設想周到且細膩，其創見常令人激賞，具敏銳的觀察力。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：年幼時,勞碌奔波中越能發揮其靈敏的智能與耐性;在寬裕的環境中生長,沒有失業煩惱,然易見異思遷換工作,中年遇失敗後,會一切順利,尤其能享受晚年財運,須注意罹患腎臟系統疾病。') href='#' style='color:#000'>鼠",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖牛]個性：富幽默感及敏銳的觀察力，行事積極，對工作或異性設想周到且細膩，其創見常令人激賞，具敏銳的觀察力。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：年輕時，在變化多端的環境中，度過操勞的日子，但有堅忍的獨立性，年輕時，會為自己的前途散佈辛勞的根源。進入中年期，會分為成功大道與沈沒於逆境兩條路。到四十五、六歲有第二個開拓良好機運的機會，如能抑制唯我獨尊的性情，到晚年便能平安。') href='#' style='color:#000'>牛",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖虎]個性：意志堅強且活躍，為領導人物，但因這些性格遇到困難會受打擊而身敗名裂。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：膽大，做事果決，年輕時就會出人頭地，中年時若能把握年輕時機運則會成功，若不能把握機運，則會在人際關係中衰敗下來，不再成功。寅年出生的人，擔任公教人員為宜，且要自愛，不要有貪念與爭功的歪念。注意呼吸系統，消化系統的疾病。') href='#' style='color:#000'>虎",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖兔]個性：做事從容且具幽默感，為受歡迎的社交家。然而，卻有急性及見異思遷的缺點.','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：不管任何場合，都能受上司賞識。中年時若投機會埋滅一生，切注意要踏實做事，才能安穩生活。') href='#' style='color:#000'>兔",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖龍]個性：明朗、活躍的社交家，對事情容易發生興趣，其缺點是容易熱衷也易失去興趣。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：大部分與親人之感情為薄，然在社會上卻受歡迎。早年就能發揮潛力，進入中年期需注意無謂的野心，恐怕會身敗名裂。若能克服野心，按部就班地照計劃完成各項事情，必有最佳回報。最適合的職業為從事教育工作，須注意循環系統的疾病。') href='#' style='color:#000'>龍",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖蛇]個性：大部分有自我主張，不容易為外人左右。另外，會盲目信賴他人，也是疑心重的人。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：年輕時，生活在溫暖的環境，長大後較懶，所以常換工作，對異性不能專情。中年時，應收斂惰性，立定志向，奮發努力。適宜從事刺激性的工作。') href='#' style='color:#000'>蛇",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖馬]個性：大部分頭腦轉得快，行動輕敏，有開朗的個性，尊重師長，雙親，性情活潑但又不乏沉穩。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：是標準的行動派，訂立了目標，便努力邁進，年輕時就會露頭角，中年若能維持不變，養成耐性才能有所成就，適宜在藝術，教育職位方面求發展。注意心臟系統的疾病。') href='#' style='color:#000'>馬",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖羊]個性：大部分為深思熟慮，研究心強。因此，有神經質且膽怯，做事拖泥帶水。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：雖然年輕時生活安穩，但恐十年代時，會患大疾。中年時是大展鴻圖的好機會，因研究心強，若努力研究，能獲高的地位，也能致富。特別注意消化器系統的疾病。') href='#' style='color:#000'>羊",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖猴]個性：才華洋溢，富辯才，進取心強，待人親切，富同情心。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：有靈敏的心思，有待人的素養，年少即受人注目，口才靈巧，反應快，年輕時便得好職位。但因有機心，恐會失去良好地位，特別注意一點，較適宜從事推銷工作。注意關節方面的疾病。') href='#' style='color:#000'>猴",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖雞]個性：大部分為規規矩矩且熱心工作，並注重穿著，廣交朋友。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：年輕時，不願受束縛，喜歡過自由自在的生活方式，因此在工作上無法定心，常換工作，三十歲以後，才會稍微收心。四十至五十歲為黃金時代，應把握時機，好好發揮才能。從事業務方面工作較合適，注意由偏食引起的疾病.') href='#' style='color:#000'>雞",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖狗]個性：大都分盡責且保守。因此，較固執，不易接受他人的意見.','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：雖然能夠成為團體中的幹部，然而，常為了工作上的問題，與上司爭議，而丟棄辛苦得來的工作.') href='#' style='color:#000'>狗",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'[肖豬]個性：大部分為堅定意志者，有愛心及人情味，然而做事有時缺乏考慮。','1','&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;特徵：年輕時，對家庭不滿，但心裡卻仍敬愛雙親，性格誠實，自視甚高，常吃虧。亥年出生的晚年都很幸福，中年以後能慢慢發揮才能。需注意呼吸及消化系統的疾病。') href='#' style='color:#000'>豬");
var solarTerm = new Array("小寒","大寒","立春","雨水","驚蟄","春分","清明","谷雨","立夏","小滿","芒種","夏至","小暑","大暑","立秋","處暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至[冬節]"); 
var mla = new Array(481267.8809,218.3162,6.2888,1.2740,0.6583,0.2136,0.1851,0.1144,0.0588,0.0571,0.0533,0.0458,0.0409,0.0347,0.0304,0.0154,0.0125,0.0110,0.0107,0.0100,0.0085,0.0079,0.0068,0.0052,0.0050,0.0040,0.0040,0.0040,0.0038,0.0037,0.0028,0.0027,0.0026,0.0024,0.0023,0.0022,0.0021,0.0021,0.0021,0.0018,0.0016,0.0012,0.0011,0.0009,0.0008,0.0007,0.0007,0.0007,0.0007,0.0006,0.0006,0.0005,0.0005,0.0005,0.0004,0.0004,0.0003,0.0003,0.0003,0.0003,0.0003,0.0003,0.0003);
var mlb = new Array(0,0,477198.868,413335.35,890534.22,954397.74,35999.05,966404,63863.5,377336.3,1367733.1,854535.2,441199.8,445267.1,513197.9,75870,1443603,489205,1303870,1431597,826671,449334,926533,31932,481266,1331734,1844932,133,1781068,541062,1934,918399,1379739,99863,922466,818536,990397,71998,341337,401329,1856938,1267871,1920802,858602,1403732,790672,405201,485333,27864,111869,2258267,1908795,1745069,509131,39871,12006,958465,381404,349472,1808933,549197,4067,2322131);
var mlc = new Array(0,0,44.963,10.74,145.7,179.93,87.53,276.5,124.2,13.2,280.7,148.2,47.4,27.9,222.5,41,52,142,246,315,111,188,323,107,205,283,56,29,21,259,145,182,17,122,163,151,357,85,16,274,152,249,186,129,98,114,50,186,127,38,156,90,24,242,223,187,340,354,337,58,220,70,191);
var maa = new Array(5.1281,0.2806,0.2777,0.1733,0.0554,0.0463,0.0326,0.0172,0.0093,0.0088,0.0082,0.0043,0.0042,0.0034,0.0025,0.0022,0.0022,0.0021,0.0019,0.0018,0.0018,0.0018,0.0015,0.0015,0.0015,0.0014,0.0013,0.0013,0.0011,0.0010,0.0009,0.0008,0.0007,0.0006,0.0006,0.0005,0.0005,0.0005,0.0004,0.0004,0.0003,0.0003,0.0003,0.0003,0.0003);
var mab = new Array(483202.019,960400.89,6003.15,407332.2,896537.4,69866.7,1373736.2,1437599.8,884531,471196,371333,547066,1850935,443331,860538,481268,1337737,105866,924402,820668,519201,1449606,42002,928469,996400,29996,447203,37935,1914799,1297866,1787072,972407,1309873,559072,1361730,848352,419339,948395,2328134,1024264,932536,1409735,2264270,1814936,335334);
var mac = new Array(3.273,138.24,48.31,52.43,104,82.5,239,273.2,187,87,55,217,14,230,106,308,241,80,141,153,181,10,46,121,316,129,6,65,48,288,340,235,205,134,322,190,149,222,149,352,282,57,115,16,57);
var mha = new Array(0.950725,0.051820,0.009530,0.007842,0.002824,0.000858,0.000531,0.000400,0.000319,0.000271,0.000263,0.000197,0.000173,0.000167,0.000111,0.000103,0.000084,0.000083,0.000078,0.000073,0.000064,0.000063,0.000041,0.000034,0.000033,0.000031,0.000030,0.000029,0.000026,0.000023,0.000019,0.000013,0.000013,0.000013,0.000012,0.000011,0.000011,0.000010,0.000009,0.000007,0.000007,0.000006,0.000006,0.000005);
var mhb = new Array(0,477198.868,413335.35,890534.22,954397.74,1367733.1,854535.2,377336.3,441199.8,445267,513198,489205,1431597,1303870,35999,826671,63864,926533,1844932,1781068,1331734,449334,481266,918399,541062,922466,75870,990397,818536,553069,1267871,1403732,341337,2258267,2258267,1908795,858602,1745069,790672,2322131,1808933,485333,99863,405201);
var mhc = new Array(0,134.963,100.74,235.7,269.93,10.7,238.2,103.2,137.4,118,312,232,45,336,178,201,214,53,146,111,13,278,295,272,349,253,131,87,241,266,339,188,106,246,246,180,219,114,204,281,148,276,212,140);
var sTermInfo = new Array(0,21208,42467,63836,85337,107014,128867,150921,173149,195551,218072,240693,263343,285989,308563,331033,353350,375494,397447,419210,440795,462224,483532,504758); 
var nStr1 = new Array('日','一','二','三','四','五','六','七','八','九','十'); 
var nStr2 = new Array('初','十','廿','卅','　');
var monthName = new Array("<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'12月22日-1月20日','-1','★山羊座(摩羯座)★\\n　　優點：做事腳踏實地，意志力強，有家庭觀念，對人謙遜，處處謹慎....&nbsp;。\\n　　缺點：固執,不夠樂觀,個人利己主義,缺乏浪漫情趣,太專注於個人的目標。\\n1月22日-2月21日　★水瓶座★　請看下月...') href=''>JAN",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'1月22日-2月21日','-1','★水瓶座★\\n　　優點：崇尚自由，興趣廣泛，創意十足，有理性的智慧，感情忠實。\\n　　缺點：缺乏熱情，過於強調生活的自主權，太過理智情趣不足，多管閒事。\\n2月22日-3月21日　★雙魚座★　　請看下月...') href=''>FEB",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'2月22日-3月21日','-1','★雙魚座★\\n　　優點：感情豐富，心地仁慈，捨己為人，不自私，懂得包容，溫和且浪漫。\\n　　缺點：不夠實際，太情緒化，多愁善感，不善理財，感情用事。\\n3月22日-4月20日　★白羊座★　請看下月...') href=''>MAR",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'3月22日-4月20日','-1','★白羊座★\\n　　優點：做事積極，熱情有活力，有明快的決斷力，坦白率真，重情講義氣。\\n　　缺點：自我中心太強，粗心大意，容易腦羞成怒，缺乏時間觀念缺乏耐性。\\n4月21日-5月21日　★金牛座★　請看下月...') href=''>APR",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'4月21日-5月21日','-1','★金牛座★\\n　　優點：耐性十足，腳踏實地，一往情深，有藝術天份，做事有計劃有規律。\\n　　缺點：佔有慾太強，善妒，缺乏幽默感，不知變通，缺乏求新求變的勇氣。\\n5月22日-6月21日　★雙子座★　請看下月...') href=''>MAY",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'5月22日-6月21日','-1','★雙子座★\\n　　優點：有高人一等的幽默感，有天生的語言才華，反應較快，學習能力強。\\n　　缺點：付出少卻要得多，喜歡批評別人而不檢討自己，做任何事都欠耐心。\\n6月22日-7月21日　★巨蟹座★　請看下月...') href=''>JUN",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'6月22日-7月21日','-1','★巨蟹座★\\n　　優點：情感真摯深切，想像力豐富，念舊重情，懂得體貼關懷，善解人意。\\n　　缺點：提不起放不下，說話拐彎抹角，不直接，不知適可而止，缺乏理性。\\n7月22日-8月21日　★獅子座★　請看下月...') href=''>JUL",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'7月22日-8月21日','-1','★獅子座★\\n　　優點：一言九鼎有信用，樂觀，心胸寬大，懂得寬恕具有激勵人心的氣質。\\n　　缺點：死愛面子活受罪，缺乏節儉的美德，剛愎自用，自以為是缺乏耐性。\\n8月22日-9月21日　★處女座★　請看下月...') href=''>AUG",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'8月22日-9月21日','-1','★處女座★\\n　　優點：追求完美謙遜不誇大，有精確的觀察力，對愛情忠實守本份有耐性。\\n　　缺點：太過吹毛求疵，有潔癖頃向，不夠浪漫不尊重他人的夢想，欠遠見。\\n9月22日-10月21日　★天秤座★　請看下月...') href=''>SEP",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'9月22日-10月21日','-1','★天秤座★\\n　　優點：公平客觀，天生的優雅風采，浪漫的戀愛高手，能屈能伸適應力強。\\n　　缺點：優柔寡斷，猶豫不決，總是自願其說，藉囗太多，愛享受好逸惡勞。\\n10月22日-11月21日　★天蠍座★　請看下月...') href=''>OCT",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'10月22日-11月21日','-1','★天蠍座★\\n　　優點：對朋友講義氣，天生的性感魅力，對人生有潛在的熱情，恩怨分明。\\n　　缺點：佔有慾過高，愛吃醋，得理不饒人，囗是心非，城府太深報復心強。\\n11月22日-12月21日　★人馬座（射手座）★　請看下月...') href=''>NOV",
"<a  onmouseout='hidetip2()' onmouseover=showtip2(this,event,'11月22日-12月21日','-1','★人馬座（射手座）★\\n　　優點：天生樂觀，正直坦率，有救世救人的熱情，待人友善，經得起打擊。\\n　　缺點：心直囗快，容易得罪人，不信邪，不聽勸告，衝動，不懂三思而行。\\n12月22日-1月20日　★山羊座(摩羯座)　★請看1月...') href=''>DEC");
var month2=new Array("近代史上的元月：<br><br>《1789年1月----美國第一次大選,華盛頓當選為第一任總統》<br>《1912年1月1日----中華民國成立，孫中山任臨時大總統，同期國民黨成立》<br>《1924年1月----第一次國共合作》<br>《1932年1月28日----日本在上海發動「一.二八」事變》<br>《1933年1月----德國希特拉上台》<br>《1949年1月----淮海戰役、平津戰役解放軍取得最後勝利》<br>《1976年1月8日----周恩來逝世》",
"近代史上的2月：<br><br>《1848年2月----「共產黨宣言」在歐洲發表》<br>《1848年2月----法國「二月革命」爆發》<br>《1923年2月----京漢鐵路工人大罷工》<br>《1972年2月21日----尼克松到訪中國》",
"近代史上的3月：<br>《1925年3月12日----孫中山逝世》<br>《1932年3月----日本扶植清朝廢帝溥儀，在東北建立偽「滿洲國」》",
"近代史上的4月：<br>《1861年4月----美國南北戰爭爆發》<br>《1911年4月----廣州黃花岡起義》<br>《1949年4月23日----解放軍解放南京,民國結束》<br>《1970年4月24日----中國成功發射第一顆人造衛星》<br>《1976年4月7日----華國鋒任中共第一副主席》<br>《1984年4月6日----中國對外開放14個沿海城市》",
"近代史上的5月：<br>《1841年5月29日----廣州三元裡民眾抵抗英軍入侵》<br>《1919年5月4日----「五四」運動爆發》<br>《1945年5月8日----德國簽訂無條件投降書》",
"近代史上的6月：<br>《1840年6月----第一次鴉片戰爭爆發》<br>《1898年6月----「百日維新」開始》<br>《1913年6月----國民二次革命開始》<br>《1914年6月28日----薩拉熱窩事件--第一次世界大戰爆發》<br>《1944年6月6日----英美盟軍登陸諾曼底》<br>《1950年6月25日----朝鮮戰爭爆發》",
"近代史上的7月：<br>《1776年7月4日----《獨立宣言》發表，美國成立》<br>《1921年7月----中國共產黨成立》<br>《1937年7月7日----日本發動蘆溝橋事變》<br>《1946年7月----中國爆發全面內戰》<br>《1953年7月26日----朝鮮戰爭結束，形成南北對峙局面》<br>《1976年7月6日----朱德逝世》<br>《1997年7月----中國收回香港主權》",
"近代史上的8月：<br>《1789年8月----法國《人權宣言》發佈》<br>《1842年8月----清政府割讓香港》<br>《1894年8月1日----清政府對日宣戰，甲午戰爭爆發》<br>《1905年8月----中國同盟會成立》<br>《1927年8月1日----「八一」南昌起義》<br>《1945年8月6日、9日----美國在日本廣島、長崎第一次使用原子彈》<br>《1945年8月14日----日本宣佈無條件投降》<br>《1966年8月18日----毛澤東在天安門接見紅衛兵》",
"近代史上的9月：<br>《1909年9月----中國第一條自行設計的「京張」鐵路開通》<br>《1915年9月----中國新文化運動開始》<br>《1922年9月----安源路礦工人大罷工》<br>《1931年9月18日----日本在瀋陽發動「九.一八」事變》<br>《1939年9月3日第二次世界大戰全面爆發》<br>《1945年9月2日----日本簽訂無條件投降書》<br>《1976年9月9日----毛澤東逝世》<br>《1984年9月26日----中英發表關於香港問題的聯合聲明》",
"近代史上的10月：<br>《1856年10月----英法聯軍火燒圓明園；同月清政府割讓九龍半島》<br>《1911年10月10日----武昌起義，辛亥革命開始》<br>《1934年10月----紅軍開始二萬五千里長征》<br>《1949年10月1日----中華人民共和國成立》<br>《1950年10月25日----中國人民志願軍入朝參加抗美戰爭》<br>《1951年10月26日----解放軍進藏，西藏和平解放》<br>《1957年10月4日----前蘇聯將世界上第一顆人造衛星送上太空》<br>《1976年10月6日----「四人幫」受審》",
"近代史上的11月：<br>《1798年11月9日----法國拿破倫發動「霧月政變」，拿破倫時代開始》<br>《1917年11月7日----「十月革命」勝利蘇聯成立》<br>《1943年11月----蘇、美、英三大巨頭舉行德克蘭會議》<br>《1948年11月----遼沈戰役結束,淮海戰役開始》<br>《1969年11月12日----劉少奇在開封逝世》",
"近代史上的12月：<br>《1936年12月12日----西安事變》<br>《1937年12月13日----南京大屠殺》<br>《1941年12月8日----太平洋戰爭爆發》");
var sFtv = new Array( "0101*元旦", "0214 情人節", "0308 婦女節", "0312 植樹節", "0315 消費者權益日", "0401 愚人節", "0501 勞動節", "0504 青年節", "0512 護士節", "0601 兒童節", "0701 建黨節 香港回歸紀念日", "0801 建軍節", "0909 毛澤東逝世紀念日", "0910 教師節", "0928 孔聖誕", "1001*國慶節", "1006 老人節", "1024 聯合國日", "1031 萬聖節（鬼節）", "1112 孫中山誕辰紀念日", "1220 澳門回歸紀念日", "1224*平安夜", "1225*聖誕節", "1226 毛澤東誕辰紀念日");
var lFtv = new Array( "0101*春節", "0107*人日", "0115*元宵節", "0125 填倉節", "0126 生菜會", "0202 龍頭節", "0206 東華帝君誕", "0215 涅槃節", "0219 觀音誕", "0323 媽祖誕、天後誕", "0408 牛王誕", "0505*端午節", "0508 龍母誕", "0520 分龍節", "0606 姑姑節", "0616 魯班節", "0624 關帝節", "0630 圍香節","0707 七夕情人節", "0715 中元節(鬼節)", "0802 灶君誕", "0827 先師誕", "0815*中秋節", "0909 重陽節", "1001 祭祖節、祀靴節", "1025 感天上帝誕", "1208 臘八節", "1220 魯班公誕", "1224 小年（祀灶）", "0100*除夕");
var wFtv = new Array( "0231 總統日","0520 母親節", "0531 勝利日", "0630 父親節", "0716 合作節", "0730 被奴役國家周", "0911 西方勞動節", "1011 世界住房日", "1021 美國哥倫布紀念日", "1144 感恩節");

function lYearDays(y) {
	var i, sum = 348;
	for(i=0x8000; i>0x8; i>>=1) sum += (NongliData[y-1900] & i)? 1: 0;
	return(sum+leapDays(y));
}

function lYearDays(y) {
	var i, sum = 348;
	for(i=0x8000; i>0x8; i>>=1) sum += (NongliData[y-1900] & i)? 1: 0;
	return(sum+leapDays(y));
}

function leapDays(y) {
	if(leapMonth(y)) return( (NongliData[y-1899]&0xf)==0xf? 30: 29);
	else return(0);
}

function leapMonth(y) {
	var lm = NongliData[y-1900] & 0xf;
	return(lm==0xf?0:lm);
}

function monthDays(y,m) {
	return( (NongliData[y-1900] & (0x10000>>m))? 30: 29 )
}

function Lunar(objDate) {
	var i, leap=0, temp=0;
	var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
	for(i=1900; i<2100 && offset>0; i++) { 
		temp=lYearDays(i); offset-=temp; 
	}
	if(offset<0) { 
		offset+=temp; i--; 
	}
	this.year = i;
	leap = leapMonth(i);
	this.isLeap = false;
	for(i=1; i<13 && offset>0; i++) {
		if(leap>0 && i==(leap+1) && this.isLeap==false) { 
			--i; 
			this.isLeap = true; 
			temp = leapDays(this.year); 
		} else { 
			temp = monthDays(this.year, i); 
		}
		if(this.isLeap==true && i==(leap+1)) this.isLeap = false;
		offset -= temp;
	}
	if(offset==0 && leap>0 && i==leap+1)
	if(this.isLeap){ 
		this.isLeap = false; 
	} else { 
		this.isLeap = true; --i; 
	}
	if(offset<0){ 
		offset += temp; --i; 
	}
	this.month = i;
	this.day = offset + 1;
}

function solarDays(y,m) {
	if(m==1)
		return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28)
	else
		return(solarMonth[m])
}

function cyclical(num) {
	return(Gan[num%10]+Zhi[num%12])
}
function cyclical4(num) {
	return(Gan3[num%10])
}
function cyclical5(num) {
	return(Gan4[num%12])
}
function cyclical3(num) {
	return('<font color="#804000">彭祖百忌：</font>['+Gan2[num%10]+' '+Zhi2[num%12]+']')
}

function calElement(sYear,sMonth,sDay,week,lYear,lMonth,lDay,isLeap,cYear,cMonth,cDay) {
      this.isToday    = false;

      this.sYear      = sYear;
      this.sMonth     = sMonth;
      this.sDay       = sDay;
      this.week       = week;

      this.lYear      = lYear;
      this.lMonth     = lMonth;
      this.lDay       = lDay;
      this.isLeap     = isLeap;

      this.cYear      = cYear;
      this.cMonth     = cMonth;
      this.cDay       = cDay;

      this.color      = '';
      this.solarTerms    = '';  
      this.solarFestival = ''; 
      this.lunarFestival = ''; 
}

function sTerm(y,n) {
   var offDate = new Date( ( 31556925974.7*(y-1900) + sTermInfo[n]*60000  ) + Date.UTC(1900,0,6,2,5) )
   return(offDate.getUTCDate())
}

function cyclical6(num,num2) { 
	if (num==0) return(jcName0[num2]); 
	if (num==1) return(jcName1[num2]); 
	if (num==2) return(jcName2[num2]); 
	if (num==3) return(jcName3[num2]); 
	if (num==4) return(jcName4[num2]); 
	if (num==5) return(jcName5[num2]); 
	if (num==6) return(jcName6[num2]); 
	if (num==7) return(jcName7[num2]); 
	if (num==8) return(jcName8[num2]); 
	if (num==9) return(jcName9[num2]); 
	if (num==10) return(jcName10[num2]); 
	if (num==11) return(jcName11[num2]); 
} 

function calendar(y,m) {

   var sDObj, lDObj, lY, lM, lD=1, lL, lX=0, tmp1, tmp2,lM2,lY2,lD2,tmp3,dayglus,bsg,xs,xs1,fs,fs1,cs,cs1
   var lDPOS = new Array(3)
   var n = 0
   var firstLM = 0

   sDObj = new Date(y,m,1,0,0,0,0);           
   this.length    = solarDays(y,m)    
   this.firstWeek = sDObj.getDay()   
	if(m<2) {
		cY=cyclical(y-1900+36-1);lY2=(y-1900+36-1);
	} else { 
		cY=cyclical(y-1900+36);lY2=(y-1900+36);
	}
	var term2=sTerm(y,2);
	var firstNode = sTerm(y,m*2)
	cM = cyclical((y-1900)*12+m+12);
	lM2= (y-1900)*12+m+12;
	var dayCyclical = Date.UTC(y,m,1,0,0,0,0)/86400000+25567+10;

	for(var i=0;i<this.length;i++) {
		if(lD>lX) {     	
			sDObj = new Date(y,m,i+1)   
			lDObj = new Lunar(sDObj)    
			lY    = lDObj.year          
			lM    = lDObj.month         
			lD    = lDObj.day          
			lL    = lDObj.isLeap        
			lX    = lL? leapDays(lY): monthDays(lY,lM) 
			if(n==0) firstLM = lM
			lDPOS[n++] = i-lD+1
		}
		if(m==1 && (i+1)==term2){ 
			cY=cyclical(y-1900+36);
			lY2=(y-1900+36);
		}
		if((i+1)==firstNode) {
			cM = cyclical((y-1900)*12+m+13);
			lM2=(y-1900)*12+m+13;
		}
		cD = cyclical(dayCyclical+i);
		lD2=(dayCyclical+i);
		this[i] = new calElement(y, m+1, i+1, nStr1[(i+this.firstWeek)%7], lY, lM, lD++, lL, cY ,cM, cD );
		bsg=(lD2)%12;
		cs1=i+1;
		if(m==0){
			if(cs1<sTerm(y,m*2  )-1){xs1='水泉動';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3) {xs1='雁北鄉';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8) {xs1='鵲始巢';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='鳺始鴝';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='雞始乳';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='征鳥厲疾';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='水澤腹堅';}
		}
		if(m==1){
			if(cs1<sTerm(y,m*2  )-1){xs1='水澤腹堅';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='東風解凍';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='蟄蟲始振';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='魚上冰';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='獺祭魚';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='候雁北';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='草木萌動';}
		}
		if(m==2){
			if(cs1<sTerm(y,m*2  )-1){xs1='草木萌動';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='桃始華';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='倉庚鳴';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='鷹化為鳩';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='玄鳥至';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='雷乃發聲';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='始電';}
		}
		if(m==3){
			if(cs1<sTerm(y,m*2  )-1){xs1='始電';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='桐始華';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='田鼠化為鴽';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='虹始見';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='萍始生';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='鳴鳩拂其羽';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='戴勝降於桑';}
		}
		if(m==4){
			if(cs1<sTerm(y,m*2  )-1){xs1='戴勝降於桑';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='螻蟈鳴';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='蚯蚓出';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='王瓜生';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='苦菜秀';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='靡草死';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='麥秋至';}
		}
		if(m==5){
			if(cs1<sTerm(y,m*2  )-1){xs1='麥秋至';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='螳螂生';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='鵙始鳴';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='反舌無聲';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='鹿角解';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='蜩始鳴';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='半夏生';}
		}
		if(m==6){
			if(cs1<sTerm(y,m*2  )-1){xs1='半夏生';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='溫風至';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='蟀蟋居壁';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='鷹如鷙';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='腐草為螢';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='土潤溽暑';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='大雨時行';}
		}
		if(m==7){
			if(cs1<sTerm(y,m*2  )-1){xs1='大雨時行';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='涼風至';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='白露降';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='寒蟬鳴';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='鷹乃祭鳥';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='天地始肅';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='禾乃登';}
		}
		if(m==8){
			if(cs1<sTerm(y,m*2  )-1){xs1='禾乃登';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='鴻雁來';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='玄鳥歸';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='群鳥養羞';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='雷乃收聲';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='蟄蟲坯戶';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='水始涸';}
		}
		if(m==9){
			if(cs1<sTerm(y,m*2  )-1){xs1='水始涸';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='鴻雁來賓';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='雀入大水為蛤';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='菊有黃花';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='豺乃祭獸';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='草木黃落';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='蟄蟲鹹俯';}
		}
		if(m==10){
			if(cs1<sTerm(y,m*2  )-1){xs1='蟄蟲鹹俯';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='水始冰';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='地始凍';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='雉入大水為蜃';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='虹藏不見';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='天氣騰地氣降';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='閉塞成冬';}
		}
		if(m==11){
			if(cs1<sTerm(y,m*2  )-1){xs1='閉塞成冬';}
			else if(cs1>=sTerm(y,m*2  )-1 && cs1<=sTerm(y,m*2  )+3){xs1='鶡鴠不鳴';}
			else if(cs1>sTerm(y,m*2  )+3 && cs1<=sTerm(y,m*2  )+8){xs1='虎始交';}
			else if(cs1>sTerm(y,m*2  )+8 && cs1<sTerm(y,m*2+1)-1){xs1='荔挺出';}
			else if(cs1>=sTerm(y,m*2+1)-1 && cs1<=sTerm(y,m*2+1)+3){xs1='蚯蚓結';}
			else if(cs1>sTerm(y,m*2+1)+3 && cs1<=sTerm(y,m*2+1)+8){xs1='麋鹿解';}
			else if(cs1>sTerm(y,m*2+1)+8){xs1='水泉動';}
		}
		if(bsg==0){dayglus=Gan[9]+'命進祿 ';}
		else if(bsg==2){dayglus=Gan[0]+'命進祿 ';}
		else if(bsg==3){dayglus=Gan[1]+'命進祿 ';}
		else if(bsg==5){dayglus=Gan[2]+','+Gan[4]+'命進祿 ';}
		else if(bsg==6){dayglus=Gan[3]+','+Gan[5]+'命進祿 ';}
		else if(bsg==8){dayglus=Gan[6]+'命進祿 ';}
		else if(bsg==9){dayglus=Gan[7]+'命進祿 ';}
		else if(bsg==11){dayglus=Gan[8]+'命進祿 ';}
		else {dayglus='';}
		if((lD2)%10==0 || (lD2)%10==5){xs='東北';}
		else if((lD2)%10==1 || (lD2)%10==6){xs='西北';}
		else if((lD2)%10==2 || (lD2)%10==7){xs='西南';}
		else if((lD2)%10==3 || (lD2)%10==8){xs='正南';}
		else if((lD2)%10==4 || (lD2)%10==9){xs='東南';}
		if((lD2)%10==0 || (lD2)%10==1){fs='東南';}
		else if((lD2)%10==2 || (lD2)%10==3){fs='正東';}
		else if((lD2)%10==4){fs='正北';}
		else if((lD2)%10==5){fs='正南';}
		else if((lD2)%10==6 || (lD2)%10==7){fs='西南';}
		else if((lD2)%10==8){fs='西北';}
		else if((lD2)%10==9){fs='正西';}
		if((lD2)%10==0 || (lD2)%10==1){cs='東北';}
		else if((lD2)%10==2 || (lD2)%10==3){cs='西南';}
		else if((lD2)%10==4 || (lD2)%10==5){cs='正北';}
		else if((lD2)%10==6 || (lD2)%10==7){cs='正東';}
		else if((lD2)%10==8 || (lD2)%10==9){cs='正南';}
		this[i].pgday =cyclical3(lD2);
		this[i].dGz = '時辰：'+cyclical4(lD2);
		this[i].sgz ='<FONT color=#FF8C1A>吉</font><FONT color=#0000A0>凶</font>：'+ cyclical5(lD2);
		this[i].sgz2 =jzny([lD2]%10+''+[lD2]%12);
		this[i].sgz4 =CalConv((lD2)%10,(lD2)%12);
		this[i].sgz5 =CalConv2(lY2%12,lM2%12,(lD2)%12,lY2%10,(lD2)%10,lM,lD-1,m+1,cs1);
		this[i].sgz6 =cyclical7(lM2%12,(lD2)%12);
		this[i].sgz7 =jznyy([lD2]%10+''+[lD2]%12);

		this[i].sgz8 =jznyy([lM2]%10+''+[lM2]%12);
		this[i].sgz9 =jznyy([lY2]%10+''+[lY2]%12);
		this[i].sgz3 =cyclical6(lM2%12,(lD2)%12);
		this[i].dayglu ='◇今日命祿：<font color=red>'+dayglk[(lD2)%10]+'命互祿 '+dayglus+'</font>';
		this[i].ssfw ='◇喜神：<font color=red>'+xs+'</font> ◇福神：<font color=red>'+fs+'</font> ◇財神：<font color=red>'+cs;
		this[i].fs1 ='本日物候：'+xs1
		if((i+this.firstWeek)%7==0)   this[i].color = 'red'
		if((i+this.firstWeek)%14==13) this[i].color = 'red'
		this[i].sgzzm2 = '◆'+sTerm(y,m*2  )+'日'+ solarTerm[m*2]+'  '+'◆'+sTerm(y,m*2+1)+'日'+ solarTerm[m*2+1]
	}
	if(y==tY && m==tM) this[tD-1].solarTerms +=''


	tmp1=sTerm(y,m*2  )-1
	tmp2=sTerm(y,m*2+1)-1
	this[tmp1].solarTerms = solarTerm[m*2]
	this[tmp2].solarTerms = solarTerm[m*2+1]

	if(m==3) this[tmp1].color = '#CC4AF7'
	for(i in sFtv)
		if(sFtv[i].match(/^(\d{2})(\d{2})([\s\*])(.+)$/))
			if(Number(RegExp.$1)==(m+1)) {
				this[Number(RegExp.$2)-1].solarFestival += RegExp.$4 + ' '
				if(RegExp.$3=='*') this[Number(RegExp.$2)-1].color = '#BC02D7'
			}
	for(i in wFtv)
		if(wFtv[i].match(/^(\d{2})(\d)(\d)([\s\*])(.+)$/))
			if(Number(RegExp.$1)==(m+1)) {
				tmp1=Number(RegExp.$2);
				tmp2=Number(RegExp.$3);
				if(tmp1<5)
					this[((this.firstWeek>tmp2)?7:0) + 7*(tmp1-1) + tmp2 - this.firstWeek].solarFestival += RegExp.$5 + ' ';
				else {
					tmp1 -= 5;
					tmp3 = (this.firstWeek+this.length-1)%7;
					this[this.length - tmp3 - 7*tmp1 + tmp2 - (tmp2>tmp3?7:0) - 1 ].solarFestival += RegExp.$5 + ' ';
				}
			}
	
	for(i in lFtv)
		if(lFtv[i].match(/^(\d{2})(.{2})([\s\*])(.+)$/)) {
			tmp1=Number(RegExp.$1)-firstLM
			if(tmp1==-11) tmp1=1
			if(tmp1 >=0 && tmp1<n) {
				tmp2 = lDPOS[tmp1] + Number(RegExp.$2) -1
				if( tmp2 >= 0 && tmp2<this.length) {
					this[tmp2].lunarFestival += RegExp.$4 + ' '
					if(RegExp.$3=='*') this[tmp2].color = '#FF00FF'
				}
			}
		}
	if(m==2 || m==3) {
		var estDay = new easter(y);
		if(m == estDay.m)
		this[estDay.d-1].solarFestival = this[estDay.d-1].solarFestival+'復活節';
	}
	if((this.firstWeek+12)%7==5) this[12].solarFestival += '黑五'
	if(y==tY && m==tM) this[tD-1].isToday = true;
}

function CalConv(d,dd) {	
	return '歲煞'+sfw[dd]+' '+AnimalIdx[dd]+'日沖('+Gan5[d]+Zhi3[dd]+')'+AnimalIdx2[dd];
}

function jzny(d){
	var ny;
	if(d=='00' || d=='11') ny='海中金';
	if(d=='22' || d=='33') ny='爐中火';
	if(d=='44' || d=='55') ny='大林木';
	if(d=='66' || d=='77') ny='路旁土';
	if(d=='88' || d=='99') ny='劍鋒金';
	if(d=='010' || d=='111') ny='山頭火';
	if(d=='20' || d=='31') ny='洞下水';
	if(d=='42' || d=='53') ny='城牆土';
	if(d=='64' || d=='75') ny='白臘金';
	if(d=='86' || d=='97') ny='楊柳木';
	if(d=='08' || d=='19') ny='泉中水';
	if(d=='210' || d=='311') ny='屋上土';
	if(d=='40' || d=='51') ny='霹雷火';
	if(d=='62' || d=='73') ny='松柏木';
	if(d=='84' || d=='95') ny='常流水';
	if(d=='06' || d=='17') ny='沙中金';
	if(d=='28' || d=='39') ny='山下火';
	if(d=='410' || d=='511') ny='平地木';
	if(d=='60' || d=='71') ny='壁上土';
	if(d=='82' || d=='93') ny='金箔金';
	if(d=='04' || d=='15') ny='佛燈火';
	if(d=='26' || d=='37') ny='天河水';
	if(d=='48' || d=='59') ny='大驛土';
	if(d=='610' || d=='711') ny='釵釧金';
	if(d=='80' || d=='91') ny='桑柘木';
	if(d=='02' || d=='13') ny='大溪水';
	if(d=='24' || d=='35') ny='沙中土';
	if(d=='46' || d=='57') ny='天上火';
	if(d=='68' || d=='79') ny='石榴木';
	if(d=='810' || d=='911') ny='大海水';
	return(ny);
}

function jznyy(d){
	var nyy;
	if(d=='00' || d=='11') nyy='金';
	if(d=='22' || d=='33') nyy='火';
	if(d=='44' || d=='55') nyy='木';
	if(d=='66' || d=='77') nyy='土';
	if(d=='88' || d=='99') nyy='金';
	if(d=='010' || d=='111') nyy='火';
	if(d=='20' || d=='31') nyy='水';
	if(d=='42' || d=='53') nyy='土';
	if(d=='64' || d=='75') nyy='金';
	if(d=='86' || d=='97') nyy='木';
	if(d=='08' || d=='19') nyy='水';
	if(d=='210' || d=='311') nyy='土';
	if(d=='40' || d=='51') nyy='火';
	if(d=='62' || d=='73') nyy='木';
	if(d=='84' || d=='95') nyy='水';
	if(d=='06' || d=='17') nyy='金';
	if(d=='28' || d=='39') nyy='火';
	if(d=='410' || d=='511') nyy='木';
	if(d=='60' || d=='71') nyy='土';
	if(d=='82' || d=='93') nyy='金';
	if(d=='04' || d=='15') nyy='火';
	if(d=='26' || d=='37') nyy='水';
	if(d=='48' || d=='59') nyy='土';
	if(d=='610' || d=='711') nyy='金';
	if(d=='80' || d=='91') nyy='木';
	if(d=='02' || d=='13') nyy='水';
	if(d=='24' || d=='35') nyy='土';
	if(d=='46' || d=='57') nyy='火';
	if(d=='68' || d=='79') nyy='木';
	if(d=='810' || d=='911') nyy='水';
	return(nyy);
}

function easter(y) {
	var term2=sTerm(y,5);
	var dayTerm2 = new Date(Date.UTC(y,2,term2,0,0,0,0)); 
	var lDayTerm2 = new Lunar(dayTerm2); 

	if(lDayTerm2.day<15)
		var lMlen= 15-lDayTerm2.day;
	else
		var lMlen= (lDayTerm2.isLeap? leapDays(y): monthDays(y,lDayTerm2.month)) - lDayTerm2.day + 15;
	var l15 = new Date(dayTerm2.getTime() + 86400000*lMlen ); 
	var dayEaster = new Date(l15.getTime() + 86400000*( 7-l15.getUTCDay() ) ); 
	this.m = dayEaster.getUTCMonth();
	this.d = dayEaster.getUTCDate();
}

function cDay(d){
	var s;

	switch (d) {
		case 10:
			s = '初十'; break;
		case 20:
			s = '二十'; break;
		case 30:
			s = '三十'; break;
		default :
			s = nStr2[Math.floor(d/10)];
			s += nStr1[d%10];
	}
	return(s);
}

function cDay2(d){
	var s2;

	switch (d) {
		case 1:
			s2 = '正'; break;
		case 2:
			s2 = '二'; break;
		case 3:
			s2 = '三'; break;
		case 4:
			s2 = '四'; break;
		case 5:
			s2 = '五'; break;
		case 6:
			s2 = '六'; break;
		case 7:
			s2 = '七'; break;
		case 8:
			s2 = '八'; break;
		case 9:
			s2 = '九'; break;
		case 10:
			s2 = '十'; break;
		case 11:
			s2 = '十一'; break;
		case 12:
			s2 = '十二'; break;
		default :
	}
	return(s2);
}

var cld;

function drawCld(SY,SM) {
	var i,sD,s,size,bsms,rmms,SY2;
	cld = new calendar(SY,SM);
	if(SY>1874 && SY<1909) yDisplay = '光緒&nbsp;' + (((SY-1874)==1)?'元':SY-1874)
	if(SY>1908 && SY<1912) yDisplay = '宣統&nbsp;' + (((SY-1908)==1)?'元':SY-1908)
	if(SY>1911 && SY<1949) yDisplay = '民國&nbsp;' + (((SY-1911)==1)?'元':SY-1911)
	if(SY>1948 && SY<1950) yDisplay = '中華人民共和國' + (((SY-1948)==1)?'成立':SY-1948)
	if(SY>1949) yDisplay = '世界綠色和平活動' + (((SY-1949)==1)?'元':SY-1949)
	if(SM==0){SY2=SY-1;}else{SY2=SY;}
	GZ.innerHTML ='<!--<a href="https://www.ixuehai.cn" target=_blank title="ixuehai.cn分享知識，快樂閱讀！"><font color=#FFCC00>●</font>愛學海</a>&nbsp;&nbsp;--><font color=#FFCC00>●</font>&nbsp;<a onmouseout="hidetip2()" onmouseover=showtip2(this,event,"'+'公元'+SY+'年'+(SM+1)+'月","0","'+SM+'") href="#" style="color:#000">'+ yDisplay+'年'+'</a> &nbsp;&nbsp;<font color=#FFCC00>●</font>&nbsp;'+Animals[(SY2-4)%12]+'年[農曆' + cyclical(SY2-1900+36)+'年]' +'</a>&nbsp;<img src="wnlimg/' + ((SY2-4)%12+1) +'.gif">&nbsp;' ;
	YMBG.innerHTML = monthName[SM]+"&nbsp;" +SY+" 返回今天</a>"  ;
	for(i=0;i<42;i++) {
		sObj=eval('SD'+ i);
		lObj=eval('LD'+ i);
		sObj.parentElement.parentElement.background = '';
		sD = i - cld.firstWeek;
		if(sD>-1 && sD<cld.length) { 
			sObj.innerHTML = sD+1;
			if(cld[sD].isToday) sObj.parentElement.parentElement.background = 'wnlimg/bk.gif'; 
			sObj.style.color = cld[sD].color; 
			if(cld[sD].lDay==1) {
				rmms=(cld[sD].isLeap?'閏':'');
				if(rmms!=''){
					bsms='';
				} else {
					bsms=(monthDays(cld[sD].lYear,cld[sD].lMonth)==29?'小':'大');
				}
				lObj.innerHTML = '<strong>'+rmms + cld[sD].lMonth + '月' + bsms+'</strong>';
			} else {
				lObj.innerHTML = cDay(cld[sD].lDay);
			}
			s=cld[sD].lunarFestival;
			if(s.length>0) {
				if(s.length>4) s = s.substr(0, 3)+'…';
				s = s.fontcolor('#C49402');
			} else {
				s=cld[sD].solarFestival;
				if(s.length>0) {
					size = (s.charCodeAt(0)>0 && s.charCodeAt(0)<128)?8:4;
					if(s.length>size+1) s = s.substr(0, size-1)+'…';
					s = s.fontcolor('#FF8000');
				} else { 
					s=cld[sD].solarTerms;
					if(s.length>0) s = s.fontcolor('#309F00');
				}
			}
			if(s.length>0) lObj.innerHTML = s;
		} else { 
			sObj.innerHTML = '';
			lObj.innerHTML = '';
		}
	}
}

function changeCld() {
	var y,m;
	y=CLD.SY.selectedIndex+1900;
	m=CLD.SM.selectedIndex;
	drawCld(y,m);
}

function pushBtm(K) {
	switch (K){
		case 'YU' :
			if(CLD.SY.selectedIndex>0) CLD.SY.selectedIndex--;
			break;
		case 'YD' :
			if(CLD.SY.selectedIndex<149) CLD.SY.selectedIndex++;
			break;
		case 'MU' :
			if(CLD.SM.selectedIndex>0) {
				CLD.SM.selectedIndex--;
			} else {
				CLD.SM.selectedIndex=11;
				if(CLD.SY.selectedIndex>0) CLD.SY.selectedIndex--;
			}
			break;
		case 'MD' :
			if(CLD.SM.selectedIndex<11) {
				CLD.SM.selectedIndex++;
			} else {
				CLD.SM.selectedIndex=0;
				if(CLD.SY.selectedIndex<200) CLD.SY.selectedIndex++;
			}
			break;
		default :
			CLD.SY.selectedIndex=tY-1900;
			CLD.SM.selectedIndex=tM;
	}
	changeCld();
}

var Today = new Date();
var tY = Today.getFullYear();
var tM = Today.getMonth();
var tD = Today.getDate();
var tD1 = tD
var ybm1 = tM+1;
var azz = new Date()
azz = azz.valueOf()
var tD2 = new Date((azz + 1 * 24 * 60 * 60 * 1000)).getDate();
var ybm2 = new Date((azz + 1 * 24 * 60 * 60 * 1000)).getMonth()+1;
var tD3 = new Date((azz + 2 * 24 * 60 * 60 * 1000)).getDate();
var ybm3 = new Date((azz + 3 * 24 * 60 * 60 * 1000)).getMonth()+1;
var d2r = Math.PI / 180.0;
var width = "130";
var offsetx = 2;
var offsety = 16;
var snow = 0;
var snow2 = 0;

function Ymd2Jd(yy,mm,dd) {
	var days,tmp,yym1;
	yym1 = yy - 1;
	days = 1721422;
	solarMonth[1] = 28;
	if (yy % 4 == 0) {
		solarMonth[1] = 29;
		if (yy > 1582) {
			if (yy % 100 == 0) {
				solarMonth[1] = 28;
				if (yy %400 == 0) {
					solarMonth[1] = 29;
				}
			}
		}
	}
	days += Math.floor(365.25 * yym1 + 0.1);
	for (m = 0; m < (mm - 1) ; m++) {
		days += solarMonth[m];
	}
	days += dd;
	if (days >= 2299160) days -= 10;
	if (yym1 >= 1600) {
		days -= Math.floor((yym1 - 1600 + 0.1) / 100);
		days += Math.floor((yym1 - 1600 + 0.1) / 400);
	}
	return days;
}

function GetSukuD(dd) {
	var s;
	s = (dd + SukuDofs) % 28;
	return Sukuyou[s];
}

function GetSuku2D(dd) {
	var s;
	s = (dd + SukuDofs) % 28;
	return Sukuyou2[s];
}

function GetSuku3D(dd) {
	var s;
	s = (dd + SukuDofs) % 28;
	return Sukuyou3[s];
}

function GetSuku4D(dd) {
	var s;
	s = (dd + SukuDofs) % 28;
	return Sukuyou4[s];
}

function Get6you(omm,odd) {
	var k;
	k = (omm + odd + 4) % 6;
	return Rokuyou[k];
}

function mOvr(v) {	
	var s,festival,bt,imgsr,rqcolor,jcrnmu,jy,rmm,bsm;
	var sObj=eval('SD'+ v);
	var d=sObj.innerHTML-1;
	if (snow == 0) {
		d = tD-1;
		snow = 1;
	}
	if(sObj.innerHTML!='') {
		sObj.style.cursor = 'help';
		if(cld[d].solarTerms!='' && cld[d].isToday == true) {
			bt='tablebody2';
			if(cld[d].solarTerms!='今天'){imgsr='今天：';}else{imgsr='';}
		} else {
			bt='tablebody1';
			imgsr='今日：'
		}
		rcrltd.className=bt;
		if(cld[d].solarTerms == '' && cld[d].solarFestival == '' && cld[d].lunarFestival == '') { 
			festival = cld[d].sgzzm2;
		} else {
			festival = imgsr + cld[d].solarTerms + ' '+ cld[d].solarFestival + ' ' + cld[d].lunarFestival;
		}
		if(cld[d].sgz5!=0){jy=cld[d].sgz5;}else{jy=jcr(cld[d].sgz3);}
		rmm=(cld[d].isLeap?'閏':'');
		if(rmm!=''){bsm='';}else{bsm=(monthDays(cld[d].lYear,cld[d].lMonth)==29?'小':'大');}
		if(cld[d].week=='日'){rqcolor='<font color=#FF8040>'}else{rqcolor=''}
		s= '<table border="0" cellpadding="1" cellspacing="1" class=tableborder1 style="table-layout: fixed;width:100%">' +
			'<tr height=35><th>'+ festival +'</th></tr>' + 
			'<TR><td class='+bt+'>' +
				'<TABLE WIDTH=100% BORDER=0 CELLPADDING=0 CELLSPACING=0>' +
				'<TR><TD ALIGN="center" style="padding-top:5px;">' +
					'<FONT COLOR="#004000" face="Arial"><strong><span style="letter-spacing: 0px;font-size:18pt;">'+rqcolor+cld[d].sYear+'年'+cld[d].sMonth+'月</span></font>' +
					'<br>' +
					'<font style="font-size:39pt;line-height:50px;color:#085820">'+cld[d].sDay+'</font>' +
					'<br>' +
					'<font STYLE="letter-spacing: 5px; font-size:18px;line-height:28px;color:#085820">星期'+cld[d].week+'</strong></font>' +
					'<br>' +
					'<font color="#800080">農曆'+cld[d].cYear+cld[d].sgz9+'年 '+rmm+cDay2(cld[d].lMonth)+'月'+bsm+'  '+cDay(cld[d].lDay)+'日</font>' +
					'<br>' +
					'<font color="#800080">'+cld[d].cMonth+cld[d].sgz8+'(</font>' +
					'<font color=#008000>'+moonglk[cld[d].lMonth-1]+'</font>' +
					'<font color="#800080">)月 '+cld[d].cDay+cld[d].sgz7+GetSuku4D(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+cld[d].sgz3+'日</font>' +
					'<br>' +
					'<font color=#008000 style="line-height: 25px">'+cld[d].fs1+ '</font>' +
					'<br>' +
					'<FONT color=#0000A0>'+cld[d].sgz4 +'</font>' +
					'<br>' +
					'<a style="cursor: help" onmouseout="hidetip2()" onmouseover=showtip2(this,event,"'+Jd2KyuuseiNameL(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+'","'+Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay)+'","宿名：'+GetSuku2D(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+'('+GetSukuD(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+')")>' + Jd2KyuuseiNameL(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+'<br>宿名：'+GetSukuD(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+GetSuku2D(Ymd2Jd(cld[d].sYear,cld[d].sMonth,cld[d].sDay))+' 六曜：'+Get6you(cld[d].sMonth,cld[d].sDay) +
					'<br>' +
					'值日：'+cld[d].sgz6+' 五行：'+cld[d].sgz2 +
					'<br>' +
					cld[d].pgday +
					'</a>' +
				'</TD></TR></TABLE>' +
			'</TD></TR>' +
			'<TR><TD height=38 class='+bt+' align=center>' +
				'<table border="0" cellpadding="4" cellspacing="0"><tr>' +
				'<td><font color="#800080">'+cld[d].cDay+'<br>'+cld[d].sgz3+'日</td>' +
				'<td>'+jy+'</TD>' +
				'</TR></TABLE>' +
			'</TD></TR></TABLE>';
	var mnname;
		var moonimg;
		if (cld[d].lDay >= 24) mnname = '有明月';
		if (cld[d].lDay <= 14) mnname = '宵月';
		if (cld[d].lDay <= 7) mnname = '夕月';
		if (cld[d].lDay == 1) mnname = '新(朔)月';
		if (cld[d].lDay == 2) mnname = '既朔月';
		if (cld[d].lDay == 3) mnname = '娥眉新月';
		if (cld[d].lDay == 4) mnname = '娥眉新月';
		if (cld[d].lDay == 5) mnname = '娥眉月';
		if (cld[d].lDay == 7) mnname = '上弦月';
		if (cld[d].lDay == 8) mnname = '上弦月';
		if (cld[d].lDay == 9) mnname = '九夜月';
		if (cld[d].lDay == 13) mnname = '漸盈凸月';
		if (cld[d].lDay == 14) mnname = '小望月';
		if (cld[d].lDay == 15) mnname = '滿(望)月';
		if (cld[d].lDay == 16) mnname = '既望月';
		if (cld[d].lDay == 17) mnname = '立待月';
		if (cld[d].lDay == 18) mnname = '居待月';
		if (cld[d].lDay == 19) mnname = '寢待月';
		if (cld[d].lDay == 20) mnname = '更待月';
		if (cld[d].lDay == 21) mnname = '漸虧凸月';
		if (cld[d].lDay == 22) mnname = '下弦月';
		if (cld[d].lDay == 23) mnname = '下弦月';
		if (cld[d].lDay == 26) mnname = '娥眉殘月';
		if (cld[d].lDay == 27) mnname = '娥眉殘月';
		if (cld[d].lDay == 28) mnname = '殘月';
		if (cld[d].lDay == 29) mnname = '曉月';
		if (cld[d].lDay == 30) mnname = '晦月';
		moonimg='<IMG SRC="wnlimg/moon' + cld[d].lDay + '.gif" WIDTH=55 HEIGHT=55>'
		sg.innerHTML ='<strong>月相：'+mnname+'</strong>';
		sg2.innerHTML =s;
		sg3.innerHTML =cld[d].dGz;
		sg4.innerHTML =cld[d].sgz;
		sg5.innerHTML =moonimg;
		dayglu1.innerHTML =cld[d].dayglu+' &nbsp;'+cld[d].ssfw;
	}
}

function Main(v,T) {
	var OutString = "";
	var quady = new Array;
	var sunp = new Array;
	var moonp = new Array;
	var y, m, day, glong, glat, tz, numday, mj, lst1, i,jwnum,jing,jings,wei,weis,XZ,hb,yb1,yb2;
	var rads = 0.0174532925, sinmoonalt;  
	var sObj=eval('SD'+ v);
	var d=sObj.innerHTML-1;     
	if(sObj.innerHTML!='') {
		y=cld[d].sYear; 
		m=cld[d].sMonth;
		jwnum=CLD.per_des;
		if(jwnum==undefined){
			jing='113';
			jings='07';
			wei='23';
			weis='02';
			hb=0;
			yb1=37;
		} else {
			XZ=getString(jwnum,5);
			hb=getString(jwnum,10);
			if(XZ==0) XZ='';
			jing=XZ+''+getString(jwnum,4)+''+getString(jwnum,3);
			jings=getString(jwnum,2)+''+getString(jwnum,1);
			wei=getString(jwnum,9)+''+getString(jwnum,8);
			weis=getString(jwnum,7)+''+getString(jwnum,6);
			yb1=(getString(jwnum,12)+''+getString(jwnum,11))*1;
		}
		if(T==7){
			today = new Date () ; 
			day =today.getDate();
		} else {
			day =cld[d].sDay;
		}
		glong = parseInt(jing)+parseFloat(jings)/60;
		glat = parseInt(wei)+parseFloat(weis)/60;
		tz = parseFloat(8);
		mj = mjd(day, m, y, 0.0);
		rcrl.innerHTML ='<a style="cursor: help" onmouseout="hidetip2()" onmouseover=showtip2(this,event,"","2","'+yb1+'")>'+
		Cal(mj, tz, glong, glat,hb)+'<br><span style="line-height: 20px; color:#804000">◇東經：'+jing+'.'+jings+'度 ◇北緯：'+wei+'.'+weis+'度 <br></a>';
	}
}

function hrsmin(hours) {
	var hrs, h, m, dum;
	hrs = Math.floor(hours * 60 + 0.5)/ 60.0;
	h = Math.floor(hrs);
	m = Math.floor(60 * (hrs - h) + 0.5);
	if(h<10)h="0"+h;
	if(m<10)m="0"+m;
	dum = h +"時"+ m+"分";
	if (dum < 1000) dum = "0" + dum;
	if (dum <100) dum = "0" + dum;
	if (dum < 10) dum = "0" + dum;
	return dum;
}

function ipart(x) {
	var a;
	if (x> 0) {
		a = Math.floor(x);
	} else {
		a = Math.ceil(x);
	}
	return a;
}

function frac(x) {
	var a;
	a = x - Math.floor(x);
	if (a < 0) a += 1;
	return a;
}

function round(num, dp) {
	return Math.round (num * Math.pow(10, dp)) / Math.pow(10, dp);
}

function range(x) {
	var a, b;
	b = x / 360;
	a = 360 * (b - ipart(b));
	if (a  < 0 ) {
		a = a + 360
	}
	return a
}

function mjd(day, month, year, hour) {
	var a, b;
	if (month <= 2) {
		month = month + 12;
		year = year - 1;
	}
	a = 10000.0 * year + 100.0 * month + day;
	if (a <= 15821004.1) {
		b = -2 * Math.floor((year + 4716)/4) - 1179;
	} else {
		b = Math.floor(year/400) - Math.floor(year/100) + Math.floor(year/4);
	}
	a = 365.0 * year - 679004.0;
	return (a + b + Math.floor(30.6001 * (month + 1)) + day + hour/24.0);
}

function quad(ym, yz, yp) {
	var nz, a, b, c, dis, dx, xe, ye, z1, z2, nz;
	var quadout = new Array;

	nz = 0;
	a = 0.5 * (ym + yp) - yz;
	b = 0.5 * (yp - ym);
	c = yz;
	xe = -b / (2 * a);
	ye = (a * xe + b) * xe + c;
	dis = b * b - 4.0 * a * c;
	if (dis > 0)	{
		dx = 0.5 * Math.sqrt(dis) / Math.abs(a);
		z1 = xe - dx;
		z2 = xe + dx;
		if (Math.abs(z1) <= 1.0) nz += 1;
		if (Math.abs(z2) <= 1.0) nz += 1;
		if (z1 < -1.0) z1 = z2;
	}
	quadout[0] = nz;
	quadout[1] = z1;
	quadout[2] = z2;
	quadout[3] = xe;
	quadout[4] = ye;
	return quadout;
}


function lmst(mjd, glong) {
	var lst, t, d;
	d = mjd - 51544.5
	t = d / 36525.0;
	lst = range(280.46061837 + 360.98564736629 * d + 0.000387933 *t*t - t*t*t / 38710000);
	return (lst/15.0 + glong/15);
}


function minisun(t) {
	var p2 = 6.283185307, coseps = 0.91748, sineps = 0.39778;
	var L, M, DL, SL, X, Y, Z, RHO, ra, dec;
	var suneq = new Array;

	M = p2 * frac(0.993133 + 99.997361 * t);
	DL = 6893.0 * Math.sin(M) + 72.0 * Math.sin(2 * M);
	L = p2 * frac(0.7859453 + M / p2 + (6191.2 * t + DL)/1296000);
	SL = Math.sin(L);
	X = Math.cos(L);
	Y = coseps * SL;
	Z = sineps * SL;
	RHO = Math.sqrt(1 - Z * Z);
	dec = (360.0 / p2) * Math.atan(Z / RHO);
	ra = (48.0 / p2) * Math.atan(Y / (X + RHO));
	if (ra <0 ) ra += 24;
	suneq[1] = dec;
	suneq[2] = ra;
	return suneq;
}

function sin_alt(iobj, mjd0, hour, glong, cglat, sglat) {
	var mjd, t, ra, dec, tau, salt, rads = 0.0174532925;
	var objpos = new Array;
	mjd = mjd0 + hour/24.0;
	t = (mjd - 51544.5) / 36525.0;
	if (iobj == 1) {
		objpos = minimoon(t);
	} else {
		objpos = minisun(t);
	}
	ra = objpos[2];
	dec = objpos[1];
	tau = 15.0 * (lmst(mjd, glong) - ra);
	salt = sglat * Math.sin(rads*dec) + cglat * Math.cos(rads*dec) * Math.cos(rads*tau);
	return salt;
}

function getzttime(mjd, tz, glong) {
	var sglong, sglat, date, ym, yz, utrise, utset, j;
	var yp, nz, hour, z1, z2, iobj, rads = 0.0174532925;
	var quadout = new Array;
   
	sinho = Math.sin(rads * -0.833);		
	date = mjd - tz/24;
	hour = 1.0;
	ym = sin_alt(2, date, hour - 1.0, glong, 1, 0) - sinho;

	while(hour < 25) {
		yz = sin_alt(2, date, hour, glong, 1, 0) - sinho;
		yp = sin_alt(2, date, hour + 1.0, glong, 1, 0) - sinho;
		quadout = quad(ym, yz, yp);
		nz = quadout[0];
		z1 = quadout[1];
		z2 = quadout[2];
		xe = quadout[3];
		ye = quadout[4];

		if (nz == 1) {
			if (ym < 0.0) 
				utrise = hour + z1;			
			else 
				utset = hour + z1;
			
		} 
		if (nz == 2) {
			if (ye < 0.0) {
				utrise = hour + z2;
				utset = hour + z1;
			}
			else {
				utrise = hour + z1;
				utset = hour + z2;
			}
		} 
		ym = yp;
		hour += 2.0;
	} 
	var zt=(utrise+utset)/2;
	if(zt<utrise)
		zt=(zt+12)%24;
	return zt;
}

function Cal(mjd, tz, glong, glat,hb) {

	var sglong, sglat, date, ym, yz, above, utrise, utset,hbt, j;
	var yp, nz, rise, sett, hour, z1, z2, iobj, rads = 0.0174532925;
	var quadout = new Array;
	var always_up = "無日落";
	var always_down = "無日出";
	var outstring = "";
	hbt=hb*0.083;
	sinho = Math.sin(rads * -0.833);		
	sglat = Math.sin(rads * glat);
	cglat = Math.cos(rads * glat);
	date = mjd - tz/24;
	rise = false;
	sett = false;
	above = false;
	hour = 1.0;
	ym = sin_alt(2, date, hour - 1.0, glong, cglat, sglat) - sinho;
	if (ym > 0.0) above = true;
	while(hour < 25 && (sett == false || rise == false)) {
		yz = sin_alt(2, date, hour, glong, cglat, sglat) - sinho;
		yp = sin_alt(2, date, hour + 1.0, glong, cglat, sglat) - sinho;
		quadout = quad(ym, yz, yp);
		nz = quadout[0];
		z1 = quadout[1];
		z2 = quadout[2];
		xe = quadout[3];
		ye = quadout[4];
		if (nz == 1) {
			if (ym < 0.0) {
				utrise = hour + z1-hbt;
				rise = true;
			}
			else {
				utset = hour + z1+hbt;
				sett = true;
			}
		} 
		if (nz == 2) {
			if (ye < 0.0) {
				utrise = hour + z2-hbt;
				utset = hour + z1+hbt;
			}
			else {
				utrise = hour + z1-hbt;
				utset = hour + z2+hbt;
			}
		} 
		ym = yp;
		hour += 2.0;
	} 
	if (rise == true || sett == true ) {
		if (rise == true) outstring +='◎天亮：'+ hrsmin(utrise-0.5)+' ◎天黑：'+hrsmin(utset+0.5)+'<br>◎日出：' + hrsmin(utrise);
		else outstring += "◎日出：無日出"+"  ";	
		if (sett == true) outstring += " ◎日落：" + hrsmin(utset)+"<br>";
		else outstring += " ◎日落：無日落<br>";
		var zt=getzttime(mjd, tz, glong)
		outstring+= " ◎日中：" + hrsmin(zt);
		outstring += " ◎晝長："+hrsmin(utset-utrise);
	}
	else {
		if (above == true){
		 outstring += always_up;
		 var zt=getzttime(mjd, tz, glong);
		 outstring+="<br>"+"日中："+hrsmin(zt);
		 outstring += "<br>晝長："+hrsmin(24);
		}
		else outstring += always_down;
	}		
	return outstring;
}

function tick() {
	var today,z1,z2,z3,z4,z5,z6,z7,z8,z9,z10,z11,z12,ztx,scolor;
	var sccolor=new Array("red","#00FF00");
	today = new Date()
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	var stM =tM+1
	if(hours<10) hours='0'+hours
	if(minutes<10) minutes='0'+minutes
	if(seconds<10) seconds='0'+seconds
	scolor=sccolor[seconds%2]
	Clock.innerHTML =tY+'年'+stM+'月'+tD+'日&nbsp;'+hours+':'+minutes+':'+seconds;
	if (( hours >= 1 ) && (hours < 3 )){
		z1=scolor;
		ztx="丑";
	} else {
		z1="#c0c0c0";
	}
	if (( hours >= 3 ) && (hours < 5 )) {
		z2=scolor;
		ztx="寅";
	} else {
		z2="#c0c0c0";
	}
	if (( hours >= 5 ) && (hours < 7 )) {
		z3=scolor;
		ztx="卯";
	} else {
		z3="#c0c0c0";
	}
	if (( hours >= 7 ) && (hours < 9 )){
		z4=scolor;
		ztx="辰";
	} else {
		z4="#c0c0c0";
	}
	if (( hours >= 9 ) && (hours < 11)) {
		z5=scolor;
		ztx="巳";
	} else {
		z5="#c0c0c0";
	}
	if (( hours >= 11) && (hours < 13)) {
		z6=scolor;
		ztx="午";
	} else {
		z6="#c0c0c0";
	}
	if (( hours >= 13) && (hours < 15)){
		z7=scolor;
		ztx="未";
	} else {
		z7="#c0c0c0";
	}
	if (( hours >= 15) && (hours < 17)){
		z8=scolor;
		ztx="申";
	} else {
		z8="#c0c0c0";
	}
	if (( hours >= 17) && (hours < 19)){
		z9=scolor;
		ztx="酉";
	} else {
		z9="#c0c0c0";
	}
	if (( hours >= 19) && (hours < 21)){
		z10=scolor;
		ztx="戌";
	} else {
		z10="#c0c0c0";
	}
	if (( hours >= 21) && (hours < 23)){
		z11=scolor;
		ztx="亥";
	} else {
		z11="#c0c0c0";
	}
	if (((hours >= 23) || (hours < 1))) {
		z12=scolor;
		ztx="子";
	} else {
		z12="#c0c0c0";
	}
	tim.innerHTML='<table border="0" cellpadding="0" cellspacing="0" width="100%">'+'<tr><td width=56></td><td height=2 width=20 bgcolor='+z12+'></td>'+'<td width=20 bgcolor='+z1+'></td><td width=21 bgcolor='+z2+'></td><td width=21 bgcolor='+z3+'></td>'+'<td width=20 bgcolor='+z4+'></td><td width=20 bgcolor='+z5+'></td>'+'<td width=20 bgcolor='+z6+'></td><td width=20 bgcolor='+z7+'></td>'+'<td width=20 bgcolor='+z8+'></td><td width=20 bgcolor='+z9+'></td>'+'<td width=20 bgcolor='+z10+'></td><td width=20 bgcolor='+z11+'></td>'+'<td width=29></td></tr></td></tr></table>'; //48 22 / 56 29
	tim2.innerHTML=ztx;
	window.setTimeout("tick()", 1000);
}

function initial() {
   CLD.SY.selectedIndex=tY-1900;
   CLD.SM.selectedIndex=tM;
   drawCld(tY,tM);
   tick();
}

function getString(isString,n){
       var isResult=isString.substr(isString.length-n,1);
      return  isResult;
}

var provinceOp=null; 
var cityOp=null; 
var PROVNUM=32; 
provinceOp = new Array(PROVNUM); 
provinceOp[0]=new Option("北京"); 
provinceOp[1]=new Option("天津"); 
provinceOp[2]=new Option("河北"); 
provinceOp[3]=new Option("山西"); 
provinceOp[4]=new Option("內蒙"); 
provinceOp[5]=new Option("遼寧"); 
provinceOp[6]=new Option("吉林"); 
provinceOp[7]=new Option("黑龍江"); 
provinceOp[8]=new Option("上海"); 
provinceOp[9]=new Option("江蘇"); 
provinceOp[10]=new Option("浙江"); 
provinceOp[11]=new Option("安徽"); 
provinceOp[12]=new Option("福建"); 
provinceOp[13]=new Option("江西"); 
provinceOp[14]=new Option("山東"); 
provinceOp[15]=new Option("河南"); 
provinceOp[16]=new Option("湖北"); 
provinceOp[17]=new Option("湖南"); 
provinceOp[18]=new Option("廣東"); 
provinceOp[19]=new Option("廣西"); 
provinceOp[20]=new Option("海南"); 
provinceOp[21]=new Option("重慶"); 
provinceOp[22]=new Option("四川"); 
provinceOp[23]=new Option("貴州"); 
provinceOp[24]=new Option("雲南"); 
provinceOp[25]=new Option("西藏"); 
provinceOp[26]=new Option("陝西"); 
provinceOp[27]=new Option("甘肅"); 
provinceOp[28]=new Option("青海"); 
provinceOp[29]=new Option("寧夏"); 
provinceOp[30]=new Option("新疆"); 
provinceOp[31]=new Option("港澳台"); 
cityOp = new Array(PROVNUM); 
cityOp[0] = new Array(11); 
cityOp[0][0]=new Option("----","00399211646"); 
cityOp[0][1]=new Option("北 京","00399211646"); 
cityOp[0][2]=new Option("平 谷","00401311710"); 
cityOp[0][3]=new Option("密 雲","00403711685"); 
cityOp[0][4]=new Option("順 義","00401311665"); 
cityOp[0][5]=new Option("通 縣","00399211667"); 
cityOp[0][6]=new Option("懷 柔","00403211662"); 
cityOp[0][7]=new Option("大 興","00397311633"); 
cityOp[0][8]=new Option("房 山","00397211598"); 
cityOp[0][9]=new Option("延 慶","00404711597"); 
cityOp[0][10]=new Option("昌 平","00402211620"); 
cityOp[1] = new Array(7); 
cityOp[1][0]=new Option("----","011391311720"); 
cityOp[1][1]=new Option("天 津","011391311720"); 
cityOp[1][2]=new Option("寧 河","011393311783"); 
cityOp[1][3]=new Option("靜 海","011389311692"); 
cityOp[1][4]=new Option("薊 縣","011400511740"); 
cityOp[1][5]=new Option("寶 坻","011397511730"); 
cityOp[1][6]=new Option("武 清","011394011705"); 
cityOp[2] = new Array(34); 
cityOp[2][0]=new Option("----","040380211430"); 
cityOp[2][1]=new Option("石家莊","040380211430"); 
cityOp[2][2]=new Option("安國","040382411520"); 
cityOp[2][3]=new Option("保定","170385111530"); 
cityOp[2][4]=new Option("霸州","170390611624"); 
cityOp[2][5]=new Option("泊頭","170380411634"); 
cityOp[2][6]=new Option("滄州","170381811652"); 
cityOp[2][7]=new Option("承德","100405911757"); 
cityOp[2][8]=new Option("定州","040383011500"); 
cityOp[2][9]=new Option("豐南","040393411806"); 
cityOp[2][10]=new Option("高碑店","040392011551"); 
cityOp[2][11]=new Option("蒿城","040380211450"); 
cityOp[2][12]=new Option("邯鄲","040363611428"); 
cityOp[2][13]=new Option("河間","040382611605"); 
cityOp[2][14]=new Option("衡水","040374411542"); 
cityOp[2][15]=new Option("黃驊","040382111721"); 
cityOp[2][16]=new Option("晉州","040380211502"); 
cityOp[2][17]=new Option("冀州","040373411533"); 
cityOp[2][18]=new Option("廓坊","040393111642"); 
cityOp[2][19]=new Option("鹿泉","040380411419"); 
cityOp[2][20]=new Option("南宮","040372211523"); 
cityOp[2][21]=new Option("秦皇島","090395511935"); 
cityOp[2][22]=new Option("任丘","040384211607");
cityOp[2][23]=new Option("三河","040395811704");
cityOp[2][24]=new Option("沙河","040365111430"); 
cityOp[2][25]=new Option("深州","040380111532"); 
cityOp[2][26]=new Option("唐山","040393611811"); 
cityOp[2][27]=new Option("武安","040364211411"); 
cityOp[2][28]=new Option("邢台","040370411430"); 
cityOp[2][29]=new Option("辛集","040375411512"); 
cityOp[2][30]=new Option("新樂","040382011441"); 
cityOp[2][31]=new Option("張家口","040404811453"); 
cityOp[2][32]=new Option("涿州","040392911559"); 
cityOp[2][33]=new Option("遵化","040401111758"); 
cityOp[3] = new Array(21); 
cityOp[3][0]=new Option("----","030375411233"); 
cityOp[3][1]=new Option("太原","030375411233"); 
cityOp[3][2]=new Option("長治","030361111306"); 
cityOp[3][3]=new Option("大同","070400611317"); 
cityOp[3][4]=new Option("高平","030354811255"); 
cityOp[3][5]=new Option("古交","030375411209"); 
cityOp[3][6]=new Option("河津","030353511041"); 
cityOp[3][7]=new Option("侯馬","030353711121"); 
cityOp[3][8]=new Option("霍州","030363411142"); 
cityOp[3][9]=new Option("介休","030370211155"); 
cityOp[3][10]=new Option("晉城","030353011251"); 
cityOp[3][11]=new Option("臨汾","030360511131"); 
cityOp[3][12]=new Option("潞城","030362111314"); 
cityOp[3][13]=new Option("朔州","080391911226"); 
cityOp[3][14]=new Option("孝義","030370811148"); 
cityOp[3][15]=new Option("忻州","030382411243"); 
cityOp[3][16]=new Option("陽泉","030375111334"); 
cityOp[3][17]=new Option("永濟","030345211027"); 
cityOp[3][18]=new Option("原平","030384311242"); 
cityOp[3][19]=new Option("榆次","030374111243"); 
cityOp[3][20]=new Option("運城","030350211059"); 
cityOp[4] = new Array(20); 
cityOp[4][0]=new Option("----","020404811141"); 
cityOp[4][1]=new Option("呼和浩特","020404811141"); 
cityOp[4][2]=new Option("包頭","160403910949"); 
cityOp[4][3]=new Option("赤峰","020421711858"); 
cityOp[4][4]=new Option("東勝","020394810959"); 
cityOp[4][5]=new Option("二連浩特","180433811158"); 
cityOp[4][6]=new Option("額爾古納","020501312011"); 
cityOp[4][7]=new Option("豐鎮","020402711309"); 
cityOp[4][8]=new Option("根河","020504812129"); 
cityOp[4][9]=new Option("海拉爾","020491211939"); 
cityOp[4][10]=new Option("霍林郭勒","020453211938"); 
cityOp[4][11]=new Option("集寧","020410211306"); 
cityOp[4][12]=new Option("臨河","020404610722"); 
cityOp[4][13]=new Option("滿洲裡","020493511723"); 
cityOp[4][14]=new Option("通遼","020433712216"); 
cityOp[4][15]=new Option("烏蘭浩特","020460312203"); 
cityOp[4][16]=new Option("烏海","020394010648"); 
cityOp[4][17]=new Option("錫林浩特","020435711603"); 
cityOp[4][18]=new Option("牙克石","020491712040"); 
cityOp[4][19]=new Option("扎蘭屯","020480012247"); 
cityOp[5] = new Array(30); 
cityOp[5][0]=new Option("----","610414812325"); 
cityOp[5][1]=new Option("瀋陽","610414812325"); 
cityOp[5][2]=new Option("鞍山","660410712300"); 
cityOp[5][3]=new Option("北票","610414812047"); 
cityOp[5][4]=new Option("本溪","610411812346"); 
cityOp[5][5]=new Option("朝陽","610413412027"); 
cityOp[5][6]=new Option("大連","630385512136"); 
cityOp[5][7]=new Option("丹東","650400812422"); 
cityOp[5][8]=new Option("大石橋","610403712231"); 
cityOp[5][9]=new Option("東港","610395312408"); 
cityOp[5][10]=new Option("鳳城","610402812402"); 
cityOp[5][11]=new Option("撫順","610415112354"); 
cityOp[5][12]=new Option("阜新","610420112139"); 
cityOp[5][13]=new Option("蓋州","610402412221"); 
cityOp[5][14]=new Option("海城","610405112243"); 
cityOp[5][15]=new Option("葫蘆島","610404512051"); 
cityOp[5][16]=new Option("錦州","670410712109"); 
cityOp[5][17]=new Option("開原","610423212402"); 
cityOp[5][18]=new Option("遼陽","610411612312"); 
cityOp[5][19]=new Option("凌海","610411012121"); 
cityOp[5][20]=new Option("凌源","610411411922"); 
cityOp[5][21]=new Option("盤錦","610410712203"); 
cityOp[5][22]=new Option("普蘭店","610392312158"); 
cityOp[5][23]=new Option("鐵法","610422812332"); 
cityOp[5][24]=new Option("鐵嶺","610421812351"); 
cityOp[5][25]=new Option("瓦房店","610393712200"); 
cityOp[5][26]=new Option("興城","610403712041"); 
cityOp[5][27]=new Option("新民","610415912249"); 
cityOp[5][28]=new Option("營口","700403912213"); 
cityOp[5][29]=new Option("莊河","610394112258"); 
cityOp[6] = new Array(27); 
cityOp[6][0]=new Option("----","620435412519"); 
cityOp[6][1]=new Option("長春","620435412519"); 
cityOp[6][2]=new Option("白城","620453812250"); 
cityOp[6][3]=new Option("白山","680415612626"); 
cityOp[6][4]=new Option("大安","620453012418"); 
cityOp[6][5]=new Option("德惠","620443212542"); 
cityOp[6][6]=new Option("敦化","620432212813"); 
cityOp[6][7]=new Option("公主嶺","620433112449"); 
cityOp[6][8]=new Option("和龍","620423212900"); 
cityOp[6][9]=new Option("樺甸","620425812644"); 
cityOp[6][10]=new Option("琿春","620425213022"); 
cityOp[6][11]=new Option("集安","620410812611"); 
cityOp[6][12]=new Option("蛟河","620434212721"); 
cityOp[6][13]=new Option("吉林","620435212633"); 
cityOp[6][14]=new Option("九台","620440912551"); 
cityOp[6][15]=new Option("遼源","620425412509"); 
cityOp[6][16]=new Option("臨江","620414912653"); 
cityOp[6][17]=new Option("龍井","620424612926"); 
cityOp[6][18]=new Option("梅河口","620423212540"); 
cityOp[6][19]=new Option("舒蘭","620442412657"); 
cityOp[6][20]=new Option("四平","620431012422"); 
cityOp[6][21]=new Option("松原","620451112449"); 
cityOp[6][22]=new Option("洮南","620452012247"); 
cityOp[6][23]=new Option("通化","620414312556"); 
cityOp[6][24]=new Option("圖們","680425712951"); 
cityOp[6][25]=new Option("延吉","680425412930"); 
cityOp[6][26]=new Option("愉樹","680444912632"); 
cityOp[7] = new Array(30); 
cityOp[7][0]=new Option("----","600454412636"); 
cityOp[7][1]=new Option("哈爾濱","600454412636"); 
cityOp[7][2]=new Option("阿城","600453212658"); 
cityOp[7][3]=new Option("安達","600462412518"); 
cityOp[7][4]=new Option("北安","600481512631"); 
cityOp[7][5]=new Option("大慶","600463612501"); 
cityOp[7][6]=new Option("富錦","600471513202"); 
cityOp[7][7]=new Option("海林","600443512921"); 
cityOp[7][8]=new Option("海倫","600472812657"); 
cityOp[7][9]=new Option("鶴崗","600472013016"); 
cityOp[7][10]=new Option("黑河","690501412729"); 
cityOp[7][11]=new Option("佳木斯","600464713022"); 
cityOp[7][12]=new Option("雞西","600451713057"); 
cityOp[7][13]=new Option("密山","600453213150"); 
cityOp[7][14]=new Option("牡丹江","640443512936"); 
cityOp[7][15]=new Option("訥河","600482912451"); 
cityOp[7][16]=new Option("寧安","600442112928"); 
cityOp[7][17]=new Option("齊齊哈爾","690472012357"); 
cityOp[7][18]=new Option("七台河","600454813049"); 
cityOp[7][19]=new Option("雙城","600452212615"); 
cityOp[7][20]=new Option("尚志","600451412755"); 
cityOp[7][21]=new Option("雙鴨山","600463813111"); 
cityOp[7][22]=new Option("綏芬河","690442513111"); 
cityOp[7][23]=new Option("綏化","600463812659"); 
cityOp[7][24]=new Option("鐵力","600465912801"); 
cityOp[7][25]=new Option("同江","600473913230"); 
cityOp[7][26]=new Option("五常","600445512711"); 
cityOp[7][27]=new Option("五大連池","600483812607"); 
cityOp[7][28]=new Option("伊春","600474212856"); 
cityOp[7][29]=new Option("肇東","600460412558"); 
cityOp[8] = new Array(11); 
cityOp[8][0]=new Option("----","200312212148"); 
cityOp[8][1]=new Option("上 海","200312212148");
cityOp[8][2]=new Option("嘉 定","200314012124");
cityOp[8][3]=new Option("寶 山","200314112148");
cityOp[8][4]=new Option("川 沙","200311912170");
cityOp[8][5]=new Option("南 匯","200310512176"); 
cityOp[8][6]=new Option("奉 賢","200309212146"); 
cityOp[8][7]=new Option("松 江","200310012124"); 
cityOp[8][8]=new Option("金 山","200308912116"); 
cityOp[8][9]=new Option("青 浦","200311512110"); 
cityOp[8][10]=new Option("崇 明","200317312140"); 
cityOp[9] = new Array(40); 
cityOp[9][0]=new Option("----","210320311846"); 
cityOp[9][1]=new Option("南京","210320311846"); 
cityOp[9][2]=new Option("常熟","210313912043"); 
cityOp[9][3]=new Option("常州","300314711958"); 
cityOp[9][4]=new Option("丹陽","210320011932"); 
cityOp[9][5]=new Option("東台","210325112019"); 
cityOp[9][6]=new Option("高郵","210324711927"); 
cityOp[9][7]=new Option("海門","210315312109"); 
cityOp[9][8]=new Option("淮安","210333011909"); 
cityOp[9][9]=new Option("淮陰","210333611902"); 
cityOp[9][10]=new Option("江都","210322611932"); 
cityOp[9][11]=new Option("姜堰","210323412008"); 
cityOp[9][12]=new Option("江陰","210315412017"); 
cityOp[9][13]=new Option("靖江","210320212017"); 
cityOp[9][14]=new Option("金壇","210314611933"); 
cityOp[9][15]=new Option("昆山","210312312057"); 
cityOp[9][16]=new Option("連雲港","290343611910"); 
cityOp[9][17]=new Option("溧陽","210312611929"); 
cityOp[9][18]=new Option("南通","310320112051"); 
cityOp[9][19]=new Option("邳州","210341911759"); 
cityOp[9][20]=new Option("啟樂","210314812139"); 
cityOp[9][21]=new Option("如皋","210322312033"); 
cityOp[9][22]=new Option("宿遷","210335811818"); 
cityOp[9][23]=new Option("蘇州","240311912037"); 
cityOp[9][24]=new Option("太倉","210312712106"); 
cityOp[9][25]=new Option("泰興","210321012001"); 
cityOp[9][26]=new Option("泰州","210323011954"); 
cityOp[9][27]=new Option("通州","210320512103"); 
cityOp[9][28]=new Option("吳江","210311012039"); 
cityOp[9][29]=new Option("無錫","230313412018"); 
cityOp[9][30]=new Option("興化","210325611950"); 
cityOp[9][31]=new Option("新沂","210342211820"); 
cityOp[9][32]=new Option("徐州","210341511711"); 
cityOp[9][33]=new Option("鹽在","210332212008"); 
cityOp[9][34]=new Option("揚中","250321411949"); 
cityOp[9][35]=new Option("揚州","250322311926"); 
cityOp[9][36]=new Option("宜興","210312111949"); 
cityOp[9][37]=new Option("儀征","210321611910"); 
cityOp[9][38]=new Option("張家港","210315212032"); 
cityOp[9][39]=new Option("鎮江","210321111927"); 
cityOp[10] = new Array(34); 
cityOp[10][0]=new Option("----","220301612010"); 
cityOp[10][1]=new Option("杭州","220301612010"); 
cityOp[10][2]=new Option("慈溪","220301112115"); 
cityOp[10][3]=new Option("東陽","220291612014"); 
cityOp[10][4]=new Option("奉化","220293912124"); 
cityOp[10][5]=new Option("富陽","220300311957"); 
cityOp[10][6]=new Option("海寧","220303212042"); 
cityOp[10][7]=new Option("湖州","220305212006"); 
cityOp[10][8]=new Option("建德","220292911916"); 
cityOp[10][9]=new Option("江山","220284511837"); 
cityOp[10][10]=new Option("嘉興","220304612045"); 
cityOp[10][11]=new Option("金華","220290711939"); 
cityOp[10][12]=new Option("蘭溪","220291211928"); 
cityOp[10][13]=new Option("臨海","220285112108"); 
cityOp[10][14]=new Option("麗水","220282711954"); 
cityOp[10][15]=new Option("龍泉","220280411908"); 
cityOp[10][16]=new Option("寧波","220295212133"); 
cityOp[10][17]=new Option("平湖","220304212101"); 
cityOp[10][18]=new Option("衢州","220285811852"); 
cityOp[10][19]=new Option("瑞安","220274812038"); 
cityOp[10][20]=new Option("上虞","220300112052"); 
cityOp[10][21]=new Option("紹興","320300012034"); 
cityOp[10][22]=new Option("台州","480284112127"); 
cityOp[10][23]=new Option("桐鄉","480303812032"); 
cityOp[10][24]=new Option("溫嶺","480282212121"); 
cityOp[10][25]=new Option("溫州","480280112039"); 
cityOp[10][26]=new Option("蕭山","480300912016"); 
cityOp[10][27]=new Option("義烏","480291812004"); 
cityOp[10][28]=new Option("樂清","480280812058"); 
cityOp[10][29]=new Option("餘杭","480302612018"); 
cityOp[10][30]=new Option("余姚","480300212110"); 
cityOp[10][31]=new Option("永康","480295412001"); 
cityOp[10][32]=new Option("舟山","480300112206"); 
cityOp[10][33]=new Option("諸暨","220294312014"); 
cityOp[11] = new Array(21); 
cityOp[11][0]=new Option("----","190315211717"); 
cityOp[11][1]=new Option("合肥","190315211717"); 
cityOp[11][2]=new Option("安慶","260303111702"); 
cityOp[11][3]=new Option("蚌埠","190325611721"); 
cityOp[11][4]=new Option("亳州","190335211547"); 
cityOp[11][5]=new Option("巢湖","190313611752"); 
cityOp[11][6]=new Option("滁州","190321811818"); 
cityOp[11][7]=new Option("阜陽","190325411548"); 
cityOp[11][8]=new Option("貴池","190303911728"); 
cityOp[11][9]=new Option("淮北","190335711647"); 
cityOp[11][10]=new Option("淮南","190323711658"); 
cityOp[11][11]=new Option("黃山天都峰","272294311818"); 
cityOp[11][12]=new Option("界首","190331511521"); 
cityOp[11][13]=new Option("六安","190314411628"); 
cityOp[11][14]=new Option("馬鞍山","190314311828"); 
cityOp[11][15]=new Option("明光","190324711758"); 
cityOp[11][16]=new Option("宿州","190333811658"); 
cityOp[11][17]=new Option("天長","190324111859"); 
cityOp[11][18]=new Option("銅陵","190305611748"); 
cityOp[11][19]=new Option("蕪湖","190311911822"); 
cityOp[11][20]=new Option("宣州","190305711844"); 
cityOp[12] = new Array(23); 
cityOp[12][0]=new Option("------","340260511918"); 
cityOp[12][1]=new Option("福州","340260511918"); 
cityOp[12][2]=new Option("長樂","340255811931"); 
cityOp[12][3]=new Option("福安","340270611939"); 
cityOp[12][4]=new Option("福清","340254211923"); 
cityOp[12][5]=new Option("建甌","340270311820"); 
cityOp[12][6]=new Option("建陽","340272111807"); 
cityOp[12][7]=new Option("晉江","340244911835"); 
cityOp[12][8]=new Option("龍海","330242611748"); 
cityOp[12][9]=new Option("龍巖","330250611701"); 
cityOp[12][10]=new Option("南安","340245711823"); 
cityOp[12][11]=new Option("南平","340263811810"); 
cityOp[12][12]=new Option("寧德","340263911931"); 
cityOp[12][13]=new Option("莆田","380242611901"); 
cityOp[12][14]=new Option("泉州","380245611836"); 
cityOp[12][15]=new Option("三明","490261311736"); 
cityOp[12][16]=new Option("邵武","490272011729"); 
cityOp[12][17]=new Option("石獅","380244411838"); 
cityOp[12][18]=new Option("武夷山","490274611802"); 
cityOp[12][19]=new Option("廈門","380242711806"); 
cityOp[12][20]=new Option("永安","340255811723"); 
cityOp[12][21]=new Option("漳平","500251711724"); 
cityOp[12][22]=new Option("漳州","500243111739"); 
cityOp[13] = new Array(20); 
cityOp[13][0]=new Option("------","500284011555"); 
cityOp[13][1]=new Option("南昌","500284011555"); 
cityOp[13][2]=new Option("德興","500285711735"); 
cityOp[13][3]=new Option("豐城","500281211548"); 
cityOp[13][4]=new Option("贛州","580285211456"); 
cityOp[13][5]=new Option("高安","580282511522"); 
cityOp[13][6]=new Option("吉安","580270711458"); 
cityOp[13][7]=new Option("景德鎮","280291711713"); 
cityOp[13][8]=new Option("井岡山","580263411410"); 
cityOp[13][9]=new Option("九江","550294311558"); 
cityOp[13][10]=new Option("樂平","580285811708"); 
cityOp[13][11]=new Option("臨川","580275911621"); 
cityOp[13][12]=new Option("萍鄉","580273711350"); 
cityOp[13][13]=new Option("瑞昌","580294011538"); 
cityOp[13][14]=new Option("瑞金","580255311601"); 
cityOp[13][15]=new Option("上饒","580252711758"); 
cityOp[13][16]=new Option("新余","580274811456"); 
cityOp[13][17]=new Option("宜春","580274711423"); 
cityOp[13][18]=new Option("鷹潭","580281411703"); 
cityOp[13][19]=new Option("樟樹","580280311532"); 
cityOp[14] = new Array(48); 
cityOp[14][0]=new Option("------","050364011700"); 
cityOp[14][1]=new Option("濟南","050364011700"); 
cityOp[14][2]=new Option("安丘","050362511912"); 
cityOp[14][3]=new Option("濱州","050372211802"); 
cityOp[14][4]=new Option("昌邑","050395211924"); 
cityOp[14][5]=new Option("德州","050372611617"); 
cityOp[14][6]=new Option("東營","050372711830"); 
cityOp[14][7]=new Option("肥城","050361411646"); 
cityOp[14][8]=new Option("高密","050362211944"); 
cityOp[14][9]=new Option("菏澤","050351411526"); 
cityOp[14][10]=new Option("膠南","050355311958"); 
cityOp[14][11]=new Option("膠州","050361712000"); 
cityOp[14][12]=new Option("即墨","050362212028"); 
cityOp[14][13]=new Option("濟寧","050352311633"); 
cityOp[14][14]=new Option("萊蕪","050361211740"); 
cityOp[14][15]=new Option("萊西","050365212031"); 
cityOp[14][16]=new Option("萊陽","050365812042"); 
cityOp[14][17]=new Option("萊州","050371011957"); 
cityOp[14][18]=new Option("樂陵","050374411712"); 
cityOp[14][19]=new Option("聊城","050362611557"); 
cityOp[14][20]=new Option("臨清","050365111542"); 
cityOp[14][21]=new Option("臨沂","050350311820"); 
cityOp[14][22]=new Option("龍口","050373912021"); 
cityOp[14][23]=new Option("蓬萊","110374812045"); 
cityOp[14][24]=new Option("平度","050364711958"); 
cityOp[14][25]=new Option("青島","060360312018"); 
cityOp[14][26]=new Option("青州","050364211828"); 
cityOp[14][27]=new Option("曲阜","050353611658"); 
cityOp[14][28]=new Option("日照","050352311932"); 
cityOp[14][29]=new Option("榮成","050371012225"); 
cityOp[14][30]=new Option("乳山","050365412131"); 
cityOp[14][31]=new Option("壽光","050365311844"); 
cityOp[14][32]=new Option("泰安","150361111708"); 
cityOp[14][33]=new Option("泰山岱頂","151361111708"); 
cityOp[14][34]=new Option("滕州","050350611709"); 
cityOp[14][35]=new Option("濰坊","130364311906"); 
cityOp[14][36]=new Option("威海","140373112207"); 
cityOp[14][37]=new Option("文登","050371212203"); 
cityOp[14][38]=new Option("新泰","050355411745"); 
cityOp[14][39]=new Option("煙台","110373212124"); 
cityOp[14][40]=new Option("兗州","050353211649"); 
cityOp[14][41]=new Option("禹城","050365611639"); 
cityOp[14][42]=new Option("棗莊","050345211733"); 
cityOp[14][43]=new Option("章丘","050364311732"); 
cityOp[14][44]=new Option("招遠","050372112023"); 
cityOp[14][45]=new Option("諸城","050355911924"); 
cityOp[14][46]=new Option("淄博","120364811803"); 
cityOp[14][47]=new Option("鄒城","120352411658"); 
cityOp[15] = new Array(37); 
cityOp[15][0]=new Option("------","510344611340"); 
cityOp[15][1]=new Option("鄭州","510344611340"); 
cityOp[15][2]=new Option("安陽","510360611421"); 
cityOp[15][3]=new Option("長葛","510341211347"); 
cityOp[15][4]=new Option("登封","510342711302"); 
cityOp[15][5]=new Option("鄧州","510324211205"); 
cityOp[15][6]=new Option("鞏義","510344611258"); 
cityOp[15][7]=new Option("鶴壁","510355411411"); 
cityOp[15][8]=new Option("輝縣","510352711347"); 
cityOp[15][9]=new Option("焦作","510351411312"); 
cityOp[15][10]=new Option("濟源","510350411235"); 
cityOp[15][11]=new Option("開封","560344711421"); 
cityOp[15][12]=new Option("靈寶","510343111052"); 
cityOp[15][13]=new Option("林州","510360311349"); 
cityOp[15][14]=new Option("漯河","510333311402"); 
cityOp[15][15]=new Option("洛陽","560344111227"); 
cityOp[15][16]=new Option("南陽","510330011232"); 
cityOp[15][17]=new Option("平頂山","510334411317"); 
cityOp[15][18]=new Option("濮陽","510354411501"); 
cityOp[15][19]=new Option("沁陽","510350511257"); 
cityOp[15][20]=new Option("汝州","510340911250"); 
cityOp[15][21]=new Option("三門峽","510344711112"); 
cityOp[15][22]=new Option("商丘","510342611538"); 
cityOp[15][23]=new Option("衛輝","510352411403"); 
cityOp[15][24]=new Option("舞鋼","510331711330"); 
cityOp[15][25]=new Option("項城","510332611454"); 
cityOp[15][26]=new Option("滎陽","510344611321"); 
cityOp[15][27]=new Option("新密","510343111322"); 
cityOp[15][28]=new Option("新鄉","510351811352"); 
cityOp[15][29]=new Option("信陽","510320711404"); 
cityOp[15][30]=new Option("新鄭","510342411343"); 
cityOp[15][31]=new Option("許昌","510340111349"); 
cityOp[15][32]=new Option("偃師","510344311247"); 
cityOp[15][33]=new Option("義馬","510344311155"); 
cityOp[15][34]=new Option("禹州","510340911328"); 
cityOp[15][35]=new Option("周口","510333711438"); 
cityOp[15][36]=new Option("駐馬店","510325811401"); 
cityOp[16] = new Array(34); 
cityOp[16][0]=new Option("------","520303511417"); 
cityOp[16][1]=new Option("武漢","520303511417"); 
cityOp[16][2]=new Option("安陸","520311511341"); 
cityOp[16][3]=new Option("當陽","520305011147"); 
cityOp[16][4]=new Option("丹江口","520323310830"); 
cityOp[16][5]=new Option("大冶","520300611458"); 
cityOp[16][6]=new Option("恩施","520301610929"); 
cityOp[16][7]=new Option("鄂州","520302311452"); 
cityOp[16][8]=new Option("廣水","520313711348"); 
cityOp[16][9]=new Option("洪湖","520294811327"); 
cityOp[16][10]=new Option("黃石","520301211506"); 
cityOp[16][11]=new Option("黃州","520302711452"); 
cityOp[16][12]=new Option("荊門","570310211212"); 
cityOp[16][13]=new Option("荊沙","520301811216"); 
cityOp[16][14]=new Option("老河口","520322311140"); 
cityOp[16][15]=new Option("利川","520301810856"); 
cityOp[16][16]=new Option("麻城","520311011501"); 
cityOp[16][17]=new Option("浦圻","520294211351"); 
cityOp[16][18]=new Option("潛江","520302611253"); 
cityOp[16][19]=new Option("石首","520294311224"); 
cityOp[16][20]=new Option("十堰","520324011047"); 
cityOp[16][21]=new Option("隨州","520314211322"); 
cityOp[16][22]=new Option("天門","520603911310"); 
cityOp[16][23]=new Option("武穴","520295111533"); 
cityOp[16][24]=new Option("襄樊","520320211208"); 
cityOp[16][25]=new Option("咸寧","520295311417"); 
cityOp[16][26]=new Option("仙桃","520302211327"); 
cityOp[16][27]=new Option("孝感","520305611354"); 
cityOp[16][28]=new Option("宜昌","570304211117"); 
cityOp[16][29]=new Option("宜城","570314211215"); 
cityOp[16][30]=new Option("應城","520305711333"); 
cityOp[16][31]=new Option("棗陽","520320711244"); 
cityOp[16][32]=new Option("枝城","520302311127"); 
cityOp[16][33]=new Option("鍾祥","520311011234"); 
cityOp[17] = new Array(30); 
cityOp[17][0]=new Option("------","530281211259"); 
cityOp[17][1]=new Option("長沙","530281211259"); 
cityOp[17][2]=new Option("常德","530290211151"); 
cityOp[17][3]=new Option("郴州","530254611302"); 
cityOp[17][4]=new Option("衡陽","530265311237"); 
cityOp[17][5]=new Option("洪江","530270710959"); 
cityOp[17][6]=new Option("懷化","590273310958"); 
cityOp[17][7]=new Option("津市","530293811152"); 
cityOp[17][8]=new Option("吉首","530281810943"); 
cityOp[17][9]=new Option("耒陽","530262411251"); 
cityOp[17][10]=new Option("冷水江","530274211126"); 
cityOp[17][11]=new Option("冷水灘","530262611135"); 
cityOp[17][12]=new Option("漣源","530274111141"); 
cityOp[17][13]=new Option("醴陵","530274011330"); 
cityOp[17][14]=new Option("臨湘","530292911327"); 
cityOp[17][15]=new Option("瀏陽","530280911337"); 
cityOp[17][16]=new Option("婁底","530274411159"); 
cityOp[17][17]=new Option("汨羅","530284911303"); 
cityOp[17][18]=new Option("韶山","530275411229"); 
cityOp[17][19]=new Option("邵陽","530271411128"); 
cityOp[17][20]=new Option("武岡","530264311037"); 
cityOp[17][21]=new Option("湘潭","530275211253"); 
cityOp[17][22]=new Option("湘鄉","530274411231"); 
cityOp[17][23]=new Option("益陽","530283611220"); 
cityOp[17][24]=new Option("永州","530261311137"); 
cityOp[17][25]=new Option("沅江","530285011222"); 
cityOp[17][26]=new Option("岳陽","530292211306"); 
cityOp[17][27]=new Option("張家界","590290811029"); 
cityOp[17][28]=new Option("株洲","530275111309"); 
cityOp[17][29]=new Option("資興","530255811313"); 
cityOp[18] = new Array(52); 
cityOp[18][0]=new Option("----","370230811314"); 
cityOp[18][1]=new Option("廣州","370230811314"); 
cityOp[18][2]=new Option("番禺","370225711322"); 
cityOp[18][3]=new Option("從化","370233311333"); 
cityOp[18][4]=new Option("花都","370232311312"); 
cityOp[18][5]=new Option("潮陽","390231611636"); 
cityOp[18][6]=new Option("潮州","390234011638"); 
cityOp[18][7]=new Option("澄海","390232811646"); 
cityOp[18][8]=new Option("東莞","370230211345");
cityOp[18][9]=new Option("恩平","370221211219"); 
cityOp[18][10]=new Option("佛山","370230211306"); 
cityOp[18][11]=new Option("南海","370230111309"); 
cityOp[18][12]=new Option("順德","370225011315"); 
cityOp[18][13]=new Option("三水 ","370231811289"); 
cityOp[18][14]=new Option("高明","370225311250"); 
cityOp[18][15]=new Option("高要","370230211226"); 
cityOp[18][16]=new Option("高州","370215411050"); 
cityOp[18][17]=new Option("鶴山","370224611257"); 
cityOp[18][18]=new Option("河源","460234311441"); 
cityOp[18][19]=new Option("惠陽","460224811428"); 
cityOp[18][20]=new Option("惠州","460230511422"); 
cityOp[18][21]=new Option("江門","370223511304"); 
cityOp[18][22]=new Option("揭陽","460223211621"); 
cityOp[18][23]=new Option("開平","370222211240"); 
cityOp[18][24]=new Option("樂昌","370250911321"); 
cityOp[18][25]=new Option("雷州","450205411004"); 
cityOp[18][26]=new Option("廉江","450213711017"); 
cityOp[18][27]=new Option("連州","370244811223"); 
cityOp[18][28]=new Option("羅定","460224611133"); 
cityOp[18][29]=new Option("茂名","450214011053"); 
cityOp[18][30]=new Option("化州","450213911037"); 
cityOp[18][31]=new Option("梅州","390241911607"); 
cityOp[18][32]=new Option("普寧","390231811610"); 
cityOp[18][33]=new Option("清遠","370234211301"); 
cityOp[18][34]=new Option("汕頭","390232211641"); 
cityOp[18][35]=new Option("汕尾","460224711521"); 
cityOp[18][36]=new Option("韶關","370244811337"); 
cityOp[18][37]=new Option("四會","370232111241"); 
cityOp[18][38]=new Option("台山","370221511248"); 
cityOp[18][39]=new Option("吳川","450212611047"); 
cityOp[18][40]=new Option("新會","370223211301"); 
cityOp[18][41]=new Option("興寧","370240911543"); 
cityOp[18][42]=new Option("陽春","370221011148"); 
cityOp[18][43]=new Option("陽江","370215011158"); 
cityOp[18][44]=new Option("英德","370241011322"); 
cityOp[18][45]=new Option("雲浮","370225711202"); 
cityOp[18][46]=new Option("增城","370231811349"); 
cityOp[18][47]=new Option("湛江","450211111024"); 
cityOp[18][48]=new Option("肇慶","370230311227"); 
cityOp[18][49]=new Option("中山","440223111322"); 
cityOp[18][50]=new Option("珠海","440221711334"); 
cityOp[18][51]=new Option("深圳","400223311407"); 
cityOp[19] = new Array(17); 
cityOp[19][0]=new Option("----","350224810819"); 
cityOp[19][1]=new Option("南寧","350224810819"); 
cityOp[19][2]=new Option("北海","430212810907"); 
cityOp[19][3]=new Option("北流","350224211021"); 
cityOp[19][4]=new Option("百色","350235410636");
cityOp[19][5]=new Option("防城港","430213710820"); 
cityOp[19][6]=new Option("貴港","350230610936"); 
cityOp[19][7]=new Option("桂林","410251711017"); 
cityOp[19][8]=new Option("桂平","410232211004"); 
cityOp[19][9]=new Option("河池","350244210803"); 
cityOp[19][10]=new Option("合山","350234710852"); 
cityOp[19][11]=new Option("柳州","350231910924"); 
cityOp[19][12]=new Option("賃祥","350220710644"); 
cityOp[19][13]=new Option("欽州","430215710837"); 
cityOp[19][14]=new Option("梧州","430232911120"); 
cityOp[19][15]=new Option("玉林","350223811009"); 
cityOp[19][16]=new Option("宜州","350242810840"); 
cityOp[20] = new Array(7); 
cityOp[20][0]=new Option("----","360200211020"); 
cityOp[20][1]=new Option("海口","360200211020"); 
cityOp[20][2]=new Option("儋州","420193110934"); 
cityOp[20][3]=new Option("瓊海","360191411028"); 
cityOp[20][4]=new Option("瓊山","360195911021"); 
cityOp[20][5]=new Option("三亞","420181410931"); 
cityOp[20][6]=new Option("通什","360184610931"); 
cityOp[21] = new Array(6); 
cityOp[21][0]=new Option("----","810293510633"); 
cityOp[21][1]=new Option("重慶","810293510633"); 
cityOp[21][2]=new Option("合川","810300210615"); 
cityOp[21][3]=new Option("江津","810291810616"); 
cityOp[21][4]=new Option("南川","810291010705"); 
cityOp[21][5]=new Option("永川","810292310553"); 
cityOp[22] = new Array(32); 
cityOp[22][0]=new Option("----","830304010404"); 
cityOp[22][1]=new Option("成都","830304010404"); 
cityOp[22][2]=new Option("巴中","830315110643"); 
cityOp[22][3]=new Option("崇州","830303910340"); 
cityOp[22][4]=new Option("達川","830311410729"); 
cityOp[22][5]=new Option("德陽","830310910422"); 
cityOp[22][6]=new Option("都江堰","830310110337"); 
cityOp[22][7]=new Option("峨眉山","870293610329"); 
cityOp[22][8]=new Option("峨眉金頂","873293610329"); 
cityOp[22][9]=new Option("涪陵","830294210722"); 
cityOp[22][10]=new Option("廣漢","880305810415"); 
cityOp[22][11]=new Option("廣元","880322810551"); 
cityOp[22][12]=new Option("華鎣","830302610644"); 
cityOp[22][13]=new Option("簡陽","830302410432"); 
cityOp[22][14]=new Option("江油","880314810442"); 
cityOp[22][15]=new Option("閬中","830313610558"); 
cityOp[22][16]=new Option("樂山","870293610344"); 
cityOp[22][17]=new Option("瀘州","870285410524"); 
cityOp[22][18]=new Option("綿陽","880313010442"); 
cityOp[22][19]=new Option("南充","830304910604"); 
cityOp[22][20]=new Option("內江","830293610502"); 
cityOp[22][21]=new Option("攀枝花","830263410143"); 
cityOp[22][22]=new Option("彭州","830305910357"); 
cityOp[22][23]=new Option("邛崍","830302610328"); 
cityOp[22][24]=new Option("遂寧","830303110533"); 
cityOp[22][25]=new Option("萬縣","830305010821"); 
cityOp[22][26]=new Option("萬源","830320310803"); 
cityOp[22][27]=new Option("西昌","830275410216"); 
cityOp[22][28]=new Option("雅安","860295910259"); 
cityOp[22][29]=new Option("宜賓","870284710434"); 
cityOp[22][30]=new Option("自貢","870292310446"); 
cityOp[22][31]=new Option("資陽","830300910438"); 
cityOp[23] = new Array(12); 
cityOp[23][0]=new Option("----","840263510642"); 
cityOp[23][1]=new Option("貴陽","840263510642"); 
cityOp[23][2]=new Option("安順","840261410555"); 
cityOp[23][3]=new Option("畢節","840271810518"); 
cityOp[23][4]=new Option("赤水","840283410542"); 
cityOp[23][5]=new Option("都勻","840261510731"); 
cityOp[23][6]=new Option("凱裡","840263510758"); 
cityOp[23][7]=new Option("六盤水","840263510450"); 
cityOp[23][8]=new Option("清鎮","840263310627"); 
cityOp[23][9]=new Option("銅仁","840274310912"); 
cityOp[23][10]=new Option("興義","840250510453"); 
cityOp[23][11]=new Option("遵義","841274210655"); 
cityOp[24] = new Array(19); 
cityOp[24][0]=new Option("----","821250410242"); 
cityOp[24][1]=new Option("昆明","821250410242"); 
cityOp[24][2]=new Option("保山","821250809910"); 
cityOp[24][3]=new Option("楚雄","821250110132"); 
cityOp[24][4]=new Option("大理","851253410013"); 
cityOp[24][5]=new Option("東川","821260610312"); 
cityOp[24][6]=new Option("個舊","821232110309"); 
cityOp[24][7]=new Option("景洪","820220110048"); 
cityOp[24][8]=new Option("開遠","821234310313"); 
cityOp[24][9]=new Option("曲靖","821253010348"); 
cityOp[24][10]=new Option("瑞麗","820240009750"); 
cityOp[24][11]=new Option("思茅","820224810058"); 
cityOp[24][12]=new Option("畹町","820240609804"); 
cityOp[24][13]=new Option("宣威","821261310406"); 
cityOp[24][14]=new Option("玉溪","821242210232"); 
cityOp[24][15]=new Option("昭通","821272010342"); 
cityOp[24][16]=new Option("麗江","821268610025"); 
cityOp[24][17]=new Option("中甸","852277809972"); 
cityOp[24][18]=new Option("貢山","851277309865"); 
cityOp[25] = new Array(72); 
cityOp[25][0]=new Option("----","804293909108"); 
cityOp[25][1]=new Option("拉薩","804293909108"); 
cityOp[25][2]=new Option("日喀則","805291608851"); 
cityOp[25][3]=new Option("林周","80430209124"); 
cityOp[25][4]=new Option("當雄","804305109105"); 
cityOp[25][5]=new Option("墨竹工卡","805297709177"); 
cityOp[25][6]=new Option("尼木","805294409014"); 
cityOp[25][7]=new Option("米林","805291809413"); 
cityOp[25][8]=new Option("墨脫","805292209526"); 
cityOp[25][9]=new Option("達孜","805296309139"); 
cityOp[25][10]=new Option("曲水","805293909070"); 
cityOp[25][11]=new Option("堆龍德慶","805296709096"); 
cityOp[25][12]=new Option("林芝","805295909425"); 
cityOp[25][13]=new Option("工布江達","805299209325"); 
cityOp[25][14]=new Option("那曲","804314709210"); 
cityOp[25][15]=new Option("巴青","804319609410"); 
cityOp[25][16]=new Option("比如","804315309368"); 
cityOp[25][17]=new Option("班戈","804313509005"); 
cityOp[25][18]=new Option("聶榮","804310809230"); 
cityOp[25][19]=new Option("索縣","804319209371"); 
cityOp[25][20]=new Option("安多","804322909168"); 
cityOp[25][21]=new Option("申扎","804309408870"); 
cityOp[25][22]=new Option("呂都","804311809714"); 
cityOp[25][23]=new Option("貢覺","804308609829"); 
cityOp[25][24]=new Option("左貢","805296809790"); 
cityOp[25][25]=new Option("察隅","805286209749"); 
cityOp[25][26]=new Option("洛隆","804308109576"); 
cityOp[25][27]=new Option("丁青","804314209563"); 
cityOp[25][28]=new Option("波密","805299209575"); 
cityOp[25][29]=new Option("江達","804315308919"); 
cityOp[25][30]=new Option("察雅","804306909756"); 
cityOp[25][31]=new Option("芒康","805296409868"); 
cityOp[25][32]=new Option("八宿","804300409695"); 
cityOp[25][33]=new Option("邊壩","804309409469"); 
cityOp[25][34]=new Option("類烏齊","804312009657"); 
cityOp[25][35]=new Option("乃東","805291809176"); 
cityOp[25][36]=new Option("加查","805290909260"); 
cityOp[25][37]=new Option("曲松","805290809211"); 
cityOp[25][38]=new Option("錯那","805279809191"); 
cityOp[25][39]=new Option("窮結","805290409165"); 
cityOp[25][40]=new Option("貢嘎","805292509096"); 
cityOp[25][41]=new Option("浪卡子","805299609033"); 
cityOp[25][42]=new Option("桑日","805292609200"); 
cityOp[25][43]=new Option("朗縣","805290609311"); 
cityOp[25][44]=new Option("隆子","805284609242"); 
cityOp[25][45]=new Option("措美","805284909140"); 
cityOp[25][46]=new Option("洛扎","805284209083"); 
cityOp[25][47]=new Option("扎囊","805292209126"); 
cityOp[25][48]=new Option("定結","805283808777"); 
cityOp[25][49]=new Option("拉孜","805291008762"); 
cityOp[25][50]=new Option("聶拉木","805281908594"); 
cityOp[25][51]=new Option("謝通門","805294308825"); 
cityOp[25][52]=new Option("仲巴","805296608415"); 
cityOp[25][53]=new Option("康馬","805285708967"); 
cityOp[25][54]=new Option("亞東","805275508893"); 
cityOp[25][55]=new Option("崗巴","805282908850"); 
cityOp[25][56]=new Option("南木林","805297108902"); 
cityOp[25][57]=new Option("薩迦","805288708800"); 
cityOp[25][58]=new Option("定日","805285708711"); 
cityOp[25][59]=new Option("吉隆","805289408529"); 
cityOp[25][60]=new Option("昂仁","805293008722"); 
cityOp[25][61]=new Option("江孜","805289408963"); 
cityOp[25][62]=new Option("仁布","805292108977"); 
cityOp[25][63]=new Option("白朗","805291108916"); 
cityOp[25][64]=new Option("薩嘎","805293808530"); 
cityOp[25][65]=new Option("噶爾","804320808000"); 
cityOp[25][66]=new Option("革吉","804324508113"); 
cityOp[25][67]=new Option("扎達","804314707976"); 
cityOp[25][68]=new Option("措勤","804310608516"); 
cityOp[25][69]=new Option("日上","804334407961"); 
cityOp[25][70]=new Option("改則","804323308410"); 
cityOp[25][71]=new Option("普蘭","804303708118"); 
cityOp[26] = new Array(14); 
cityOp[26][0]=new Option("----","730341710857"); 
cityOp[26][1]=new Option("西安","730341710857"); 
cityOp[26][2]=new Option("安康","730324110901"); 
cityOp[26][3]=new Option("寶雞","730342210709"); 
cityOp[26][4]=new Option("韓城","730352811027"); 
cityOp[26][5]=new Option("漢中","730330410701"); 
cityOp[26][6]=new Option("華陰","770343411005"); 
cityOp[26][7]=new Option("商州","730335210957"); 
cityOp[26][8]=new Option("銅川","730350610907"); 
cityOp[26][9]=new Option("渭南","730343010930"); 
cityOp[26][10]=new Option("咸陽","730342010843"); 
cityOp[26][11]=new Option("興平","730341810829"); 
cityOp[26][12]=new Option("延安","780363510928"); 
cityOp[26][13]=new Option("榆林","730381810947"); 
cityOp[27] = new Array(14); 
cityOp[27][0]=new Option("----","750360410351"); 
cityOp[27][1]=new Option("蘭州","750360410351"); 
cityOp[27][2]=new Option("白銀","750363310412"); 
cityOp[27][3]=new Option("敦煌","76040089441"); 
cityOp[27][4]=new Option("嘉峪關","76039489814"); 
cityOp[27][5]=new Option("金昌","750382810210"); 
cityOp[27][6]=new Option("酒泉","76039449831"); 
cityOp[27][7]=new Option("臨夏","750353710312"); 
cityOp[27][8]=new Option("平涼","750353210640"); 
cityOp[27][9]=new Option("天水","760343710542"); 
cityOp[27][10]=new Option("武威","760375610239"); 
cityOp[27][11]=new Option("西峰","750354510740"); 
cityOp[27][12]=new Option("玉門","76039499735"); 
cityOp[27][13]=new Option("張掖","760385610026"); 
cityOp[28] = new Array(9); 
cityOp[28][0]=new Option("-----","742363810174"); 
cityOp[28][1]=new Option("西 寧","742363810174"); 
cityOp[28][2]=new Option("德令哈","742372209723"); 
cityOp[28][3]=new Option("格爾木","742362609455"); 
cityOp[28][4]=new Option("大 通","742369210167"); 
cityOp[28][5]=new Option("都 蘭","742363009813"); 
cityOp[28][6]=new Option("平 安","742364710209"); 
cityOp[28][7]=new Option("湟 中","742364910157"); 
cityOp[28][8]=new Option("樂 都","742364910238"); 
cityOp[28][9]=new Option("民 和","742363010280"); 
cityOp[28][10]=new Option("湟 源","742367210128"); 
cityOp[28][11]=new Option("互 助","742368410195"); 
cityOp[28][12]=new Option("化 隆","742361110230"); 
cityOp[28][13]=new Option("循 化","742358410246"); 
cityOp[28][14]=new Option("門 源","742373710162"); 
cityOp[28][15]=new Option("海 晏","742368910099"); 
cityOp[28][16]=new Option("剛 察","742373210017"); 
cityOp[28][17]=new Option("祁 連","742382010022"); 
cityOp[28][18]=new Option("同 仁","742355410200"); 
cityOp[28][19]=new Option("尖 扎","742359210200"); 
cityOp[28][20]=new Option("澤 庫","742350310150"); 
cityOp[28][21]=new Option("河 南","742347510162"); 
cityOp[28][22]=new Option("共 和","742362710061"); 
cityOp[28][23]=new Option("貴 德","742360210147"); 
cityOp[28][24]=new Option("貴 南","742355710075"); 
cityOp[28][25]=new Option("同 德","742352410063"); 
cityOp[28][26]=new Option("興 海","742356009999"); 
cityOp[28][27]=new Option("瑪 沁","742344910026"); 
cityOp[28][28]=new Option("甘 德","742339509989"); 
cityOp[28][29]=new Option("久 治","742334610147"); 
cityOp[28][30]=new Option("班 瑪","742329210073"); 
cityOp[28][31]=new Option("達 日","742337409968"); 
cityOp[28][32]=new Option("瑪 多","742349209826"); 
cityOp[28][33]=new Option("玉 樹","742330309697"); 
cityOp[28][34]=new Option("稱 多","742333509712"); 
cityOp[28][35]=new Option("囊 謙","742322309647"); 
cityOp[28][36]=new Option("雜 多","742329209530"); 
cityOp[28][37]=new Option("治 多","742338609560"); 
cityOp[28][38]=new Option("曲麻菜","742345209550"); 
cityOp[28][39]=new Option("格爾木","742364109490"); 
cityOp[28][40]=new Option("烏 蘭","742369009846"); 
cityOp[28][41]=new Option("都 蘭","742363009813"); 
cityOp[28][42]=new Option("天 峻","742372809903"); 
cityOp[29] = new Array(19); 
cityOp[29][0]=new Option("------","721382710616"); 
cityOp[29][1]=new Option("銀川","721382710616"); 
cityOp[29][2]=new Option("青銅峽","721375610559"); 
cityOp[29][3]=new Option("石嘴山","721390210622"); 
cityOp[29][4]=new Option("吳忠","721375910611"); 
cityOp[29][5]=new Option("永 寧","721382810624"); 
cityOp[29][6]=new Option("賀 蘭","721385510635"); 
cityOp[29][7]=new Option("平 羅","721389110654"); 
cityOp[29][8]=new Option("陶 樂","721388210669"); 
cityOp[29][9]=new Option("同 心","721369710594"); 
cityOp[29][10]=new Option("靈 武","721381010634"); 
cityOp[29][11]=new Option("中 寧","721374810566"); 
cityOp[29][12]=new Option("鹽 池","721377810741"); 
cityOp[29][13]=new Option("中 衛","721375110518"); 
cityOp[29][14]=new Option("固 原","721360110628"); 
cityOp[29][15]=new Option("西 吉","721359710570"); 
cityOp[29][16]=new Option("涇 源","721355010633"); 
cityOp[29][17]=new Option("海 原","721365610564"); 
cityOp[29][18]=new Option("隆 德","721356310611"); 
cityOp[30] = new Array(18); 
cityOp[30][0]=new Option("--------","711434508736"); 
cityOp[30][1]=new Option("烏魯木齊","711434508736"); 
cityOp[30][2]=new Option("阿克蘇","711410908019"); 
cityOp[30][3]=new Option("阿勒泰","711475008812"); 
cityOp[30][4]=new Option("阿圖什","711394207608"); 
cityOp[30][5]=new Option("博樂","711445708208"); 
cityOp[30][6]=new Option("昌吉","711440208718"); 
cityOp[30][7]=new Option("阜康","711440908758"); 
cityOp[30][8]=new Option("哈密","711425009328"); 
cityOp[30][9]=new Option("和田","711370907955"); 
cityOp[30][10]=new Option("克拉瑪依","711453608451"); 
cityOp[30][11]=new Option("喀什","791393007559"); 
cityOp[30][12]=new Option("庫爾勒","711414608607"); 
cityOp[30][13]=new Option("奎屯","711442708456"); 
cityOp[30][14]=new Option("石河子","711441808600"); 
cityOp[30][15]=new Option("塔城","711464608259"); 
cityOp[30][16]=new Option("吐魯番","711425408911"); 
cityOp[30][17]=new Option("伊寧","791435508120"); 
cityOp[31] = new Array(11); 
cityOp[31][0]=new Option("-----","890222011410"); 
cityOp[31][1]=new Option("香 港","890222011410"); 
cityOp[31][2]=new Option("澳 門","900221311333"); 
cityOp[31][3]=new Option("台 北","910250512150"); 
cityOp[31][4]=new Option("高 雄","920226412037"); 
cityOp[31][5]=new Option("基 隆","910251412173"); 
cityOp[31][6]=new Option("台 中","910241512067"); 
cityOp[31][7]=new Option("台 南","910229812019"); 
cityOp[31][8]=new Option("宜 蘭","910247512175"); 
cityOp[31][9]=new Option("桃 園","910250012130"); 
cityOp[31][10]=new Option("新 竹","910248112096");

function window_onload() {
	addProvince(CLD.province); 
	addCity(CLD.province,CLD.city); 
	CLD.province.disabled = false; 
	CLD.city.disabled = false; 
}

function addProvince(prov){
	for(i=0;i<PROVNUM;i++) {
		prov.add(provinceOp[i]); 
	} 
	prov.options[8].selected=true; 
} 

function addCity(prov,city,w){ 
	var i = prov.selectedIndex; 
	for(j=0;j<cityOp[i].length;j++) { 
		city.add(cityOp[i][j]); 
	} 
	if(w==0){ 
		city.options[w].selected=true;
	} else {
		city.options[1].selected=true;
	} 
}

function delCity(city){ 
	var len = city.length; 
	for(i=0;i<len;i++){ 
		city.remove(0); 
	} 
} 

function province_onchange() { 
	delCity(CLD.city); 
	addCity(CLD.province,CLD.city,0); 
} 

function mychange() { 
	document.CLD.per_des=document.CLD.city.value; 
	Main(7,7);
	MoonRise(7,7); 
}

function deltaT(year){
	return (58 + 0.8 * (year - 1990));
}

function MoonLong(T) {
	var kaku,i,ans;
	T /= 36525.0;
	ans = 0.0;
	for (i = 62; i >= 1 ; i--) {
		kaku = (mlb[i] * T + mlc[i]) * d2r;
		ans += mla[i] * Math.cos(kaku);
	}
	kaku = (mlb[0] * T + mlc[0] * d2r);
	ans += mla[0] * T * Math.cos(kaku);
	ans = ans - Math.floor(ans / 360.0) * 360.0;
	return ans;
}

function MoonLat(T) {
	var kaku,i,ans;
	T /= 36525.0;
	ans = 0.0;
	for (i = 44; i >= 0 ; i--) {
		kaku = (mab[i] * T + mac[i]) * d2r;
		ans += maa[i] * Math.cos(kaku);
	}
	return ans;
}

function MoonHP(T) {
	var kaku,i,ans;
	T /= 36525.0;
	ans = 0.0;
	for (i = 43; i >= 0 ; i--) {
		kaku = (mhb[i] * T + mhc[i]) * d2r;
		ans += mha[i] * Math.cos(kaku);
	}
return ans;
}

function GetEpci(T) {
	var Epci;
	T /= 36525.0;
	Epci = 0.00256 * Math.cos((1934 * T + 235) * d2r) + 0.00015 * Math.cos((72002 * T + 201) * d2r);
	Epci += 23.43928 - 0.01301 * T;
	return Epci * d2r;
}

function GetGMT(UT,T) {
	var gmt;
	gmt = UT + 6.69736 + 24.000513 * T / 365.25;
	gmt += 0.00029 * Math.sin((1934 * T / 36525 + 235) * d2r);
	gmt = gmt / 24.0;
	gmt = (gmt -  Math.floor(gmt)) * 24.0;
	return gmt;
}

function POL2XYZ(p,x) {
	with(Math) {
		x[2] = p[0] * sin(p[2]);
		x[1] = p[0] * cos(p[2]);
		x[0] = x[1] * cos(p[1]);
		x[1] *= sin(p[1]);
	}
}

function XYZ2POL(x,p) {
	var r;
	r = x[0] * x[0] + x[1] * x[1];
	with(Math) {
		p[0] = sqrt(x[2] * x[2] + r);
		r = sqrt(r);
	
		p[2] = atan2(x[2],r);
		p[1] = atan2(x[1],x[0]);
	}
}

function ROTXYZ(x,p,base) {
	var nx = new Array(3);
	var e1,e2;

	if (base == 0) {e1 = 1; e2 = 2;}
	else if (base == 1) {e1 = 0; e2 = 2;}
	else {e1 = 0; e2 = 1;}

	with(Math) {
		nx[base] = x[base];
		nx[e1] = cos(p) * x[e1] - sin(p) * x[e2];
		nx[e2] = sin(p) * x[e1] + cos(p) * x[e2];
	}
	for (e1 in nx) x[e1] = nx[e1];
}

function Koudou2Sekidou(Kou,Sek,T,FLAG) {
	var e;
	var xyz = new Array(3);

	e = GetEpci(T); 
	if (FLAG != 1) e = -e; 
	POL2XYZ(Kou,xyz);
	ROTXYZ(xyz,e,0); 
	XYZ2POL(xyz,Sek); 
} 

var Now_dcd; 

function GetEL(T,ra,dc,lng,lat) { 
	var hangl,el,latd,hour; 
	hour = T - 0.5; 
	hour = (hour - Math.floor(hour)) * 24.0; 
	hangl = GetGMT(hour,T) * 15.0 * d2r;
	hangl = ra - (hangl + lng); 
	Now_dcd = 90 * d2r - dc; 
	latd = 90 * d2r - lat;
	with (Math) {
		el = cos(latd) * cos(Now_dcd) + sin(latd) * sin(Now_dcd) * cos(hangl);
		el = atan2(sqrt(1.0 - el * el),el);
	}
	return Math.PI/2.0 - el;
}

function addZero(n) {
	if (n < 10) return '0' + n;
	else return '' + n;
}

function RiseSB(ts,dtime,lng,lat,objectflag) {
	var dtimemin,TD;
	var firstflag;
	var dt,t0,t1;
	var el0,el1;
	var elbase;
	var Kou = new Array(3);
	var Sek = new Array(3);
	firstflag = 1;
	dt = deltaT(yy) / 86400.0;
	dtimemin = 0.5 / 1440;
	t1 = ts;
	el0 = 0;
	while (dtime >= dtimemin) {
		TD = t1 + dt;
		if (objectflag == 1) {
			Kou[0] = 1.0;
			Kou[1] = SunLong(TD) * d2r;
			Kou[2] = 0.0;
			elbase = 0.902 * d2r;
		} else {
			elbase = MoonHP(TD);
			Kou[0] = 1.0 / Math.sin(elbase);
			Kou[1] = MoonLong(TD) * d2r;
			Kou[2] = MoonLat(TD) * d2r;
			elbase = (0.586 - elbase) * d2r;
		}

		Koudou2Sekidou(Kou,Sek,TD,1);
		el1 = GetEL(t1,Sek[1],Sek[2],lng,lat) + elbase;	
		if (firstflag > 0) {
			el0 = el1;
			firstflag = 0;
		}
		if (el0 * el1 >= 0) {
			t0 = t1;
			el0 = el1;
		} else {
			dtime /= 2.0;
		}
		t1 = t0 + dtime;
	}
	RiseFlag = el1;
	return (t0 + dtime);	
}

function MoonRise(v,Te) {
	var T,tmp,moont,moond,XZ,sitelong,sitelat,jwnum;	
  var sObj=eval('SD'+ v);
  var d=sObj.innerHTML-1; 
	if(sObj.innerHTML!='') {
		yy=cld[d].sYear; 
		mm=cld[d].sMonth;
		jwnum=CLD.per_des;
		if(jwnum==undefined){
			sitelong = 113.07;
			sitelat = 23.02;
		}else{
			xZ=getString(jwnum,5);
			if(XZ==0) XZ='';
			sitelong=(XZ+''+getString(jwnum,4)+''+getString(jwnum,3)+'.'+getString(jwnum,2)+''+getString(jwnum,1))*1;
			sitelat=(getString(jwnum,9)+''+getString(jwnum,8)+'.'+getString(jwnum,7)+''+getString(jwnum,6))*1;
		}
		if(Te==7){
			dd =tD;
		} else {
			dd =cld[d].sDay;
		}
	}
	RiseTime = -999;
	SetTime = -999;
	T = Ymd2Jd(yy,mm,dd) - Ymd2Jd(2000,1,1.5) - 9/24.0;
	tmp = (RiseSB(T,(8.0/24.0),(sitelong * d2r),(sitelat * d2r),2) - T) * 24.0;
	if (RiseFlag < 0) {
		tmp = (RiseSB((T + (tmp + 1)/24),(8.0/24.0),(sitelong * d2r),(sitelat * d2r),2) - T) * 24.0;
	}
	RiseTime = tmp;

	tmp = (RiseSB(T,(8.0/24.0),(sitelong * d2r),(sitelat * d2r),2) - T) * 24.0;
	if (RiseFlag >= 0) {
		tmp = (RiseSB((T + (tmp + 0.5)/24),(8.0/24.0),(sitelong * d2r),(sitelat * d2r),2) - T) * 24.0;
	}
	SetTime = tmp;
	RiseTime += 0.5 / 1440.0;
	SetTime += 0.5 / 1440.0;
	if ((RiseTime >= 0) && (RiseTime < 24.0)) { 
		hour = Math.floor(RiseTime);
		min = Math.floor((RiseTime - hour) * 60.0);
		moont='◎月出：'+addZero(hour) + '時' + addZero(min) + '分<br>';
	} else { 
		moont='◎月出：00時00分<br>';
	} 
	if ((SetTime >= 0) && (SetTime < 24.0)) { 
		hour = Math.floor(SetTime);
		min = Math.floor((SetTime - hour) * 60.0);
		moond='◎月落：'+addZero(hour) + '時' + addZero(min) + '分';
	} else { 
		moond='◎月落：00時00分';
	}
	rcrl2.innerHTML ='<br>'+moont + moond;
}
