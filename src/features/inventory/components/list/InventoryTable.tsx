import DataTable from "@/src/components/data-table/core/DataTable";
import { InventoryTableConfig } from "@/src/features/inventory/inventory.table.config";

export default function InventoryTable() {
  return (
    <DataTable
      config={InventoryTableConfig}
      filters={{}}
      onFiltersChange={() => {}}
    />
  );
}
