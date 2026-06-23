import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Diagnostic probe. The AI runs inside this Next.js app now (no separate Express
 * backend to reach), so this reports local configuration instead of a TCP probe.
 */
export async function GET(): Promise<Response> {
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY?.trim());
  const model =
    process.env.GEMINI_MODEL?.trim() ||
    process.env.GEMINI_MODEL_NAME?.trim() ||
    "gemini-1.5-flash";

  return NextResponse.json({
    ok: true,
    mode: "embedded",
    note: "Backend is embedded in the Next.js app — no external API server is used.",
    geminiConfigured,
    model: geminiConfigured ? model : null,
    routes: {
      generate: "POST /api/generate (prompt → streamed TSX)",
      imageToReact: "POST /api/image-to-react (multipart image → JSON)",
      health: "GET /api/health",
    },
    ...(geminiConfigured
      ? {}
      : {
          hint:
            "GEMINI_API_KEY is not set in this environment. Add it in Vercel project settings and redeploy.",
        }),
  });
}
