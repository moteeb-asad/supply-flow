import DataTablePagination from "@/src/components/data-table/pagination/DataTablePagination";
import type { PaginationState } from "../types";

export function DataTablePaginationBar({
  pagination,
  total,
  onPageChange,
  itemLabel,
}: {
  pagination: PaginationState;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}) {
  return (
    <DataTablePagination
      page={pagination.page}
      pageSize={pagination.pageSize}
      total={total}
      onPageChange={onPageChange}
      itemLabel={itemLabel}
    />
  );
}
