import type { Permission } from "@/src/features/auth/types";

export type SidebarMenuGroup = "operations" | "partners" | "insights";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: string;
  permission: Permission;
  group: SidebarMenuGroup;
  // Small pill after the label, e.g. "Soon".
  badge?: string;
}
