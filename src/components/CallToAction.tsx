'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Twitch } from 'lucide-react';
import { usePathname } from "next/navigation";

export function CallToAction() {
  const pathname = usePathname();
  const isAnalytics = pathname === "/";
  const crossLink = isAnalytics ? "/schedule" : "/";
  const crossText = isAnalytics ? "прогноз трансляций" : "раздел аналитики";

  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950/20">
      <div className="mx-auto max-w-7xl px-4 flex flex-col items-center justify-center py-12 text-center">
        <h2 className="mb-4 text-2xl font-semibold tracking-tight text-white">
          Хочешь стать частью статистики?
        </h2>
        <p className="mb-4 max-w-2xl text-lg text-muted-foreground">
          Присоединяйся к стримам, чтобы попасть в будущие аналитические отчёты и просто хорошо провести время.
        </p>
        <p className="mb-8 max-w-2xl text-sm text-zinc-400">
          А&nbsp;ещё загляни в&nbsp;наш <Link href={crossLink} scroll={true} className="underline hover:text-white">{crossText}</Link>, если пропустил&nbsp;— там много интересного!
        </p>
        <Button asChild size="lg" className="text-lg font-bold">
           <Link href="https://www.twitch.tv/olesha" target="_blank">
             <Twitch className="mr-3 h-6 w-6" />
             На Twitch к Олёше!
           </Link>
        </Button>
        <p className="mt-8 text-xs italic text-zinc-600">
          (в процессе создания этого сайта ни одна бабка не пострадала)
        </p>
      </div>
    </footer>
  )
} 