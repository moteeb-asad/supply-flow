import type {
  PaymentMethod,
  PurchaseOrderStatus,
  PurchaseOrdersDateRangeFilter,
  PurchaseOrderSupplierRelation,
} from "./domain.types";

export type PurchaseOrdersQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: Record<string, unknown>;
};

export type PurchaseOrdersFiltersValue = {
  status?: PurchaseOrderStatus;
  dateRange?: PurchaseOrdersDateRangeFilter;
};

export type PurchaseOrdersFiltersProps = {
  value: Record<string, unknown>;
  onChange: (filters: Record<string, unknown>) => void;
};

export type PurchaseOrderRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  payment_method: PaymentMethod;
  order_date: string | null;
  expected_delivery_date: string | null;
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
