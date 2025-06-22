import { Insights } from "@/components/Insights";
import { HeroNav } from "@/components/HeroNav";

export default function Home() {
  return (
    <>
      <div className="border-b border-zinc-800 bg-zinc-950/20">
        <div className="container pt-24 pb-12 text-center">
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Анализ стримов Олёши
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Ключевые выводы, тренды и прогнозы на основе 935 стримов за 2021-2025 гг.
            </p>
        </div>
        <div className="container">
          <div className="border-t border-zinc-800">
             <HeroNav />
          </div>
        </div>
      </div>
      <Insights />
    </>
  );
}
