"use client";

import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import SkuReceivingMetrics from "../list/SkuReceivingMetrics";
import SkuReceivingTable from "../list/SkuReceivingTable";
import { useState } from "react";
import { SkuReceivingFiltersValue } from "../../types";

export default function SkuReceivingScreen() {
  const [filters, setFilters] = useState<SkuReceivingFiltersValue>({});
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);

  return (
    <>
      <div className="px-8 py-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-[#0e121b] text-3xl font-black leading-tight tracking-tight">
              SKU Receiving
            </h2>
            <p className="text-[#4e6797] text-sm">
              Verify delivered SKUs and update inventory levels across
              facilities.
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
              <span>Bulk Receive Upload</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
              onClick={() => setIsCreateDrawerOpen(true)}
            >
              <span className="material-symbols-outlined">barcode_scanner</span>
              <span role="button">Start Receiving</span>
            </button>
          </div>
        </div>
      </div>
      <div className="px-8 pb-8">
        <SkuReceivingMetrics />
      </div>
      <div className="space-y-6">
        <ErrorBoundary>
          <SkuReceivingTable filters={filters} onFiltersChange={setFilters} />
        </ErrorBoundary>
      </div>
    </>
  );
}
