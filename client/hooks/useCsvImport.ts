"use client";

import { useCallback, useState } from "react";
import Papa from "papaparse";
import type { ImportResult, RawCsvRow, UploadStage } from "@/types";
import { importRecords, type BatchProgress } from "@/services/api";

const MAX_FILE_SIZE_MB = 15;

interface UseCsvImportState {
  stage: UploadStage;
  fileName: string | null;
  rows: RawCsvRow[];
  headers: string[];
  errorMessage: string | null;
  progress: BatchProgress | null;
  result: ImportResult | null;
}

const initialState: UseCsvImportState = {
  stage: "idle",
  fileName: null,
  rows: [],
  headers: [],
  errorMessage: null,
  progress: null,
  result: null,
};

export function useCsvImport() {
  const [state, setState] = useState<UseCsvImportState>(initialState);

  const reset = useCallback(() => setState(initialState), []);

  const loadFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setState((s) => ({ ...s, stage: "error", errorMessage: "Only .csv files are accepted." }));
      return;
    }
    if (file.size === 0) {
      setState((s) => ({ ...s, stage: "error", errorMessage: "This file is empty." }));
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setState((s) => ({
        ...s,
        stage: "error",
        errorMessage: `File exceeds the ${MAX_FILE_SIZE_MB}MB limit.`,
      }));
      return;
    }

    setState((s) => ({ ...s, stage: "parsing", fileName: file.name, errorMessage: null }));

    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.filter((r) => Object.values(r).some((v) => v && v.trim?.()));
        if (rows.length === 0) {
          setState((s) => ({
            ...s,
            stage: "error",
            errorMessage: "No readable rows found in this CSV.",
          }));
          return;
        }
        setState((s) => ({
          ...s,
          stage: "preview",
          rows,
          headers: results.meta.fields ?? Object.keys(rows[0]),
        }));
      },
      error: (err) => {
        setState((s) => ({ ...s, stage: "error", errorMessage: err.message }));
      },
    });
  }, []);

  const confirmImport = useCallback(async () => {
    setState((s) => ({ ...s, stage: "importing", progress: null }));
    try {
      const result = await importRecords(state.rows, (progress) =>
        setState((s) => ({ ...s, progress }))
      );
      setState((s) => ({ ...s, stage: "done", result }));
    } catch (err) {
      setState((s) => ({
        ...s,
        stage: "error",
        errorMessage: err instanceof Error ? err.message : "Import failed.",
      }));
    }
  }, [state.rows]);

  return { ...state, loadFile, confirmImport, reset };
}
