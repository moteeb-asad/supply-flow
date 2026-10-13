import { ROLE_LABELS } from "@/src/features/auth/constants/rbac";

export const ROLES = [
  { id: "1", label: ROLE_LABELS.super_admin },
  { id: "2", label: ROLE_LABELS.operations_manager },
  { id: "3", label: ROLE_LABELS.store_keeper },
];

// Optionally, export a map for quick lookups
export const ROLES_MAP = Object.fromEntries(ROLES.map((r) => [r.id, r.label]));
