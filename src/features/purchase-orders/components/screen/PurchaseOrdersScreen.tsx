"use client";

import { useState } from "react";
import CreatePurchaseOrderDrawer from "../create-po/CreatePurchaseOrderDrawer";
import PurchaseOrdersMetrics from "@/src/features/purchase-orders/components/list/PurchaseOrdersMetrics";
import PurchaseOrdersStatusTabs from "@/src/features/purchase-orders/components/list/PurchaseOrdersStatusTabs";
import PurchaseOrdersTable from "@/src/features/purchase-orders/components/list/PurchaseOrdersTable";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { Button } from "@/src/components/ui/Button";
import AppIcon from "@/src/components/ui/AppIcon";
import { useOpenFromQueryParam } from "@/src/hooks/useOpenFromQueryParam";
import { PurchaseOrdersFiltersValue } from "../../types";

export default function PurchaseOrdersScreen() {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useOpenFromQueryParam();
  const [filters, setFilters] = useState<PurchaseOrdersFiltersValue>({});
  // Bumped after a create so the table returns to page 1 (newest first).
  const [createdCount, setCreatedCount] = useState(0);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6 pt-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Purchase orders
          </h1>
          <p className="mt-1 text-sm text-muted">
            Track every order from draft to delivery.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md" disabled>
            <AppIcon name="upload" className="size-4" />
            Bulk upload
            <span className="rounded-full border border-line px-1.5 text-[11px] font-normal leading-4">
              Soon
            </span>
          </Button>
          <Button size="md" onClick={() => setIsCreateDrawerOpen(true)}>
            <span
              aria-hidden="true"
              className="material-symbols-outlined !text-[18px]"
            >
              add
            </span>
            Create purchase order
          </Button>
        </div>
      </header>
      <div className="space-y-6 px-8 pb-8">
        <PurchaseOrdersMetrics />

        <ErrorBoundary>
          <PurchaseOrdersTable
            filters={filters}
            onFiltersChange={setFilters}
            resetPageKey={createdCount}
            tabs={
              <PurchaseOrdersStatusTabs
                status={filters.status}
                onStatusChange={(status) => {
                  if (filters.status !== status) {
                    setFilters((prev) => ({
                      ...prev,
                      status,
                    }));
                  }
                }}
              />
            }
          />
        </ErrorBoundary>
      </div>
      {isCreateDrawerOpen && (
        <CreatePurchaseOrderDrawer
          onClose={() => setIsCreateDrawerOpen(false)}
          onSuccess={() => setCreatedCount((count) => count + 1)}
        />
      )}
    </>
  );
}
