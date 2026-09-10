"use server";

import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface SessionHeartbeatResult {
  isLoggedIn: boolean;
  isValid: boolean;
  message?: string;
}

/**
 * Lightweight heartbeat check yang dipanggil oleh client secara berkala (setiap 60 detik)
 * untuk mendeteksi penonaktifan akun secara otomatis saat browser masih dalam kondisi terbuka.
 */
export async function checkSessionHeartbeatAction(): Promise<SessionHeartbeatResult> {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.kodeToko) {
      return { isLoggedIn: false, isValid: true };
    }

    const [user] = await db
      .select({
        id: users.id,
        isActive: users.isActive,
        tokenVersion: users.tokenVersion,
      })
      .from(users)
      .where(
        and(
          eq(users.id, session.user.id),
          eq(users.kodeToko, session.user.kodeToko)
        )
      )
      .limit(1);

    if (!user || !user.isActive) {
      return {
        isLoggedIn: true,
        isValid: false,
        message: "Akun Anda telah dinonaktifkan oleh administrator.",
      };
    }

    return { isLoggedIn: true, isValid: true };
  } catch (error) {
    // Fail-safe jika DB transient error
    return { isLoggedIn: true, isValid: true };
  }
}
