"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mode = "focus" | "short" | "long";

const LABEL: Record<Mode, string> = {
  focus: "專注",
  short: "短休息",
  long: "長休息",
};
const ACCENT: Record<Mode, string> = {
  focus: "#ef4444",
  short: "#10b981",
  long: "#3b82f6",
};
const DEFAULTS: Record<Mode, number> = { focus: 25, short: 5, long: 15 };
const LONG_EVERY = 4;
const MODES: Mode[] = ["focus", "short", "long"];

const RADIUS = 120;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const fmt = (ms: number) => {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export default function PomodoroTimer() {
  const [durations, setDurations] = useState(DEFAULTS);
  const [mode, setMode] = useState<Mode>("focus");
  const [left, setLeft] = useState(DEFAULTS.focus * 60_000);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [task, setTask] = useState("");
  const [sound, setSound] = useState(true);
  const [notify, setNotify] = useState(false);
  const [message, setMessage] = useState("");

  const endAt = useRef(0);
  const audio = useRef<AudioContext | null>(null);

  const total = durations[mode] * 60_000;
  const accent = ACCENT[mode];

  const beep = useCallback(() => {
    const ctx = audio.current;
    if (!ctx) return;
    [0, 0.28, 0.56].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const at = ctx.currentTime + t;
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.3, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.25);
    });
  }, []);

  const finish = useCallback(() => {
    setRunning(false);
    let next: Mode = "focus";
    let nextDone = done;
    if (mode === "focus") {
      nextDone = done + 1;
      setDone(nextDone);
      next = nextDone % LONG_EVERY === 0 ? "long" : "short";
    }
    setMode(next);
    setLeft(durations[next] * 60_000);
    const text =
      mode === "focus"
        ? `完成第 ${nextDone} 個番茄！休息一下吧`
        : "休息結束，準備開始下一個番茄";
    setMessage(text);
    if (sound) beep();
    if (
      notify &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(text);
    }
  }, [done, mode, durations, sound, notify, beep]);

  // 以結束時間戳計時，分頁在背景被降速時也不會失準
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const remain = endAt.current - Date.now();
      if (remain <= 0) finish();
      else setLeft(remain);
    }, 200);
    return () => window.clearInterval(id);
  }, [running, finish]);

  // 分頁標題顯示倒數
  useEffect(() => {
    const prev = document.title;
    document.title = `${fmt(left)} ${LABEL[mode]} | 番茄鐘`;
    return () => {
      document.title = prev;
    };
  }, [left, mode]);

  const start = () => {
    if (!audio.current && "AudioContext" in window)
      audio.current = new AudioContext();
    void audio.current?.resume();
    const from = left > 0 ? left : total;
    endAt.current = Date.now() + from;
    setLeft(from);
    setMessage("");
    setRunning(true);
  };

  const pause = () => {
    setLeft(Math.max(0, endAt.current - Date.now()));
    setRunning(false);
  };

  const switchMode = (m: Mode) => {
    setRunning(false);
    setMode(m);
    setLeft(durations[m] * 60_000);
    setMessage("");
  };

  const reset = () => {
    setRunning(false);
    setLeft(total);
    setMessage("");
  };

  const skip = () => {
    const next: Mode =
      mode === "focus"
        ? (done + 1) % LONG_EVERY === 0
          ? "long"
          : "short"
        : "focus";
    switchMode(next);
  };

  const setDuration = (m: Mode, raw: string) => {
    const v = Math.min(180, Math.max(1, Math.floor(Number(raw)) || 1));
    setDurations((d) => ({ ...d, [m]: v }));
    if (m === mode && !running) setLeft(v * 60_000);
  };

  const toggleNotify = async (on: boolean) => {
    if (
      on &&
      "Notification" in window &&
      Notification.permission === "default"
    ) {
      await Notification.requestPermission();
    }
    setNotify(
      on && "Notification" in window && Notification.permission === "granted",
    );
  };

  const progress = total > 0 ? 1 - left / total : 0;
  const cycleDone = done % LONG_EVERY;

  return (
    <div
      className="flex-1 transition-colors duration-500"
      style={{
        background: `color-mix(in srgb, ${accent} 9%, var(--background))`,
      }}
    >
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            番茄鐘
          </h1>
          <p className="mt-2 text-zinc-500">專注一段時間，休息一下，再繼續。</p>
        </header>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] lg:items-start">
          <div className="flex flex-col items-center">
            {/* 模式切換 */}
            <div
              role="tablist"
              aria-label="模式"
              className="inline-flex rounded-full bg-black/5 p-1 dark:bg-white/10"
            >
              {MODES.map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition sm:px-5 ${
                    mode === m
                      ? "bg-white shadow dark:bg-zinc-800"
                      : "text-zinc-500 hover:text-foreground"
                  }`}
                >
                  {LABEL[m]}
                </button>
              ))}
            </div>

            {/* 圓形進度 */}
            <div className="relative mt-8 w-full max-w-[22rem]">
              <svg
                viewBox="0 0 280 280"
                className="w-full -rotate-90"
                aria-hidden
              >
                <circle
                  cx="140"
                  cy="140"
                  r={RADIUS}
                  fill="none"
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="10"
                />
                <circle
                  cx="140"
                  cy="140"
                  r={RADIUS}
                  fill="none"
                  stroke={accent}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
                  style={{
                    transition: running
                      ? "stroke-dashoffset 0.25s linear"
                      : "none",
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p
                  role="timer"
                  aria-live="off"
                  className="font-mono text-6xl font-bold tabular-nums sm:text-7xl"
                >
                  {fmt(left)}
                </p>
                <p
                  className="mt-2 text-sm font-medium"
                  style={{ color: accent }}
                >
                  {LABEL[mode]}
                  {running ? "中" : ""}
                </p>
              </div>
            </div>

            {/* 控制 */}
            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-full border border-zinc-300 px-5 py-3 text-sm transition hover:bg-black/5 dark:border-zinc-700 dark:hover:bg-white/10"
              >
                重置
              </button>
              <button
                type="button"
                onClick={running ? pause : start}
                className="min-w-36 rounded-full px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:brightness-110"
                style={{ background: accent }}
              >
                {running ? "暫停" : left < total ? "繼續" : "開始"}
              </button>
              <button
                type="button"
                onClick={skip}
                className="rounded-full border border-zinc-300 px-5 py-3 text-sm transition hover:bg-black/5 dark:border-zinc-700 dark:hover:bg-white/10"
              >
                跳過
              </button>
            </div>

            <p
              aria-live="polite"
              className="mt-5 min-h-6 text-center text-sm text-zinc-600 dark:text-zinc-400"
            >
              {message}
            </p>

            {/* 進度點 */}
            <div
              className="mt-2 flex items-center gap-2"
              aria-label={`本輪已完成 ${cycleDone} / ${LONG_EVERY}`}
            >
              {Array.from({ length: LONG_EVERY }, (_, i) => (
                <span
                  key={i}
                  className="h-3 w-3 rounded-full"
                  style={{
                    background:
                      i < cycleDone ? ACCENT.focus : "rgba(128,128,128,0.3)",
                  }}
                />
              ))}
            </div>
            <p className="mt-2 text-sm text-zinc-500">
              本次已完成 {done} 個番茄
            </p>
          </div>

          {/* 側欄 */}
          <div className="space-y-6">
            <div className="rounded-xl border border-zinc-200 bg-background/70 p-5 dark:border-zinc-800">
              <label htmlFor="task" className="font-semibold">
                這一輪要專注的事
              </label>
              <input
                id="task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                maxLength={60}
                placeholder="例如：寫完週報"
                className="mt-3 w-full rounded-lg border border-zinc-300 bg-transparent px-3 py-2 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-300"
              />
              {task && mode === "focus" && (
                <p className="mt-3 text-sm text-zinc-500">
                  目標：
                  <span className="font-medium text-foreground">{task}</span>
                </p>
              )}
            </div>

            <div className="rounded-xl border border-zinc-200 bg-background/70 p-5 dark:border-zinc-800">
              <p className="font-semibold">時間設定（分鐘）</p>
              <div className="mt-3 grid grid-cols-3 gap-3">
                {MODES.map((m) => (
                  <label key={m} className="text-sm text-zinc-500">
                    {LABEL[m]}
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={durations[m]}
                      onChange={(e) => setDuration(m, e.target.value)}
                      className="mt-1 w-full rounded-lg border border-zinc-300 bg-transparent px-2 py-2 text-foreground outline-none focus:border-zinc-900 dark:border-zinc-700 dark:focus:border-zinc-300"
                    />
                  </label>
                ))}
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                每完成 {LONG_EVERY} 個番茄，會進入長休息。
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-zinc-200 bg-background/70 p-5 text-sm dark:border-zinc-800">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={sound}
                  onChange={(e) => setSound(e.target.checked)}
                  className="h-4 w-4"
                />
                時間到時播放提示音
              </label>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => void toggleNotify(e.target.checked)}
                  className="h-4 w-4"
                />
                時間到時發送桌面通知
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
