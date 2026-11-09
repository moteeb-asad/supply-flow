import Link from "next/link";
import { DataTableColumn } from "@/src/components/data-table/types";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { formatDate } from "@/src/lib/dates";
import type { SkuReceivingItem } from "../../types";

const formatQty = (value: number) => Number(value).toLocaleString();

// Accepted qty against what was still outstanding when this delivery arrived;
// negative = short or rejected.
const getVariance = (row: SkuReceivingItem) =>
  Number(row.qty_received) - Number(row.qty_expected);

const numberColumn = {
  headerClassName: "text-right",
  className: "text-right tabular-nums",
};

export const skuReceivingTableColumns: DataTableColumn<SkuReceivingItem>[] = [
  {
    key: "po_number",
    header: "PO Number",
    cell: (row) => (
      <Link
        href={`/purchase-orders/${row.purchase_order_id}`}
        className="font-mono text-[12.5px] font-medium text-primary hover:underline"
      >
        {row.po_number}
      </Link>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "whitespace-nowrap",
    cell: (row) => row.supplier_name ?? "Unknown Supplier",
  },
  {
    key: "receipt_datetime",
    header: "Received On",
    className: "whitespace-nowrap text-muted",
    cell: (row) => formatDate(row.receipt_datetime),
  },
  {
    key: "sku_count",
    header: "SKU Count",
    ...numberColumn,
    cell: (row) => row.sku_count,
  },
  {
    key: "qty_expected",
    header: "Quantity Expected",
    ...numberColumn,
    cell: (row) => formatQty(row.qty_expected),
  },
  {
    key: "qty_received",
    header: "Quantity Received",
    ...numberColumn,
    cell: (row) => formatQty(row.qty_received),
  },
  {
    key: "variance",
    header: "Variance",
    ...numberColumn,
    cell: (row) => {
      const variance = getVariance(row);
      if (variance === 0) {
        return <span className="text-subtle">0</span>;
      }
      return (
        <span
          className={`font-medium ${variance < 0 ? "text-danger" : "text-success"}`}
        >
          {/* True minus sign for negatives, as in the design. */}
          {variance > 0 ? "+" : "−"}
          {formatQty(Math.abs(variance))}
        </span>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap",
    cell: (row) => <StatusPill status={row.status} />,
  },
];
