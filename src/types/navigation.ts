import type { Role } from "@/src/features/auth/types";

export interface SidebarMenuItem {
  label: string;
  path: string;
  icon: string;
  roles: Role[];
}
