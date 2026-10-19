import type { Metadata } from "next";
import FortuneDraw from "@/components/FortuneDraw";

export const metadata: Metadata = {
  title: "運勢抽籤 | Sue-tools",
  description: "搖一支籤，看看今天的運勢是大吉還是大凶。",
};

export default function FortunePage() {
  return (
    <main className="flex-1 bg-[radial-gradient(120%_80%_at_50%_0%,#fff4d6_0%,#fbe3b0_60%,#f4cf8c_100%)] text-stone-800 dark:bg-[radial-gradient(120%_80%_at_50%_0%,#3a2a10_0%,#241a0b_60%,#150f06_100%)] dark:text-amber-50">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-[0.3em] text-red-800 sm:text-6xl dark:text-red-300">
            運勢抽籤
          </h1>
          <p className="mt-4 text-stone-600 dark:text-amber-100/70">
            大吉、中吉、小吉、吉、末吉、凶、大凶，今天會抽到哪一支？
          </p>
        </header>
        <FortuneDraw />
      </div>
    </main>
  );
}
