"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import InventoryMetrics from "../list/InventoryMetrics";
import InventoryTable from "../list/InventoryTable";
import AddInventoryItemDrawer from "@/src/features/inventory/components/create-item/AddInventoryItemDrawer";
import type { InventoryItemFiltersValue } from "../../types/query.types";
import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";

export default function InventoryManagementScreen() {
  const [filters, setFilters] = useState<InventoryItemFiltersValue>({});
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  return (
    <>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] text-3xl font-black leading-tight tracking-tight">
              Inventory Management
            </h2>
            <p className="text-[#4e6797] text-sm">
              Manage and track your warehouse inventory with ease and
              efficiency.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              disabled
              className="opacity-50 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-sm">
                download
              </span>{" "}
              Export CSV
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setIsCreateDrawerOpen(true)}
              type="button"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span role="button">Add Item</span>
            </button>
          </div>
        </div>
      </div>

      <InventoryMetrics />

      <ErrorBoundary>
        <InventoryTable filters={filters} onFiltersChange={setFilters} />
      </ErrorBoundary>

      {isCreateDrawerOpen && (
        <AddInventoryItemDrawer
          open={isCreateDrawerOpen}
          onClose={() => setIsCreateDrawerOpen(false)}
          onSuccess={() => {
            void queryClient.invalidateQueries({
              queryKey: ["inventory-items-table"],
            });
            setIsCreateDrawerOpen(false);
          }}
        />
      )}
    </>
  );
}
