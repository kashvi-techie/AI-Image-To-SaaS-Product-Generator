"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type ThemeFlipEventDetail = {
  x: number;
  y: number;
  nextTheme: "light" | "dark";
};

type GridCell = {
  key: string;
  left: number;
  top: number;
  delay: number;
};

type OverlayState = {
  id: string;
  nextTheme: "light" | "dark";
  cells: GridCell[];
  totalMs: number;
};

const CELL_SIZE = 72;
const BASE_DELAY_MS = 18;
const ANIMATION_MS = 780;

function createOverlayState(detail: ThemeFlipEventDetail): OverlayState {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const cols = Math.ceil(width / CELL_SIZE);
  const rows = Math.ceil(height / CELL_SIZE);

  const originCol = Math.floor(detail.x / CELL_SIZE);
  const originRow = Math.floor(detail.y / CELL_SIZE);

  const cells: GridCell[] = [];
  let maxDelay = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const dx = col - originCol;
      const dy = row - originRow;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const organicJitter = ((row * 17 + col * 13) % 9) * 6;
      const delay = distance * BASE_DELAY_MS + organicJitter;
      maxDelay = Math.max(maxDelay, delay);
      cells.push({
        key: `${row}-${col}`,
        left: col * CELL_SIZE,
        top: row * CELL_SIZE,
        delay,
      });
    }
  }

  return {
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    nextTheme: detail.nextTheme,
    cells,
    totalMs: maxDelay + ANIMATION_MS + 120,
  };
}

export function ThemeFlipGridOverlay() {
  const [overlay, setOverlay] = useState<OverlayState | null>(null);

  useEffect(() => {
    function onThemeFlip(event: Event) {
      const customEvent = event as CustomEvent<ThemeFlipEventDetail>;
      setOverlay(createOverlayState(customEvent.detail));
    }

    window.addEventListener("luxegen-theme-flip", onThemeFlip as EventListener);
    return () =>
      window.removeEventListener("luxegen-theme-flip", onThemeFlip as EventListener);
  }, []);

  useEffect(() => {
    if (!overlay) {
      return;
    }
    const timer = window.setTimeout(() => setOverlay(null), overlay.totalMs);
    return () => window.clearTimeout(timer);
  }, [overlay]);

  const cellClassName = useMemo(() => {
    if (!overlay) {
      return "";
    }
    return overlay.nextTheme === "dark"
      ? "border border-violet-300/15 bg-[#050505]/88"
      : "border border-zinc-300/45 bg-white/78";
  }, [overlay]);

  return (
    <AnimatePresence>
      {overlay ? (
        <motion.div
          key={overlay.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed inset-0 z-[120]"
          style={{ perspective: 900 }}
        >
          {overlay.cells.map((cell) => (
            <motion.div
              key={cell.key}
              className={`absolute ${cellClassName}`}
              style={{
                left: cell.left,
                top: cell.top,
                width: CELL_SIZE + 1,
                height: CELL_SIZE + 1,
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              initial={{ rotateY: 0, scale: 0.995, opacity: 0.95 }}
              animate={{ rotateY: 180, scale: 1, opacity: 0 }}
              transition={{
                duration: ANIMATION_MS / 1000,
                delay: cell.delay / 1000,
                ease: [0.2, 0.7, 0, 1],
              }}
            />
          ))}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

