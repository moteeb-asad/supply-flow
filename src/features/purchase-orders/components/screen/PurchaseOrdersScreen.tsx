"use client";

import { createBrowserSupabaseClient } from "@/src/db/supabaseBrowserClient";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import CreatePurchaseOrderSidebar from "../create-po/CreatePurchaseOrderSidebar";
import PurchaseOrdersMetrics from "@/src/features/purchase-orders/components/list/PurchaseOrdersMetrics";
import PurchaseOrdersStatusTabs from "@/src/features/purchase-orders/components/list/PurchaseOrdersStatusTabs";
import PurchaseOrdersTable from "@/src/features/purchase-orders/components/list/PurchaseOrdersTable";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";

export default function PurchaseOrdersScreen() {
  const [isCreateSidebarOpen, setIsCreateSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<{
    status?: string;
    dateRange?: string;
  }>({});
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("purchase-orders-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "purchase_orders",
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: ["purchase-orders-table"],
          });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, supabase]);

  return (
    <>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] text-3xl font-black leading-tight tracking-tight">
              Purchase Orders
            </h2>
            <p className="text-[#4e6797] text-sm">
              Manage and track your warehouse supply orders
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-white border border-[#d0d7e7] text-[#0e121b] text-sm font-bold cursor-not-allowed opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">
                upload_file
              </span>
              <span>Bulk Upload</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setIsCreateSidebarOpen(true)}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span role="button">Create New PO</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8">
        <PurchaseOrdersStatusTabs
          status={filters.status}
          onStatusChange={(status) => {
            if (filters.status !== status) {
              setFilters((prev) => ({ ...prev, status }));
            }
          }}
        />
      </div>

      <div className="space-y-6">
        <ErrorBoundary>
          <PurchaseOrdersTable filters={filters} onFiltersChange={setFilters} />
        </ErrorBoundary>
      </div>
      <div className="px-8 pb-8">
        <PurchaseOrdersMetrics />
      </div>

      {isCreateSidebarOpen && (
        <CreatePurchaseOrderSidebar
          onClose={() => setIsCreateSidebarOpen(false)}
          onSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: ["purchase-orders-table"],
            });
            setIsCreateSidebarOpen(false);
          }}
        />
      )}
    </>
  );
}
