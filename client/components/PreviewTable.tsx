"use client";

import { useMemo, useState } from "react";
import type { RawCsvRow } from "@/types";

interface PreviewTableProps {
  fileName: string;
  headers: string[];
  rows: RawCsvRow[];
  onConfirm: () => void;
  onDiscard: () => void;
}

export default function PreviewTable({
  fileName,
  headers,
  rows,
  onConfirm,
  onDiscard,
}: PreviewTableProps) {
  const [query, setQuery] = useState("");

  const filteredRows = useMemo(() => {
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((row) => Object.values(row).some((v) => v?.toLowerCase().includes(q)));
  }, [rows, query]);

  return (
    <div className="rounded-md bg-paper text-ink shadow-paper border border-paper-line overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-paper-line">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-ink/45">
            Manifest received
          </p>
          <p className="font-display text-base tracking-tight">
            {fileName} <span className="text-ink/40 font-body font-normal">— {rows.length} rows</span>
          </p>
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rows…"
          className="w-full sm:w-56 rounded-sm border border-paper-line bg-white/60 px-3 py-1.5 text-sm font-body outline-none focus:ring-2 focus:ring-stamp-amber placeholder:text-ink/35"
        />
      </div>

      <div className="max-h-[360px] overflow-auto scrollbar-thin">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-paper-dim">
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap text-left font-mono text-[11px] uppercase tracking-wider text-ink/55 px-4 py-2.5 border-b border-paper-line"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, i) => (
              <tr key={i} className="odd:bg-white/40 hover:bg-stamp-amber/10 transition-colors">
                {headers.map((h) => (
                  <td
                    key={h}
                    className="whitespace-nowrap px-4 py-2 border-b border-paper-line/70 text-ink/85"
                  >
                    {row[h] || <span className="text-ink/25">—</span>}
                  </td>
                ))}
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={headers.length} className="px-4 py-8 text-center text-ink/40 font-mono text-xs">
                  No rows match “{query}”
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-paper-line bg-paper-dim/60">
        <button
          onClick={onDiscard}
          className="text-sm font-body text-ink/55 hover:text-ink transition-colors"
        >
          Discard
        </button>
        <button
          onClick={onConfirm}
          className="inline-flex items-center gap-2 rounded-sm bg-ink text-paper px-5 py-2.5 text-sm font-medium tracking-tight hover:bg-ink/85 transition-colors"
        >
          Confirm import
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
