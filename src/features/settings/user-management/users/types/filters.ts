import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type UserFilters = {
  lastLogin?: FilterPeriod;
  roleIds?: string[];
};
export type Filters = {
  page?: number;
  itemsPerPage?: number;
  search?: string;
  filters?: UserFilters;
};
export type ValuesProps = UserFilters;
