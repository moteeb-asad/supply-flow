import type { Role } from "@/src/features/auth/types";
import { isRole } from "@/src/features/auth/utils/rbac";

const ROLE_BADGE_BASE =
  "inline-flex h-[22px] items-center whitespace-nowrap rounded-full px-2 text-xs font-medium";

// Super admin stands out in ink; every other role is an outlined pill.
const OUTLINED = "border border-line text-muted";

// Record<Role, ...> fails to compile if a role is added without a style.
const ROLE_BADGE_COLORS: Record<Role, string> = {
  super_admin: "bg-ink text-white",
  operations_manager: OUTLINED,
  store_keeper: OUTLINED,
};

export function getRoleBadgeClassName(role: string | null | undefined) {
  const colors = isRole(role) ? ROLE_BADGE_COLORS[role] : OUTLINED;
  return `${ROLE_BADGE_BASE} ${colors}`;
}
