import { SKUReceivingStatus } from "./domain.types";
import { FilterPeriod } from "@/src/lib/date-range-utils";

export type SKUReceivingFiltersValue = {
  status?: SKUReceivingStatus;
  dateRange?: FilterPeriod;
};

export type SKUReceivingQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: SKUReceivingFiltersValue;
};
