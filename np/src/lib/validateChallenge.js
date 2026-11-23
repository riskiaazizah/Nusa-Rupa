import { stripControl } from "./text";

const LOCAL_DATETIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const UTC_OFFSET = "+08:00"; // semua tanggal challenge dibaca sebagai WITA

// "2026-11-25T10:00" (WITA) -> Date, atau null jika format/kalender tidak valid.
// new Date() diam-diam menerima "31 Februari" (menjadi 3 Maret), jadi tanggal
// dicocokkan ulang field demi field.
export function parseLocalDateTime(value) {
  const match = LOCAL_DATETIME.exec(String(value ?? "").trim());
  if (!match) return null;

  const [y, mo, d, h, mi] = match.slice(1).map(Number);
  const check = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const valid =
    check.getUTCFullYear() === y &&
    check.getUTCMonth() === mo - 1 &&
    check.getUTCDate() === d &&
    check.getUTCHours() === h &&
    check.getUTCMinutes() === mi;
  if (!valid) return null;

  return new Date(`${match[0]}:00${UTC_OFFSET}`);
}

export function validateChallengeInput(input = {}) {
  const errors = {};
  const title = stripControl(input.title).trim();
  const description = stripControl(input.description).trim();
  const rules = stripControl(input.rules).trim();
  const prize = stripControl(input.prize).trim();
  const startDate = parseLocalDateTime(input.startDate);
  const endDate = parseLocalDateTime(input.endDate);

  if (title.length < 3 || title.length > 150) errors.title = "Judul harus 3–150 karakter.";
  if (description.length < 10 || description.length > 3000) {
    errors.description = "Deskripsi harus 10–3000 karakter.";
  }
  if (rules.length < 10 || rules.length > 3000) errors.rules = "Aturan harus 10–3000 karakter.";
  if (prize.length < 2 || prize.length > 255) errors.prize = "Hadiah harus 2–255 karakter.";
  if (!startDate) errors.startDate = "Tanggal mulai wajib diisi dengan format yang benar.";
  if (!endDate) errors.endDate = "Tanggal selesai wajib diisi dengan format yang benar.";
  if (startDate && endDate && endDate <= startDate) {
    errors.endDate = "Tanggal selesai harus setelah tanggal mulai.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { title, description, rules, prize, startDate, endDate },
  };
}

// raw = [juara1, juara2, juara3] berisi id submisi (string) atau "" bila kosong.
// Aturan: minimal 1, maksimal 3, satu karya satu peringkat, tanpa lompatan peringkat.
export function validateWinnerPicks(raw) {
  const picks = raw.map((value) => {
    const text = String(value ?? "").trim();
    if (text === "") return null;
    const n = Number(text);
    return Number.isInteger(n) && n > 0 ? n : Number.NaN;
  });

  if (picks.some(Number.isNaN)) return { ok: false, error: "Pilihan pemenang tidak valid." };

  const chosen = picks.filter((p) => p !== null);
  if (chosen.length === 0) return { ok: false, error: "Pilih minimal 1 pemenang (Juara 1)." };
  if (new Set(chosen).size !== chosen.length) {
    return { ok: false, error: "Satu karya hanya boleh mendapat satu peringkat." };
  }
  for (let i = 1; i < picks.length; i++) {
    if (picks[i] !== null && picks[i - 1] === null) {
      return { ok: false, error: `Juara ${i + 1} diisi, maka Juara ${i} juga harus diisi.` };
    }
  }
  return { ok: true, picks };
}