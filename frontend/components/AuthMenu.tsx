"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, Loader2, LogIn, LogOut, User } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { useAuth } from "@/components/AuthProvider";
import { luxeSerif } from "@/lib/fonts/luxe-serif";

/** Whether Supabase auth env is present (NEXT_PUBLIC_* are inlined at build time). */
const AUTH_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

/**
 * Header auth control. Shows "Log in" when signed out and the account dropdown
 * (email, dashboard link, sign out) when signed in. Used in the landing nav and
 * the workspace header. Gating itself lives on /dashboard (redirects to /login).
 */
export function AuthMenu() {
  const { user, loading, signOut } = useAuth();
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      return;
    }
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "LG";

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        title={user ? "Account" : "Log in"}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="glass-btn inline-flex h-9 items-center gap-2 rounded-lg px-3 text-xs font-medium text-zinc-800 transition hover:bg-zinc-50/70 dark:text-zinc-100 dark:hover:bg-white/10"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {user ? (
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200/70 text-[10px] font-semibold text-amber-900 dark:bg-amber-500/25 dark:text-amber-100">
            {initials}
          </span>
        ) : (
          <User className="h-3.5 w-3.5 text-zinc-600 dark:text-amber-200/90" aria-hidden />
        )}
        <span className="hidden sm:inline">{user ? "Account" : "Log in"}</span>
      </motion.button>

      {open ? (
        <div
          role="dialog"
          aria-label="Account"
          className="absolute top-[calc(100%+0.5rem)] right-0 z-[70] w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-amber-200/40 bg-[#fdfbf4]/95 p-4 shadow-xl backdrop-blur-xl dark:border-[#fccf45]/25 dark:bg-[#261e01]/95"
        >
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-white/60">
              <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
              Checking session…
            </div>
          ) : user ? (
            <>
              <p className={`${luxeSerif.className} text-sm font-semibold text-amber-950 dark:text-[#fccf45]`}>
                Signed in
              </p>
              <p className="mt-1 truncate text-xs text-zinc-600 dark:text-white/60" title={user.email ?? undefined}>
                {user.email}
              </p>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center gap-2 rounded-lg border border-amber-200/60 bg-white/70 px-3 py-2 text-xs font-medium text-amber-950 transition hover:bg-white dark:border-[#fccf45]/25 dark:bg-white/5 dark:text-amber-100 dark:hover:bg-white/10"
              >
                <LayoutDashboard className="h-4 w-4" />
                Open dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  void signOut();
                }}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100/70 dark:text-white/70 dark:hover:bg-white/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <p className={`${luxeSerif.className} text-sm font-semibold text-amber-950 dark:text-[#fccf45]`}>
                Your account
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600 dark:text-white/55">
                Sign in to save your generations and projects.
              </p>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-400"
              >
                <LogIn className="h-4 w-4" />
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center rounded-lg border border-amber-200/60 px-3 py-2 text-xs font-medium text-amber-950 transition hover:bg-white/70 dark:border-[#fccf45]/25 dark:text-amber-100 dark:hover:bg-white/10"
              >
                Create account
              </Link>
              {!AUTH_CONFIGURED ? (
                <p className="mt-3 rounded-lg border border-amber-200/50 bg-amber-50/70 px-2.5 py-2 text-[11px] leading-relaxed text-amber-800 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-200/80">
                  Auth isn&apos;t configured yet. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to enable sign-in.
                </p>
              ) : null}
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
