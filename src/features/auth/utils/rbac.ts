import { ROLE_PERMISSIONS, ROLES } from "../constants/rbac";
import type { Permission, Role } from "../types";

export function isRole(value: unknown): value is Role {
  return (
    typeof value === "string" && (ROLES as readonly string[]).includes(value)
  );
}

// One role per user; null (no or unknown role) has no permissions.
export function hasPermission(
  role: Role | null | undefined,
  permission: Permission,
): boolean {
  return role ? ROLE_PERMISSIONS[role].includes(permission) : false;
}

export function hasAnyPermission(
  role: Role | null | undefined,
  permissions: readonly Permission[],
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

// The user's role from app_metadata, which only the server can write (synced
// from profiles.primary_role_id by migration 037). Never read roles from
// user_metadata: users can edit it themselves.
export function getRoleFromAppMetadata(
  appMetadata: Record<string, unknown> | null | undefined,
): Role | null {
  const role = appMetadata?.role;
  return isRole(role) ? role : null;
}
