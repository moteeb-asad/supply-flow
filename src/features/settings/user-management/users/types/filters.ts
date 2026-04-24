import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type UserFiltersValue = {
  lastLogin?: FilterPeriod;
  roleIds?: string[];
};

export type Filters = {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: UserFiltersValue;
};
