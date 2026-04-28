"use client";

import { ChangeEvent, DragEvent, RefObject } from "react";

type UploadZoneProps = {
  fileName: string;
  isDragging: boolean;
  isLoading: boolean;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onEnterPress: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
};

export function UploadZone({
  fileName,
  isDragging,
  isLoading,
  onDragOver,
  onDragLeave,
  onDrop,
  onInputChange,
  onEnterPress,
  inputRef,
}: UploadZoneProps) {
  return (
    <section
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`mb-10 rounded-3xl border p-10 transition ${
        isLoading
          ? "cursor-not-allowed border-zinc-200 bg-zinc-100/80 opacity-70 dark:border-white/10 dark:bg-white/[0.02]"
          : isDragging
          ? "border-amber-400/60 bg-amber-50/90 dark:border-amber-300/60 dark:bg-amber-100/5"
          : "border-zinc-200/90 bg-white/80 shadow-sm dark:border-white/15 dark:bg-white/[0.03] dark:shadow-none"
      }`}
      tabIndex={0}
      role="button"
      aria-label="Upload screenshot"
      onKeyDown={(event) => {
        if (isLoading) {
          return;
        }
        if (event.key === "Enter") {
          event.preventDefault();
          onEnterPress();
        }
      }}
    >
      <input
        ref={inputRef}
        id="image-upload"
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/heic,image/heif"
        className="hidden"
        onChange={onInputChange}
        disabled={isLoading}
      />
      <label
        htmlFor="image-upload"
        className={`block text-center ${isLoading ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <p className="mb-2 text-lg font-medium text-zinc-900 dark:text-zinc-100">
          {isLoading ? "Generating in progress..." : "Drag & Drop screenshot"}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {isLoading
            ? "Please wait until the current generation is complete."
            : "or click to browse files (PNG, JPEG, WebP, GIF, HEIC, HEIF)"}
        </p>
        {fileName ? (
          <p className="mt-4 text-sm text-amber-800 dark:text-amber-200">Selected: {fileName}</p>
        ) : null}
      </label>
    </section>
  );
}
