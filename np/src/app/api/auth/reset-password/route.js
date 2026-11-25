import { NextResponse } from "next/server";
import { validateResetPassword } from "@/lib/validators";
import { verifyPasswordResetToken } from "@/lib/jwt";
import { resetUserPassword } from "@/lib/users";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Format data request tidak valid." }, { status: 400 });
  }

  const { token, password, confirmPassword } = body ?? {};
  if (!token) {
    return NextResponse.json(
      { error: "Token reset password tidak ditemukan atau tidak valid." },
      { status: 400 }
    );
  }

  const payload = await verifyPasswordResetToken(token);
  if (!payload) {
    return NextResponse.json(
      { error: "Sesi reset password sudah kedaluwarsa atau tidak valid. Silakan ulangi langkah reset password." },
      { status: 400 }
    );
  }

  const { ok, errors, data } = validateResetPassword({ password, confirmPassword });
  if (!ok) return NextResponse.json({ errors }, { status: 400 });

  try {
    await resetUserPassword(payload.id, data.password);
    return NextResponse.json({
      ok: true,
      message: "Password berhasil diperbarui. Silakan login dengan password baru.",
    });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan saat memperbarui password." }, { status: 500 });
  }
}
