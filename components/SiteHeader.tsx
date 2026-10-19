"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { tools } from "@/lib/tools";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-background/75 backdrop-blur-md dark:border-white/10">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 font-bold tracking-tight"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 via-amber-400 to-red-500 text-sm font-black text-white">
            S
          </span>
          <span className="text-lg">Su 的小工具箱</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="主選單">
          {tools.map((t) => {
            const active = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-foreground text-background"
                    : "text-zinc-600 hover:bg-black/5 dark:text-zinc-300 dark:hover:bg-white/10"
                }`}
              >
                {t.name}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={open ? "關閉選單" : "開啟選單"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="-mr-2 flex h-10 w-10 items-center justify-center md:hidden"
        >
          <span className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 bg-foreground transition-all duration-300 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-6 bg-foreground transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 bg-foreground transition-all duration-300 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="手機選單"
          className="border-t border-black/10 bg-background md:hidden dark:border-white/10"
        >
          <ul className="mx-auto max-w-6xl divide-y divide-black/10 px-4 dark:divide-white/10 sm:px-6">
            {tools.map((t, i) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 py-4"
                >
                  <span className="font-mono text-xs text-zinc-400">
                    0{i + 1}
                  </span>
                  <span className="text-lg font-semibold">{t.name}</span>
                  <span className="ml-auto text-sm text-zinc-500">{t.en}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
