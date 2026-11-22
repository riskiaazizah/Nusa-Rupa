"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { toggleLike, toggleFavorite, addComment, deleteComment, createReport } from "@/lib/interactions";
import { validateComment, validateReport } from "@/lib/validateInteraction";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

// Guest -> halaman login. Admin/Curator -> null (tidak boleh berinteraksi).
async function getMember() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user.role === "member" ? user : null;
}

function toId(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function refresh(artworkId) {
  revalidatePath(`/artworks/${artworkId}`);
  revalidatePath("/");
}

export async function toggleLikeAction(formData) {
  const user = await getMember();
  if (!user) return;
  const artworkId = toId(formData.get("artworkId"));
  if (!artworkId) return;

  try {
    await toggleLike(user.id, artworkId);
  } catch (err) {
    if (err.code !== "23503") console.error(err); // 23503 = karya sudah tidak ada
    return;
  }
  refresh(artworkId);
}

export async function toggleFavoriteAction(formData) {
  const user = await getMember();
  if (!user) return;
  const artworkId = toId(formData.get("artworkId"));
  if (!artworkId) return;

  try {
    await toggleFavorite(user.id, artworkId);
  } catch (err) {
    if (err.code !== "23503") console.error(err);
    return;
  }
  refresh(artworkId);
  revalidatePath("/member/favorites");
}

export async function addCommentAction(prevState, formData) {
  const user = await getMember();
  if (!user) return { error: "Hanya Member yang dapat berkomentar." };
  const artworkId = toId(formData.get("artworkId"));
  if (!artworkId) return { error: "Karya tidak valid." };

  const result = validateComment(formData.get("content"));
  if (!result.ok) return { error: result.error };

  try {
    await addComment(user.id, artworkId, result.value);
  } catch (err) {
    if (err.code === "23503") return { error: "Karya tidak ditemukan." };
    console.error(err);
    return { error: SERVER_ERROR };
  }
  refresh(artworkId);
  return { success: true };
}

export async function deleteCommentAction(formData) {
  const user = await getMember();
  if (!user) return;
  const commentId = toId(formData.get("commentId"));
  if (!commentId) return;

  const deleted = await deleteComment(user.id, commentId); // WHERE user_id: hanya milik sendiri
  if (deleted) refresh(deleted.artwork_id);
}

export async function reportArtworkAction(prevState, formData) {
  const user = await getMember();
  if (!user) return { error: "Hanya Member yang dapat melaporkan karya." };
  const artworkId = toId(formData.get("artworkId"));
  if (!artworkId) return { error: "Karya tidak valid." };

  const { ok, errors, data } = validateReport({
    reason: formData.get("reason"),
    details: formData.get("details"),
  });
  if (!ok) return { errors };

  try {
    const result = await createReport(user.id, artworkId, data);
    if (result.status === "not_allowed") {
      return { error: "Karya tidak ditemukan atau merupakan karya Anda sendiri." };
    }
  } catch (err) {
    if (err.code === "23505") return { error: "Anda sudah melaporkan karya ini." };
    console.error(err);
    return { error: SERVER_ERROR };
  }
  refresh(artworkId);
  return { success: true };
}