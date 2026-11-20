const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateRegister(input = {}) {
  const errors = {};
  const role = input.role;
  const displayName = String(input.displayName ?? "").trim();
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");

  if (!["member", "curator"].includes(role)) {
    errors.role = "Pilih tipe akun Member atau Curator.";
  }
  if (displayName.length < 2 || displayName.length > 100) {
    errors.displayName = "Nama tampilan harus 2–100 karakter.";
  }
  if (!EMAIL_RE.test(email) || email.length > 255) {
    errors.email = "Format email tidak valid.";
  }
  if (password.length < 8 || password.length > 72) {
    errors.password = "Password harus 8–72 karakter.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { role, displayName, email, password },
  };
}

export function validateLogin(input = {}) {
  const errors = {};
  const email = String(input.email ?? "").trim().toLowerCase();
  const password = String(input.password ?? "");

  if (!EMAIL_RE.test(email)) errors.email = "Format email tidak valid.";
  if (password.length === 0) errors.password = "Password wajib diisi.";

  return { ok: Object.keys(errors).length === 0, errors, data: { email, password } };
}