"use client";

import { motion } from "framer-motion";
import type { PromptHistoryEntry } from "@/lib/storage/prompt-history";
import type { DesignStyle } from "@/lib/validation/generate-request";

type PromptHistorySidebarProps = {
  items: PromptHistoryEntry[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  formatStyleLabel: (style: DesignStyle) => string;
};

export function PromptHistorySidebar({
  items,
  activeId,
  onSelect,
  onClear,
  formatStyleLabel,
}: PromptHistorySidebarProps) {
  return (
    <motion.aside
      initial={{ x: -36, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 280, damping: 30, mass: 0.85 }}
      className="h-fit rounded-2xl border border-zinc-200/80 bg-white/70 p-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-violet-300/15 dark:bg-white/[0.05] dark:shadow-[0_10px_40px_rgba(139,92,246,0.12)] lg:sticky lg:top-6"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium tracking-wide text-zinc-600 uppercase dark:text-zinc-300">
          Prompt history
        </h3>
        <button
          type="button"
          onClick={onClear}
          disabled={items.length === 0}
          className="glass-btn shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium text-zinc-800 transition hover:bg-zinc-100/70 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-200 dark:hover:bg-white/10"
        >
          Clear
        </button>
      </div>
      <p className="mb-3 text-[11px] leading-snug text-zinc-500 dark:text-zinc-500">
        Up to five runs are stored locally. Select one to restore its code, preview, and prompt fields.
      </p>
      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="rounded-xl border border-zinc-200/80 bg-zinc-50/80 p-3 text-xs text-zinc-600 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-500">
            No prompt runs yet. Generate from a prompt to build history.
          </p>
        ) : null}
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
              activeId === item.id
                ? "glass-btn border-cyan-500/50 bg-cyan-500/10 text-cyan-950 dark:border-cyan-300/40 dark:bg-cyan-500/10 dark:text-cyan-50"
                : "glass-btn border-zinc-200/90 bg-zinc-50/50 text-zinc-800 hover:bg-zinc-100/80 dark:border-white/10 dark:bg-white/[0.02] dark:text-zinc-300 dark:hover:bg-white/[0.05]"
            }`}
          >
            <p className="line-clamp-2 text-sm font-medium leading-snug">{item.prompt}</p>
            <p className="mt-1.5 text-[11px] text-zinc-500 dark:text-zinc-500">
              {formatStyleLabel(item.designStyle)} · {item.createdAt}
            </p>
          </button>
        ))}
      </div>
    </motion.aside>
  );
}
