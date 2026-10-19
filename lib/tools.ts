export type Tool = {
  href: string;
  name: string;
  en: string;
  tagline: string;
  desc: string;
  points: string[];
  from: string;
  to: string;
  accent: string;
};

export const tools: Tool[] = [
  {
    href: "/wheel",
    name: "幸運大轉盤",
    en: "Lucky Wheel",
    tagline: "輸入名單，轉出幸運兒",
    desc: "聚會抽獎、點名、決定誰請客，把名單貼進來就能開轉，結果公平又有儀式感。",
    points: [
      "一行一個名字，最多 100 人",
      "可選擇抽中後自動移除",
      "記錄最近 10 次結果",
    ],
    from: "#14523c",
    to: "#2fbf80",
    accent: "#2fbf80",
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    en: "Pomodoro",
    tagline: "專注 25 分鐘，再好好休息",
    desc: "用番茄工作法切分時間，倒數、休息、長休息自動切換，讓你專心做完眼前的事。",
    points: [
      "分頁標題顯示倒數",
      "時間到有提示音與通知",
      "專注與休息時間可自訂",
    ],
    from: "#b91c1c",
    to: "#f97316",
    accent: "#ef4444",
  },
  {
    href: "/fortune",
    name: "運勢抽籤",
    en: "Fortune",
    tagline: "搖一支籤，看看今天運氣",
    desc: "從大吉到大凶，搖出今天的籤詩與工作、感情、財運、健康提醒，還附上幸運色與數字。",
    points: ["七種籤，隨機抽取", "籤詩與四項運勢說明", "幸運色、數字、方位"],
    from: "#a16207",
    to: "#f59e0b",
    accent: "#e08a00",
  },
];
