import { SessionUser, UserRole } from "@/types";

export function isAdmin(user: SessionUser | null | undefined): boolean {
  return user?.role === "ADMIN";
}

export function isCashier(user: SessionUser | null | undefined): boolean {
  return user?.role === "CASHIER" || user?.role === "ADMIN";
}

export function canAccessAdmin(role: UserRole | string | undefined): boolean {
  return role === "ADMIN";
}

export function canAccessCashier(role: UserRole | string | undefined): boolean {
  return role === "CASHIER" || role === "ADMIN";
}
