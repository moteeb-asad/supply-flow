export type PurchaseOrderStatus =
  | "draft"
  | "pending"
  | "partially_received"
  | "closed"
  | "cancelled"
  | "overdue";

export type PurchaseOrder = {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string;
  order_date: string | null;
  expected_delivery_date: string | null;
  total_amount: number;
  status: PurchaseOrderStatus;
};

export type PurchaseOrdersQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
};

export type PurchaseOrdersFiltersValue = {
  status?: PurchaseOrderStatus;
  dateRange?: "last_7_days" | "last_30_days" | "this_month" | "this_quarter";
};
