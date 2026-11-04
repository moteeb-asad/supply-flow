import SupplierCard from "../supplier-grid/SupplierCard";
import { Button } from "@/src/components/ui/Button";
import type { SupplierGridProps } from "@/src/features/suppliers/types/suppliers.types";

const gridClassName = "grid gap-4 sm:grid-cols-2 xl:grid-cols-4";

export default function SupplierGrid({
  suppliers,
  hasMore,
  isLoading,
  onLoadMore,
}: SupplierGridProps) {
  if (isLoading && suppliers.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-line p-8 text-center text-[13px] text-muted">
        Loading suppliers...
      </p>
    );
  }

  if (suppliers.length === 0) {
    return (
      <p className="rounded-card border border-dashed border-line p-8 text-center text-[13px] text-muted">
        No suppliers found.
      </p>
    );
  }

  return (
    <>
      <ul className={gridClassName}>
        {suppliers.map((supplier) => (
          <li key={supplier.id}>
            <SupplierCard supplier={supplier} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            variant="secondary"
            size="md"
            onClick={onLoadMore}
            loading={isLoading}
            text={isLoading ? "Loading..." : "Load more suppliers"}
          />
        </div>
      )}
    </>
  );
}
