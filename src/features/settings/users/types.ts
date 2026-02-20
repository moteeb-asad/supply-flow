export interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TableHeaderProps {
  searchPlaceholder?: string;
  showFilter?: boolean;
  onSearch?: (value: string) => void;
  onFilterClick?: () => void;
}

export interface TablePaginationProps {
  currentPage: number;
  total: number;
  itemsPerPage: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}

export interface TableFiltersProps {
  onClose?: () => void;
  onApply?: () => void;
  onClear?: () => void;
}
