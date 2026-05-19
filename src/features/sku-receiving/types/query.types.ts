import { SKUReceivingStatus } from "./domain.types";
import { FilterPeriod } from "@/src/lib/date-range-utils";

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

export type PurchaseOrderOption = {
  id: string;
  po_number: string;
  supplier_id: string;
  supplier_name: string | null;
  expected_delivery_date: string | null;
  status: string;
};

export type GetPurchaseOrderForReceivingInput = {
  search?: string;
  limit?: number;
  offset?: number;
};

export type GetPurchaseOrderForReceivingResult = {
  items: PurchaseOrderOption[];
  nextOffset: number | null;
};
