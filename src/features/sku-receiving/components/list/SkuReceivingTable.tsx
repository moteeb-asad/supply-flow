import DataTable from "@/src/components/data-table/core/DataTable";
import type {
  SkuReceivingItem,
  SkuReceivingQueryParams,
  SkuReceivingFiltersValue,
} from "../../types";
import { skuReceivingTableConfig } from "../../sku-receiving.table.config";

export default function SkuReceivingTable({
  filters,
  onFiltersChange,
}: {
  filters: SkuReceivingFiltersValue;
  onFiltersChange: (filters: SkuReceivingFiltersValue) => void;
}) {
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
