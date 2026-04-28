"use client";

import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type StreamedCodeDisplayProps = {
  code: string;
};

export function StreamedCodeDisplay({ code }: StreamedCodeDisplayProps) {
  if (!code.trim()) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className="overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0b0e] dark:shadow-none"
    >
      <div className="border-b border-zinc-200/90 px-4 py-2 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400">
        Generated component (streamed)
      </div>
      <div className="bg-zinc-950">
        <SyntaxHighlighter
          language="tsx"
          style={oneDark}
          customStyle={{
            margin: 0,
            background: "transparent",
            fontSize: "0.82rem",
            maxHeight: "28rem",
          }}
          wrapLongLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </motion.div>
  );
}
