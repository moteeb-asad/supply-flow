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
    void fetchNextPage();
  };

  const list = useMemo(() => suppliers, [suppliers]);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6 pt-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-muted">
            Who you buy from, how fast they deliver and what they need per
            order.
          </p>
        </div>
        <Button size="md" onClick={() => setDrawerOpen(true)}>
          <span
            aria-hidden="true"
            className="material-symbols-outlined !text-[18px]"
          >
            add
          </span>
          Add supplier
        </Button>
      </header>

      <div className="space-y-6 px-8 pb-8">
        <SupplierMetrics />

        <div className="flex flex-wrap items-center justify-between gap-3">
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
