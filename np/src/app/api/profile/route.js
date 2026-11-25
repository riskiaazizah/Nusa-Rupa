import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { validateProfileInput } from "@/lib/validateMember";
import { MAX_UPLOAD_BYTES, detectImageType, saveUpload, removeUploadedFile } from "@/lib/uploads";
import { updateProfile } from "@/lib/profile";

// Foto profil diunggah lewat Route Handler (Server Action dibatasi 1 MB secara default).
// userId SELALU diambil dari sesi, sehingga hanya profil sendiri yang bisa diubah.
export async function PATCH(request) {
  const user = await getSession();
  if (!user) return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });

  let form;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Data form tidak valid." }, { status: 400 });
  }

  const { errors, data } = validateProfileInput({
    displayName: form.get("displayName"),
    bio: form.get("bio"),
    links: form.get("links"),
  });

  const file = form.get("avatar");
  const hasFile = file instanceof File && file.size > 0;
  const removeAvatar = form.get("removeAvatar") === "1";
  let avatar = null;

  if (hasFile) {
    if (file.size > MAX_UPLOAD_BYTES) {
      errors.avatar = "Ukuran foto maksimal 5 MB.";
    } else {
      const buffer = Buffer.from(await file.arrayBuffer());
      const type = detectImageType(buffer); // dicek dari isi file, bukan dari nama/ekstensi
      if (type) avatar = { buffer, type };
      else errors.avatar = "Format foto harus JPG, PNG, WEBP, atau GIF.";
    }
  }
  if (Object.keys(errors).length > 0) return NextResponse.json({ errors }, { status: 400 });

  const newAvatarUrl = avatar ? await saveUpload(avatar.buffer, avatar.type.ext, "avatars", data.displayName) : null;
  try {
    const result = await updateProfile(user.id, data, { newAvatarUrl, removeAvatar });
    if (!result) {
      if (newAvatarUrl) await removeUploadedFile(newAvatarUrl);
      return NextResponse.json({ error: "Profil tidak ditemukan." }, { status: 404 });
    }
    if (result.oldAvatarUrl) await removeUploadedFile(result.oldAvatarUrl);
    return NextResponse.json({ ok: true });
  } catch (err) {
    if (newAvatarUrl) await removeUploadedFile(newAvatarUrl); // jangan tinggalkan file yatim
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
