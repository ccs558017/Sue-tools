"use client";

import { useEffect, useRef, useState } from "react";
import {
  fortunes,
  luckyColors,
  luckyDirections,
  type Fortune,
} from "@/lib/fortunes";

const SHAKE_MS = 1700;

// 0 ~ n-1 的均勻隨機整數
function randomIndex(n: number) {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / n) * n;
  do {
    crypto.getRandomValues(buf);
  } while (buf[0] >= limit);
  return buf[0] % n;
}

const totalWeight = fortunes.reduce((s, f) => s + f.weight, 0);

function drawFortune(): Fortune {
  const total = totalWeight;
  let r = randomIndex(total);
  for (const f of fortunes) {
    if (r < f.weight) return f;
    r -= f.weight;
  }
  return fortunes[0];
}

type Result = {
  fortune: Fortune;
  color: string;
  number: number;
  direction: string;
  date: string;
};

type Phase = "idle" | "shaking" | "result";

export default function FortuneDraw() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const draw = () => {
    if (phase === "shaking") return;
    setPhase("shaking");
    timer.current = window.setTimeout(() => {
      setResult({
        fortune: drawFortune(),
        color: luckyColors[randomIndex(luckyColors.length)],
        number: 1 + randomIndex(99),
        direction: luckyDirections[randomIndex(luckyDirections.length)],
        date: new Date().toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        }),
      });
      setPhase("result");
    }, SHAKE_MS);
  };

  const f = result?.fortune;

  return (
    <div className="mx-auto w-full max-w-3xl">
      {/* 籤筒 */}
      {phase !== "result" && (
        <div className="flex flex-col items-center">
          <div
            className={phase === "shaking" ? "fortune-shake" : ""}
            aria-hidden
          >
            <svg viewBox="0 0 200 260" className="w-44 sm:w-52">
              {/* 籤 */}
              <g fill="#f3d9a4" stroke="#b9852f" strokeWidth="1.5">
                <rect
                  x="62"
                  y="10"
                  width="10"
                  height="110"
                  rx="3"
                  transform="rotate(-14 67 120)"
                />
                <rect
                  x="82"
                  y="2"
                  width="10"
                  height="120"
                  rx="3"
                  transform="rotate(-5 87 120)"
                />
                <rect
                  x="104"
                  y="6"
                  width="10"
                  height="116"
                  rx="3"
                  transform="rotate(4 109 120)"
                />
                <rect
                  x="124"
                  y="14"
                  width="10"
                  height="108"
                  rx="3"
                  transform="rotate(12 129 120)"
                />
                <rect
                  x="94"
                  y="0"
                  width="10"
                  height="124"
                  rx="3"
                  transform="rotate(-1 99 120)"
                />
              </g>
              <g fill="#c81e1e">
                <rect
                  x="63"
                  y="14"
                  width="8"
                  height="14"
                  rx="2"
                  transform="rotate(-14 67 120)"
                />
                <rect
                  x="105"
                  y="10"
                  width="8"
                  height="14"
                  rx="2"
                  transform="rotate(4 109 120)"
                />
              </g>
              {/* 筒身 */}
              <path
                d="M44 112 H156 L148 248 Q148 254 142 254 H58 Q52 254 52 248 Z"
                fill="#a61e1e"
              />
              <rect
                x="40"
                y="104"
                width="120"
                height="16"
                rx="6"
                fill="#d4a017"
              />
              <rect
                x="50"
                y="232"
                width="100"
                height="12"
                rx="4"
                fill="#d4a017"
              />
              <rect
                x="86"
                y="146"
                width="28"
                height="66"
                rx="4"
                fill="#fbe7b0"
              />
              <text
                x="100"
                y="172"
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill="#a61e1e"
              >
                <tspan x="100" y="170">
                  運
                </tspan>
                <tspan x="100" y="190">
                  勢
                </tspan>
              </text>
            </svg>
          </div>

          <p className="mt-6 min-h-6 text-sm text-amber-900/70 dark:text-amber-100/70">
            {phase === "shaking"
              ? "搖啊搖，搖出今天的運勢…"
              : "心裡想著今天，然後搖一支籤"}
          </p>
          <button
            type="button"
            onClick={draw}
            disabled={phase === "shaking"}
            className="mt-4 rounded-full bg-gradient-to-b from-red-600 to-red-800 px-14 py-4 text-lg font-bold tracking-widest text-amber-50 shadow-lg transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {phase === "shaking" ? "搖籤中…" : "搖籤"}
          </button>
        </div>
      )}

      {/* 結果 */}
      {phase === "result" && result && f && (
        <div className="fortune-reveal">
          <div
            aria-live="polite"
            className="overflow-hidden rounded-2xl border-2 bg-[#fdf6e3] text-stone-800 shadow-xl dark:bg-[#2a2418] dark:text-amber-50"
            style={{ borderColor: f.color }}
          >
            <div className="px-6 pb-6 pt-8 text-center sm:px-10">
              <p className="text-sm tracking-widest text-stone-500 dark:text-amber-100/60">
                {result.date}
              </p>
              <p className="mt-1 text-sm tracking-[0.4em] text-stone-500 dark:text-amber-100/60">
                今日運勢
              </p>
              <div
                className="mx-auto mt-5 flex h-36 w-36 items-center justify-center rounded-full border-4 text-6xl font-black sm:h-44 sm:w-44 sm:text-7xl"
                style={{ color: f.color, borderColor: f.color }}
              >
                {f.name}
              </div>
              <p className="mt-6 text-lg font-semibold leading-loose sm:text-xl">
                {f.poem[0]}
                <br />
                {f.poem[1]}
              </p>
              <p className="mt-3 text-stone-600 dark:text-amber-100/75">
                {f.summary}
              </p>
            </div>

            <dl className="grid divide-y divide-stone-300/70 border-t border-stone-300/70 dark:divide-amber-100/15 dark:border-amber-100/15 sm:grid-cols-2 sm:divide-y-0">
              {[
                ["工作", f.work],
                ["感情", f.love],
                ["財運", f.money],
                ["健康", f.health],
              ].map(([k, v], i) => (
                <div
                  key={k}
                  className={`px-6 py-4 sm:px-8 ${
                    i % 2 === 0 ? "sm:border-r" : ""
                  } ${i < 2 ? "sm:border-b" : ""} border-stone-300/70 dark:border-amber-100/15`}
                >
                  <dt className="text-sm font-bold" style={{ color: f.color }}>
                    {k}
                  </dt>
                  <dd className="mt-1 text-sm leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="grid grid-cols-3 border-t border-stone-300/70 bg-black/[.03] text-center dark:border-amber-100/15 dark:bg-white/[.04]">
              {[
                ["幸運色", result.color],
                ["幸運數字", String(result.number)],
                ["幸運方位", result.direction],
              ].map(([k, v]) => (
                <div key={k} className="px-2 py-4">
                  <p className="text-xs text-stone-500 dark:text-amber-100/60">
                    {k}
                  </p>
                  <p className="mt-1 text-lg font-bold">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="rounded-full border border-red-800/50 px-8 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-800/10 dark:border-red-300/50 dark:text-red-200"
            >
              再抽一次
            </button>
          </div>
        </div>
      )}

      {/* 機率說明 */}
      <details className="mt-12 rounded-xl border border-amber-900/20 p-4 text-sm dark:border-amber-100/20">
        <summary className="cursor-pointer font-semibold">各籤的機率</summary>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
          {fortunes.map((x) => (
            <li key={x.name} className="flex justify-between">
              <span style={{ color: x.color }} className="font-bold">
                {x.name}
              </span>
              <span className="tabular-nums text-stone-500 dark:text-amber-100/60">
                {Math.round((x.weight / totalWeight) * 1000) / 10}%
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-stone-500 dark:text-amber-100/60">
          籤是用瀏覽器的隨機數抽出，內容僅供娛樂，不必當真。
        </p>
      </details>
    </div>
  );
}
