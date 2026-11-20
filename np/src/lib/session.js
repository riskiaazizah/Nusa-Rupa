import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "./db";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./jwt";

export async function createSession({ id, role }) {
  const token = await signSession({ id, role });
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Mengambil user TERBARU dari database (role dan curator_status bisa berubah).
// cache() = query hanya jalan sekali per request.
export const getSession = cache(async () => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await verifySession(token);
  if (!session) return null;

  const { rows } = await query(
    `SELECT u.id, u.email, u.role, u.curator_status, p.display_name, p.avatar_url
       FROM users u
       JOIN profiles p ON p.user_id = u.id
      WHERE u.id = $1`,
    [session.id]
  );
  return rows[0] ?? null; // user sudah dihapus = dianggap logout
});

// Dipakai di layout/page/server action: cek ulang role di server (Flowchart #3)
export async function requireRole(role) {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== role) redirect("/");
  if (role === "curator" && user.curator_status !== "approved") {
    redirect("/pending-curator");
  }
  return user;
}

// Khusus Pending Curator Page: curator yang belum approved
export async function requirePendingCurator() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (user.role !== "curator") redirect("/");
  if (user.curator_status === "approved") redirect("/curator");
  return user;
}