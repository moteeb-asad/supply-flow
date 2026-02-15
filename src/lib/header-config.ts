export type HeaderAction =
  | {
      type: "button";
      label: string;
      icon?: string;
      action: string; // event name to dispatch
    }
  | {
      type: "search";
      placeholder?: string;
    };

export type HeaderConfig = {
  title?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
  actions?: HeaderAction[];
};

type RouteConfig = {
  [path: string]: HeaderConfig;
};

export const headerRouteConfig: RouteConfig = {
  "/settings/user-management": {
    actions: [
      {
        type: "button",
        label: "Invite User",
        icon: "person_add",
        action: "invite-user",
      },
    ],
  },
  "/suppliers": {
    showSearch: true,
    searchPlaceholder: "Search suppliers...",
    actions: [
      {
        type: "button",
        label: "Add Supplier",
        icon: "add",
        action: "add-supplier",
      },
    ],
  },
  "/inventory": {
    showSearch: true,
    searchPlaceholder: "Search inventory...",
  },
  "/reports": {
    showSearch: true,
    searchPlaceholder: "Search reports...",
  },
};

export function getHeaderConfig(pathname: string): HeaderConfig {
  // Match exact path first
  if (headerRouteConfig[pathname]) {
    return headerRouteConfig[pathname];
  }

  // Match parent paths (e.g., /settings/user-management/invitations → /settings/user-management)
  const pathSegments = pathname.split("/").filter(Boolean);
  for (let i = pathSegments.length; i > 0; i--) {
    const parentPath = "/" + pathSegments.slice(0, i).join("/");
    if (headerRouteConfig[parentPath]) {
      return headerRouteConfig[parentPath];
    }
  }

  return {}; // Default empty config
}
