import type { SidebarMenuItem } from "@/src/types/navigation";
import SidebarNavLink from "./SidebarNavLink";
import { sidebarGroups } from "./menu.config";

type SidebarNavProps = {
  items: SidebarMenuItem[];
};

export default function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="mt-4 flex-1 space-y-4 overflow-y-auto"
    >
      {sidebarGroups.map((group) => {
        const groupItems = items.filter((item) => item.group === group.id);
        if (groupItems.length === 0) return null;

        return (
          <div key={group.id}>
            <p className="px-2.5 pb-1 text-xs font-medium text-subtle">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {groupItems.map((item) => (
                <SidebarNavLink
                  key={item.path}
                  href={item.path}
                  icon={item.icon}
                  label={item.label}
                  badge={item.badge}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
