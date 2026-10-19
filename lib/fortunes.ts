export type Fortune = {
  name: string;
  weight: number;
  color: string;
  poem: [string, string];
  summary: string;
  work: string;
  love: string;
  money: string;
  health: string;
};

// weight 加總為 100，等於各籤的抽中百分比
export const fortunes: Fortune[] = [
  {
    name: "大吉",
    weight: 8,
    color: "#c81e1e",
    poem: ["雲開見日萬事通", "貴人相助步步高"],
    summary: "今天運勢極佳，想做的事就放手去做。",
    work: "提案容易被肯定，適合推進最重要的那件事。",
    love: "主動表達心意，容易得到好的回應。",
    money: "有意外的小驚喜，仍要量力而為。",
    health: "精神飽滿，適合出門動一動。",
  },
  {
    name: "中吉",
    weight: 15,
    color: "#d9480f",
    poem: ["春風得意馬蹄輕", "穩紮穩打事可成"],
    summary: "整體順利，保持節奏就會有好結果。",
    work: "進度穩定，遇到問題找人討論會更快解決。",
    love: "多一點關心，關係會更靠近。",
    money: "收支平衡，適合整理一下預算。",
    health: "狀態不錯，別熬夜就好。",
  },
  {
    name: "小吉",
    weight: 20,
    color: "#e08a00",
    poem: ["細水長流終有成", "一步一腳印自明"],
    summary: "小小的幸運會陸續出現，留意身邊的小事。",
    work: "先完成手邊的小任務，成就感會帶動後面的進度。",
    love: "一句簡單的問候，就能讓對方開心。",
    money: "適合小額的開心消費，不必太多。",
    health: "記得多喝水，起來走動一下。",
  },
  {
    name: "吉",
    weight: 22,
    color: "#2f9e44",
    poem: ["平穩安然度日長", "心定自然福氣來"],
    summary: "平順安穩的一天，不需要刻意追求什麼。",
    work: "照著計畫走，不會出大錯。",
    love: "順其自然，不必勉強。",
    money: "沒有大起大落，守好現有的就好。",
    health: "作息正常，狀態穩定。",
  },
  {
    name: "末吉",
    weight: 15,
    color: "#1c7ed6",
    poem: ["雲後微光漸漸明", "再等片刻見晴天"],
    summary: "目前還在醞釀，好運稍晚才會到，別急。",
    work: "事情可能要多等一下，先把細節確認清楚。",
    love: "給彼此一點時間，不要急著下結論。",
    money: "不適合衝動購買，晚一點再決定。",
    health: "容易覺得有點累，早點休息。",
  },
  {
    name: "凶",
    weight: 12,
    color: "#5f3dc4",
    poem: ["風雨忽來莫驚慌", "謹慎行事自平安"],
    summary: "今天有些小波折，放慢腳步，多檢查幾次。",
    work: "容易有疏漏，送出前再確認一遍。",
    love: "說話前先想一想，避免因小事起爭執。",
    money: "避免大額支出和臨時的決定。",
    health: "注意交通和飲食，小心別著涼。",
  },
  {
    name: "大凶",
    weight: 8,
    color: "#343a40",
    poem: ["烏雲蔽日暫時暗", "守得雲開見月明"],
    summary: "今天不太順，但這只是一支籤，低調謹慎地度過就好。",
    work: "不要硬碰硬，重要的決定延後再做。",
    love: "先照顧好自己的心情，別在情緒上做決定。",
    money: "今天不適合投資、借貸或大筆消費。",
    health: "多休息、早點睡，把事情留給明天。",
  },
];

export const luckyColors = [
  "紅色",
  "橘色",
  "黃色",
  "綠色",
  "藍色",
  "紫色",
  "粉色",
  "白色",
  "黑色",
];
export const luckyDirections = [
  "東",
  "南",
  "西",
  "北",
  "東南",
  "西南",
  "東北",
  "西北",
];
