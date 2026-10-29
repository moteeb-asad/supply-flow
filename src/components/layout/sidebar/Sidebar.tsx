import SidebarNav from "./SidebarNav";
import SidebarNavLink from "./SidebarNavLink";
import { sidebarMenu } from "./menu.config";
import {
  getCurrentUser,
  logoutAction,
} from "@/src/features/auth/actions/auth.actions";
import { getMenuForRole } from "@/src/lib/navigation";
import { formatRole, getInitials } from "@/src/lib/utils";
import { getRoleFromAppMetadata } from "@/src/features/auth/utils/rbac";

const sidebarIconButtonClassName =
  "relative flex size-7 cursor-pointer items-center justify-center rounded-control text-subtle transition-colors hover:bg-background-light hover:text-ink";

export default async function Sidebar() {
  const user = await getCurrentUser();
  const role = getRoleFromAppMetadata(user?.app_metadata);
  const filteredMenuItems = getMenuForRole(role, sidebarMenu);
  // Extract name from user metadata
  const userName =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  return (
    // Sits on the grey frame (see app/(main)/layout.tsx), no border or fill.
    <aside className="sticky top-2 flex h-[calc(100vh-16px)] w-60 shrink-0 flex-col px-2 py-2">
      <div className="flex items-center gap-2.5 px-1.5">
        <div className="flex size-8 items-center justify-center rounded-control bg-ink text-white">
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px]"
          >
            deployed_code
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold leading-5 text-ink">SupplyFlow</p>
          <p className="text-xs leading-4 text-subtle">Warehouse operations</p>
        </div>
      </div>
      <SidebarNav items={filteredMenuItems} />
      <div className="space-y-2 pt-2">
        <SidebarNavLink href="/settings" icon="settings" label="Settings" />
        <div className="flex items-center gap-2.5 rounded-card border border-line bg-surface/60 p-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-soft">
            <span className="text-xs font-semibold text-neutral">
              {getInitials(userName)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-5 text-ink">
              {userName}
            </p>
            <p className="truncate text-xs leading-4 text-subtle">
              {formatRole(role)}
            </p>
          </div>
          <div className="flex shrink-0 items-center">
            <button
              aria-label="Notifications"
              className={sidebarIconButtonClassName}
              title="Notifications"
              type="button"
            >
              <span className="material-symbols-outlined !text-[18px]">
                notifications
              </span>
              <span className="absolute right-1 top-1 size-1.5 rounded-full bg-danger" />
            </button>
            <form action={logoutAction}>
              <button
                aria-label="Log out"
                className={sidebarIconButtonClassName}
                title="Log out"
                type="submit"
              >
                <span className="material-symbols-outlined !text-[18px]">
                  logout
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
