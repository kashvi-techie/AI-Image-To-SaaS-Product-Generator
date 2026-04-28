"use client";

import { motion } from "framer-motion";

type HistoryItem = {
  id: string;
  componentName: string;
  createdAt: string;
};

type HistorySidebarProps = {
  items: HistoryItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
};

export function HistorySidebar({
  items,
  activeId,
  onSelect,
  onClear,
}: HistorySidebarProps) {
  return (
    <motion.aside
      initial={{ x: -36, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 280,
        damping: 30,
        mass: 0.85,
        delay: 0.06,
      }}
      className="rounded-3xl border border-zinc-200/80 bg-white/70 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-violet-300/15 dark:bg-white/[0.05] dark:shadow-[0_10px_40px_rgba(139,92,246,0.12)]"
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium tracking-wide text-zinc-600 uppercase dark:text-zinc-300">
          Recent Generations
        </h3>
        <button
          type="button"
          onClick={onClear}
          disabled={items.length === 0}
          className="glass-btn rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-800 transition hover:bg-zinc-100/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-500">
            No generations yet. Your last 5 components appear here.
          </p>
        ) : null}
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-xl border px-3 py-2 text-left transition ${
              activeId === item.id
                ? "glass-btn border-amber-400/60 bg-amber-100/90 text-amber-950 dark:border-amber-300/40 dark:bg-amber-200/10 dark:text-amber-100"
                : "glass-btn border-zinc-200/90 bg-zinc-50/50 text-zinc-800 hover:bg-zinc-100/80 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:bg-white/[0.05]"
            }`}
          >
            <p className="truncate text-sm font-medium">{item.componentName}</p>
            <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-500">{item.createdAt}</p>
          </button>
        ))}
      </div>
    </motion.aside>
  );
}
