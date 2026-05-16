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
