import type { DataTableConfig } from "@/src/components/data-table/types";
import { purchaseOrdersFetcher } from "./fetchers/purchaseorders.fetcher";
import PurchaseOrdersFilters from "@/src/features/purchase-orders/components/list/PurchaseOrdersFilters";
import type {
  PurchaseOrder,
  PurchaseOrdersQueryParams,
  PurchaseOrderStatus,
} from "./types";
import { formatAmount, formatDate } from "./utils/formatters";

const statusStyles: Record<
  PurchaseOrderStatus,
  { label: string; className: string; dotClass: string }
> = {
  closed: {
    label: "Closed",
    className: "bg-green-100 text-green-700",
    dotClass: "bg-green-600",
  },
  overdue: {
    label: "Overdue",
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
  draft: {
    label: "Draft",
    className: "bg-slate-100 text-slate-700",
    dotClass: "bg-slate-500",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-700",
    dotClass: "bg-slate-500",
  },
};

const paymentMethodStyles: Record<
  PurchaseOrder["payment_method"],
  { label: string; gst: string; className: string }
> = {
  cod: {
    label: "COD",
    gst: "GST 16%",
    className: "bg-orange-100 text-orange-700",
  },
  card: {
    label: "Card",
    gst: "GST 5%",
    className: "bg-sky-100 text-sky-700",
  },
};

export const PurchaseOrdersTableConfig: DataTableConfig<
  PurchaseOrder,
  PurchaseOrdersQueryParams
> = {
  fetcher: purchaseOrdersFetcher,
  queryKey: (params) => ["purchase-orders-table", params],
  rowHref: (row) => `/purchase-orders/${row.id}`,
  filters: PurchaseOrdersFilters,
  columns: [
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
          <span className="text-sm font-medium">{row.supplier_name}</span>
        </div>
      ),
    },
    {
      key: "order_date",
      header: "Order Date",
      className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
      cell: (row) => formatDate(row.order_date),
    },
    {
      key: "expected_delivery_date",
      header: "Expected Delivery",
      className: "px-6 py-4 text-sm text-[#4e6797] whitespace-nowrap",
      cell: (row) => {
        const isOverdue = row.status === "overdue";
        return (
          <span className={isOverdue ? "text-red-600 font-medium" : ""}>
            {formatDate(row.expected_delivery_date)}
          </span>
        );
      },
    },
    {
      key: "total_amount",
      header: "Total Amount",
      className: "px-6 py-4 text-sm font-semibold whitespace-nowrap",
      cell: (row) => formatAmount(row.total_amount),
    },
    {
      key: "payment_method",
      header: "Payment",
      className: "px-6 py-4 whitespace-nowrap",
      cell: (row) => {
        const payment = paymentMethodStyles[row.payment_method];
        return (
          <div className="space-y-1">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${payment.className}`}
            >
              {payment.label}
            </span>
            <p className="text-xs text-slate-500">{payment.gst}</p>
          </div>
        );
      },
    },
    {
      key: "status",
      header: "Status",
      className: "px-6 py-4",
      cell: (row) => {
        const style = statusStyles[row.status] ?? statusStyles.draft;
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${style.className}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${style.dotClass}`}
            ></span>
            {style.label}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      className: "px-6 py-4 text-right",
      cell: (row) => (
        <div className="flex justify-end gap-2">
          <button
            disabled
            className="p-1.5 text-[#4e6797] cursor-not-allowed opacity-50 rounded transition-all"
            title="View PDF"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              picture_as_pdf
            </span>
          </button>
          <button
            disabled
            className="p-1.5 text-[#4e6797] cursor-not-allowed opacity-50 rounded transition-all"
            title="Track Delivery"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">
              local_shipping
            </span>
          </button>
        </div>
      ),
    },
  ],
  searchPlaceholder: "Search by PO# or Supplier name...",
};
