"use client";

import { motion } from "framer-motion";

export function GeneratingState() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-10 rounded-3xl border border-zinc-200/90 bg-white/90 p-8 shadow-sm dark:border-white/10 dark:bg-white/[0.02] dark:shadow-none"
    >
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="h-2.5 w-2.5 rounded-full bg-amber-500 dark:bg-amber-200"
              animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 0.9,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        <motion.p
          className="text-lg text-zinc-800 dark:text-zinc-200"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY }}
        >
          Generating magic...
        </motion.p>
      </div>
    </motion.section>
  );
}
