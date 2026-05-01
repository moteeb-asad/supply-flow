import DataTablePagination from "@/src/components/data-table/pagination/DataTablePagination";
import type { PaginationState } from "../types";

export function DataTablePaginationBar({
  pagination,
  total,
  onPageChange,
}: {
  pagination: PaginationState;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <DataTablePagination
      page={pagination.page}
      pageSize={pagination.pageSize}
      total={total}
      onPageChange={onPageChange}
    />
  );
}
