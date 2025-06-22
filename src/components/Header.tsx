'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

const routes = [
  { href: "/", label: "Аналитика" },
  { href: "/schedule", label: "Расписание" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Появляется после прокрутки на 300px
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 300);
  });

  return (
    <motion.header 
      initial={{ y: "-100%" }}
      animate={{ y: isScrolled ? 0 : "-100%" }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed top-0 z-50 w-full border-b border-zinc-800 bg-background/80 backdrop-blur-lg"
    >
      <div className="container relative flex h-16 items-center">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="font-bold" scroll={true}>
            Olesha Analytics
          </Link>
        </div>
        
        <nav className="ml-auto flex items-center space-x-2">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} passHref scroll={true}>
              <div
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  pathname === route.href 
                    ? "bg-zinc-700 text-zinc-100" 
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                )}
              >
                {route.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}