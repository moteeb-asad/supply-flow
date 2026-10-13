import type { Role } from "@/src/features/auth/types";
import { hasPermission } from "@/src/features/auth/utils/rbac";
import type { SidebarMenuItem } from "@/src/types/navigation";

export function isActivePath(currentPath: string, targetPath: string): boolean {
  // Exact match
  if (currentPath === targetPath) return true;

  // Section-level match (e.g. /settings, /settings/users)
  if (targetPath !== "/" && currentPath.startsWith(`${targetPath}/`)) {
    return true;
  }

  return false;
}

export function getMenuForRoles(
  roles: readonly Role[],
  items: SidebarMenuItem[],
): SidebarMenuItem[] {
  return items.filter((item) => hasPermission(roles, item.permission));
}
