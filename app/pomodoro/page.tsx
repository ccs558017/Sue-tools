import type { Metadata } from "next";
import PomodoroTimer from "@/components/PomodoroTimer";

export const metadata: Metadata = {
  title: "番茄鐘 | Sue-tools",
  description: "番茄工作法計時器，幫助你專注工作。",
};

export default function PomodoroPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PomodoroTimer />
    </main>
  );
}
