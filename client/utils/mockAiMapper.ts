import type { CrmRecord, CrmStatus, RawCsvRow } from "@/types";
import { ALLOWED_CRM_STATUS, isValidEmail, isValidPhone } from "./validators";

const FIELD_ALIASES: Record<keyof CrmRecord, string[]> = {
  created_at: ["created_at", "date", "created", "timestamp", "created on"],
  name: ["name", "full name", "lead name", "customer name", "contact"],
  email: ["email", "email id", "email address", "mail"],
  country_code: ["country_code", "isd", "std code", "dial code"],
  mobile_without_country_code: [
    "phone",
    "mobile",
    "contact number",
    "phone number",
    "mobile number",
    "whatsapp",
  ],
  company: ["company", "organisation", "organization", "business"],
  city: ["city", "town"],
  state: ["state", "province"],
  country: ["country"],
  lead_owner: ["owner", "lead owner", "assigned to", "sales rep"],
  crm_status: ["status", "crm_status", "lead status", "stage"],
  crm_note: ["note", "notes", "remark", "remarks", "comment"],
  data_source: ["source", "data_source", "lead source", "channel"],
  possession_time: ["possession", "possession_time", "timeline"],
  description: ["description", "requirement", "details"],
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[_\-]+/g, " ").replace(/\s+/g, " ");
}

function findColumn(row: RawCsvRow, field: keyof CrmRecord): string | undefined {
  const aliases = FIELD_ALIASES[field];
  const keys = Object.keys(row);
  for (const key of keys) {
    const norm = normalizeHeader(key);
    if (aliases.includes(norm)) return row[key];
  }
  return undefined;
}

function extractPhone(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "");
  return digitsOnly.slice(-10);
}

function guessCrmStatus(raw?: string): CrmStatus | undefined {
  if (!raw) return undefined;
  const norm = raw.trim().toUpperCase().replace(/\s+/g, "_");
  if ((ALLOWED_CRM_STATUS as string[]).includes(norm)) return norm as CrmStatus;
  if (/NOT.?CONNECT|NO.?ANSWER|UNREACHABLE/.test(norm)) return "DID_NOT_CONNECT";
  if (/SALE|WON|CLOSED.?WON|CONVERTED/.test(norm)) return "SALE_DONE";
  if (/BAD|JUNK|SPAM|INVALID/.test(norm)) return "BAD_LEAD";
  return "GOOD_LEAD_FOLLOW_UP";
}

/**
 * Simulates what the AI batch-mapping step would return. This is a
 * deliberately simple heuristic mapper — the real backend swaps this
 * for a Gemini/OpenAI prompt call (see server/prompts/crmPrompt.js).
 */
export function mockMapRowToCrm(row: RawCsvRow): CrmRecord {
  const emailRaw = findColumn(row, "email");
  const phoneRaw = findColumn(row, "mobile_without_country_code");

  const record: CrmRecord = {
    created_at: findColumn(row, "created_at"),
    name: findColumn(row, "name"),
    email: emailRaw && isValidEmail(emailRaw) ? emailRaw.trim() : undefined,
    country_code: findColumn(row, "country_code"),
    mobile_without_country_code:
      phoneRaw && isValidPhone(extractPhone(phoneRaw))
        ? extractPhone(phoneRaw)
        : undefined,
    company: findColumn(row, "company"),
    city: findColumn(row, "city"),
    state: findColumn(row, "state"),
    country: findColumn(row, "country"),
    lead_owner: findColumn(row, "lead_owner"),
    crm_status: guessCrmStatus(findColumn(row, "crm_status")),
    crm_note: findColumn(row, "crm_note"),
    data_source: findColumn(row, "data_source") ?? "csv_import",
    possession_time: findColumn(row, "possession_time"),
    description: findColumn(row, "description"),
  };

  // Extra emails/phones found beyond the first go into crm_note, per spec.
  const extraNotes: string[] = [];
  if (emailRaw && emailRaw.includes(",")) {
    extraNotes.push(`Additional emails: ${emailRaw.split(",").slice(1).join(", ").trim()}`);
  }
  if (phoneRaw && phoneRaw.includes(",")) {
    extraNotes.push(`Additional phones: ${phoneRaw.split(",").slice(1).join(", ").trim()}`);
  }
  if (extraNotes.length) {
    record.crm_note = [record.crm_note, ...extraNotes].filter(Boolean).join(" | ");
  }

  return record;
}
