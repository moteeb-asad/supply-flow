import type { UserRole } from "@/src/types/layout";
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

export function getMenuByRole(
  role: UserRole | null | undefined,
  items: SidebarMenuItem[],
): SidebarMenuItem[] {
  if (!role) {
    return [];
  }

  return items.filter((item) => item.roles.includes(role));
}
