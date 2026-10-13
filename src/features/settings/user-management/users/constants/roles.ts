import { ROLES, ROLE_LABELS } from "@/src/features/auth/constants/rbac";

export const ROLE_OPTIONS = ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));
