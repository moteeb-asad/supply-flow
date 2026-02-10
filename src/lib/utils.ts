import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROLE_LABELS, type UserRole } from "@/src/types/auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRole(role: UserRole | undefined | null): string {
  if (!role) return "User";
  return ROLE_LABELS[role] || role;
}
