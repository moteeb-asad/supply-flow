import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROLE_LABELS, type UserRole } from "@/src/features/auth/types";
import { formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRole(role: string | UserRole | undefined | null): string {
  if (!role) return "User";
  return ROLE_LABELS[role as UserRole] || role;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const formatLastLogin = (lastSignIn: string | null) => {
  if (!lastSignIn) return "Never";
  return formatDistanceToNow(new Date(lastSignIn), { addSuffix: true });
};
