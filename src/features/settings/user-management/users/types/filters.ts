import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type UsersFiltersValue = {
  lastLogin?: FilterPeriod;
  roleIds?: string[];
};
export type Filters = {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: UsersFiltersValue;
};
export type UsersTableQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: UsersFiltersValue;
};
