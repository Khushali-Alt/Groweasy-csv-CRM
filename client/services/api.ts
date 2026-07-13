import type { CrmRecord, ImportResult, RawCsvRow, SkippedRecord } from "@/types";
import { mockMapRowToCrm } from "@/utils/mockAiMapper";
import { validateCrmRecord } from "@/utils/validators";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;
const BATCH_SIZE = 100;

export interface BatchProgress {
  batchIndex: number;
  batchCount: number;
  rowsProcessed: number;
  rowsTotal: number;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function importBatchViaBackend(rows: RawCsvRow[]): Promise<CrmRecord[]> {
  const res = await fetch(`${API_BASE}/api/import`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ records: rows }),
  });
  if (!res.ok) throw new Error(`Batch failed with status ${res.status}`);
  const json = await res.json();
  return json.data as CrmRecord[];
}

async function importBatchViaMock(rows: RawCsvRow[]): Promise<CrmRecord[]> {
  // Small artificial delay so batching/progress UI is visible in demos.
  await new Promise((r) => setTimeout(r, 350 + Math.random() * 250));
  return rows.map(mockMapRowToCrm);
}

/**
 * Batches raw CSV rows, sends each batch for AI mapping (real backend
 * when NEXT_PUBLIC_API_BASE_URL is set, otherwise an offline mock),
 * validates every returned record, and merges the results — mirroring
 * the backend workflow described in the README so this file is a
 * drop-in swap once the Express API exists.
 */
export async function importRecords(
  rows: RawCsvRow[],
  onProgress?: (progress: BatchProgress) => void,
  maxRetries = 2
): Promise<ImportResult> {
  const batches = chunk(rows, BATCH_SIZE);
  const imported: CrmRecord[] = [];
  const skippedRecords: SkippedRecord[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    let mapped: CrmRecord[] | null = null;
    let attempt = 0;

    while (attempt <= maxRetries && mapped === null) {
      try {
        mapped = API_BASE
          ? await importBatchViaBackend(batch)
          : await importBatchViaMock(batch);
      } catch (err) {
        attempt++;
        if (attempt > maxRetries) {
          // One batch failing shouldn't stop the others — skip its rows with a reason.
          batch.forEach((row) =>
            skippedRecords.push({ row, reason: "AI batch failed after retries" })
          );
          mapped = [];
        }
      }
    }

    mapped?.forEach((record, idx) => {
      const { valid, reason } = validateCrmRecord(record);
      if (valid) {
        imported.push(record);
      } else {
        skippedRecords.push({ row: batch[idx] ?? {}, reason: reason ?? "Failed validation" });
      }
    });

    onProgress?.({
      batchIndex: i + 1,
      batchCount: batches.length,
      rowsProcessed: Math.min((i + 1) * BATCH_SIZE, rows.length),
      rowsTotal: rows.length,
    });
  }

  return {
    imported: imported.length,
    skipped: skippedRecords.length,
    total: rows.length,
    data: imported,
    skippedRecords,
  };
}
