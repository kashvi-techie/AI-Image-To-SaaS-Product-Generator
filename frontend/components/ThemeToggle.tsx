"use client";

import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-24 rounded-lg border border-zinc-200/80 bg-zinc-100/80 dark:border-white/10 dark:bg-white/5"
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";
  const nextTheme = isDark ? "light" : "dark";

  function handleToggle(event: { clientX: number; clientY: number }) {
    window.dispatchEvent(
      new CustomEvent("luxegen-theme-flip", {
        detail: {
          x: event.clientX,
          y: event.clientY,
          nextTheme,
        },
      }),
    );
    setTheme(nextTheme);
  }

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="glass-btn inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50/70 dark:text-zinc-100 dark:hover:bg-white/10"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 text-amber-300" aria-hidden />
      ) : (
        <Moon className="h-3.5 w-3.5 text-zinc-600" aria-hidden />
      )}
      <span className="hidden sm:inline">{isDark ? "Light mode" : "Dark mode"}</span>
    </motion.button>
  );
}
