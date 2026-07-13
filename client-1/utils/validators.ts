import type { CrmRecord, CrmStatus } from "@/types";

export const ALLOWED_CRM_STATUS: CrmStatus[] = [
  "GOOD_LEAD_FOLLOW_UP",
  "DID_NOT_CONNECT",
  "BAD_LEAD",
  "SALE_DONE",
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9]{7,15}$/;

export function isValidEmail(value?: string): boolean {
  if (!value) return false;
  return EMAIL_RE.test(value.trim());
}

export function isValidPhone(value?: string): boolean {
  if (!value) return false;
  return PHONE_RE.test(value.replace(/[\s-()]/g, ""));
}

export function isValidCrmStatus(value?: string): value is CrmStatus {
  return !!value && (ALLOWED_CRM_STATUS as string[]).includes(value);
}

export function isValidDate(value?: string): boolean {
  if (!value) return true; // created_at is optional; absence is not a rejection reason
  const t = Date.parse(value);
  return !Number.isNaN(t);
}

/**
 * Mirrors the backend validation layer so the frontend can pre-flag
 * obviously bad rows before they're even sent, and so the mock
 * (offline) import path behaves like the real API contract.
 */
export function validateCrmRecord(record: CrmRecord): {
  valid: boolean;
  reason?: string;
} {
  const hasEmail = isValidEmail(record.email);
  const hasPhone = isValidPhone(record.mobile_without_country_code);

  if (!hasEmail && !hasPhone) {
    return { valid: false, reason: "Missing valid email and mobile number" };
  }
  if (record.crm_status && !isValidCrmStatus(record.crm_status)) {
    return { valid: false, reason: `Invalid crm_status "${record.crm_status}"` };
  }
  if (!isValidDate(record.created_at)) {
    return { valid: false, reason: `Invalid created_at "${record.created_at}"` };
  }
  return { valid: true };
}
