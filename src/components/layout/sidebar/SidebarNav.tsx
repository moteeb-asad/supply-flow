"use client";

import { sidebarMenu } from "./menu.config";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuIcons: Record<string, string> = {
  Dashboard: "dashboard",
  Suppliers: "local_shipping",
  Inventory: "package_2",
  Orders: "description",
  Reports: "analytics",
  "SKU Receiving": "inventory_2",
};

export default function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
      {sidebarMenu.map((item) => {
        const isActive = pathname === item.path;
        const iconName = menuIcons[item.label] ?? "dashboard";

        return (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary"
                : "text-[#4e6797] hover:bg-gray-100"
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
  );
}
