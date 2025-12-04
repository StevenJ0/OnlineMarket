import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || "";
  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/login", "/register"];

  const adminRoutes = ["/admin"];

  if (publicRoutes.includes(pathname)) {
    if (token) {
      const payload = await verifyToken(token);
      if (payload) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
    return NextResponse.next();
  }

  const protectedRoutes = ["/dashboard", "/profile", "/settings"];

  if (protectedRoutes.some((r) => pathname.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // ROUTES ADMIN
  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    const payload = await verifyToken(token);

    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Tentukan halaman mana saja yang ingin diproteksi
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/penjual/:path*",
    
  ],
};
