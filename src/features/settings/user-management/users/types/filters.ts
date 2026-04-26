import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type UserFiltersValue = {
  lastLogin?: FilterPeriod | string;
  roleIds?: string[];
};
export type Filters = {
  page?: number;
  pageSize?: number;
  search?: string;
  filters?: UserFiltersValue;
};
export type UsersTableQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  filters?: UserFiltersValue;
};
