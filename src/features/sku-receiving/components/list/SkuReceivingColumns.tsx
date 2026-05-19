import { DataTableColumn } from "@/src/components/data-table/types";
import { SkuReceivingItem } from "@/src/features/sku-receiving/types/domain.types";

export const skuReceivingTableColumns: DataTableColumn<SkuReceivingItem>[] = [
  {
    key: "po_number",
    header: "PO Number",
    className: "px-6 py-4 text-sm font-bold text-primary whitespace-wrap",
    cell: (row) => `#${row.po_number}`,
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "px-6 py-4",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">supplier name</span>
      </div>
    ),
  },
];
