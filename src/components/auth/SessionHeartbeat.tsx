"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { checkSessionHeartbeatAction } from "@/lib/actions/session-heartbeat-action";

export function SessionHeartbeat() {
  const pathname = usePathname();

  useEffect(() => {
    // Jangan lakukan polling jika sedang di halaman login/register/root
    if (pathname === "/login" || pathname === "/register" || pathname === "/") {
      return;
    }

    const checkHeartbeat = async () => {
      try {
        const res = await checkSessionHeartbeatAction();
        if (res.isLoggedIn && !res.isValid) {
          // Akun telah dinonaktifkan di database
          alert(res.message || "Akun Anda telah dinonaktifkan. Anda akan dialihkan ke halaman login.");
          window.location.href = "/login?error=account_deactivated";
        }
      } catch {
        // Ignore network errors
      }
    };

    // Jalankan pertama kali saat mount
    checkHeartbeat();

    // Polling setiap 60 detik
    const interval = setInterval(checkHeartbeat, 60 * 1000);

    // Re-check saat window kembali fokus
    const handleFocus = () => {
      checkHeartbeat();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [pathname]);

  return null;
}
