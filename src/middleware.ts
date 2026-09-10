import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isLoginPage = nextUrl.pathname === "/login";
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isCashierRoute = nextUrl.pathname.startsWith("/cashier");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // Jika sudah login dan membuka halaman login, arahkan sesuai role
  if (isLoginPage) {
    if (isLoggedIn && user) {
      if (user.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", nextUrl));
      } else {
        return NextResponse.redirect(new URL("/cashier", nextUrl));
      }
    }
    return NextResponse.next();
  }

  // Proteksi Route Admin (hanya role ADMIN)
  if (isAdminRoute) {
    if (!isLoggedIn || !user) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/cashier", nextUrl));
    }
    return NextResponse.next();
  }

  // Proteksi Route Cashier (role CASHIER atau ADMIN)
  if (isCashierRoute) {
    if (!isLoggedIn || !user) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.json|.*\\..*).*)"],
};
