import type { Role } from "@/src/features/auth/types";
import { isRole } from "@/src/features/auth/utils/rbac";

const ROLE_BADGE_BASE =
  "px-2.5 py-1 rounded-full text-[11px] font-bold uppercase text-nowrap";

// Record<Role, ...> fails to compile if a role is added without a style.
const ROLE_BADGE_COLORS: Record<Role, string> = {
  super_admin: "bg-primary/10 text-primary",
  operations_manager: "bg-orange-100 text-orange-600",
  store_keeper: "bg-gray-100 text-muted",
};

export function getRoleBadgeClassName(role: string | null | undefined) {
  const colors = isRole(role)
    ? ROLE_BADGE_COLORS[role]
    : "bg-gray-100 text-muted";
  return `${ROLE_BADGE_BASE} ${colors}`;
}
