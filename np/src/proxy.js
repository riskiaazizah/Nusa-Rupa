import { NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";

// DILARANG memanggil pg / database di file ini.
// Proxy (dulu: middleware) hanya membaca cookie dan memeriksa token.
export async function proxy(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const user = token ? await verifyToken(token) : null;
  const go = (path) => NextResponse.redirect(new URL(path, req.url));

  if (!user) return go(`/login?next=${encodeURIComponent(pathname)}`);

  if (pathname.startsWith("/admin") && user.role !== "admin") return go("/");

  if (pathname.startsWith("/dashboard/member") && user.role !== "member") return go("/");

  if (pathname.startsWith("/dashboard/curator")) {
    if (user.role !== "curator") return go("/");
    if (user.status !== "approved") return go("/pending-curator");
  }

  if (pathname.startsWith("/pending-curator")) {
    if (user.role !== "curator" || user.status === "approved") return go("/");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/pending-curator"],
};