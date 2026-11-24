import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink, access } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
const FOLDERS = ["artworks", "banners", "avatars"];
const OWN_FILE = /^\/uploads\/(artworks|banners|avatars)\/([a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp|gif|svg))$/;

export function toFileSlug(str, defaultName = "upload") {
  if (!str || typeof str !== "string") return defaultName;
  const slug = str
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || defaultName;
}

async function fileExists(filePath) {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

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

export async function saveUpload(buffer, ext, folder = "artworks", baseName = null) {
  if (!FOLDERS.includes(folder)) throw new Error("Folder upload tidak valid.");
  const dir = path.join(UPLOAD_ROOT, folder);
  await mkdir(dir, { recursive: true });

  const safeExt = ext.replace(/^\.+/, "").toLowerCase();
  const slug = baseName ? toFileSlug(baseName, folder) : randomUUID();

  let name = `${slug}.${safeExt}`;
  let counter = 1;
  while (await fileExists(path.join(dir, name))) {
    name = `${slug}-${counter}.${safeExt}`;
    counter++;
  }

  await writeFile(path.join(dir, name), buffer);
  return `/uploads/${folder}/${name}`;
}

export async function removeUploadedFile(fileUrl) {
  const match = typeof fileUrl === "string" ? OWN_FILE.exec(fileUrl) : null;
  if (!match) return;
  try {
    await unlink(path.join(UPLOAD_ROOT, match[1], match[2]));
  } catch (err) {
    if (err.code !== "ENOENT") console.error(err);
  }
}
