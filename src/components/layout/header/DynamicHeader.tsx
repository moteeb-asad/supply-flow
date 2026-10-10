"use client";

import { usePathname, useRouter } from "next/navigation";
import { getHeaderConfig } from "@/src/lib/header-config";
import { Button } from "@/src/components/ui/Button";

export default function DynamicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const config = getHeaderConfig(pathname);

  const handleAction = (actionName: string) => {
    // Update URL to trigger modal in the page component
    const currentPath = pathname;
    router.push(`${currentPath}?modal=${actionName}`);
  };

  if (!config.showSearch && !config.actions?.length) {
    return null; // No header actions needed for this route
  }

  return (
    <div className="flex items-center gap-2">
      {/* Search Bar */}
      {config.showSearch && (
        <div className="relative w-72">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-muted !text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder={config.searchPlaceholder || "Search..."}
            className="h-9 w-full rounded-md border border-line-soft bg-background-light pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary"
          />
        </div>
      )}

      {/* Action Buttons */}
      {config.actions?.map((action, index) =>
        action.type === "button" ? (
          <Button
            key={index}
            variant="primary"
            size="sm"
            shadow="none"
            onClick={() => handleAction(action.action)}
          >
            {action.icon && (
              <span className="material-symbols-outlined !text-lg">
                {action.icon}
              </span>
            )}
            {action.label}
          </Button>
        ) : null,
      )}
    </div>
  );
}
