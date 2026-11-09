import { ROLES, ROLE_LABELS } from "@/src/features/auth/constants/rbac";
import type { Role } from "@/src/features/auth/types";

// What each role can do, in words. Keep in sync with ROLE_PERMISSIONS
// (src/features/auth/constants/rbac.ts).
const ROLE_DESCRIPTIONS: Record<Role, string> = {
  super_admin: "Everything, including inviting and removing users.",
  operations_manager:
    "Orders, suppliers, inventory, receiving and reports. Cannot manage users.",
  store_keeper:
    "Records receiving and views inventory. Cannot see orders or suppliers.",
};

export const ROLE_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
  description: ROLE_DESCRIPTIONS[role],
}));
