import { NextResponse } from "next/server";
import { validateForgotPassword } from "@/lib/validators";
import { findUserByEmail } from "@/lib/users";
import { signPasswordResetToken } from "@/lib/jwt";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format data request tidak valid." }, { status: 400 });
  }

  const { ok, errors, data } = validateForgotPassword(body);
  if (!ok) return NextResponse.json({ errors }, { status: 400 });

  try {
    const user = await findUserByEmail(data.email);
    if (!user) {
      return NextResponse.json(
        { error: "Akun dengan alamat email ini tidak ditemukan." },
        { status: 404 }
      );
    }

    const token = await signPasswordResetToken({ id: user.id, email: user.email });

    return NextResponse.json({
      ok: true,
      message: "Akun terverifikasi. Silakan masukkan password baru.",
      email: user.email,
      token,
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan pada server." }, { status: 500 });
  }
}
