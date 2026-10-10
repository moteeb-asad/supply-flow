import SidebarNav from "./SidebarNav";
import SidebarNavLink from "./SidebarNavLink";
import { sidebarMenu } from "./menu.config";
import { getCurrentUser } from "@/src/features/auth/actions/auth.actions";
import { getMenuByRole } from "@/src/lib/navigation";
import { formatRole } from "@/src/lib/utils";
import type { UserRole } from "@/src/types/layout";

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
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-line-soft bg-white">
      <div className="flex h-14 items-center gap-2.5 px-4">
        <div className="flex size-8 items-center justify-center rounded-md bg-primary text-white">
          <span className="material-symbols-outlined !text-[20px]">
            inventory_2
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-sm font-bold leading-none">SupplyFlow</h1>
          <p className="text-xs leading-none text-muted">Warehouse Admin</p>
        </div>
      </div>
      <SidebarNav items={filteredMenuItems} />
      <div className="space-y-1 border-t border-line-soft p-3">
        <SidebarNavLink href="/settings" icon="settings" label="Settings" />
        <div className="flex items-center gap-2.5 px-2.5 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <span className="text-xs font-bold text-primary">{initial}</span>
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <p className="truncate text-sm font-medium leading-none">
              {userName}
            </p>
            <p className="truncate text-xs leading-none text-muted">
              {formatRole(user?.user_metadata.primary_role)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
