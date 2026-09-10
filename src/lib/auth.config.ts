import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types";

/**
 * Konfigurasi NextAuth yang 100% kompatibel dengan Edge Runtime.
 * File ini TIDAK mengimpor driver Node.js (seperti pg, postgres-js, bcrypt).
 * Digunakan oleh middleware.ts untuk route protection berkecepatan tinggi tanpa latency DB.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.kodeToko = user.kodeToko;
        token.role = user.role;
        token.namaLengkap = user.namaLengkap;
        token.tokenVersion = user.tokenVersion ?? 1;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.kodeToko = token.kodeToko as string;
        session.user.role = token.role as UserRole;
        session.user.namaLengkap = token.namaLengkap as string;
      }
      return session;
    },

    authorized({ auth: authSession, request: { nextUrl } }) {
      const isLoggedIn = !!authSession?.user?.id;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) {
        return isLoggedIn && authSession?.user?.role === "ADMIN";
      }
      if (path.startsWith("/cashier")) {
        return isLoggedIn;
      }
      return true;
    },
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "__Secure-authjs.session-token"
          : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax" as const,
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  providers: [],
} satisfies NextAuthConfig;
