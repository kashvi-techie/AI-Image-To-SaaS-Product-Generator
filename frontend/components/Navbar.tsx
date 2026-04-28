"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavbarProps = {
  credits: number;
  animateCredits: boolean;
};

export function Navbar({ credits, animateCredits }: NavbarProps) {
  return (
    <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200/80 bg-white/70 px-5 py-4 shadow-[0_12px_34px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-violet-300/15 dark:bg-white/[0.05] dark:shadow-[0_10px_40px_rgba(139,92,246,0.12)]">
      <div className="flex items-center gap-3">
        <Image
          src="/luxegen-logo.svg"
          alt="LuxeGen logo"
          width={96}
          height={24}
          priority
        />
      </div>
      <div className="flex flex-wrap items-center justify-end gap-3">
        <ThemeToggle />
        <motion.div
          animate={
            animateCredits
              ? {
                  scale: [1, 1.06, 1],
                  boxShadow: [
                    "0 0 0px rgba(251,191,36,0.0)",
                    "0 0 24px rgba(251,191,36,0.35)",
                    "0 0 0px rgba(251,191,36,0.0)",
                  ],
                }
              : undefined
          }
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="rounded-full border border-amber-400/40 bg-amber-100/90 px-4 py-1.5 text-sm font-medium text-amber-950 dark:border-amber-300/30 dark:bg-amber-200/10 dark:text-amber-100"
        >
          Credits: {credits}
        </motion.div>
      </div>
    </nav>
  );
}
