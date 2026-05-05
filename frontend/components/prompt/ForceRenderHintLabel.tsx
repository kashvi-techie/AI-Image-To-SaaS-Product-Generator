"use client";

import * as React from "react";

const HOVER_MS = 3000;

const FORCE_RENDER_HELP =
  "Force render tries to run the live preview while the model is still writing code. Imports are removed and the preview uses your default export (or a temporary wrapper). Turn it on if you want to see the UI early; the stream can briefly produce invalid syntax—preview updates are debounced and, while streaming, we keep the last good frame instead of flashing errors.";

type ForceRenderHintLabelProps = {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  inputClassName?: string;
  /** Luxe workspace uses tighter typography + gold tooltip */
  luxe?: boolean;
};

export function ForceRenderHintLabel({
  checked,
  onChange,
  className = "",
  inputClassName = "rounded border-zinc-300 text-amber-600 focus:ring-amber-500",
  luxe = false,
}: ForceRenderHintLabelProps): React.ReactElement {
  const tipId = React.useId();
  const [open, setOpen] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startHover = React.useCallback(() => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setOpen(true);
    }, HOVER_MS);
  }, [clearTimer]);

  const endHover = React.useCallback(() => {
    clearTimer();
    setOpen(false);
  }, [clearTimer]);

  return (
    <label
      className={`relative flex cursor-pointer items-center gap-2 ${className}`}
      onMouseEnter={startHover}
      onMouseLeave={endHover}
      onFocus={startHover}
      onBlur={endHover}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={inputClassName}
        aria-describedby={open ? tipId : undefined}
      />
      <span className={luxe ? "text-[10px]" : "text-xs"}>Force render</span>
      {open ? (
        <span
          id={tipId}
          role="tooltip"
          className={`absolute top-full right-0 z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] rounded-xl border p-3 shadow-lg ${
            luxe
              ? "border-[#d4af37]/35 bg-[#fdfbf7] text-[11px] leading-snug text-amber-950 dark:border-[#fccf45]/25 dark:bg-[#1a1612] dark:text-[#e8dcc4]"
              : "border-zinc-200 bg-white text-xs leading-snug text-zinc-800 dark:border-white/15 dark:bg-zinc-900 dark:text-zinc-100"
          }`}
        >
          {FORCE_RENDER_HELP}
        </span>
      ) : null}
    </label>
  );
}
