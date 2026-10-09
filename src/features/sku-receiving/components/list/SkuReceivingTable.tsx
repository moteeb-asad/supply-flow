import DataTable from "@/src/components/data-table/core/DataTable";
import type {
  SkuReceivingItem,
  SkuReceivingQueryParams,
  SkuReceivingFiltersValue,
  SkuReceivingTableProps,
} from "../../types";
import { skuReceivingTableConfig } from "../../sku-receiving.table.config";

export default function SkuReceivingTable({
  filters,
  onFiltersChange,
}: SkuReceivingTableProps) {
  return (
    <DataTable<
      SkuReceivingItem,
      SkuReceivingQueryParams,
      SkuReceivingFiltersValue
    >
      config={skuReceivingTableConfig}
      refreshKey={JSON.stringify(filters)}
      filters={filters}
      onFiltersChange={onFiltersChange}
    />
  );
}
