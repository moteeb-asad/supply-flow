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
    <div className="flex items-center gap-3">
      {/* Search Bar */}
      {config.showSearch && (
        <div className="relative w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#4e6797] text-xl">
            search
          </span>
          <input
            type="text"
            placeholder={config.searchPlaceholder || "Search..."}
            className="w-full pl-10 pr-4 py-2 bg-background-light border border-[#e7ebf3] rounded-lg focus:ring-2 focus:ring-primary text-sm"
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
