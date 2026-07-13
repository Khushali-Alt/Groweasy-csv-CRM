"use client";

import { useCallback, useRef, useState } from "react";

interface UploadBoxProps {
  onFileSelected: (file: File) => void;
  errorMessage: string | null;
  isBusy: boolean;
}

export default function UploadBox({ onFileSelected, errorMessage, isBusy }: UploadBoxProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload CSV file"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`
          relative cursor-pointer select-none rounded-md tear-edge
          bg-paper text-ink shadow-paper
          border border-paper-line
          px-8 py-14 sm:py-16 text-center
          transition-all duration-150
          ${isDragOver ? "scale-[1.01] ring-2 ring-stamp-amber" : "hover:shadow-lg"}
          ${isBusy ? "opacity-60 pointer-events-none" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onFileSelected(file);
            e.target.value = "";
          }}
        />

        <div className="mx-auto mb-5 h-12 w-12 rounded-full border-2 border-dashed border-ink/25 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-ink/60">
            <path
              d="M12 16V4M12 4L7 9M12 4l5 5M5 20h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <p className="font-display text-lg tracking-tight">
          {isDragOver ? "Release to file it" : "Drop your CSV on the desk"}
        </p>
        <p className="text-ink/55 text-sm mt-1.5">
          or <span className="underline underline-offset-2">browse</span> — any column layout works
        </p>
        <p className="text-ink/35 text-[11px] font-mono uppercase tracking-widest mt-6">
          .csv only · up to 15MB
        </p>
      </div>

      {errorMessage && (
        <p
          role="alert"
          className="mt-3 text-sm font-mono text-stamp-rust flex items-center gap-2"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-stamp-rust" />
          {errorMessage}
        </p>
      )}
    </div>
  );
}
