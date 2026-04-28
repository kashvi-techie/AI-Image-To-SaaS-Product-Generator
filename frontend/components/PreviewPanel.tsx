"use client";

import { motion } from "framer-motion";
import { LiveError, LivePreview, LiveProvider } from "react-live";
import { livePreviewScope } from "@/lib/live-preview-scope";

type PreviewPanelProps = {
  liveCode: string | null;
};

export function PreviewPanel({ liveCode }: PreviewPanelProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-200/90 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b0b0e] dark:shadow-none">
      <div className="border-b border-zinc-200/90 px-4 py-3 text-sm text-zinc-700 dark:border-white/10 dark:text-zinc-300">
        Live Preview
      </div>
      <div className="min-h-[32rem] p-5">
        {liveCode ? (
          <LiveProvider
            code={liveCode}
            noInline
            scope={livePreviewScope}
            enableTypeScript
          >
            <div className="rounded-2xl border border-white/10 bg-white p-4 text-black">
              <LivePreview />
            </div>
            <LiveError className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800 dark:border-rose-300/40 dark:bg-rose-950/10 dark:text-rose-300" />
          </LiveProvider>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[28rem] items-center justify-center rounded-2xl border border-zinc-200/90 bg-zinc-50/80 p-6 dark:border-white/10 dark:bg-white/[0.02]"
          >
            <div className="max-w-sm text-center">
              <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200">Live Canvas</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                The generated component will render here with real-time preview
                once processing completes.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </article>
  );
}
