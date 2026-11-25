import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

// Menyajikan file karya yang diunggah SETELAH build. Next.js (mode production)
// hanya menyajikan isi public/ yang sudah ada saat build, jadi file baru harus
// dilayani lewat route ini agar gambar tampil baik di `npm run dev` maupun `npm start`.
const TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  svg: "image/svg+xml",
};
const NAME_RE = /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif|svg)$/;

export async function GET(request, { params }) {
  const { name } = await params;
  const match = NAME_RE.exec(name);
  if (!match) return new NextResponse("Not found", { status: 404 });

  try {
    const file = await readFile(path.join(process.cwd(), "public", "uploads", "artworks", name));
    return new NextResponse(file, {
      headers: {
        "Content-Type": TYPES[match[1]],
        "Cache-Control": "public, max-age=31536000, immutable", // nama UUID tidak pernah berubah isinya
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}