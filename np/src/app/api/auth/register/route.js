import { NextResponse } from "next/server";
import { validateRegister } from "@/lib/validators";
import { createUser } from "@/lib/users";
import { createSession } from "@/lib/session";
import { homePathFor } from "@/lib/roles";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body request tidak valid." }, { status: 400 });
  }

  const { ok, errors, data } = validateRegister(body);
  if (!ok) return NextResponse.json({ errors }, { status: 400 });

  try {
    const user = await createUser(data);
    await createSession(user);
    return NextResponse.json({ ok: true, redirectTo: homePathFor(user) }, { status: 201 });
  } catch (err) {
    if (err.code === "23505") {
      return NextResponse.json({ errors: { email: "Email sudah terdaftar." } }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}