type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

export default function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 border-t border-[#d0d7e7] dark:border-slate-700">
      <p className="text-xs text-[#4e6797] font-medium tracking-wide uppercase">
        Showing {start}-{end} of {total}
      </p>

      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded text-xs font-bold disabled:opacity-50 hover:bg-slate-50 transition-colors"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          Previous
        </button>
        <button
          className="px-3 py-1 bg-white dark:bg-slate-800 border border-[#d0d7e7] dark:border-slate-700 rounded text-xs font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Next
        </button>
      </div>
    </div>
  );
}
