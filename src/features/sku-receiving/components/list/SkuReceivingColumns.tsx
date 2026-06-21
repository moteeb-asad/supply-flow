import { DataTableColumn } from "@/src/components/data-table/types";
import { SkuReceivingItem } from "@/src/features/sku-receiving/types/domain.types";
import { SKUReceivingStatus } from "@/src/features/sku-receiving/types/domain.types";

const skuReceivingStyles: Record<
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
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Supplier Name</span>
      </div>
    ),
  },
  {
    key: "delivery_date",
    header: "Delivery Date",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => "Oct 24, 2023",
  },
  {
    key: "sku_count",
    header: "SKU Count",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => "3",
  },
  {
    key: "qty_ordered",
    header: "Quantity Ordered",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => "850",
  },
  {
    key: "qty_received",
    header: "Quantity Received",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => "810",
  },
  {
    key: "variance",
    header: "Variance",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => (
      <div className="flex items-center gap-1">
        <span className="px-6 py-4 text-sm text-center text-error font-bold">
          -20
        </span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
    cell: (row) => {
      const style =
        skuReceivingStyles[row.status as SKUReceivingStatus] ??
        skuReceivingStyles.pending;
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
