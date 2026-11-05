"use client";

import { ErrorBoundary } from "@/src/components/ui/ErrorBoundary";
import { Button } from "@/src/components/ui/Button";
import { useOpenFromQueryParam } from "@/src/hooks/useOpenFromQueryParam";
import SkuReceivingMetrics from "../list/SkuReceivingMetrics";
import SkuReceivingTable from "../list/SkuReceivingTable";
import { useState } from "react";
import type { SkuReceivingFiltersValue } from "../../types";
import SkuReceivingCreateDrawer from "../create-receiving/CreateReceivingDrawer";

export default function SkuReceivingScreen() {
  const [filters, setFilters] = useState<SkuReceivingFiltersValue>({});
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useOpenFromQueryParam();
  // Bumped after a receipt so the table returns to page 1 (newest first).
  const [createdCount, setCreatedCount] = useState(0);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6 pt-8">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-[-0.01em]">
            SKU receiving
          </h1>
          <p className="mt-1 text-sm text-muted">
            Check deliveries against their purchase order and update stock.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="md" disabled>
            <span
              aria-hidden="true"
              className="material-symbols-outlined !text-[18px]"
            >
              upload_file
            </span>
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
              barcode_scanner
            </span>
            Start receiving
          </Button>
        </div>
      </header>

      <div className="space-y-6 px-8 pb-8">
        <SkuReceivingMetrics />
        <ErrorBoundary>
          <SkuReceivingTable
            filters={filters}
            onFiltersChange={setFilters}
            resetPageKey={createdCount}
          />
        </ErrorBoundary>
      </div>

      {isCreateDrawerOpen && (
        <SkuReceivingCreateDrawer
          onClose={() => setIsCreateDrawerOpen(false)}
          onSuccess={() => {
            setCreatedCount((count) => count + 1);
            setIsCreateDrawerOpen(false);
          }}
        />
      )}
    </>
  );
}
