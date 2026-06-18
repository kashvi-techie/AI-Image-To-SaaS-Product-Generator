import { GoogleGenAI } from "@google/genai";
import {
  getReactComponentJsonSchema,
  reactComponentResultSchema,
  type ReactComponentResult,
} from "./schema.js";

const VISION_PROMPT = `You are a senior React (TypeScript + TSX) developer.
Analyze the attached image and implement a single UI that matches it as closely as possible.
Be extremely pedantic about layout fidelity.

Rules:
- Output must follow the JSON schema exactly.
- sourceCode must be valid TSX: one default-exported function component, no extraneous prose.
- Prefer semantic HTML and accessible patterns (labels, alt text, roles where needed).
- Use Tailwind CSS v4 utility classes for all styling and layout. Avoid inline styles unless absolutely unavoidable.
- Recreate spacing and structure precisely: identify and apply padding, margins, gaps, width/height proportions, and border radius as seen in the image.
- Recreate flex/grid behavior precisely: infer axis direction, justify-content, align-items, wrapping, and responsive stacking from the screenshot.
- Preserve visual hierarchy exactly: section order, card grouping, text alignment, and whitespace rhythm must match the reference.
- If the reference includes image assets or unknown logos/photos, replace them with relevant Lucide icons or stable Unsplash placeholders.
- For placeholders, use descriptive Unsplash source URLs (for example: https://source.unsplash.com/featured/?dashboard or .../?finance) based on context.
- Do not use placeholder comments like "// add logic"; write a complete component.
- Do not wrap sourceCode in markdown code fences inside the string.`;

function parseJsonFromModelText(raw: string): unknown {
  const cleaned = raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const objectMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!objectMatch) {
      throw new Error("Model response was not valid JSON");
    }
    try {
      return JSON.parse(objectMatch[0]);
    } catch {
      throw new Error("Model response was not valid JSON");
    }
  }
}

function normalizeModelResult(value: unknown): unknown {
  if (!value || typeof value !== "object") {
    return value;
  }
  const obj = value as Record<string, unknown>;
  const sourceCode =
    (typeof obj.sourceCode === "string" && obj.sourceCode) ||
    (typeof obj.code === "string" && obj.code) ||
    (typeof obj.tsx === "string" && obj.tsx) ||
    "";
  return {
    componentName:
      typeof obj.componentName === "string"
        ? obj.componentName
        : "GeneratedComponent",
    description:
      typeof obj.description === "string"
        ? obj.description
        : "Generated UI converted from reference image.",
    styling:
      obj.styling === "tailwind" ||
      obj.styling === "inline" ||
      obj.styling === "css-module" ||
      obj.styling === "none"
        ? obj.styling
        : "tailwind",
    props: Array.isArray(obj.props) ? obj.props : [],
    sourceCode,
    accessibilityNotes:
      typeof obj.accessibilityNotes === "string" ? obj.accessibilityNotes : undefined,
  };
}

export async function imageToStructuredReact(params: {
  apiKey: string;
  model: string;
  imageBase64: string;
  mimeType: string;
}): Promise<ReactComponentResult> {
  const { apiKey, model, imageBase64, mimeType } = params;
  const ai = new GoogleGenAI({ apiKey, apiVersion: "v1" });
  const responseJsonSchema = getReactComponentJsonSchema();
  const modelCandidates = [model, "gemini-1.5-pro", "gemini-2.5-flash"].filter(
    (item, index, items) => items.indexOf(item) === index,
  );

  const contents = {
    role: "user" as const,
    parts: [
      {
        text: `${VISION_PROMPT}

Return a strict JSON object only (no markdown) matching the required schema fields.`,
      },
      {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      },
    ],
  };

  let response: Awaited<ReturnType<typeof ai.models.generateContent>> | null = null;
  let lastError: unknown = null;

  for (const modelName of modelCandidates) {
    try {
      response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseMimeType: "application/json",
          responseJsonSchema,
          temperature: 0.4,
        },
      });
      break;
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      const needsSchemaFallback = /responseMimeType|responseJsonSchema/i.test(message);
      const needsModelFallback = /not found|not supported/i.test(message);
      if (!needsSchemaFallback && !needsModelFallback) {
        throw error;
      }
      try {
        response = await ai.models.generateContent({
          model: modelName,
          contents,
          config: {
            temperature: 0.4,
          },
        });
        break;
      } catch (fallbackError) {
        lastError = fallbackError;
        const fallbackMessage =
          fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
        const canTryNextModel = /not found|not supported/i.test(fallbackMessage);
        if (!canTryNextModel) {
          throw fallbackError;
        }
      }
    }
  }

  if (!response) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  const raw = response.text;
  if (!raw) {
    const reason =
      response.promptFeedback?.blockReason ??
      response.candidates?.[0]?.finishReason ??
      "empty response";
    throw new Error(`Gemini returned no text: ${String(reason)}`);
  }

  let parsedUnknown: unknown;
  try {
    parsedUnknown = parseJsonFromModelText(raw);
  } catch {
    parsedUnknown = {
      componentName: "GeneratedComponent",
      description: "Generated UI converted from reference image.",
      styling: "tailwind",
      props: [],
      sourceCode: raw,
    };
  }

  const parsed = normalizeModelResult(parsedUnknown);

  return reactComponentResultSchema.parse(parsed);
}
