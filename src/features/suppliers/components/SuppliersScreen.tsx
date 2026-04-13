"use client";

import CategoryFilter from "./dashboard/CategoryFilter";
import SupplierMetrics from "./dashboard/SupplierMetrics";
import SupplierSearch from "./dashboard/SupplierSearch";
import SupplierGrid from "./supplier-grid/SupplierGrid";
import { useMemo, useState } from "react";
import { CreateSupplierDrawer } from "./onboarding/CreateSupplierDrawer";
import type {
  SuppliersScreenProps,
  CategoryFilterValue,
} from "@/src/features/suppliers/types/suppliers.types";
import { useSuppliers } from "@/src/features/suppliers/hooks/useSuppliers";
import SupplierGridSkeleton from "./supplier-grid/SupplierGridSkeleton";
import { Button } from "@/src/components/ui/Button";

export default function SuppliersScreen({}: SuppliersScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState<CategoryFilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { suppliers, fetchNextPage, hasNextPage, isFetching, isLoading } =
    useSuppliers({ category, search: searchTerm });

  const isGridLoading = isLoading || (isFetching && suppliers.length === 0);
  const handleLoadMore = () => {
    if (!hasNextPage || isFetching) {
      return;
    }
    fetchNextPage();
  };

  const list = useMemo(() => suppliers, [suppliers]);

  return (
    <>
      {/* Header */}
      <div className="px-8 py-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] text-3xl font-black leading-tight tracking-tight">
              Suppliers
            </h2>
            <p className="text-[#4e6797] text-sm">
              Manage and monitor vendor performance
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-white shadow-md transition-colors hover:bg-blue-700"
              onClick={() => setDrawerOpen(true)}
            >
              <span className="material-symbols-outlined text-lg">add</span>
              <span>Add Supplier</span>
            </Button>
          </div>
        </div>
      </div>

      <SupplierMetrics />

      <div className="px-8 space-y-6 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SupplierSearch onSearchChange={setSearchTerm} />
          <CategoryFilter value={category} onChange={setCategory} />
        </div>
        {isLoading && suppliers.length === 0 ? (
          <SupplierGridSkeleton />
        ) : (
          <SupplierGrid
            suppliers={list}
            hasMore={Boolean(hasNextPage)}
            isLoading={isGridLoading}
            onLoadMore={handleLoadMore}
          />
        )}
      </div>

      {drawerOpen && (
        <CreateSupplierDrawer onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
