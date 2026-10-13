import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ROLE_LABELS } from "@/src/features/auth/constants/rbac";
import { formatDistanceToNow } from "date-fns";
import { isRole } from "@/src/features/auth/utils/rbac";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRole(role: string | null | undefined): string {
  if (!role) return "User";
  return isRole(role) ? ROLE_LABELS[role] : role;
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

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
