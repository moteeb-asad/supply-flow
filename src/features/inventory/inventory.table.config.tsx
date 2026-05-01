import type { DataTableConfig } from "@/src/components/data-table/types";
import type { InventoryItem } from "./types/domain.types";
import type { InventoryItemQueryParams } from "./types/query.types";
import { inventoryItemsFetcher } from "./fetchers/inventoryitems.fetcher";
import { StockStatus } from "./types/query.types";
import InventoryTableFilters from "@/src/features/inventory/components/list/InventoryTableFilters";

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
  filters: InventoryTableFilters,
  columns: [
    {
      key: "sku",
      header: "SKU",
      className:
        "px-6 py-4 text-sm font-bold text-primary text-wrap max-w-[100px]",
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
      key: "supplier",
      header: "Supplier",
      className: "px-6 py-4 text-sm text-[#4e6797]",
      cell: (row) => row.primarySupplier,
    },
    {
      key: "stock_level",
      header: "Stock Level",
      className: "px-6 py-4",
      cell: (row) => {
        // Normalize stock value
        const stock =
          typeof row.initialStock === "number" ? row.initialStock : 0;
        // Define thresholds
        let status: StockStatus = "good";
        if (stock <= 20) status = "critical";
        else if (stock <= 50) status = "low";

        const percent = Math.min(100, Math.round((stock / 300) * 100)); // 300 is arbitrary max for bar
        const styles = stockStatusStyles[status];

        return (
          <div className="flex flex-col gap-1.5 w-32">
            <div className="flex justify-between text-[10px] font-bold">
              <span>{stock} Units</span>
              <span className={styles.className}>{styles.label}</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={styles.barClass + " h-full"}
                style={{ width: `${percent}%` }}
              ></div>
            </div>
          </div>
        );
      },
    },
    {
      key: "unit_price",
      header: "Unit Price",
      className: "px-6 py-4 text-sm font-semibold whitespace-nowrap",
      cell: (row) => `$${row.unitPrice}`,
    },
    {
      key: "total_value",
      header: "Total Value",
      className: "px-6 py-4 text-sm font-semibold whitespace-nowrap",
      cell: (row) => `$${(row.unitPrice * row.initialStock).toFixed(2)}`,
    },
    {
      key: "actions",
      header: "Actions",
      className: "px-6 py-4",
      cell: (_row) => (
        <div className="flex justify-end gap-2">
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
