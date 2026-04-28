/** Infer `ComponentName` from `export default function ComponentName`. */
export function inferDefaultExportComponentName(tsx: string): string | null {
  const match = tsx.match(/export\s+default\s+function\s+(\w+)\s*[<(]/);
  return match?.[1] ?? null;
}

export function downloadTextFile(content: string, fileName: string, mime: string): void {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export function downloadGeneratedTsx(tsxSource: string): void {
  const trimmed = tsxSource.trim();
  if (!trimmed) {
    return;
  }
  const base =
    inferDefaultExportComponentName(trimmed) ?? "GeneratedComponent";
  const safeBase = base.replace(/[^\w-]/g, "") || "GeneratedComponent";
  downloadTextFile(trimmed, `${safeBase}.tsx`, "text/typescript");
}
