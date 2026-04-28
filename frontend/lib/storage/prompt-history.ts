import { designStyles, type DesignStyle } from "@/lib/validation/generate-request";

export const PROMPT_HISTORY_STORAGE_KEY = "luxegen-prompt-history";
export const PROMPT_HISTORY_MAX_ITEMS = 5;

export type PromptHistoryEntry = {
  id: string;
  prompt: string;
  designStyle: DesignStyle;
  code: string;
  createdAt: string;
};

function isDesignStyle(value: unknown): value is DesignStyle {
  return typeof value === "string" && (designStyles as readonly string[]).includes(value);
}

function isPromptHistoryEntry(value: unknown): value is PromptHistoryEntry {
  if (!value || typeof value !== "object") {
    return false;
  }
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.prompt === "string" &&
    isDesignStyle(o.designStyle) &&
    typeof o.code === "string" &&
    typeof o.createdAt === "string"
  );
}

export function loadPromptHistoryFromStorage(): PromptHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }
  const raw = localStorage.getItem(PROMPT_HISTORY_STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(isPromptHistoryEntry).slice(0, PROMPT_HISTORY_MAX_ITEMS);
  } catch {
    return [];
  }
}

export function savePromptHistoryToStorage(entries: PromptHistoryEntry[]): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(
    PROMPT_HISTORY_STORAGE_KEY,
    JSON.stringify(entries.slice(0, PROMPT_HISTORY_MAX_ITEMS)),
  );
}
