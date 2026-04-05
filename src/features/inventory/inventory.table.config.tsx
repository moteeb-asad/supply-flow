import type { DataTableConfig } from "@/src/components/data-table/types";

export type StockStatus = "good" | "low" | "critical";

export type InventoryItem = {
  id: string;
  sku: string;
  item_name: string;
  category: string;
  stock_quantity: number;
  stock_status: StockStatus;
  stock_max: number;
  reorder_point: number;
  unit_price: number;
};

export type InventoryQueryParams = {
  search?: string;
  page?: number;
  pageSize?: number;
};

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

async function inventoryFetcher(
  _params: InventoryQueryParams,
): Promise<{ data: InventoryItem[]; total: number }> {
  return { data: [], total: 0 };
}

export const InventoryTableConfig: DataTableConfig<
  InventoryItem,
  InventoryQueryParams
> = {
  fetcher: inventoryFetcher,
  queryKey: (params) => ["inventory-table", params],
  columns: [
    {
      key: "sku",
      header: "SKU",
      className: "px-6 py-4 text-sm font-bold text-primary whitespace-nowrap",
      cell: (row) => row.sku,
    },
    {
      key: "item_name",
      header: "Item Name",
      className: "px-6 py-4 text-sm font-medium",
      cell: (row) => row.item_name,
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
      cell: (row) => {
        const style = stockStatusStyles[row.stock_status];
        const pct = Math.min(
          100,
          Math.round((row.stock_quantity / row.stock_max) * 100),
        );
        return (
          <div className="space-y-1 min-w-[140px]">
            <div className="flex items-center gap-2 text-sm">
              <span>{row.stock_quantity} Units</span>
              <span className={style.className}>{style.label}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-200">
              <div
                className={`h-1.5 rounded-full ${style.barClass}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      key: "reorder_point",
      header: "Reorder Point",
      className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
      cell: (row) => `${row.reorder_point} Units`,
    },
    {
      key: "unit_price",
      header: "Unit Price",
      className: "px-6 py-4 text-sm font-semibold whitespace-nowrap",
      cell: (row) => `$${row.unit_price.toFixed(2)}`,
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
