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


// Nama kategori: wajib, 2–100 karakter. Keunikan dijaga database (unique index LOWER(name)).
export function validateCategoryName(name) {
  const value = String(name ?? "").trim();
  if (value.length < 2 || value.length > 100) {
    return "Nama kategori harus 2–100 karakter.";
  }
  return null;
}


// "Forest Fire, peatland ,forest fire" -> ["forest fire", "peatland"]
export function parseTags(raw) {
  const seen = new Set();
  for (const part of String(raw ?? "").split(",")) {
    const tag = part.trim().toLowerCase().replace(/\s+/g, " ");
    if (tag) seen.add(tag);
  }
  return [...seen];
}

// Dipakai untuk create dan edit karya. File divalidasi terpisah (lib/uploads.js).
export function validateArtworkInput(input = {}) {
  const errors = {};
  const title = String(input.title ?? "").trim();
  const description = String(input.description ?? "").trim();
  const categoryId = Number(input.categoryId);
  const tags = parseTags(input.tags);

  if (title.length < 3 || title.length > 150) {
    errors.title = "Judul harus 3–150 karakter.";
  }
  if (description.length < 10 || description.length > 2000) {
    errors.description = "Deskripsi harus 10–2000 karakter.";
  }
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    errors.categoryId = "Pilih kategori karya.";
  }
  if (tags.length < 1) {
    errors.tags = "Isi minimal 1 tag (pisahkan dengan koma).";
  } else if (tags.length > 10) {
    errors.tags = "Maksimal 10 tag.";
  } else if (tags.some((t) => t.length > 50)) {
    errors.tags = "Setiap tag maksimal 50 karakter.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { title, description, categoryId, tags },
  };
}