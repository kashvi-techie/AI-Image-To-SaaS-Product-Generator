"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ExternalLink, Loader2, Rocket, X } from "lucide-react";

function GithubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6 0-.6 0-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.8-2.4 4.7-4.6 4.9.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2z" />
    </svg>
  );
}
import * as React from "react";

type PublishResult = {
  projectName: string;
  repoUrl?: string;
  deploymentUrl?: string;
  inspectorUrl?: string;
  warnings?: string[];
};

const LS_GH = "luxegen.publish.githubToken";
const LS_VC = "luxegen.publish.vercelToken";
const LS_TEAM = "luxegen.publish.vercelTeamId";

export function PublishDialog({
  open,
  onClose,
  code,
  defaultName = "luxegen-site",
}: {
  open: boolean;
  onClose: () => void;
  code: string;
  defaultName?: string;
}) {
  const [githubToken, setGithubToken] = React.useState("");
  const [vercelToken, setVercelToken] = React.useState("");
  const [vercelTeamId, setVercelTeamId] = React.useState("");
  const [projectName, setProjectName] = React.useState(defaultName);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<PublishResult | null>(null);

  React.useEffect(() => {
    if (!open) return;
    try {
      setGithubToken(localStorage.getItem(LS_GH) ?? "");
      setVercelToken(localStorage.getItem(LS_VC) ?? "");
      setVercelTeamId(localStorage.getItem(LS_TEAM) ?? "");
    } catch {
      /* ignore */
    }
    setError(null);
    setResult(null);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function handlePublish() {
    setError(null);
    setResult(null);
    if (!githubToken.trim() && !vercelToken.trim()) {
      setError("Add a GitHub token, a Vercel token, or both.");
      return;
    }
    if (!code.trim()) {
      setError("Generate a component first — there's nothing to publish yet.");
      return;
    }
    try {
      localStorage.setItem(LS_GH, githubToken.trim());
      localStorage.setItem(LS_VC, vercelToken.trim());
      localStorage.setItem(LS_TEAM, vercelTeamId.trim());
    } catch {
      /* ignore */
    }
    setLoading(true);
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          projectName,
          githubToken: githubToken.trim() || undefined,
          vercelToken: vercelToken.trim() || undefined,
          vercelTeamId: vercelTeamId.trim() || undefined,
        }),
      });
      const data = (await res.json()) as PublishResult & { error?: string };
      if (!res.ok) {
        setError(data.error || `Publish failed (${res.status}).`);
        if (data.repoUrl || data.deploymentUrl) setResult(data);
        return;
      }
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 dark:border-white/15 dark:bg-[#15120c] dark:text-zinc-100";
  const labelCls = "mb-1 block text-xs font-medium text-zinc-700 dark:text-zinc-300";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-label="Publish site"
            className="relative z-10 w-[min(34rem,calc(100vw-2rem))] max-h-[90vh] overflow-y-auto rounded-2xl border border-amber-200/50 bg-[#fdfbf4] p-5 shadow-2xl dark:border-[#fccf45]/25 dark:bg-[#1a1612]"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-amber-600" />
                <h2 className="text-base font-semibold text-amber-950 dark:text-amber-100">
                  Publish your site
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/10"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {result ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg border border-emerald-300/50 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-400/25 dark:bg-emerald-500/10 dark:text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Published <strong>{result.projectName}</strong>
                </div>
                {result.deploymentUrl ? (
                  <a
                    href={result.deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-amber-200/60 bg-white px-3 py-2.5 text-sm font-medium text-amber-950 transition hover:bg-amber-50 dark:border-[#fccf45]/25 dark:bg-white/5 dark:text-amber-100 dark:hover:bg-white/10"
                  >
                    <span className="truncate">{result.deploymentUrl}</span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ) : null}
                {result.deploymentUrl ? (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    The site is building on Vercel — give it a minute, then refresh the link.
                  </p>
                ) : null}
                {result.repoUrl ? (
                  <a
                    href={result.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 dark:border-white/15 dark:bg-white/5 dark:text-zinc-100 dark:hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <GithubMark className="h-4 w-4 shrink-0" />
                      {result.repoUrl}
                    </span>
                    <ExternalLink className="h-4 w-4 shrink-0" />
                  </a>
                ) : null}
                {result.warnings && result.warnings.length ? (
                  <div className="rounded-lg border border-amber-300/50 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-400/25 dark:bg-amber-500/10 dark:text-amber-200">
                    {result.warnings.map((w, i) => (
                      <p key={i}>{w}</p>
                    ))}
                  </div>
                ) : null}
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-white/15 dark:text-zinc-200 dark:hover:bg-white/10"
                >
                  Publish again
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  Packages your component into a deployable Next.js app, creates a GitHub repo,
                  and deploys to Vercel. Tokens are stored only in this browser and sent directly
                  to GitHub/Vercel for this request.
                </p>

                <div>
                  <label className={labelCls}>Project name</label>
                  <input
                    className={inputCls}
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="luxegen-site"
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    GitHub token{" "}
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=LuxeGen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline dark:text-amber-400"
                    >
                      create one ↗
                    </a>{" "}
                    <span className="text-zinc-400">(scope: repo)</span>
                  </label>
                  <input
                    className={inputCls}
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_…"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Vercel token{" "}
                    <a
                      href="https://vercel.com/account/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:underline dark:text-amber-400"
                    >
                      create one ↗
                    </a>
                  </label>
                  <input
                    className={inputCls}
                    type="password"
                    value={vercelToken}
                    onChange={(e) => setVercelToken(e.target.value)}
                    placeholder="vercel token…"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    Vercel team ID <span className="text-zinc-400">(optional — only for team accounts)</span>
                  </label>
                  <input
                    className={inputCls}
                    value={vercelTeamId}
                    onChange={(e) => setVercelTeamId(e.target.value)}
                    placeholder="team_…"
                    autoComplete="off"
                  />
                </div>

                {error ? (
                  <div className="rounded-lg border border-rose-300/50 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:border-rose-400/25 dark:bg-rose-500/10 dark:text-rose-200">
                    {error}
                  </div>
                ) : null}

                <button
                  type="button"
                  onClick={() => void handlePublish()}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-500 dark:hover:bg-amber-400"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Publishing…
                    </>
                  ) : (
                    <>
                      <Rocket className="h-4 w-4" />
                      Publish
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
