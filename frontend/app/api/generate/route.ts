import { NextResponse } from "next/server";
import { createPromptGenerateStream } from "@/lib/server/ai/gemini-stream";

export const runtime = "nodejs";
/** Gemini streaming can run longer than the default; cap within Vercel limits. */
export const maxDuration = 60;

/**
 * Prompt → streaming TSX. Runs Gemini directly in this Next.js route (no separate
 * Express backend). GEMINI_API_KEY stays server-side. Returns plain-text chunks so
 * the client can render the component as it streams.
 */
export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createPromptGenerateStream(body);

  if (!result.ok) {
    return NextResponse.json(
      {
        error: result.error,
        ...(result.details ? { details: result.details } : {}),
      },
      { status: result.status },
    );
  }

  return new Response(result.stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
