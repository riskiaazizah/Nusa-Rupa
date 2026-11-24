import { stripControl } from "./text";

export const MAX_LINKS = 5;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// links boleh berupa array atau string JSON. Baris yang kosong seluruhnya diabaikan.
export function validateProfileInput({ displayName, bio, links }) {
  const errors = {};
  const name = stripControl(displayName).trim();
  const bioText = stripControl(bio).trim();

  if (name.length < 2 || name.length > 100) errors.displayName = "Nama tampilan harus 2–100 karakter.";
  if (bioText.length > 500) errors.bio = "Bio maksimal 500 karakter.";

  let rows = links;
  if (typeof links === "string") {
    try {
      rows = JSON.parse(links || "[]");
    } catch {
      rows = null;
    }
  }

  const cleaned = [];
  if (!Array.isArray(rows)) {
    errors.links = "Data tautan tidak valid.";
  } else {
    for (const row of rows) {
      const label = stripControl(row?.label).trim();
      const url = stripControl(row?.url).trim();
      if (!label && !url) continue;
      if (!label || label.length > 50) {
        errors.links = "Nama tautan wajib diisi (maksimal 50 karakter).";
        break;
      }
      if (!url || url.length > 255 || !isHttpUrl(url)) {
        errors.links = "Tautan harus berupa alamat lengkap yang diawali http:// atau https://.";
        break;
      }
      cleaned.push({ label, url });
    }
    if (!errors.links && cleaned.length > MAX_LINKS) errors.links = `Maksimal ${MAX_LINKS} tautan.`;
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { displayName: name, bio: bioText || null, links: cleaned },
  };
}

// Ganti email dan/atau password. Password saat ini wajib untuk perubahan apa pun.
export function validateAccountInput(input = {}) {
  const errors = {};
  const currentPassword = String(input.currentPassword ?? "");
  const newEmail = stripControl(input.newEmail).trim().toLowerCase();
  const newPassword = String(input.newPassword ?? "");
  const confirmPassword = String(input.confirmPassword ?? "");

  if (currentPassword.length === 0) errors.currentPassword = "Password saat ini wajib diisi.";

  if (newEmail && (!EMAIL_RE.test(newEmail) || newEmail.length > 255)) {
    errors.newEmail = "Format email tidak valid.";
  }
  if (newPassword) {
    if (newPassword.length < 8 || newPassword.length > 72) {
      errors.newPassword = "Password baru harus 8–72 karakter.";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Konfirmasi password tidak sama.";
    }
  }
  if (!newEmail && !newPassword) errors.form = "Isi email baru atau password baru.";

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { currentPassword, newEmail: newEmail || null, newPassword: newPassword || null },
  };
}
