/**
 * Car brand metadata for fetch-car-brand.mjs
 * logoFile: Wikimedia Commons filename (Special:FilePath)
 */
export const CAR_BRAND_REGIONS = [
  {
    id: 'japan',
    label: '日本',
    brands: [
      {
        id: 'toyota',
        nameZh: '豐田',
        nameEn: 'Toyota',
        tier: '一般平價',
        logoFile: 'Toyota_logo_(Red).svg',
        desc: '【品牌定位與國籍】日本國民車代表，全球銷量長年第一。定位務實可靠、保值性高，核心價值是「有路就有豐田」的耐用口碑與完整產品線。\n【核心／招牌車款】Corolla Altis（房車）、RAV4（休旅）、Camry（中大型房車）、Hilux（皮卡）；台灣常見 Yaris Cross、Corolla Cross。\n【妥善率與維護成本】妥善率與二手殘值表現優異，零件供應充足，保養費用中等偏低，是家庭首購與通勤用車的保守安全選擇。\n【駕駛調性與動力特色】偏向舒適平穩、方向輕巧，不強調極限操控；近年 ADAS（TSS）普及度高，車機逐步跟上主流。\n【動力型式】以汽油與油電混合（HEV）為主，bZ4X 等純電車款逐步擴充，Hybrid 是招牌技術。',
      },
      {
        id: 'honda',
        nameZh: '本田',
        nameEn: 'Honda',
        tier: '一般平價',
        logoFile: 'Honda.svg',
        desc: '【品牌定位與國籍】日本老牌車廠，以引擎技術與空間運用著稱。定位介於務實家用與些微運動感之間，核心價值是「The Power of Dreams」的駕馭樂趣。\n【核心／招牌車款】Civic（房車）、CR-V（休旅）、Fit（掀背）；台灣主力 CR-V、HR-V、City。\n【妥善率與維護成本】妥善率佳，維修體系成熟，保養成本中等；部分高轉引擎車款需注意機油消耗習慣。\n【駕駛調性與動力特色】路感比同級日系稍銳利，轉向回饋較直接；VTEC 引擎是招牌，操控取向高於純舒適。\n【動力型式】汽油、油電混合（e:HEV）並行，純電車款如 Prologue 逐步推出。',
      },
      {
        id: 'nissan',
        nameZh: '日產',
        nameEn: 'Nissan',
        tier: '一般平價',
        logoFile: 'Nissan_logo.svg',
        desc: '【品牌定位與國籍】日本三大車廠之一，與 Renault 聯盟後共享平台。定位實用家用，Leaf 曾領先全球電動車量產。\n【核心／招牌車款】Altima、X-Trail（休旅）、Kicks；GT-R 是性能圖騰，台灣以 Kicks、X-Trail 較常見。\n【妥善率與維護成本】CVT 變速箱在部分車齡較高車款需留意，整體維修成本中等，零件取得尚稱便利。\n【駕駛調性與動力特色】Comfort 取向，懸吊偏軟；ProPILOT 等輔助駕駛在部分車款表現穩定。\n【動力型式】汽油、油電、e-POWER 增程電驅，Leaf 為純電代表。',
      },
      {
        id: 'mazda',
        nameZh: '馬自達',
        nameEn: 'Mazda',
        tier: '一般平價',
        logoFile: 'Mazda_logo.svg',
        logoFallbacks: ['Mazda.svg', 'Mazda_logo_(North_America).svg'],
        desc: '【品牌定位與國籍】日本車廠，堅持「魂動」設計與人馬一體駕馭哲學。定位略高於一般日系，強調質感與操控樂趣。\n【核心／招牌車款】Mazda3、CX-5、CX-30、MX-5（跑車）；台灣以 CX-5、Mazda3 為主力。\n【妥善率與維護成本】妥善率良好，保養費用中等；內裝用料在同級中評價較高，二手殘值穩定。\n【駕駛調性與動力特色】同級最強調操控與路感，G-Vectoring 轉向輔助是特色；方向精準、車身剛性佳。\n【動力型式】Skyactiv 汽油引擎為主，部分車款有 48V 輕油電，電動化步伐相對保守。',
      },
      {
        id: 'subaru',
        nameZh: '速霸陸',
        nameEn: 'Subaru',
        tier: '一般平價',
        logoFile: 'Subaru_logo.svg',
        desc: '【品牌定位與國籍】日本小眾車廠，以水平對臥引擎與全時四驅聞名。定位戶外、安全與全氣候通行。\n【核心／招牌車款】Forester、Outback、Impreza、WRX；台灣以 Forester、XV 較常見。\n【妥善率與維護成本】引擎結構特殊，建議原廠或熟悉速霸陸的保修廠；妥善率中上，零件較日系主流略少。\n【駕駛調性與動力特色】四驅抓地力佳，視野開闊；EyeSight 輔助駕駛系統是招牌，適合多雨或多彎路段。\n【動力型式】水平對臂汽油引擎為主，e-Boxer 輕油電，Solterra 為純電休旅。',
      },
      {
        id: 'lexus',
        nameZh: '凌志',
        nameEn: 'Lexus',
        tier: '豪華品牌',
        logoFile: 'Lexus.svg',
        logoFallbacks: ['Lexus_division_emblem.svg'],
        desc: '【品牌定位與國籍】Toyota 旗下豪華品牌，1989 年創立，主打日式細膩服務與靜謐質感。與 Mercedes、BMW 同屬一線豪華。\n【核心／招牌車款】ES（房車）、RX（休旅）、NX、LX；台灣 ES、NX、RX 能見度高。\n【妥善率與維護成本】妥善率優異，Hybrid 車款保養成本低於德系豪華；原廠服務口碑佳，殘值穩定。\n【駕駛調性與動力特色】極致舒適、隔音出色，懸吊偏軟；LSS+ 安全輔助完整，強調「Omotenashi」待客之道。\n【動力型式】油電混合（HEV）為招牌，部分車款有純電 RZ，整體電動化節奏穩健。',
      },
    ],
  },
  {
    id: 'germany',
    label: '德國',
    brands: [
      {
        id: 'bmw',
        nameZh: 'BMW',
        nameEn: 'BMW',
        tier: '豪華品牌',
        logoFile: 'BMW.svg',
        desc: '【品牌定位與國籍】德國巴伐利亞引擎製造廠，藍白螺旋槳象徵航空血統。定位豪華運動，標語「The Ultimate Driving Machine」。\n【核心／招牌車款】3 Series、5 Series、X3、X5；M 系列是性能旗艦，台灣 3 Series、X3 常見。\n【妥善率與維護成本】妥善率中上，過保後維修與零件費用偏高，建議定期原廠保養；二手殘值在德系中佳。\n【駕駛調性與動力特色】後驅／xDrive 四驅，操控精準、路感清晰；iDrive 車機成熟，輔助駕駛功能完整。\n【動力型式】汽油、柴油（歐洲）、油電、純電 i 系列（i4、iX）並重。',
      },
      {
        id: 'mercedes-benz',
        nameZh: '賓士',
        nameEn: 'Mercedes-Benz',
        tier: '豪華品牌',
        logoFile: 'Mercedes-Benz_logo.svg',
        logoFallbacks: ['Mercedes-Benz_logo_2011.svg'],
        desc: '【品牌定位與國籍】德國豪華車鼻祖，三芒星象徵陸海空。定位頂級舒適與科技，「The Best or Nothing」精神。\n【核心／招牌車款】C-Class、E-Class、S-Class、GLC、GLE；AMG 為高性能子品牌。\n【妥善率與維護成本】新車品質穩定，長期持有維修成本高於日系；原廠與副廠體系完整，豪華車殘值尚可。\n【駕駛調性與動力特色】舒適平穩為先，隔音與行車質感一流；MBUX 車機與輔助駕駛在旗艦車款領先。\n【動力型式】汽油、柴油、48V 輕油電、插電式混合（PHEV）、純電 EQ 系列全面佈局。',
      },
      {
        id: 'volkswagen',
        nameZh: '福斯',
        nameEn: 'Volkswagen',
        tier: '一般平價',
        logoFile: 'Volkswagen_logo_2019.svg',
        desc: '【品牌定位與國籍】德國國民車品牌，「人民的汽車」。定位歐系質感與扎實底盤，集團旗下含 Audi、Porsche、Skoda。\n【核心／招牌車款】Golf（掀背）、Passat、Tiguan（休旅）、ID.系列電動車。\n【妥善率與維護成本】妥善率中等，DSG 變速箱需注意保養週期；零件與保修廠在台尚稱充足，費用介於日系與德系豪華之間。\n【駕駛調性與動力特色】底盤紮實、高速穩定，歐系路感；車室質感優於同價日系。\n【動力型式】汽油、柴油、PHEV、純電 ID.3／ID.4 為電動主力。',
      },
      {
        id: 'audi',
        nameZh: '奧迪',
        nameEn: 'Audi',
        tier: '豪華品牌',
        logoFile: 'Audi_logo_2016.svg',
        logoFallbacks: ['Audi_logo.svg'],
        desc: '【品牌定位與國籍】德國豪華品牌，四環標誌象徵四家公司合併。定位科技豪華與 Quattro 四驅性能。\n【核心／招牌車款】A4、A6、Q5、Q7；RS 系列為高性能，台灣 A4、Q5 能見度高。\n【妥善率與維護成本】妥善率中上，電子系統複雜度較高，過保維修費用偏高；原廠體系完整。\n【駕駛調性與動力特色】Quattro 四驅抓地力強，內裝科技感重；Virtual Cockpit 數位儀表是招牌。\n【動力型式】汽油、TDI 柴油、TFSI e 插電混合、e-tron 純電系列。',
      },
      {
        id: 'porsche',
        nameZh: '保時捷',
        nameEn: 'Porsche',
        tier: '層峰／超跑',
        logoFile: 'Porsche_wordmark.svg',
        logoFallbacks: ['Porsche_logo.svg'],
        desc: '【品牌定位與國籍】德國 Stuttgart 超跑與豪華運動品牌，盾形徽飾來自符騰堡州。定位頂級駕馭與品牌象徵。\n【核心／招牌車款】911（經典跑車）、Cayenne（休旅）、Macan、Taycan（純電）；911 是品牌靈魂。\n【妥善率與維護成本】妥善率佳但保養極貴，零件與工資高；殘值在跑車中頂尖，911 具收藏價值。\n【駕駛調性與動力特色】操控極精準，後置／中置引擎佈局獨特；PDK 雙離合變速箱反應迅捷。\n【動力型式】水平對臥六缸汽油為招牌，Cayenne 有 V8，Taycan 純電性能媲美燃油超跑。',
      },
    ],
  },
  {
    id: 'usa',
    label: '美國',
    brands: [
      {
        id: 'tesla',
        nameZh: '特斯拉',
        nameEn: 'Tesla',
        tier: '豪華電動',
        logoFile: 'Tesla_Motors.svg',
        logoFallbacks: ['Tesla,_Inc.-Logo.svg', 'Tesla_logo.svg'],
        desc: '【品牌定位與國籍】美國電動車先驅，馬斯克旗下。定位科技電動與軟體定義汽車，顛覆傳統經銷模式。\n【核心／招牌車款】Model 3（房車）、Model Y（休旅）、Model S、Model X、Cybertruck。\n【妥善率與維護成本】電動結構簡化保養項目，但鈑金與服務中心密度因區而異；OTA 更新頻繁，二手殘值波動較大。\n【駕駛調性與動力特色】瞬間扭力強、加速迅猛，單踏板模式；Autopilot／FSD 輔助駕駛話題性高，車機整合娛樂與導航。\n【動力型式】純電動（BEV）為唯一路線，超充網路是生態系優勢。',
      },
      {
        id: 'ford',
        nameZh: '福特',
        nameEn: 'Ford',
        tier: '一般平價',
        logoFile: 'Ford_logo_flat.svg',
        desc: '【品牌定位與國籍】美國老牌車廠，亨利·福特量產線革命創始者。定位實用、皮卡文化與美式風格。\n【核心／招牌車款】F-150（全球暢銷皮卡）、Mustang（跑車）、Focus、Kuga；台灣曾引進 Kuga、Focus。\n【妥善率與維護成本】妥善率因車系而異，皮卡與商用口碑佳；在台銷售據點較少時，零件需留意。\n【駕駛調性與動力特色】美式大馬力取向，皮卡越野與載重能力強；Mustang 強調直線加速與聲浪。\n【動力型式】汽油 V6／V8 為傳統，F-150 Lightning 純電皮卡、Mustang Mach-E 電動休旅。',
      },
    ],
  },
  {
    id: 'korea',
    label: '韓國',
    brands: [
      {
        id: 'hyundai',
        nameZh: '現代',
        nameEn: 'Hyundai',
        tier: '一般平價',
        logoFile: 'Hyundai_Motor_Company_logo.svg',
        desc: '【品牌定位與國籍】韓國最大車廠，近年設計與品質大幅提升。定位高 CP 值、長保固與快速迭代。\n【核心／招牌車款】Elantra、Tucson（休旅）、Santa Fe、Ioniq 電動系列；台灣 Tucson、Venue 常見。\n【妥善率與維護成本】保固年限長，妥善率進步明顯，保養費用偏低；零件供應在台尚稱便利。\n【駕駛調性與動力特色】設計感強，懸吊舒適；SmartSense 輔助駕駛普及，車機支援 Apple CarPlay。\n【動力型式】汽油、油電、純電 Ioniq 5／6，電動化投入積極。',
      },
      {
        id: 'kia',
        nameZh: '起亞',
        nameEn: 'Kia',
        tier: '一般平價',
        logoFile: 'Kia_logo_(2021).svg',
        logoFallbacks: ['Kia_logo.svg', 'Kia_new_logo.svg'],
        desc: '【品牌定位與國籍】韓國現代集團旗下，定位年輕、設計導向，與 Hyundai 共享平台但風格更運動。\n【核心／招牌車款】Sportage（休旅）、K5、Sorento、EV6 純電；台灣 Sportage、Carnival 能見度高。\n【妥善率與維護成本】與 Hyundai 相近，長保固是賣點，維修成本中等偏低。\n【駕駛調性與動力特色】外觀大膽、內裝質感提升；EV6 操控獲獎，整體偏年輕運動。\n【動力型式】汽油、油電、純電 EV6／EV9，E-GMP 電動平台。',
      },
    ],
  },
  {
    id: 'taiwan',
    label: '臺灣',
    brands: [
      {
        id: 'luxgen',
        nameZh: '納智捷',
        nameEn: 'Luxgen',
        tier: '自主品牌',
        logoFile: 'Luxgen.svg',
        logoFallbacks: ['Luxgen_logo.svg'],
        desc: '【品牌定位與國籍】臺灣自主品牌，裕隆與中華汽車合作。定位本土研發、智慧車聯網與國產化服務。\n【核心／招牌車款】U6、U7、M7（MPV）、n7 純電休旅；曾與 Ferrari 合作設計引擎。\n【妥善率與維護成本】據點以台灣為主，保修便利；部分車款零件依賴集團供應鏈，妥善率因世代而異。\n【駕駛調性與動力特色】強調本土路況調校與車聯網功能；MPV 空間與電動車 n7 是近期重點。\n【動力型式】汽油、油電、純電 n7；電動化為轉型方向。',
      },
    ],
  },
  {
    id: 'sweden',
    label: '瑞典',
    brands: [
      {
        id: 'volvo',
        nameZh: '富豪',
        nameEn: 'Volvo',
        tier: '豪華品牌',
        logoFile: 'Volvo_logo.svg',
        desc: '【品牌定位與國籍】瑞典品牌，現隸屬吉利集團。核心價值是「安全」——三點式安全帶發明者，定位北歐簡約與家庭守護。\n【核心／招牌車款】XC60、XC90（休旅）、S60、V60；台灣 XC40、XC60 常見。\n【妥善率與維護成本】妥善率良好，保養費用介於日系與德系豪華之間；二手殘值穩定。\n【駕駛調性與動力特色】極致安全與環保材質，駕駛輔助 Pilot Assist 成熟；懸吊舒適、隔音佳。\n【動力型式】汽油、48V 輕油電、插電混合（T8）、純電 EX30／EX90。',
      },
    ],
  },
  {
    id: 'uk',
    label: '英國',
    brands: [
      {
        id: 'land-rover',
        nameZh: '荒原路華',
        nameEn: 'Land Rover',
        tier: '豪華越野',
        logoFile: 'Land_Rover_logo.svg',
        logoFallbacks: ['Land_Rover_logo_black.svg'],
        desc: '【品牌定位與國籍】英國越野豪華品牌，現屬 JLR 集團。定位全地形越野與奢華休旅，「Above and Beyond」。\n【核心／招牌車款】Range Rover（旗艦）、Defender（經典越野）、Discovery、Evoque；台灣 Range Rover Sport 能見。\n【妥善率與維護成本】妥善率與維修成本在豪華車中偏高，電子與氣懸系統需注意；越野零件專業度高。\n【駕駛調性與動力特色】越野能力頂尖，Terrain Response 地形模式；公路行駛兼具豪華與高坐姿視野。\n【動力型式】汽油、柴油、PHEV，純電 Range Rover 逐步推出。',
      },
    ],
  },
  {
    id: 'italy',
    label: '義大利',
    brands: [
      {
        id: 'ferrari',
        nameZh: '法拉利',
        nameEn: 'Ferrari',
        tier: '層峰／超跑',
        logoFile: 'Scuderia_Ferrari_Logo.svg',
        logoFallbacks: ['Ferrari_logo.svg'],
        desc: '【品牌定位與國籍】義大利 Maranello 超跑傳奇，躍馬徽飾來自一戰飛行員。定位頂級性能、賽車血統與收藏價值。\n【核心／招牌車款】296 GTB、SF90、Roma、Purosangue（休旅）；F1 紅色是品牌象徵。\n【妥善率與維護成本】妥善率需專業保養，維修極其昂貴；限量車款具投資與收藏屬性。\n【駕駛調性與動力特色】高轉 V8／V12 聲浪、極致操控，賽車科技下放；每一台都是性能藝術品。\n【動力型式】汽油超跑為主，SF90 與 296 為 V6／V8 油電混合，首台純電車開發中。',
      },
    ],
  },
  {
    id: 'china',
    label: '中國',
    brands: [
      {
        id: 'byd',
        nameZh: '比亞迪',
        nameEn: 'BYD',
        tier: '電動新星',
        logoFile: 'BYD_Company_Logo.svg',
        logoFallbacks: ['BYD_Auto_logo.svg', 'BYD_logo.svg'],
        desc: '【品牌定位與國籍】中國電動車龍頭，垂直整合電池（刀片電池）與整車。定位新能源領導者與高性價比電動化。\n【核心／招牌車款】Han、Seal、Atto 3（元 Plus）、Tang；全球 EV 銷量名列前茅。\n【妥善率與維護成本】電動結構簡化保養，刀片電池安全訴求；海外保修據點快速擴張中。\n【駕駛調性與動力特色】加速性能強，DiPilot 輔助駕駛；車機功能豐富，性價比突出。\n【動力型式】純電（BEV）與插電混合（DM-i）雙主線，是全球電動化最積極的車廠之一。',
      },
    ],
  },
];

export const CAR_BRAND_INTRO = {
  summary: '路上認車標、選車前快速比較——依產地瀏覽各品牌車標，點選即可查看五大核心資訊。',
  guide: [
    '品牌定位與國籍：了解產地血統、價格階級（國民車、豪華、超跑）與核心價值（如 Volvo 的安全、Mazda 的駕馭樂趣）。',
    '核心／招牌車款：掌握該品牌主力產品，如 Toyota Corolla／RAV4、Ford F-150 等銷售支柱。',
    '妥善率與維護成本：耐用度、零件取得與保養花費，可參考 J.D. Power、消費者報告等調查。',
    '駕駛調性與動力特色：舒適（Lexus）、操控（BMW）、越野（Land Rover）或科技輔駕表現。',
    '動力型式：汽油（ICE）、油電（HEV）、插電（PHEV）或純電（EV）的佈局與主力技術。',
  ],
  disclaimer: '內容供選車參考與路上認車使用，實際規格、價格與妥善率因市場、年式而異，購車前請以原廠與經銷商資訊為準。',
};
