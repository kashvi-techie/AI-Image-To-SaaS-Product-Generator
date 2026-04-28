"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Palette } from "lucide-react";

type ProjectStatsProps = {
  totalGenerations: number;
  designStyleLabel: string;
};

export function ProjectStats({ totalGenerations, designStyleLabel }: ProjectStatsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      className="mb-8 grid gap-4 sm:grid-cols-2"
    >
      <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-violet-300/15 dark:bg-white/[0.05] dark:shadow-[0_10px_40px_rgba(139,92,246,0.12)]">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5">
            <LayoutGrid className="h-5 w-5 text-zinc-600 dark:text-amber-200/90" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Total generations
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums text-zinc-900 dark:text-zinc-50">
              {totalGenerations}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Successful prompt and image runs in this browser
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-5 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-violet-300/15 dark:bg-white/[0.05] dark:shadow-[0_10px_40px_rgba(139,92,246,0.12)]">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-2 dark:border-white/10 dark:bg-white/5">
            <Palette className="h-5 w-5 text-zinc-600 dark:text-cyan-200/90" aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
              Current design style
            </p>
            <p className="mt-1 truncate text-xl font-semibold text-zinc-900 dark:text-zinc-50">
              {designStyleLabel}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
              Applied to the next prompt generation
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
