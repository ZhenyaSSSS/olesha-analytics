'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const routes = [
  { 
    href: "/", 
    label: "Аналитика",
    description: "Ключевые инсайты и графики" 
  },
  { 
    href: "/schedule", 
    label: "Прогноз",
    description: "Прогноз будущих стримов"
  },
];

export function HeroNav() {
  const pathname = usePathname();

  return (
    <div className="container">
      <nav className="flex items-center">
        {routes.map((route) => (
          <Link key={route.href} href={route.href} passHref scroll={true}>
            <div
              className={cn(
                "relative px-4 py-3 transition-colors",
                pathname === route.href ? "text-white" : "text-muted-foreground hover:text-white"
              )}
            >
              <div className="text-sm font-semibold">
                {route.label}
              </div>
              <div className="text-xs">
                {route.description}
              </div>
              {pathname === route.href && (
                <motion.div
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary"
                  layoutId="underline"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
} 