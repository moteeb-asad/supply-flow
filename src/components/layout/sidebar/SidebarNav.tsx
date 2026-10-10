import type { SidebarMenuItem } from "@/src/types/navigation";
import SidebarNavLink from "./SidebarNavLink";

type SidebarNavProps = {
  items: SidebarMenuItem[];
};

export default function SidebarNav({ items }: SidebarNavProps) {
  return (
    <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
      {items.map((item) => (
        <SidebarNavLink
          key={item.path}
          href={item.path}
          icon={item.icon}
          label={item.label}
        />
      ))}
    </nav>
  );
}
