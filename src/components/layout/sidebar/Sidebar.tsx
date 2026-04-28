import SidebarNav from "./SidebarNav";
import { sidebarMenu } from "./menu.config";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { getMenuByRole } from "@/src/lib/navigation";
import { formatRole } from "@/src/lib/utils";
import type { UserRole } from "@/src/types/layout";
import SettingsLink from "./SettingsLink";

export default async function Sidebar() {
  const user = await getCurrentUser();
  const primaryRole = user?.user_metadata?.primary_role;
  const userRole: UserRole | null =
    primaryRole === "super_admin" ||
    primaryRole === "operations_manager" ||
    primaryRole === "store_keeper"
      ? primaryRole
      : null;
  const filteredMenuItems = getMenuByRole(userRole, sidebarMenu);
  // Extract name from user metadata
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  // Get first letter of name for avatar
  const initial = userName.charAt(0).toUpperCase();
  return (
    <aside className="w-64 flex flex-col border-r border-[#e7ebf3] bg-white min-h-screen shrink-0">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary size-10 rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined">inventory_2</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-bold leading-none">SupplyFlow</h1>
            <p className="text-[#4e6797] text-xs font-normal">
              Warehouse Admin
            </p>
          </div>
        </div>
      </div>
      <SidebarNav items={filteredMenuItems} />
      <div className="p-4 border-t border-[#e7ebf3]">
        <SettingsLink />
        <div className="mt-4 flex items-center gap-3 px-3">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{initial}</span>
          </div>
          <div className="flex flex-col justify-space-between">
            <p className="text-sm font-medium leading-none truncate max-w-32">
              {userName}
            </p>
            <p className="text-xs text-[#4e6797] truncate max-w-32">
              {formatRole(user?.user_metadata.primary_role)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
