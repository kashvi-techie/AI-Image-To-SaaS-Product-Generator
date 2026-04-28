"use client";

import { AnimatePresence, motion } from "framer-motion";

type ToastProps = {
  message: string;
  show: boolean;
  variant?: "success" | "error" | "info";
};

export function Toast({ message, show, variant = "success" }: ToastProps) {
  const styleClass =
    variant === "error"
      ? "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-300/30 dark:bg-rose-300/10 dark:text-rose-100"
      : variant === "info"
        ? "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-300/30 dark:bg-amber-500/10 dark:text-amber-100"
        : "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/30 dark:bg-emerald-300/10 dark:text-emerald-100";

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className={`fixed right-5 bottom-5 z-50 rounded-xl border px-4 py-2 text-sm shadow-lg backdrop-blur ${styleClass}`}
        >
          {message}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
