"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

type AnimatedCopyButtonProps = {
  onCopy: () => Promise<void>;
  disabled?: boolean;
  className?: string;
};

export function AnimatedCopyButton({
  onCopy,
  disabled,
  className,
}: AnimatedCopyButtonProps) {
  const [phase, setPhase] = useState<"idle" | "success">("idle");

  async function handleClick() {
    if (disabled) {
      return;
    }
    try {
      await onCopy();
      setPhase("success");
      window.setTimeout(() => setPhase("idle"), 2000);
    } catch {
      /* Parent may toast; keep button in idle */
    }
  }

  return (
    <motion.button
      type="button"
      onClick={() => void handleClick()}
      disabled={disabled}
      layout
      className={className}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      animate={
        phase === "success"
          ? {
              scale: [1, 1.06, 1],
              boxShadow: [
                "0 0 0 0 rgba(52, 211, 153, 0)",
                "0 0 0 4px rgba(52, 211, 153, 0.25)",
                "0 0 0 0 rgba(52, 211, 153, 0)",
              ],
            }
          : { scale: 1 }
      }
      transition={
        phase === "success"
          ? { duration: 0.55, ease: "easeOut" }
          : { type: "spring", stiffness: 400, damping: 28 }
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {phase === "success" ? (
          <motion.span
            key="ok"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
            >
              <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" aria-hidden />
            </motion.span>
            Copied
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            className="flex items-center gap-1.5"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Copy to clipboard
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
