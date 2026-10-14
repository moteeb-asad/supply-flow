import type { Permission } from "@/src/features/auth/types";

// Permission required to open each route section (and everything below it).
export const ROUTE_PERMISSIONS: Record<string, Permission> = {
  "/dashboard": "dashboard:view",
  "/inventory": "inventory:view",
  "/suppliers": "suppliers:view",
  "/purchase-orders": "purchase_orders:view",
  "/sku-receiving": "receiving:view",
  "/reports": "reports:view",
  "/settings": "settings:view",
  "/settings/account": "settings:view",
  "/settings/user-management": "users:manage",
};

// Longest first so the most specific route wins (sorted once, not per request).
const ROUTES_BY_SPECIFICITY = Object.keys(ROUTE_PERMISSIONS).sort(
  (a, b) => b.length - a.length,
);

// Permission for the most specific matching route, or null if the route is
// not listed. Matches the route itself or a sub-path, not a shared prefix
// (e.g. "/settings" does not match "/settingsx").
export function getRoutePermission(pathname: string): Permission | null {
  const route = ROUTES_BY_SPECIFICITY.find(
    (candidate) =>
      pathname === candidate || pathname.startsWith(`${candidate}/`),
  );
  return route ? ROUTE_PERMISSIONS[route] : null;
}
