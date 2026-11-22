"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { updateCuratorStatus } from "@/lib/adminUsers";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

async function decide(formData, status) {
  await requireRole("admin");

  const userId = Number(formData.get("userId"));
  if (!Number.isInteger(userId) || userId <= 0) return { error: "Curator tidak valid." };

  try {
    const changed = await updateCuratorStatus(userId, status);
    if (!changed) return { error: "Curator tidak ditemukan atau sudah diproses." };
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }

  revalidatePath("/admin/curators");
  revalidatePath("/admin");
  return { success: true };
}

export async function approveCuratorAction(prevState, formData) {
  return decide(formData, "approved");
}

export async function rejectCuratorAction(prevState, formData) {
  return decide(formData, "rejected");
}