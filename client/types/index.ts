export type RawCsvRow = Record<string, string>;

export type CrmStatus =
  | "GOOD_LEAD_FOLLOW_UP"
  | "DID_NOT_CONNECT"
  | "BAD_LEAD"
  | "SALE_DONE";

export interface CrmRecord {
  created_at?: string;
  name?: string;
  email?: string;
  country_code?: string;
  mobile_without_country_code?: string;
  company?: string;
  city?: string;
  state?: string;
  country?: string;
  lead_owner?: string;
  crm_status?: CrmStatus;
  crm_note?: string;
  data_source?: string;
  possession_time?: string;
  description?: string;
}

export interface SkippedRecord {
  row: RawCsvRow;
  reason: string;
}

export interface ImportResult {
  imported: number;
  skipped: number;
  total: number;
  data: CrmRecord[];
  skippedRecords: SkippedRecord[];
}

export type UploadStage =
  | "idle"
  | "parsing"
  | "preview"
  | "importing"
  | "done"
  | "error";
