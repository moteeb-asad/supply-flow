import type { DataTableConfig } from "@/src/components/data-table/types";
import type { InventoryItem } from "./types/domain.types";
import type { InventoryItemQueryParams } from "./types/query.types";
import { inventoryItemsFetcher } from "./fetchers/inventoryitems.fetcher";

type StockStatus = "good" | "low" | "critical";

const stockStatusStyles: Record<
  StockStatus,
  { label: string; className: string; barClass: string }
> = {
  good: {
    label: "Good",
    className: "text-green-600 font-semibold",
    barClass: "bg-green-500",
  },
  low: {
    label: "Low",
    className: "text-orange-500 font-semibold",
    barClass: "bg-orange-400",
  },
  critical: {
    label: "Critical",
    className: "text-red-600 font-semibold",
    barClass: "bg-red-500",
  },
};

export const InventoryTableConfig: DataTableConfig<
  InventoryItem,
  InventoryItemQueryParams
> = {
  fetcher: inventoryItemsFetcher,
  queryKey: (params) => ["inventory-table", params],
  columns: [
    {
      key: "sku",
      header: "SKU",
      className: "px-6 py-4 text-sm font-bold text-primary whitespace-nowrap",
      cell: (row) => row.skuCode,
    },
    {
      key: "item_name",
      header: "Item Name",
      className: "px-6 py-4 text-sm font-medium",
      cell: (row) => row.itemName,
    },
    {
      key: "category",
      header: "Category",
      className: "px-6 py-4 text-sm text-[#4e6797]",
      cell: (row) => row.category,
    },
    {
      key: "stock_level",
      header: "Stock Level",
      className: "px-6 py-4",
      cell: (row) => row.initialStock,
    },
    {
      key: "unit_price",
      header: "Unit Price",
      className: "px-6 py-4 text-sm font-semibold whitespace-nowrap",
      cell: (row) => `$${row.unitPrice.toFixed(2)}`,
    },
    {
      key: "actions",
      header: "Actions",
      className: "px-6 py-4",
      cell: (_row) => (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            Adjust
          </button>
          <button
            type="button"
            className="rounded border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            History
          </button>
        </div>
      ),
    },
  ],
  searchPlaceholder: "Search by SKU or item name...",
};
