import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateArtworkInput } from "@/lib/validators";
import { MAX_UPLOAD_BYTES, detectImageType, saveUpload, removeUploadedFile } from "@/lib/uploads";
import { createArtwork } from "@/lib/artworks";

// Upload lewat Route Handler (bukan Server Action) karena Server Action dibatasi
// 1 MB secara default, sedangkan karya boleh sampai 5 MB.
export async function POST(request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
  if (user.role !== "member") {
    return NextResponse.json({ error: "Hanya Member yang dapat mengunggah karya." }, { status: 403 });
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Data form tidak valid." }, { status: 400 });
  }

  const { errors, data } = validateArtworkInput({
    title: form.get("title"),
    description: form.get("description"),
    categoryId: form.get("categoryId"),
    tags: form.get("tags"),
  });

  const file = form.get("file");
  let buffer = null;
  let type = null;

  if (!(file instanceof File) || file.size === 0) {
    errors.file = "File karya wajib diunggah.";
  } else if (file.size > MAX_UPLOAD_BYTES) {
    errors.file = "Ukuran file maksimal 5 MB.";
  } else {
    buffer = Buffer.from(await file.arrayBuffer());
    type = detectImageType(buffer); // dicek dari isi file, bukan dari nama/ekstensi
    if (!type) errors.file = "Format file harus JPG, PNG, WEBP, atau GIF.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  const fileUrl = await saveUpload(buffer, type.ext, "artworks", data.title);
  try {
    const artwork = await createArtwork({ userId: user.id, fileUrl, ...data });
    return NextResponse.json({ ok: true, id: artwork.id }, { status: 201 });
  } catch (err) {
    await removeUploadedFile(fileUrl); // jangan tinggalkan file yatim
    if (err.code === "23503") {
      return NextResponse.json({ errors: { categoryId: "Kategori tidak valid." } }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}