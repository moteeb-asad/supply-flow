"use client";

import CategoryFilter from "./dashboard/category-filter";
import SupplierMetrics from "./dashboard/supplier-metrics";
import SupplierSearch from "./dashboard/supplier-search";
import SupplierGrid from "./supplier-grid/supplier-grid";
import { useState } from "react";
import { CreateSupplierDrawer } from "./onboarding/CreateSupplierDrawer";

export default function SuppliersScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

        <button
          className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-primary text-white text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors cursor-pointer"
          onClick={() => setDrawerOpen(true)}
        >
          <span className="material-symbols-outlined text-xl">add</span>
          <span>Add Supplier</span>
        </button>
      </div>

      <SupplierMetrics />

      <div className="px-8 space-y-6 pb-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SupplierSearch />
          <CategoryFilter />
        </div>
        <SupplierGrid />
      </div>

      {drawerOpen && (
        <CreateSupplierDrawer onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
