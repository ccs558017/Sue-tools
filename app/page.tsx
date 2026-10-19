import Link from "next/link";
import { tools, type Tool } from "@/lib/tools";

function Illustration({ href, accent }: { href: string; accent: string }) {
  if (href === "/wheel") {
    // 六等分轉盤（座標為固定值）
    const slices = [
      "M0 0 L0 -40 A40 40 0 0 1 34.641 -20 Z",
      "M0 0 L34.641 -20 A40 40 0 0 1 34.641 20 Z",
      "M0 0 L34.641 20 A40 40 0 0 1 0 40 Z",
      "M0 0 L0 40 A40 40 0 0 1 -34.641 20 Z",
      "M0 0 L-34.641 20 A40 40 0 0 1 -34.641 -20 Z",
      "M0 0 L-34.641 -20 A40 40 0 0 1 0 -40 Z",
    ];
    return (
      <svg viewBox="-50 -50 100 100" className="h-full w-full" aria-hidden>
        <circle r="46" fill="#fff" opacity="0.25" />
        {slices.map((d, i) => (
          <path
            key={i}
            d={d}
            fill={i % 2 ? "#effff5" : "#0f3d2e"}
            opacity={i % 2 ? 0.95 : 0.9}
          />
        ))}
        <circle r="7" fill="#fff" stroke="#0f3d2e" strokeWidth="2" />
        <path d="M0 -50 L-5 -40 H5 Z" fill="#f4ffb8" />
      </svg>
    );
  }
  if (href === "/pomodoro") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#fff"
          strokeOpacity="0.3"
          strokeWidth="7"
        />
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#fff"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="238.8"
          strokeDashoffset="80"
          transform="rotate(-90 50 50)"
        />
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="18"
          fontWeight="800"
          fill="#fff"
          fontFamily="ui-monospace, monospace"
        >
          25:00
        </text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <g fill="#fff3cf" stroke="#7a4b00" strokeOpacity="0.5" strokeWidth="1">
        <rect
          x="32"
          y="6"
          width="7"
          height="46"
          rx="2"
          transform="rotate(-12 35 52)"
        />
        <rect x="46" y="2" width="7" height="50" rx="2" />
        <rect
          x="60"
          y="8"
          width="7"
          height="44"
          rx="2"
          transform="rotate(12 63 52)"
        />
      </g>
      <path
        d="M26 50 H74 L70 94 Q70 97 67 97 H33 Q30 97 30 94 Z"
        fill="#7f1d1d"
      />
      <rect x="22" y="46" width="56" height="8" rx="3" fill={accent} />
      <text
        x="50"
        y="82"
        textAnchor="middle"
        fontSize="16"
        fontWeight="800"
        fill="#fde68a"
      >
        籤
      </text>
    </svg>
  );
}

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-black/10 bg-white/70 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl dark:border-white/10 dark:bg-white/[.04]"
    >
      <div
        className="relative flex h-48 items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tool.from}, ${tool.to})`,
        }}
      >
        <span className="absolute left-5 top-4 font-mono text-sm font-medium text-white/80">
          0{index + 1}
        </span>
        <span className="absolute right-5 top-4 text-xs font-medium uppercase tracking-[0.2em] text-white/70">
          {tool.en}
        </span>
        <div className="h-32 w-32 transition duration-500 group-hover:rotate-6 group-hover:scale-110 sm:h-36 sm:w-36">
          <Illustration href={tool.href} accent={tool.accent} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-bold tracking-tight">{tool.name}</h3>
        <p className="mt-1 text-sm font-medium" style={{ color: tool.accent }}>
          {tool.tagline}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          {tool.desc}
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          {tool.points.map((p) => (
            <li key={p} className="flex items-start gap-2">
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: tool.accent }}
              />
              {p}
            </li>
          ))}
        </ul>
        <span className="mt-8 inline-flex items-center gap-2 pt-2 text-sm font-semibold">
          開始使用
          <span className="transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <>
      {/* 主視覺 */}
      <section className="relative isolate overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="landing-float absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-400/30 blur-3xl" />
          <div className="landing-float absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-300/40 blur-3xl [animation-delay:-3s]" />
          <div className="landing-float absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-red-400/25 blur-3xl [animation-delay:-6s]" />
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.06)_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)]" />
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:px-6 sm:pb-28 sm:pt-24">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-xs font-medium tracking-wide text-zinc-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-zinc-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />3
            個小工具，打開就能用
          </p>
          <h1 className="mt-8 text-5xl font-black leading-[1.1] tracking-tight sm:text-7xl">
            <span className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 bg-clip-text text-transparent">
              Kai 的
            </span>
            <br className="sm:hidden" />
            小工具箱
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            抽獎、專注、問運勢。把日常會用到的小事，做成簡單好用的小工具。
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tools"
              className="rounded-full bg-foreground px-8 py-3.5 text-sm font-semibold text-background shadow-lg transition hover:scale-105"
            >
              看看有哪些工具
            </a>
            <Link
              href="/pomodoro"
              className="rounded-full border border-black/15 bg-white/60 px-8 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/10"
            >
              直接開始專注
            </Link>
          </div>
        </div>
      </section>

      {/* 工具列表 */}
      <section
        id="tools"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6 sm:pb-28"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            選一個工具
          </h2>
          <p className="text-sm text-zinc-500">點整張卡片就能進入</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <ToolCard key={t.href} tool={t} index={i} />
          ))}
        </div>
      </section>

      {/* 特色 */}
      <section className="border-y border-black/10 bg-zinc-100/60 dark:border-white/10 dark:bg-white/[.03]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          {[
            ["免註冊、免安裝", "打開網頁就能使用，不需要建立帳號。"],
            ["資料留在你這裡", "名單與設定都在你的瀏覽器裡處理，不會上傳。"],
            ["手機也好用", "手機、平板、電腦都有對應的版面。"],
          ].map(([title, text]) => (
            <div key={title}>
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
