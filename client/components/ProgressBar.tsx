interface ProgressBarProps {
  batchIndex: number;
  batchCount: number;
  rowsProcessed: number;
  rowsTotal: number;
}

export default function ProgressBar({
  batchIndex,
  batchCount,
  rowsProcessed,
  rowsTotal,
}: ProgressBarProps) {
  const pct = rowsTotal > 0 ? Math.round((rowsProcessed / rowsTotal) * 100) : 0;

  return (
    <div className="rounded-md bg-paper text-ink shadow-paper border border-paper-line px-6 py-7">
      <div className="flex items-center justify-between mb-3">
        <p className="font-display text-base tracking-tight">Mapping fields to CRM…</p>
        <span className="font-mono text-xs text-ink/50">
          batch {batchIndex}/{batchCount}
        </span>
      </div>

      <div className="h-2 w-full rounded-full bg-paper-line overflow-hidden">
        <div
          className="h-full bg-stamp-amber transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-2.5">
        <p className="text-xs font-mono text-ink/50">
          {rowsProcessed.toLocaleString()} / {rowsTotal.toLocaleString()} rows
        </p>
        <p className="text-xs font-mono text-stamp-amber">{pct}%</p>
      </div>
    </div>
  );
}
