import type { DesignStyle } from "@/lib/validation/generate-request";

/**
 * Rich, style-specific guidance appended to the system instruction so Gemini
 * outputs visibly different UI for each dropdown option.
 */
const DIRECTIVES: Record<DesignStyle, string> = {
  minimalist: `Apply a strict minimalist aesthetic: generous whitespace, 1–2 neutral type weights only, subtle 1px hairline dividers, almost no decoration, monochrome or near-monochrome palette (e.g. zinc/stone), one restrained accent at most. Flat surfaces, no skeuomorphism, no gradients unless barely visible. Components feel editorial and calm; prioritize clarity and hierarchy over ornament.`,

  "luxury-minimal": `Apply a luxury-minimal aesthetic: dark or deep neutral base, restrained gold/champagne or warm accent lines, fine typography with noticeable letter-spacing on labels, thin borders with soft inner highlights, subtle glass or frosted panels sparingly. Premium spacing; avoid loud colors or playful shapes.`,

  cyberpunk: `Apply a cyberpunk / neo-noir UI: deep black or midnight blue base, neon magenta–cyan–electric blue accents, thin glow-like borders (use ring/box-shadow, not actual blur stacks), grid or scan-line hints in backgrounds, monospace touches for data or labels, high contrast and futuristic chrome details. Avoid pastel or earthy palettes; lean sharp, tech, and high-energy.`,

  "b2b-saas": `Apply a credible B2B SaaS product UI: clean cards, clear table/list patterns, sensible default grays and one primary brand blue or teal, compact but readable density, status pills and subtle icons, focus on scannability and trust. Avoid experimental art-direction; prefer familiar dashboard patterns.`,

  playful: `Apply a playful, friendly UI: rounded-2xl shapes, soft pastel or candy accents, bouncy spacing, optional subtle rotation or asymmetry in layout, cheerful micro-copy tone in placeholder text, illustrated-feel blocks (solid color shapes). Keep accessibility: contrast still sufficient for body text.`,

  brutalist: `Apply a brutalist / raw digital aesthetic: harsh black–white contrast or bold primaries, thick borders, visible grid, default system-adjacent typography feel, asymmetric spacing, raw rectangles, little to no shadow, “unfinished” honesty. Avoid polish, gradients, or soft glassmorphism.`,

  editorial: `Apply an editorial / magazine layout: strong typographic scale (display headings vs small captions), column-like rhythm, pull-quote or stat emphasis, serif-leaning pairing suggested via font-serif utilities where appropriate, generous vertical rhythm, art-directed whitespace, minimal chrome.`,
};

export function buildDesignStyleBlock(style: DesignStyle): string {
  return DIRECTIVES[style];
}
