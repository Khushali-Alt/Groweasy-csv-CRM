"use client";

import Navbar from "@/components/Navbar";
import UploadBox from "@/components/UploadBox";
import PreviewTable from "@/components/PreviewTable";
import ProgressBar from "@/components/ProgressBar";
import Loader from "@/components/Loader";
import ResultTable from "@/components/ResultTable";
import { useCsvImport } from "@/hooks/useCsvImport";

export default function Home() {
  const {
    stage,
    fileName,
    rows,
    headers,
    errorMessage,
    progress,
    result,
    loadFile,
    confirmImport,
    reset,
  } = useCsvImport();

  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />

      <section className="mx-auto w-full max-w-5xl px-6 pt-14 pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-stamp-amber mb-3">
          Field 01 of 15 mapped automatically
        </p>
        <h1 className="font-display text-3xl sm:text-4xl tracking-tight text-paper max-w-2xl">
          Any CSV in. A clean CRM manifest out.
        </h1>
        <p className="text-paper/55 mt-3 max-w-xl text-[15px] leading-relaxed">
          Export leads from anywhere — no matter what the columns are called.
          GrowEasy reads the sheet, maps every field to your CRM schema, and
          stamps each row approved or rejected before it ever touches your
          database.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 pb-20 flex-1">
        {stage === "idle" || stage === "parsing" || stage === "error" ? (
          <div className="max-w-xl">
            <UploadBox
              onFileSelected={loadFile}
              errorMessage={stage === "error" ? errorMessage : null}
              isBusy={stage === "parsing"}
            />
            {stage === "parsing" && (
              <div className="mt-4">
                <Loader label={`Reading ${fileName}…`} />
              </div>
            )}
          </div>
        ) : null}

        {stage === "preview" && (
          <PreviewTable
            fileName={fileName ?? "file.csv"}
            headers={headers}
            rows={rows}
            onConfirm={confirmImport}
            onDiscard={reset}
          />
        )}

        {stage === "importing" && (
          <ProgressBar
            batchIndex={progress?.batchIndex ?? 0}
            batchCount={progress?.batchCount ?? 1}
            rowsProcessed={progress?.rowsProcessed ?? 0}
            rowsTotal={progress?.rowsTotal ?? rows.length}
          />
        )}

        {stage === "done" && result && (
          <ResultTable result={result} onStartOver={reset} />
        )}
      </section>

      <footer className="border-t border-desk-line/80 py-6">
        <p className="mx-auto max-w-5xl px-6 text-[11px] font-mono uppercase tracking-widest text-muted">
          GrowEasy · CSV manifest is parsed on-device, never leaves your browser until you confirm
        </p>
      </footer>
    </main>
  );
}
