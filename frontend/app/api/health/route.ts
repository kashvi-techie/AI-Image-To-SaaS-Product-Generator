import { NextResponse } from "next/server";

export const runtime = "nodejs";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() ||
  process.env.GEMINI_MODEL_NAME?.trim() ||
  "gemini-1.5-flash";

/**
 * Local liveness check. The AI now runs inside this Next.js app (no separate Express
 * backend), so this route is always "alive" as long as the app is serving.
 * `geminiConfigured` reflects whether GEMINI_API_KEY is set in this environment —
 * the UI uses it to distinguish "ready" from "add your key".
 */
export async function GET(): Promise<Response> {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());
  return NextResponse.json({
    ok: true,
    alive: true,
    mode: "embedded",
    geminiConfigured,
    model: geminiConfigured ? GEMINI_MODEL : null,
    ...(geminiConfigured
      ? {}
      : {
          hint:
            "Set GEMINI_API_KEY in this app's environment (Vercel → Project → Settings → Environment Variables), then redeploy.",
        }),
  });
}
