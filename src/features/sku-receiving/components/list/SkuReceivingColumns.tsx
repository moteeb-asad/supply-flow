import { DataTableColumn } from "@/src/components/data-table/types";
import { formatDate } from "@/src/lib/utils";
import { SKU_RECEIVING_STATUS_STYLES } from "../../constants/statuses";
import type { SkuReceivingItem } from "../../types";

const formatQty = (value: number) => Number(value).toLocaleString();

// Accepted qty against what was still outstanding when this delivery arrived;
// negative = short or rejected.
const getVariance = (row: SkuReceivingItem) =>
  Number(row.qty_received) - Number(row.qty_expected);

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
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => (
      <span className="text-sm font-medium">
        {row.supplier_name ?? "Unknown Supplier"}
      </span>
    ),
  },
  {
    key: "receipt_datetime",
    header: "Received On",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => formatDate(row.receipt_datetime),
  },
  {
    key: "sku_count",
    header: "SKU Count",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => row.sku_count,
  },
  {
    key: "qty_expected",
    header: "Quantity Expected",
    className: "px-6 py-4 text-sm text-[#4e6797]",
    cell: (row) => formatQty(row.qty_expected),
  },
  {
    key: "qty_received",
    header: "Quantity Received",
    className: "px-6 py-4 text-sm text-[#4e6797]",
    cell: (row) => formatQty(row.qty_received),
  },
  {
    key: "variance",
    header: "Variance",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => {
      const variance = getVariance(row);
      if (variance === 0) {
        return <span className="font-bold text-[#4e6797]">0</span>;
      }
      return (
        <span
          className={`font-bold ${variance < 0 ? "text-error" : "text-green-700"}`}
        >
          {variance > 0 ? "+" : ""}
          {formatQty(variance)}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => {
      const style =
        SKU_RECEIVING_STATUS_STYLES[row.status] ??
        SKU_RECEIVING_STATUS_STYLES.pending;
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.className}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${style.dotClass}`}></span>
          {style.label}
        </span>
      );
    },
  },
];
