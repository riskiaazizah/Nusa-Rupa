import { REPORT_REASONS } from "./constants";
import { stripControl } from "./text";

export function validateComment(content) {
  const value = stripControl(content).trim();
  if (value.length < 1) return { ok: false, error: "Komentar tidak boleh kosong." };
  if (value.length > 1000) return { ok: false, error: "Komentar maksimal 1000 karakter." };
  return { ok: true, value };
}

export function validateReport({ reason, details }) {
  const errors = {};
  const allowed = REPORT_REASONS.map((r) => r.value);
  if (!allowed.includes(reason)) errors.reason = "Pilih alasan laporan.";

  const text = stripControl(details).trim();
  if (text.length > 500) errors.details = "Detail maksimal 500 karakter.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { reason, details: text || null },
  };
}