import DataTable from "@/src/components/data-table/core/DataTable";
import { InventoryTableConfig } from "@/src/features/inventory/inventory.table.config";
import { InventoryItem } from "../../types/domain.types";
import {
  InventoryItemQueryParams,
  InventoryItemFiltersValue,
} from "../../types/query.types";

export default function InventoryTable({
  filters,
  onFiltersChange,
  resetPageKey,
}: {
  filters: InventoryItemFiltersValue;
  onFiltersChange: (filters: InventoryItemFiltersValue) => void;
  resetPageKey?: number;
}) {
  return (
    <DataTable<
      InventoryItem,
      InventoryItemQueryParams,
      InventoryItemFiltersValue
    >
      config={InventoryTableConfig}
      filters={filters}
      onFiltersChange={onFiltersChange}
      resetPageKey={resetPageKey}
    />
  );
}
