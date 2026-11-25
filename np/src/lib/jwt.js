import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "tiga_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari (detik)

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET belum diset atau kurang dari 32 karakter (cek .env.local).");
  }
  return new TextEncoder().encode(secret);
}

// Payload sengaja minimal: id user + role. Status curator TIDAK disimpan di token
// karena bisa berubah (Admin approve/reject) saat user sedang login.
export async function signSession({ id, role }) {
  return new SignJWT({ role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySession(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { id: Number(payload.sub), role: payload.role };
  } catch {
    return null; // token rusak / kedaluwarsa
  }
}

// Token reset password bertenggat waktu singkat (15 menit)
export async function signPasswordResetToken({ id, email }) {
  return new SignJWT({ email, type: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(id))
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecret());
}

export async function verifyPasswordResetToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.type !== "password_reset") return null;
    return { id: Number(payload.sub), email: payload.email };
  } catch {
    return null;
  }
}