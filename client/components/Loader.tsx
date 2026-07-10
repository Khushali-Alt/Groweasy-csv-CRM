export default function Loader({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2.5 text-paper/70">
      <span className="relative flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stamp-amber/60" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-stamp-amber" />
      </span>
      {label && <span className="text-sm font-mono">{label}</span>}
    </div>
  );
}
