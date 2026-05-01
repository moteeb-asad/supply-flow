import type { FilterPeriod } from "@/src/lib/date-range-utils";

export type Filters = {
  lastLogin?: FilterPeriod | string;
  roleIds?: string[];
  status?: string;
  dateRange?: string;
};

export type DataTableFiltersProps = {
  filtersOpen: boolean;
  setFiltersOpen: (open: boolean) => void;
  config: {
    filters?: React.ComponentType<{
      values: Filters;
      onChange: (filters: Filters) => void;
    }>;
  };
  values: Filters;
  onChange: (filters: Filters) => void;
  onApply?: () => void;
  onClear?: () => void;
};

export type DataTableConfig<T, P = unknown> = {
  fetcher: (params: P) => Promise<{ data: T[]; total: number }>;
  queryKey?: (params: P) => readonly unknown[];
  columns: DataTableColumn<T>[];
  rowHref?: (row: T) => string;
  filters?: React.ComponentType<{
    values: Filters;
    onChange: (filters: Filters) => void;
  }>;
  searchPlaceholder?: string;
};

export type DataTableColumn<T> = {
  key: string;
  header: React.ReactNode;
  className?: string;
  cell: (row: T) => React.ReactNode;
};

export type PaginationState = {
  page: number;
  pageSize: number;
};

export type DataTableProps<
  T extends { id: string | number },
  P = unknown,
  TFilters = unknown,
> = {
  config: DataTableConfig<T, P>;
  refreshKey?: string | number;
  onRowClick?: (row: T, event: React.MouseEvent) => void;

  filters: TFilters;
  onFiltersChange: (filters: TFilters) => void;
};

export type DataTableSearchProps = {
  value: string;
  applySearch: (value: string) => void;
  placeholder?: string;
};

export type DataTableSkeletonProps = {
  type?: "loading" | "search";
};
