import AppIcon from "@/src/components/ui/AppIcon";

type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  // Plural noun after the count, e.g. "items".
  itemLabel?: string;
};

const pageButtonClassName =
  "inline-flex size-8 cursor-pointer items-center justify-center rounded-control border border-line text-ink hover:bg-background-light disabled:cursor-not-allowed disabled:text-subtle disabled:opacity-50 disabled:hover:bg-transparent";

export default function DataTablePagination({
  page,
  pageSize,
  total,
  onPageChange,
  itemLabel = "results",
}: DataTablePaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  return (
    <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3 text-[13px]">
      <p className="text-muted">
        <span className="tabular-nums text-ink">
          {start}–{end}
        </span>{" "}
        of <span className="tabular-nums text-ink">{total}</span> {itemLabel}
      </p>

      <div className="flex gap-1">
        <button
          aria-label="Previous page"
          className={pageButtonClassName}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <AppIcon name="chevronLeft" className="size-4" />
        </button>
        <button
          aria-label="Next page"
          className={pageButtonClassName}
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <AppIcon name="chevronRight" className="size-4" />
        </button>
      </div>
    </div>
  );
}
