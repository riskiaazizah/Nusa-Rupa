"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { validateArtworkInput } from "@/lib/validators";
import { updateArtwork, deleteArtwork } from "@/lib/artworks";
import { removeUploadedFile } from "@/lib/uploads";

const SERVER_ERROR = "Terjadi kesalahan pada server.";
const NOT_OWNED = "Karya tidak ditemukan atau bukan milik Anda.";

export async function updateArtworkAction(prevState, formData) {
  const user = await requireRole("member");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: NOT_OWNED };

  const { ok, errors, data } = validateArtworkInput({
    title: formData.get("title"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    tags: formData.get("tags"),
  });
  if (!ok) return { errors };

  let updated;
  try {
    updated = await updateArtwork(id, user.id, data); // WHERE id AND user_id: cek pemilik
  } catch (err) {
    if (err.code === "23503") return { errors: { categoryId: "Kategori tidak valid." } };
    console.error(err);
    return { error: SERVER_ERROR };
  }
  if (!updated) return { error: NOT_OWNED };

  revalidatePath("/member/artworks");
  redirect("/member/artworks"); // redirect() harus di luar try/catch
}

export async function deleteArtworkAction(prevState, formData) {
  const user = await requireRole("member");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: NOT_OWNED };

  let fileUrl;
  try {
    fileUrl = await deleteArtwork(id, user.id);
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  if (!fileUrl) return { error: NOT_OWNED };

  await removeUploadedFile(fileUrl);
  revalidatePath("/member/artworks");
  return { success: true };
}