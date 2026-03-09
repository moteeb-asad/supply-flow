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
import { useUser } from "@/src/providers/UserProvider";

export default function SuppliersScreen({}: SuppliersScreenProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [category, setCategory] = useState<CategoryFilterValue>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useUser();
  const userRole = user?.primaryRole;

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
      <div className="flex justify-between items-center px-8 py-8 space-y-6 ">
        <div className="mb-0">
          <h2 className="text-3xl font-black">Suppliers</h2>
          <p className="text-[#4e6797]  text-sm mt-1">
            Manage and monitor vendor performance
          </p>
        </div>

        {(userRole === "super_admin" || userRole === "operations_manager") && (
          <Button
            className="flex items-center justify-center gap-2 rounded-lg w-auto h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="material-symbols-outlined text-xl">add</span>
            <span>Add Supplier</span>
          </Button>
        )}
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
