export type UserRole = "super_admin" | "operations_manager" | "store_keeper";

export interface SidebarProps {
  userRole: UserRole;
  userName?: string;
  roleLabel?: string;
}
