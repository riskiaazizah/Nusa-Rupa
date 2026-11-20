
import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/jwt";

// Pemeriksaan awal akses berdasarkan role.
// Tidak melakukan koneksi database.
// Status curator diperiksa di server melalui roles.js / session.js.

const ROLE_BY_PREFIX = {
  "/admin": "admin",
  "/dashboard/member": "member",
  "/dashboard/curator": "curator",
  "/pending-curator": "curator",
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Cari route yang membutuhkan autentikasi.
  const prefix = Object.keys(ROLE_BY_PREFIX).find(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  // Route publik tidak perlu diperiksa.
  if (!prefix) {
    return NextResponse.next();
  }

  // Ambil session dari cookie.
  const token = request.cookies.get(SESSION_COOKIE)?.value;

  // Verifikasi token.
  const session = token ? await verifySession(token) : null;

  // Jika belum login atau token tidak valid.
  if (!session) {
    const loginUrl = new URL("/login", request.url);

    loginUrl.searchParams.set(
      "next",
      pathname + request.nextUrl.search
    );

    return NextResponse.redirect(loginUrl);
  }

  // Periksa kecocokan role dengan route.
  const requiredRole = ROLE_BY_PREFIX[prefix];

  if (session.role !== requiredRole) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/member/:path*",
    "/dashboard/curator/:path*",
    "/pending-curator/:path*",
  ],
};
