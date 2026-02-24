"use client";

import { TablePaginationProps } from "../types";

export default function TablePagination({
  currentPage,
  total,
  itemsPerPage,
  itemLabel = "items",
  onPageChange,
}: TablePaginationProps) {
  // Calculate pagination values
  const totalPages = Math.ceil(total / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const from = total > 0 ? startIndex + 1 : 0;
  const to = Math.min(endIndex, total);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange?.(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      pages.push(
        <button
          key={i}
          className={
            i === currentPage
              ? "size-8 flex items-center justify-center text-sm font-bold bg-primary text-white rounded"
              : "size-8 flex items-center justify-center text-sm font-medium text-[#4e6797] hover:bg-white border border-transparent hover:border-[#e7ebf3] rounded transition-all"
          }
          onClick={() => onPageChange?.(i)}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="px-6 py-4 bg-gray-50/50 border-t border-[#e7ebf3] flex items-center justify-between">
      <p className="text-sm text-[#4e6797]">
        {"Showing "} <span className="font-medium text-[#0e121b]">{from}</span>{" "}
        to <span className="font-medium text-[#0e121b]">{to}</span> of{" "}
        <span className="font-medium text-[#0e121b]">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <button
          className="p-1 text-[#4e6797] hover:bg-white border border-transparent hover:border-[#e7ebf3] rounded transition-all disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={handlePrevious}
        >
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        {renderPageNumbers()}
        <button
          className="p-1 text-[#4e6797] hover:bg-white border border-transparent hover:border-[#e7ebf3] rounded transition-all"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
    </div>
  );
}
