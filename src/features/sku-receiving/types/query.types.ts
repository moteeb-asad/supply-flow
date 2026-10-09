import type { SKUReceivingStatus } from "./domain.types";
import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type SkuReceivingFiltersValue = {
  status?: SKUReceivingStatus;
  dateRange?: FilterPeriod;
};

export type SkuReceivingQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: SkuReceivingFiltersValue;
};

// Raw purchase_orders row as selected for the receiving PO lookup.
export type PurchaseOrderSupplierRow = {
  name: string | null;
};

export type PurchaseOrderRow = {
  id: string;
  po_number: string;
  supplier_id: string;
  expected_delivery_date: string | null;
  status: string;
  suppliers: PurchaseOrderSupplierRow | PurchaseOrderSupplierRow[] | null;
};

// Raw purchase_order_items row as selected when loading a PO for receiving.
export type PurchaseOrderItemSkuRow = {
  sku_code: string;
  name: string;
};

export type PurchaseOrderItemRow = {
  id: string;
  sku_id: string;
  ordered_qty: number | string;
  received_qty: number | string;
  skus: PurchaseOrderItemSkuRow | PurchaseOrderItemSkuRow[] | null;
};

export type PurchaseOrderWithItemsRow = PurchaseOrderRow & {
  purchase_order_items: PurchaseOrderItemRow[] | null;
};

export type PurchaseOrderOption = {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string | null;
  expected_delivery_date: string | null;
  status: string;
};

export type GetReceivablePurchaseOrdersInput = {
  search?: string;
  limit?: number;
  offset?: number;
};

export type GetReceivablePurchaseOrdersResult = {
  items: PurchaseOrderOption[];
  nextOffset: number | null;
};

export type ConfirmSkuReceivingResult =
  | { success: true; receivingId: string }
  | { success: false; error: string };

// ISO timestamps for the start of the user's local day and month.
export type SkuReceivingMetricsInput = {
  dayStart: string;
  monthStart: string;
};

// Row returned by public.get_sku_receiving_metrics().
export type SkuReceivingMetrics = {
  awaiting_receipt_count: number;
  received_today_qty: number;
  variance_cases_mtd: number;
  received_value_mtd: number;
};
