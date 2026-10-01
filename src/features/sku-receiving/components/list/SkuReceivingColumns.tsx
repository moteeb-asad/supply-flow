import { DataTableColumn } from "@/src/components/data-table/types";
import { formatDate } from "@/src/lib/utils";
import type {
  SkuReceivingItem,
  SKUReceivingStatus,
} from "@/src/features/sku-receiving/types/domain.types";

export const skuReceivingStyles: Record<
  SKUReceivingStatus,
  { label: string; className: string; dotClass: string }
> = {
  in_progress: {
    label: "In Progress",
    className: "bg-red-100 text-red-700",
    dotClass: "bg-red-600",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700",
    dotClass: "bg-amber-600",
  },
  partially_received: {
    label: "Partially Received",
    className: "bg-blue-100 text-blue-700",
    dotClass: "bg-blue-600",
  },
  received: {
    label: "Received",
    className: "bg-green-100 text-green-700",
    dotClass: "bg-green-600",
  },
  variance_flagged: {
    label: "Variance Flagged",
    className: "bg-rose-100 text-rose-700",
    dotClass: "bg-rose-600",
  },
  overdue: {
    label: "Overdue",
    className: "bg-slate-100 text-slate-700",
    dotClass: "bg-slate-500",
  },
};

const formatQty = (value: number) => Number(value).toLocaleString();

// Accepted qty against what the receipt's PO lines ordered; negative = short.
const getVariance = (row: SkuReceivingItem) =>
  Number(row.qty_received) - Number(row.qty_ordered);

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
    key: "qty_ordered",
    header: "Quantity Ordered",
    className: "px-6 py-4 text-sm text-[#4e6797]",
    cell: (row) => formatQty(row.qty_ordered),
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
        skuReceivingStyles[row.status] ?? skuReceivingStyles.pending;
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
