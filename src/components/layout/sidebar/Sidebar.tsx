"use client";

import { sidebarMenu } from "./menu.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  userRole: "super_admin" | "ops_manager" | "store_keeper";
  userName?: string;
  roleLabel?: string;
}

const menuIcons: Record<string, string> = {
  Dashboard: "dashboard",
  Suppliers: "local_shipping",
  Inventory: "package_2",
  Orders: "description",
  Reports: "analytics",
  "SKU Receiving": "inventory_2",
};

export default function Sidebar({
  userRole,
  userName = "Alex Miller",
  roleLabel = "Logistics Lead",
}: SidebarProps) {
  const pathname = usePathname();
  const filteredMenu = sidebarMenu.filter((item) =>
    item.roles.includes(userRole),
  );

  return (
    <aside className="w-64 flex flex-col border-r border-[#e7ebf3] dark:border-gray-800 bg-white dark:bg-[#1a1f2e] min-h-screen shrink-0">
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

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {filteredMenu.map((item) => {
          const isActive = pathname === item.path;
          const iconName = menuIcons[item.label] ?? "dashboard";

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-[#4e6797] hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={
                  isActive ? { fontVariationSettings: "'FILL' 1" } : undefined
                }
              >
                {iconName}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e7ebf3] dark:border-gray-800">
        <button className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-[#4e6797] hover:bg-gray-100 dark:hover:bg-gray-800">
          <span className="material-symbols-outlined">settings</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
        <div className="mt-4 flex items-center gap-3 px-3">
          <div
            className="size-8 rounded-full bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDlX8vRI_H_-Z6AOQuJQ1hgGxZFk4-W0Jenictidlx7tU-vzXiVjtcZ3u17khzV98Ene5AEItubY50MgZp2spHHOmCQX8rrJd43T8wUsBVkCWNDQ7kDElmi2f6gw-CKy5pr7sCRQ71jiVv88w_vYu9FT0h9XpxLtn7bllfo5o-mNYpPIk9p84B9ocT7yvNzPFNPAUT4WWc1DJ2C7aRni86DgYwc_5sqny5MZNzmUDY5AmoCWk8luZb83QmsW_lX4qkRuQ4jNfNjhF0")',
            }}
          />
          <div className="flex flex-col">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs text-[#4e6797]">{roleLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
