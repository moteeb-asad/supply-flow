import type { Permission } from "@/src/features/auth/types";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: string;
  permission: Permission;
}
