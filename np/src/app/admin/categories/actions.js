"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/session";
import { validateCategoryName } from "@/lib/validators";
import { createCategory, renameCategory, deleteCategory } from "@/lib/categories";

const SERVER_ERROR = "Terjadi kesalahan pada server.";

export async function addCategoryAction(prevState, formData) {
  await requireRole("admin");

  const name = String(formData.get("name") ?? "").trim();
  const error = validateCategoryName(name);
  if (error) return { error, name };

  try {
    await createCategory(name);
  } catch (err) {
    if (err.code === "23505") return { error: "Nama kategori sudah ada.", name };
    console.error(err);
    return { error: SERVER_ERROR, name };
  }

  revalidatePath("/admin/categories");
  return { success: `Kategori "${name}" ditambahkan.` };
}

export async function editCategoryAction(prevState, formData) {
  await requireRole("admin");

  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!Number.isInteger(id)) return { error: "Kategori tidak valid." };

  const error = validateCategoryName(name);
  if (error) return { error };

  try {
    const updated = await renameCategory(id, name);
    if (!updated) return { error: "Kategori tidak ditemukan." };
  } catch (err) {
    if (err.code === "23505") return { error: "Nama kategori sudah ada." };
    console.error(err);
    return { error: SERVER_ERROR };
  }

  revalidatePath("/admin/categories");
  return { success: "Kategori diperbarui." };
}

export async function removeCategoryAction(prevState, formData) {
  await requireRole("admin");

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return { error: "Kategori tidak valid." };

  try {
    const result = await deleteCategory(id);
    if (result.status === "in_use") {
      return { error: `Kategori masih dipakai ${result.count} karya dan tidak dapat dihapus.` };
    }
    if (result.status === "not_found") return { error: "Kategori tidak ditemukan." };
  } catch (err) {
    console.error(err);
    return { error: SERVER_ERROR };
  }

  revalidatePath("/admin/categories");
  return { success: "Kategori dihapus." };
}