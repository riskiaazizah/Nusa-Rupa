"use server";

import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { getSession, destroySession } from "@/lib/session";

// Hanya Curator berstatus "rejected" yang boleh menghapus akunnya sendiri
export async function deleteRejectedAccount() {
  const user = await getSession();
  if (!user || user.role !== "curator" || user.curator_status !== "rejected") {
    redirect("/pending-curator");
  }

  await query(
    `DELETE FROM users WHERE id = $1 AND role = 'curator' AND curator_status = 'rejected'`,
    [user.id]
  );
  await destroySession();
  redirect("/login");
}