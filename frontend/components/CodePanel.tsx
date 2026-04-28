"use client";

import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodePanelProps = {
  code: string | null;
  onCopySuccess: () => void;
};

export function CodePanel({ code, onCopySuccess }: CodePanelProps) {
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleCopy(): Promise<void> {
    if (!code?.trim()) {
      return;
    }
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(code);
      onCopySuccess();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setTimeout(() => setIsCopying(false), 250);
    }
  }

  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0b0e] dark:shadow-none">
      <div className="flex items-center justify-between border-b border-zinc-200/90 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
        <span>Generated React Code</span>
        <button
          type="button"
          onClick={handleCopy}
          disabled={isCopying || !code}
          className="glass-btn inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-zinc-800 transition hover:bg-zinc-100/70 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100 dark:hover:bg-white/10"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" aria-hidden />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" aria-hidden />
              Copy Code
            </>
          )}
        </button>
      </div>
      {code ? (
        <div className="bg-zinc-950">
          <SyntaxHighlighter
            language="tsx"
            style={oneDark}
            customStyle={{
              margin: 0,
              background: "transparent",
              fontSize: "0.82rem",
              minHeight: "32rem",
            }}
            wrapLongLines
          >
            {code}
          </SyntaxHighlighter>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex min-h-[32rem] items-center justify-center p-6"
        >
          <div className="max-w-sm text-center">
            <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">Code Awaits</p>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              Upload a screenshot to generate production-style React TSX with
              structure and accessibility notes.
            </p>
          </div>
        </motion.div>
      )}
    </article>
  );
}
