"use client";

import { useState } from "react";
import CreatePurchaseOrderDrawer from "../create-po/CreatePurchaseOrderDrawer";
import PurchaseOrdersMetrics from "@/src/features/purchase-orders/components/list/PurchaseOrdersMetrics";
import PurchaseOrdersStatusTabs from "@/src/features/purchase-orders/components/list/PurchaseOrdersStatusTabs";
import PurchaseOrdersTable from "@/src/features/purchase-orders/components/list/PurchaseOrdersTable";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { useOpenFromQueryParam } from "@/src/hooks/useOpenFromQueryParam";
import { PurchaseOrdersFiltersValue } from "../../types";

export default function PurchaseOrdersScreen() {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useOpenFromQueryParam();
  const [filters, setFilters] = useState<PurchaseOrdersFiltersValue>({});
  // Bumped after a create so the table returns to page 1 (newest first).
  const [createdCount, setCreatedCount] = useState(0);

  return (
    <>
      <div className="px-6 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-ink text-3xl font-black leading-tight tracking-tight">
              Purchase Orders
            </h2>
            <p className="text-muted text-sm">
              Manage and track your warehouse supply orders
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-line text-ink text-sm font-bold cursor-not-allowed opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              <span>Bulk Upload</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setIsCreateDrawerOpen(true)}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span role="button">Create New PO</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-6">
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
      </div>
      <div className="space-y-6">
        <ErrorBoundary>
          <PurchaseOrdersTable
            filters={filters}
            onFiltersChange={setFilters}
            resetPageKey={createdCount}
          />
        </ErrorBoundary>
      </div>
      <div className="px-6 pb-6">
        <PurchaseOrdersMetrics />
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
