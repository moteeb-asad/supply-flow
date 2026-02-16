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
  totalPages: number;
  from: number;
  to: number;
  total: number;
  itemLabel?: string;
  onPageChange?: (page: number) => void;
}
