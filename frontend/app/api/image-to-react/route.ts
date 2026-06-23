import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { imageToStructuredReact } from "@/lib/server/ai/gemini-image";

export const runtime = "nodejs";
export const maxDuration = 60;

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() ||
  process.env.GEMINI_MODEL_NAME?.trim() ||
  "gemini-1.5-flash";

const allowedMime = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const MAX_BYTES = 12 * 1024 * 1024;

/**
 * Image → structured React. Parses multipart `image` and calls Gemini directly in
 * this Next.js route (no separate Express backend). GEMINI_API_KEY stays server-side.
 */
export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server misconfiguration: GEMINI_API_KEY is not set" },
      { status: 500 },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return NextResponse.json(
      { error: 'Expected multipart/form-data with field "image"' },
      { status: 400 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart/form-data body" }, { status: 400 });
  }

  const file = form.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: 'Expected multipart field "image" with image bytes' },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Image too large (max 12MB)" },
      { status: 400 },
    );
  }

  const mimeType = file.type;
  if (!allowedMime.has(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type: ${mimeType}` },
      { status: 400 },
    );
  }

  try {
    const imageBase64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const result = await imageToStructuredReact({
      apiKey,
      model: GEMINI_MODEL,
      imageBase64,
      mimeType,
    });
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Model JSON did not match the expected schema",
          details: err.flatten(),
        },
        { status: 502 },
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
