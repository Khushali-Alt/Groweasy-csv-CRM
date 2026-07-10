"use client";

import { useState } from "react";
import type { ImportResult } from "@/types";

function Stamp({ kind }: { kind: "approved" | "rejected" }) {
  const isApproved = kind === "approved";
  return (
    <span
      className={`
        stamp-in inline-flex items-center justify-center rounded-sm border-2 px-2 py-0.5
        font-mono text-[10px] font-semibold uppercase tracking-widest
        ${isApproved
          ? "border-stamp-green text-stamp-green"
          : "border-stamp-rust text-stamp-rust"}
      `}
      style={{ ["--stamp-rot" as string]: isApproved ? "-6deg" : "5deg" }}
    >
      {isApproved ? "Approved" : "Rejected"}
    </span>
  );
}

export default function ResultTable({
  result,
  onStartOver,
}: {
  result: ImportResult;
  onStartOver: () => void;
}) {
  const [tab, setTab] = useState<"imported" | "skipped">("imported");

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "groweasy-import-result.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-md bg-paper text-ink shadow-paper border border-paper-line overflow-hidden">
      <div className="grid grid-cols-3 divide-x divide-paper-line border-b border-paper-line">
        <Stat label="Processed" value={result.total} />
        <Stat label="Imported" value={result.imported} accent="text-stamp-green" />
        <Stat label="Skipped" value={result.skipped} accent="text-stamp-rust" />
      </div>

      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex gap-1">
          <TabButton active={tab === "imported"} onClick={() => setTab("imported")}>
            Imported ({result.imported})
          </TabButton>
          <TabButton active={tab === "skipped"} onClick={() => setTab("skipped")}>
            Skipped ({result.skipped})
          </TabButton>
        </div>
        <button
          onClick={downloadJson}
          className="text-xs font-mono uppercase tracking-widest text-ink/50 hover:text-ink transition-colors"
        >
          Download JSON ↓
        </button>
      </div>

      <div className="max-h-[380px] overflow-auto scrollbar-thin px-5 py-4">
        {tab === "imported" ? (
          result.data.length === 0 ? (
            <EmptyState text="No records were imported from this file." />
          ) : (
            <ul className="space-y-2">
              {result.data.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between gap-3 rounded-sm border border-paper-line bg-white/40 px-3.5 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{r.name || "Unnamed lead"}</p>
                    <p className="text-xs font-mono text-ink/50 truncate">
                      {r.email || "—"} · {r.mobile_without_country_code || "—"}
                    </p>
                  </div>
                  <Stamp kind="approved" />
                </li>
              ))}
            </ul>
          )
        ) : result.skippedRecords.length === 0 ? (
          <EmptyState text="Nothing was skipped — every row cleared validation." />
        ) : (
          <ul className="space-y-2">
            {result.skippedRecords.map((s, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-3 rounded-sm border border-paper-line bg-white/40 px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {s.row.Name || s.row.name || "Unlabeled row"}
                  </p>
                  <p className="text-xs font-mono text-stamp-rust/80 truncate">{s.reason}</p>
                </div>
                <Stamp kind="rejected" />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="px-5 py-4 border-t border-paper-line bg-paper-dim/60">
        <button
          onClick={onStartOver}
          className="text-sm font-body text-ink/60 hover:text-ink transition-colors"
        >
          ← Import another file
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="px-5 py-4 text-center">
      <p className={`font-display text-2xl tracking-tight ${accent ?? "text-ink"}`}>{value}</p>
      <p className="text-[11px] font-mono uppercase tracking-widest text-ink/45 mt-0.5">{label}</p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-widest rounded-sm transition-colors ${
        active ? "bg-ink text-paper" : "text-ink/50 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ text }: { text: string }) {
  return <p className="text-center text-ink/40 font-mono text-xs py-10">{text}</p>;
}
