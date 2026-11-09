"use client";

import { useState } from "react";
import InventoryMetrics from "../list/InventoryMetrics";
import InventoryTable from "../list/InventoryTable";
import AddInventoryItemDrawer from "@/src/features/inventory/components/create-item/AddInventoryItemDrawer";
import type { InventoryItemFiltersValue } from "../../types/query.types";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { Button } from "@/src/components/ui/Button";
import { useUser } from "@/src/providers/UserProvider";
import { hasPermission } from "@/src/features/auth/utils/rbac";

export default function InventoryManagementScreen() {
  const [filters, setFilters] = useState<InventoryItemFiltersValue>({});
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  // Bumped after a create so the table returns to page 1 (newest first).
  const [createdCount, setCreatedCount] = useState(0);
  const { user } = useUser();
  const canManageInventory = hasPermission(
    user?.primaryRole,
    "inventory:manage",
  );

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6 pt-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Inventory
          </h1>
          <p className="mt-1 text-sm text-muted">
            Stock on hand for every SKU in the warehouse.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md" disabled>
            <span
              aria-hidden="true"
              className="material-symbols-outlined !text-[18px]"
            >
              download
            </span>
            Export CSV
            <span className="rounded-full border border-line px-1.5 text-[11px] font-normal leading-4">
              Soon
            </span>
          </Button>
          {canManageInventory && (
            <Button size="md" onClick={() => setIsCreateDrawerOpen(true)}>
              <span
                aria-hidden="true"
                className="material-symbols-outlined !text-[18px]"
              >
                add
              </span>
              Add item
            </Button>
          )}
        </div>
      </header>

      <div className="space-y-6 px-8 pb-8">
        <InventoryMetrics />

        <ErrorBoundary>
          <InventoryTable
            filters={filters}
            onFiltersChange={setFilters}
            resetPageKey={createdCount}
          />
        </ErrorBoundary>
      </div>

      {canManageInventory && isCreateDrawerOpen && (
        <AddInventoryItemDrawer
          open={isCreateDrawerOpen}
          onClose={() => setIsCreateDrawerOpen(false)}
          onSuccess={() => setCreatedCount((count) => count + 1)}
        />
      )}
    </>
  );
}
