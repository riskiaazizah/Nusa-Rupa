"use server";

import { requireRole } from "@/lib/session";
import { validateAccountInput } from "@/lib/validateMember";
import { changeAccount } from "@/lib/account";

export async function updateAccountAction(prevState, formData) {
  const user = await requireRole("member"); // userId selalu dari sesi, bukan dari form

  const { ok, errors, data } = validateAccountInput({
    currentPassword: formData.get("currentPassword"),
    newEmail: formData.get("newEmail"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!ok) return { errors };

  let result;
  try {
    result = await changeAccount(user.id, data);
  } catch (err) {
    console.error(err);
    return { errors: { form: "Terjadi kesalahan pada server." } };
  }

  if (result.status === "wrong_password") return { errors: { currentPassword: "Password saat ini salah." } };
  if (result.status === "email_taken") return { errors: { newEmail: "Email sudah dipakai akun lain." } };
  if (result.status === "no_change") return { errors: { form: "Tidak ada perubahan yang disimpan." } };
  if (result.status !== "ok") return { errors: { form: "Akun tidak ditemukan." } };

  return { success: true };
}
