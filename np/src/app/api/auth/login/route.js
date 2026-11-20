import { NextResponse } from "next/server";
import { validateLogin } from "@/lib/validators";
import { verifyCredentials } from "@/lib/users";
import { createSession } from "@/lib/session";
import { homePathFor } from "@/lib/roles";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { ok, errors, data } = validateLogin(body);
  if (!ok) return NextResponse.json({ errors }, { status: 400 });

  try {
    const user = await verifyCredentials(data.email, data.password);
    if (!user) {
      // Pesan sengaja umum: tidak membocorkan apakah email terdaftar
      return NextResponse.json({ error: "Email atau password salah." }, { status: 401 });
    }
    await createSession(user);
    return NextResponse.json({ ok: true, redirectTo: homePathFor(user) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}