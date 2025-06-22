'use client'

import { motion, Variants } from "framer-motion";
import { Github, Twitch } from 'lucide-react';

const FadeIn = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: "easeInOut",
    },
  },
});

export function RealFooter() {
  return (
    <motion.footer 
      className="text-center py-10 mt-16 border-t border-zinc-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={FadeIn()}
    >
      <div className="flex justify-center gap-6 mb-4">
        <a href="https://www.twitch.tv/olesha" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
          <Twitch className="w-5 h-5" />
          <span>Смотреть на Twitch</span>
        </a>
        <a href="https://github.com/ZhenyaSSSS/olesha-analytics" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
          <Github className="w-5 h-5" />
          <span>GitHub</span>
        </a>
      </div>
      <p className="text-xs text-zinc-500">
        Сделано <a href="https://t.me/eugene_sautkin" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">Евгением Сауткиным (Eugene S)</a>
      </p>
    </motion.footer>
  );
} 