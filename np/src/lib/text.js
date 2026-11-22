// Karakter kontrol (termasuk NUL \u0000) membuat PostgreSQL menolak query
// ("invalid byte sequence"). Newline, tab, dan carriage return tetap dipertahankan.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function stripControl(value) {
  return String(value ?? "").replace(CONTROL_CHARS, "");
}

// Untuk parameter satu baris (pencarian, tag): bersihkan, rapikan spasi, batasi panjang
export function cleanText(value, max = 100) {
  return stripControl(value).replace(/\s+/g, " ").trim().slice(0, max);
}