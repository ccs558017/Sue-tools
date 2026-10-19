import Link from "next/link";
import { tools } from "@/lib/tools";

export default function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-zinc-100/60 dark:border-white/10 dark:bg-white/[.03]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-amber-400 to-red-500 text-sm font-black text-white">
              K
            </span>
            <span className="text-lg">Kai 的小工具箱</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500">
            幾個簡單、好用、打開就能用的小工具。不用註冊，也不用安裝。
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">工具</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-500">
            {tools.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="transition hover:text-foreground"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">關於</p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-500">
            <li>資料只留在你的瀏覽器</li>
            <li>手機、平板、電腦都能用</li>
            <li>使用 Next.js 與 Tailwind CSS 打造</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-4 py-5 text-xs text-zinc-500 sm:px-6">
          <span>© 2026 Kai 的小工具箱</span>
          <span>運勢抽籤內容僅供娛樂</span>
        </div>
      </div>
    </footer>
  );
}
