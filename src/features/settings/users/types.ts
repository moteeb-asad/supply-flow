export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableHeaderProps {
  searchPlaceholder?: string;
  showFilter?: boolean;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
  isFilterOpen?: boolean;
}

export interface TablePaginationProps {
  currentPage: number;
  total: number;
  itemsPerPage: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}

export interface UserTableFilters {
  roles: string[];
  lastLoginRange: string;
}

export interface TableFiltersProps {
  value: UserTableFilters;
  onChange: (filters: UserTableFilters) => void;
  onClose?: () => void;
  onApply?: (filters: UserTableFilters) => void;
  onClear?: () => void;
}
