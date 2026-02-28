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
  // Simple pagination logic (replace with real logic as needed)
  const totalPages = Math.ceil(total / pageSize);
  return (
    <div className="px-6 py-4 bg-gray-50/50 border-t border-[#e7ebf3] flex items-center justify-between">
      <p className="text-sm text-[#4e6797]">
        Showing page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="p-1 text-[#4e6797] hover:bg-white border border-transparent hover:border-[#e7ebf3] rounded transition-all disabled:opacity-50"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`size-8 flex items-center justify-center text-sm font-bold rounded ${page === idx + 1 ? "bg-primary text-white" : "text-[#4e6797] bg-white"}`}
            onClick={() => onPageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className="p-1 text-[#4e6797] hover:bg-white border border-transparent hover:border-[#e7ebf3] rounded transition-all"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
