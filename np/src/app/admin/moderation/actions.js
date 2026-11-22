"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { dismissReports, takeDownArtwork } from "@/lib/moderation";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

function refresh(artworkId) {
  revalidatePath("/admin/moderation");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath(`/artworks/${artworkId}`);
}

export async function dismissReportAction(prevState, formData) {
  await requireRole("admin");

  const artworkId = Number(formData.get("artworkId"));
  if (!Number.isInteger(artworkId) || artworkId <= 0) return { error: "Karya tidak valid." };

  try {
    const count = await dismissReports(artworkId);
    if (count === 0) return { error: "Tidak ada laporan yang menunggu untuk karya ini." };
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  refresh(artworkId);
  return { success: true };
}

export async function takeDownAction(prevState, formData) {
  await requireRole("admin");

  const artworkId = Number(formData.get("artworkId"));
  if (!Number.isInteger(artworkId) || artworkId <= 0) return { error: "Karya tidak valid." };

  try {
    const removed = await takeDownArtwork(artworkId);
    if (!removed) return { error: "Karya tidak ditemukan atau tidak sedang dilaporkan." };
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }
  refresh(artworkId);
  return { success: true };
}