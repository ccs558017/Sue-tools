"use client";

import { useEffect, useRef, useState } from "react";

const MAX_NAMES = 100;
const SPIN_MS = 5200;
const SLICE_DARK = "#2a7a58";
const SLICE_LIGHT = "#3f9a73";
const BULBS = 16;
const SAMPLE = "小明\n小華\n小美\n阿強\n小雯\n大雄";

const R = 96;
const RIM_OUT = 108;
const RIM_IN = 98;
// 三角函數在伺服器與瀏覽器的末位小數可能不同，四捨五入後才不會造成 hydration 不一致
const round = (v: number) => Math.round(v * 1000) / 1000;
const point = (deg: number, r: number) => {
  const rad = (deg * Math.PI) / 180;
  return [round(r * Math.sin(rad)), round(-r * Math.cos(rad))] as const;
};

// 0 ~ n-1 的均勻隨機整數
function randomIndex(n: number) {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / n) * n;
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % n;
}

function parseNames(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, MAX_NAMES);
}

function clip(s: string, n: number) {
  const chars = Array.from(s);
  return chars.length > n ? chars.slice(0, n - 1).join("") + "…" : s;
}

export default function LuckyWheel() {
  const [text, setText] = useState(SAMPLE);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeWinner, setRemoveWinner] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const names = parseNames(text);
  const n = names.length;
  const slice = 360 / Math.max(n, 1);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useEffect(() => {
    if (!winner) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setWinner(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [winner]);

  const spin = () => {
    if (spinning || n < 2) return;
    const idx = randomIndex(n);
    const picked = names[idx];

    // 指針在最上方：要讓第 idx 格的中心轉到 0 度
    const center = (idx + 0.5) * slice;
    const jitter = (Math.random() - 0.5) * slice * 0.7;
    const spins = 5 + Math.floor(Math.random() * 3);
    const base = Math.ceil(rotation / 360) * 360;
    const target =
      base + spins * 360 + ((((360 - center + jitter) % 360) + 360) % 360);

    setWinner(null);
    setSpinning(true);
    setRotation(target);

    timer.current = window.setTimeout(() => {
      setSpinning(false);
      setWinner(picked);
      setHistory((h) => [picked, ...h].slice(0, 10));
      if (removeWinner) {
        const lines = text.split("\n");
        const at = lines.findIndex((l) => l.trim() === picked);
        if (at >= 0) lines.splice(at, 1);
        setText(lines.join("\n"));
      }
    }, SPIN_MS + 100);
  };

  const fontSize = n <= 8 ? 9 : n <= 16 ? 7 : n <= 30 ? 5 : 3.5;
  const maxChars = n <= 8 ? 8 : n <= 16 ? 9 : 10;

  const canSpin = !spinning && n >= 2;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
      {/* 轉盤 */}
      <div className="flex flex-col items-center">
        <div className="relative w-full max-w-[32rem]">
          <svg
            viewBox="-112 -112 224 224"
            className="w-full drop-shadow-[0_12px_40px_rgba(61,224,138,0.35)]"
            role="group"
            aria-label={`抽獎轉盤，共 ${n} 個名單`}
          >
            <defs>
              <linearGradient id="rim" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#7ef0b0" />
                <stop offset="0.5" stopColor="#2fbf80" />
                <stop offset="1" stopColor="#157a52" />
              </linearGradient>
              <radialGradient id="btn" cx="0.4" cy="0.3" r="0.9">
                <stop offset="0" stopColor="#f4ffb8" />
                <stop offset="0.6" stopColor="#b6e35a" />
                <stop offset="1" stopColor="#7cc23c" />
              </radialGradient>
              <linearGradient id="pin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f4ffb8" />
                <stop offset="1" stopColor="#8fd14f" />
              </linearGradient>
              <filter id="glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="1.6" />
              </filter>
            </defs>

            {/* 外框 */}
            <circle r={RIM_OUT} fill="url(#rim)" />
            <circle r={RIM_IN + 1.5} fill="#1c8f62" />
            <circle r={RIM_IN} fill="#0d4a33" />

            {/* 燈泡 */}
            {Array.from({ length: BULBS }, (_, i) => {
              const [x, y] = point(
                (i * 360) / BULBS,
                (RIM_OUT + RIM_IN) / 2 + 0.5,
              );
              const style = spinning
                ? {
                    animation: `bulb-blink 0.5s steps(1) infinite`,
                    animationDelay: i % 2 ? "0.25s" : "0s",
                  }
                : undefined;
              return (
                <g key={i} style={style}>
                  <circle
                    cx={x}
                    cy={y}
                    r="3.4"
                    fill="#fff"
                    opacity="0.8"
                    filter="url(#glow)"
                  />
                  <circle cx={x} cy={y} r="2" fill="#fff" />
                </g>
              );
            })}

            {/* 轉動的盤面 */}
            <g
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: "0 0",
                transition: spinning
                  ? `transform ${SPIN_MS}ms cubic-bezier(0.12, 0.6, 0.1, 1)`
                  : "none",
              }}
            >
              {n === 0 && <circle r={R} fill={SLICE_DARK} />}
              {n === 1 && <circle r={R} fill={SLICE_LIGHT} />}
              {n >= 2 &&
                names.map((name, i) => {
                  const a0 = i * slice;
                  const a1 = (i + 1) * slice;
                  const [x0, y0] = point(a0, R);
                  const [x1, y1] = point(a1, R);
                  // 奇數格數時最後一格會和第一格同色，改用第三種色避免相鄰同色
                  const odd = n % 2 === 1 && i === n - 1;
                  return (
                    <path
                      key={i}
                      d={`M0 0 L${x0} ${y0} A${R} ${R} 0 ${slice > 180 ? 1 : 0} 1 ${x1} ${y1} Z`}
                      fill={odd ? "#348a65" : i % 2 ? SLICE_LIGHT : SLICE_DARK}
                      stroke="rgba(255,255,255,0.14)"
                      strokeWidth={n > 30 ? 0.3 : 0.8}
                    >
                      <title>{name}</title>
                    </path>
                  );
                })}
              {n >= 1 &&
                names.map((name, i) => (
                  <text
                    key={`t${i}`}
                    transform={`rotate(${(i + 0.5) * slice - 90})`}
                    x={R - 7}
                    y={0}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontSize={fontSize}
                    fontWeight={700}
                    fill="#effff5"
                  >
                    {clip(name, maxChars)}
                  </text>
                ))}
            </g>

            {/* 中央指針（水滴） */}
            <path
              d="M0 -54 C4 -46 11 -40 11 -32 A11 11 0 0 1 -11 -32 C-11 -40 -4 -46 0 -54 Z"
              fill="url(#pin)"
              stroke="#e9ffc2"
              strokeWidth="0.8"
            />

            {/* 中央開始按鈕 */}
            <g
              role="button"
              tabIndex={canSpin ? 0 : -1}
              aria-label="開始抽獎"
              aria-disabled={!canSpin}
              onClick={spin}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  spin();
                }
              }}
              className={`outline-none ${canSpin ? "cursor-pointer" : "cursor-not-allowed"}`}
              opacity={canSpin ? 1 : 0.65}
            >
              <circle r="27" fill="#8fe0b0" opacity="0.55" />
              <circle
                r="23"
                fill="url(#btn)"
                stroke="#f4ffd0"
                strokeWidth="1.2"
              />
              <text
                textAnchor="middle"
                fontSize="9"
                fontWeight={800}
                fill="#1b4d2e"
                dominantBaseline="central"
              >
                <tspan x="0" y="-5">
                  {spinning ? "轉動" : "開始"}
                </tspan>
                <tspan x="0" y="6">
                  {spinning ? "中…" : "抽獎"}
                </tspan>
              </text>
            </g>
          </svg>
        </div>

        <p className="mt-6 min-h-6 text-center text-sm text-emerald-100/70">
          {n < 2 ? "至少需要 2 個名單才能抽獎" : "點中間的「開始抽獎」按鈕"}
        </p>
      </div>

      {/* 名單 */}
      <div className="rounded-2xl border border-emerald-300/20 bg-emerald-950/50 p-5 backdrop-blur">
        <div className="flex items-baseline justify-between">
          <label htmlFor="names" className="font-semibold text-emerald-50">
            抽獎名單
          </label>
          <span className="text-sm text-emerald-100/60">
            {n} / {MAX_NAMES} 人
          </span>
        </div>
        <p className="mt-1 text-sm text-emerald-100/60">一行輸入一個名字</p>
        <textarea
          id="names"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          disabled={spinning}
          rows={10}
          placeholder={"小明\n小華\n小美"}
          className="mt-3 w-full resize-y rounded-lg border border-emerald-300/25 bg-black/25 p-3 leading-7 text-emerald-50 outline-none placeholder:text-emerald-100/30 focus:border-lime-300 disabled:opacity-60"
        />

        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-emerald-50">
          <input
            type="checkbox"
            checked={removeWinner}
            onChange={(e) => setRemoveWinner(e.target.checked)}
            className="h-4 w-4 accent-lime-300"
          />
          抽中後從名單移除（避免重複抽到）
        </label>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setText(SAMPLE)}
            disabled={spinning}
            className="rounded-lg border border-emerald-300/30 px-3 py-2 text-sm text-emerald-50 transition hover:bg-emerald-300/10 disabled:opacity-50"
          >
            範例名單
          </button>
          <button
            type="button"
            onClick={() => setText("")}
            disabled={spinning}
            className="rounded-lg border border-emerald-300/30 px-3 py-2 text-sm text-emerald-50 transition hover:bg-emerald-300/10 disabled:opacity-50"
          >
            清空
          </button>
        </div>

        {history.length > 0 && (
          <div className="mt-6 border-t border-emerald-300/20 pt-4">
            <div className="flex items-baseline justify-between">
              <p className="text-sm font-semibold text-emerald-50">抽獎紀錄</p>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs text-emerald-100/60 hover:underline"
              >
                清除
              </button>
            </div>
            <ol className="mt-2 space-y-1 text-sm text-emerald-100/75">
              {history.map((h, i) => (
                <li key={i}>
                  <span className="mr-2 text-emerald-100/40">
                    {history.length - i}.
                  </span>
                  {h}
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>

      {/* 中獎彈窗 */}
      {winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setWinner(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="winner-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl border-2 border-lime-200/60 bg-gradient-to-b from-emerald-600 to-emerald-900 p-8 text-center shadow-[0_0_60px_rgba(163,230,53,0.35)]"
          >
            <button
              type="button"
              aria-label="關閉"
              onClick={() => setWinner(null)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center text-2xl text-white/70 hover:text-white"
            >
              ×
            </button>
            <p className="text-5xl">🎉</p>
            <p
              id="winner-title"
              className="mt-3 text-sm tracking-widest text-lime-200"
            >
              恭喜抽中
            </p>
            <p className="mt-2 break-all text-4xl font-black text-white sm:text-5xl">
              {winner}
            </p>
            <button
              type="button"
              onClick={() => setWinner(null)}
              className="mt-8 rounded-full bg-gradient-to-b from-lime-200 to-lime-400 px-10 py-3 font-bold text-emerald-950 shadow-lg transition hover:brightness-105"
            >
              太棒了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
