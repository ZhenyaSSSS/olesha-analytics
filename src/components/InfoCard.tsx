import { Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import React from 'react';

const FadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export const InfoCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      className={cn("bg-zinc-950/70 border border-primary/20 rounded-xl p-6 backdrop-blur-sm", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={FadeIn}
    >
      <div className="flex items-center mb-4">
        <Lightbulb className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
        <h3 className="text-xl font-bold text-primary">{title}</h3>
      </div>
      <div className="text-muted-foreground space-y-3 leading-relaxed">
        {children}
      </div>
    </motion.div>
  )
} 