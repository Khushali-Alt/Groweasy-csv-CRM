export default function Navbar() {
  return (
    <header className="border-b border-desk-line/80">
      <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-sm border border-stamp-amber/70 flex items-center justify-center">
            <span className="font-display text-stamp-amber text-sm">GE</span>
          </div>
          <div>
            <p className="font-display text-paper text-[15px] tracking-tight leading-none">
              GrowEasy
            </p>
            <p className="text-muted text-[11px] font-mono tracking-widest uppercase mt-0.5">
              Import Manifest
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono text-muted uppercase tracking-widest">
          <span className="h-1.5 w-1.5 rounded-full bg-stamp-green" />
          Intake desk open
        </span>
      </div>
    </header>
  );
}
