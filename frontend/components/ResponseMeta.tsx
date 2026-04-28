"use client";

import { ApiResponse } from "@/types/generation";

type ResponseMetaProps = {
  response: ApiResponse;
};

export function ResponseMeta({ response }: ResponseMetaProps) {
  return (
    <section className="mt-6 rounded-2xl border border-zinc-200/90 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:shadow-none">
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-medium text-zinc-900 dark:text-zinc-100">Component:</span>{" "}
        {response.componentName} •{" "}
        <span className="font-medium text-zinc-900 dark:text-zinc-100">Style:</span>{" "}
        {response.styling}
      </p>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{response.description}</p>
      {response.accessibilityNotes ? (
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{response.accessibilityNotes}</p>
      ) : null}
    </section>
  );
}
