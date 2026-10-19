import type { Metadata } from "next";
import LuckyWheel from "@/components/LuckyWheel";

export const metadata: Metadata = {
  title: "幸運大轉盤 | Sue-tools",
  description: "輸入名單，轉動轉盤抽出幸運兒。",
};

export default function WheelPage() {
  return (
    <main className="flex-1 bg-[radial-gradient(120%_80%_at_50%_0%,#14523c_0%,#0a2e20_55%,#05170f_100%)] text-emerald-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <header className="mb-10 text-center">
          <h1 className="bg-gradient-to-b from-lime-100 via-emerald-300 to-emerald-500 bg-clip-text text-5xl font-black tracking-widest text-transparent drop-shadow-[0_4px_0_rgba(4,60,36,0.9)] sm:text-7xl">
            幸運大轉盤
          </h1>
          <p className="mt-4 text-emerald-100/80">
            輸入這次的名單，轉出今天的幸運兒
          </p>
        </header>
        <LuckyWheel />
      </div>
    </main>
  );
}
