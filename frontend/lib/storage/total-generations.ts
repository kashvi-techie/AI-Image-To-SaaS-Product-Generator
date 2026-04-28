const TOTAL_GENERATIONS_KEY = "luxegen-total-generations";

function clampNonNegative(n: number): number {
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

export function readTotalGenerations(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const raw = localStorage.getItem(TOTAL_GENERATIONS_KEY);
  if (raw === null) {
    return 0;
  }
  const n = Number.parseInt(raw, 10);
  return clampNonNegative(n);
}

/** Increments the lifetime generation counter and returns the new total. */
export function incrementTotalGenerations(): number {
  if (typeof window === "undefined") {
    return 0;
  }
  const next = readTotalGenerations() + 1;
  localStorage.setItem(TOTAL_GENERATIONS_KEY, String(next));
  return next;
}
