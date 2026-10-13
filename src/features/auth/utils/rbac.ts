import { ROLE_PERMISSIONS, ROLES } from "../constants/rbac";
import type { Permission, Role } from "../types";

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

// Turns untrusted input (token claims, DB rows) into a clean Role[].
export function toRoles(value: unknown): Role[] {
  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.filter(isRole))];
}

export function hasPermission(
  roles: readonly Role[],
  permission: Permission,
): boolean {
  return roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function hasAnyPermission(
  roles: readonly Role[],
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(roles, permission));
}

// Roles from auth metadata: the `roles` array, else `primary_role`, else the
// legacy `role`. The one place that knows where roles live in the user record.
export function getRolesFromMetadata(
  metadata: Record<string, unknown> | null | undefined,
): Role[] {
  if (!metadata) return [];
  const roles = toRoles(metadata.roles);
  if (roles.length > 0) return roles;
  return toRoles(metadata.primary_role ?? metadata.role);
}
