import { DataTableColumn } from "@/src/components/data-table/types";
import { StatusPill } from "@/src/components/ui/StatusPill";
import { PurchaseOrder } from "../../types";
import { formatAmount } from "@/src/features/purchase-orders/utils/formatters";
import { formatDate } from "@/src/lib/dates";

const paymentMethodLabels: Record<
  PurchaseOrder["payment_method"],
  { label: string; gst: string }
> = {
  cod: { label: "COD", gst: "GST 16%" },
  card: { label: "Card", gst: "GST 5%" },
};

const actionButtonClassName =
  "inline-flex size-8 cursor-not-allowed items-center justify-center rounded-control text-subtle";

export const purchaseOrdersTableColumns: DataTableColumn<PurchaseOrder>[] = [
  {
    key: "po_number",
    header: "PO Number",
    className: "whitespace-nowrap",
    cell: (row) => (
      <span className="font-mono text-[12.5px] font-medium text-primary">
        {row.po_number}
      </span>
    ),
  },
  {
    key: "supplier",
    header: "Supplier",
    className: "whitespace-nowrap",
    cell: (row) => row.supplier_name,
  },
  {
    key: "order_date",
    header: "Order Date",
    className: "whitespace-nowrap text-muted",
    cell: (row) => formatDate(row.order_date),
  },
  {
    key: "expected_delivery_date",
    header: "Expected Delivery",
    className: "whitespace-nowrap",
    cell: (row) => (
      <span
        className={
          row.status === "overdue" ? "font-medium text-danger" : "text-muted"
        }
      >
        {formatDate(row.expected_delivery_date)}
      </span>
    ),
  },
  {
    key: "total_amount",
    header: "Total Amount",
    headerClassName: "text-right",
    className: "text-right font-medium tabular-nums",
    cell: (row) => formatAmount(row.total_amount),
  },
  {
    key: "payment_method",
    header: "Payment",
    className: "whitespace-nowrap",
    cell: (row) => {
      const payment = paymentMethodLabels[row.payment_method];
      return (
        <>
          <p>{payment.label}</p>
          <p className="text-xs text-subtle">{payment.gst}</p>
        </>
      );
    },
  },
  {
    key: "status",
    header: "Status",
    className: "whitespace-nowrap",
    cell: (row) => <StatusPill status={row.status} />,
  },
  {
    key: "actions",
    header: "Actions",
    headerClassName: "text-right",
    className: "text-right",
    // Placeholder menu button; no actions behind it yet.
    cell: (row) => (
      <button
        disabled
        className={actionButtonClassName}
        aria-label={`More actions for ${row.po_number}`}
        type="button"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="5.5" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="12" cy="18.5" r="1.5" />
        </svg>
      </button>
    ),
  },
];
