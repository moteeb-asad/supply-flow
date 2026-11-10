import type {
  PaymentMethod,
  PurchaseOrderStatus,
  PurchaseOrderSupplierRelation,
} from "./domain.types";
import { FilterPeriod } from "@/src/lib/date-range-utils";

export type PurchaseOrdersFiltersValue = {
  status?: PurchaseOrderStatus;
  dateRange?: FilterPeriod;
};

export type PurchaseOrdersQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: PurchaseOrdersFiltersValue;
};

export type PurchaseOrdersFiltersProps = {
  value: PurchaseOrdersFiltersValue;
  onChange: (filters: PurchaseOrdersFiltersValue) => void;
};

export type PurchaseOrderRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  payment_method: PaymentMethod;
  order_date: string | null;
  expected_delivery_date: string | null;
  closed_at: string | null;
  total_amount: number | string | null;
  status: PurchaseOrderStatus;
  suppliers: PurchaseOrderSupplierRelation;
};

export type GetPurchaseOrderSuppliersInput = {
  search?: string;
  limit?: number;
};

export type GetPurchaseOrderSkusInput = {
  search?: string;
  limit?: number;
};

// Row returned by get_purchase_order_metrics (migration 048). numeric comes
// back from PostgREST as a string or number, so callers wrap it in Number().
export type PurchaseOrderMetrics = {
  open_commitment: number | string;
  overdue_count: number;
  completed_this_month: number;
};
