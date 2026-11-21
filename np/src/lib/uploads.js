import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "artworks");
const URL_PREFIX = "/uploads/artworks/";

// Mengenali tipe gambar dari isi file (magic bytes), bukan dari nama/ekstensi
// yang bisa dipalsukan. Mengembalikan { ext, mime } atau null.
export function detectImageType(buf) {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
    return { ext: "jpg", mime: "image/jpeg" };
  }
  const png = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  if (buf.length >= 8 && png.every((b, i) => buf[i] === b)) {
    return { ext: "png", mime: "image/png" };
  }
  if (buf.length >= 6 && ["GIF87a", "GIF89a"].includes(buf.subarray(0, 6).toString("ascii"))) {
    return { ext: "gif", mime: "image/gif" };
  }
  if (
    buf.length >= 12 &&
    buf.subarray(0, 4).toString("ascii") === "RIFF" &&
    buf.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { ext: "webp", mime: "image/webp" };
  }
  return null;
}

// Nama file dibuat acak (UUID); nama asli dari user tidak dipakai sama sekali.
export async function saveUpload(buffer, ext) {
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await writeFile(path.join(UPLOAD_DIR, name), buffer);
  return `${URL_PREFIX}${name}`;
}

// Hanya boleh menghapus file di /uploads/artworks/. File seed dan path lain diabaikan.
export async function removeUploadedFile(fileUrl) {
  if (typeof fileUrl !== "string" || !fileUrl.startsWith(URL_PREFIX)) return;
  const name = fileUrl.slice(URL_PREFIX.length);
  if (name !== path.basename(name)) return; // tolak "../" dan sub-folder
  try {
    await unlink(path.join(UPLOAD_DIR, name));
  } catch (err) {
    if (err.code !== "ENOENT") console.error(err);
  }
}