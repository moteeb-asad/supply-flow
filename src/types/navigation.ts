import type { Permission } from "@/src/features/auth/types";
import type { AppIconName } from "@/src/components/ui/AppIcon";

export type SidebarMenuGroup = "operations" | "partners" | "insights";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: AppIconName;
  permission: Permission;
  group: SidebarMenuGroup;
  // Small pill after the label, e.g. "Soon".
  badge?: string;
}
