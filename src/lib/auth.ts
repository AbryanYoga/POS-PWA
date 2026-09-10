import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { UserRole } from "@/types";
import { authConfig } from "./auth.config";
import { normalizeEmail, normalizeKodeToko } from "./utils";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      kodeToko: string;
      role: UserRole;
      namaLengkap: string;
    } & DefaultSession["user"];
  }

  interface User {
    id?: string;
    kodeToko?: string;
    role?: UserRole;
    namaLengkap?: string;
    tokenVersion?: number;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        kodeToko: { label: "Kode Toko", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.kodeToko) {
          return null;
        }

        // Normalisasi konsisten: email lowercase, kodeToko uppercase.
        // normalizeKodeToko/normalizeEmail juga digunakan di seluruh server actions.
        const email = normalizeEmail(String(credentials.email));
        const password = String(credentials.password);
        const kodeToko = normalizeKodeToko(String(credentials.kodeToko));

        try {
          const matchedUser = await db.query.users.findFirst({
            where: and(
              eq(users.email, email),
              eq(users.kodeToko, kodeToko),
              eq(users.isActive, true)
            ),
          });

          if (!matchedUser) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            matchedUser.passwordHash
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: matchedUser.id,
            email: matchedUser.email,
            name: matchedUser.namaLengkap,
            kodeToko: matchedUser.kodeToko,
            role: matchedUser.role,
            namaLengkap: matchedUser.namaLengkap,
            tokenVersion: matchedUser.tokenVersion,
          };
        } catch (error) {
          console.error("[Auth] Database verification error:", error);
          return null;
        }
      },
    }),
  ],
});
