import { z } from "zod";

/** Prop metadata for the generated component (documentation + typing hints). */
export const propDefinitionSchema = z.object({
  name: z.string(),
  type: z.string(),
  required: z.boolean(),
  defaultValue: z.string().optional(),
  description: z.string(),
});

/** Structured output: TSX source plus metadata clients can use without executing code. */
export const reactComponentResultSchema = z.object({
  componentName: z.string().describe("PascalCase name of the single React component"),
  description: z.string().describe("Short summary of what the UI shows"),
  styling: z
    .enum(["tailwind", "inline", "css-module", "none"])
    .describe("Primary styling approach used in sourceCode"),
  props: z.array(propDefinitionSchema).describe("Props for the component"),
  sourceCode: z
    .string()
    .describe(
      "Complete TSX for one default-exported function component. No markdown fences.",
    ),
  accessibilityNotes: z
    .string()
    .optional()
    .describe("ARIA roles, labels, or focus notes if relevant"),
});

export type ReactComponentResult = z.infer<typeof reactComponentResultSchema>;

/**
 * Static JSON Schema describing {@link reactComponentResultSchema} for Gemini's
 * `responseJsonSchema`. Hand-written (instead of zod-to-json-schema) to avoid an
 * extra dependency in the Next.js app.
 */
export function getReactComponentJsonSchema(): Record<string, unknown> {
  return {
    type: "object",
    properties: {
      componentName: {
        type: "string",
        description: "PascalCase name of the single React component",
      },
      description: { type: "string", description: "Short summary of what the UI shows" },
      styling: {
        type: "string",
        enum: ["tailwind", "inline", "css-module", "none"],
      },
      props: {
        type: "array",
        items: {
          type: "object",
          properties: {
            name: { type: "string" },
            type: { type: "string" },
            required: { type: "boolean" },
            defaultValue: { type: "string" },
            description: { type: "string" },
          },
          required: ["name", "type", "required", "description"],
        },
      },
      sourceCode: {
        type: "string",
        description:
          "Complete TSX for one default-exported function component. No markdown fences.",
      },
      accessibilityNotes: { type: "string" },
    },
    required: ["componentName", "description", "styling", "props", "sourceCode"],
  };
}
