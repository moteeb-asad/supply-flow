import { StockStatus } from "@/src/features/inventory/types/query.types";
import { InventoryItem } from "../../types/domain.types";
import { DataTableColumn } from "@/src/components/data-table/types";
import { useUser } from "@/src/providers/UserProvider";
import { hasPermission } from "@/src/features/auth/utils/rbac";

const stockStatusStyles: Record<
  StockStatus,
  { label: string; textClass: string; barClass: string }
> = {
  good: { label: "Good", textClass: "text-success", barClass: "bg-success" },
  low: { label: "Low", textClass: "text-warning", barClass: "bg-warning" },
  critical: {
    label: "Critical",
    textClass: "text-danger",
    barClass: "bg-danger",
  },
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const formatMoney = (value: number) => currencyFormatter.format(value);

export const inventoryTableColumns: DataTableColumn<InventoryItem>[] = [
  {
    key: "item",
    header: "Item",
    cell: (row) => (
      <>
        <p className="font-medium">{row.itemName}</p>
        <p className="font-mono text-[12.5px] text-muted">{row.skuCode}</p>
      </>
    ),
  },
  {
    key: "category",
    header: "Category",
    className: "text-muted",
    cell: (row) => row.category,
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "text-muted",
    cell: (row) => row.primarySupplier,
  },
  {
    key: "stock_level",
    header: "Stock level",
    cell: (row) => {
      const stock = typeof row.initialStock === "number" ? row.initialStock : 0;
      const styles = stockStatusStyles[row.stockStatus];
      // 300 is an arbitrary full bar, as before.
      const percent = Math.min(100, Math.round((stock / 300) * 100));

      return (
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="h-1.5 w-20 overflow-hidden rounded-full bg-line-soft"
          >
            <span
              className={`block h-full rounded-full ${styles.barClass}`}
              style={{ width: `${percent}%` }}
            />
          </span>
          <span className="tabular-nums">{stock}</span>
          <span className={`text-xs font-medium ${styles.textClass}`}>
            {styles.label}
          </span>
        </div>
      );
    },
  },
  {
    key: "unit_price",
    header: "Unit price",
    headerClassName: "text-right",
    className: "text-right tabular-nums text-muted",
    cell: (row) => formatMoney(row.unitPrice),
  },
  {
    key: "total_value",
    header: "Total value",
    headerClassName: "text-right",
    className: "text-right font-medium tabular-nums",
    cell: (row) => formatMoney(row.unitPrice * row.initialStock),
  },
  {
    key: "actions",
    header: "Actions",
    cell: () => <InventoryRowActions />,
  },
];

const actionClassName =
  "h-8 cursor-pointer rounded-control px-2.5 text-[13px] font-medium text-muted hover:bg-background-light hover:text-ink";

// A component (not inline in cell) so it can read the user's permissions.
function InventoryRowActions() {
  const { user } = useUser();
  const canManageInventory = hasPermission(
    user?.primaryRole,
    "inventory:manage",
  );

  return (
    <div className="flex justify-end gap-1">
      {canManageInventory && (
        <button type="button" className={actionClassName}>
          Adjust
        </button>
      )}
      <button type="button" className={actionClassName}>
        History
      </button>
    </div>
  );
}
