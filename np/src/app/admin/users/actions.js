"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { deleteUserAsAdmin } from "@/lib/adminUsers";

export async function deleteUserAction(prevState, formData) {
  const admin = await requireRole("admin");

  const userId = Number(formData.get("userId"));
  if (!Number.isInteger(userId) || userId <= 0) return { error: "Pengguna tidak valid." };

  let result;
  try {
    result = await deleteUserAsAdmin(admin.id, userId);
  } catch (err) {
    console.error(err);
    return { error: "Terjadi kesalahan pada server." };
  }

  if (result.status === "forbidden") {
    return { error: "Akun Admin (termasuk akun Anda sendiri) tidak dapat dihapus." };
  }
  if (result.status === "not_found") return { error: "Pengguna tidak ditemukan." };

  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/");
  return { success: true };
}