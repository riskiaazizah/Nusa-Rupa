import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export async function POST(req) {
  const { username, email, password, role } = await req.json();

  if (!username?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Format email tidak valid." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password minimal 8 karakter." }, { status: 400 });
  }
  if (!["member", "curator"].includes(role)) {
    return NextResponse.json({ error: "Role tidak valid." }, { status: 400 });
  }

  const exists = await query(
    "SELECT 1 FROM users WHERE email = $1 OR username = $2",
    [email.trim().toLowerCase(), username.trim()]
  );
  if (exists.length) {
    return NextResponse.json({ error: "Email atau username sudah dipakai." }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const status = role === "curator" ? "pending" : "approved";

  await query(
    `INSERT INTO users (username, email, password_hash, role, status, display_name)
     VALUES ($1, $2, $3, $4, $5, $1)`,
    [username.trim(), email.trim().toLowerCase(), hash, role, status]
  );

  return NextResponse.json({ ok: true, status }, { status: 201 });
}