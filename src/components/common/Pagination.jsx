import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Reusable Pagination Component
 * 
 * Props:
 * - currentPage: number (1-based)
 * - totalPages: number
 * - totalItems: number
 * - pageSize: number
 * - onPageChange: (newPage: number) => void
 * - onPageSizeChange?: (newPageSize: number) => void
 * - pageSizeOptions?: number[]
 * - itemLabel?: string (e.g. "articles", "records", "orders")
 * - itemLabelNo?: string (Norwegian plural)
 */
const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  pageSize = 25,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  itemLabel = "items",
  itemLabelNo = "artikler",
  className = "",
}) => {
  const { isNo } = useLanguage();

  if (totalItems === 0 && totalPages <= 1) {
    return null;
  }

  const safeCurrentPage = Math.max(1, Math.min(currentPage, Math.max(1, totalPages)));
  const startItem = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endItem = Math.min(safeCurrentPage * pageSize, totalItems);

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, safeCurrentPage - 1);
      let end = Math.min(totalPages - 1, safeCurrentPage + 1);

      if (safeCurrentPage <= 3) {
        start = 2;
        end = 4;
      } else if (safeCurrentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push("ellipsis-1");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("ellipsis-2");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const handlePageClick = (page) => {
    if (typeof page === "number" && page !== safeCurrentPage && page >= 1 && page <= totalPages) {
      onPageChange?.(page);
    }
  };

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200/80 text-xs sm:text-sm text-slate-600 ${className}`}
    >
      {/* Left: Summary and Page Size */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 text-center sm:text-left justify-center sm:justify-start w-full sm:w-auto">
        <span className="font-medium text-slate-700">
          {isNo ? (
            <>
              Viser <span className="font-bold text-slate-900">{startItem}</span>–
              <span className="font-bold text-slate-900">{endItem}</span> av{" "}
              <span className="font-bold text-slate-900">{totalItems}</span> {itemLabelNo}
            </>
          ) : (
            <>
              Showing <span className="font-bold text-slate-900">{startItem}</span>–
              <span className="font-bold text-slate-900">{endItem}</span> of{" "}
              <span className="font-bold text-slate-900">{totalItems}</span> {itemLabel}
            </>
          )}
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="text-slate-500 text-xs font-medium">
              {isNo ? "Per side:" : "Per page:"}
            </span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs font-semibold text-slate-800 shadow-2xs outline-none transition hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 cursor-pointer"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Right: Pagination Controls */}
      <div className="flex items-center gap-1 justify-center w-full sm:w-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => handlePageClick(1)}
          disabled={safeCurrentPage <= 1}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
          title={isNo ? "Første side" : "First page"}
        >
          <ChevronsLeft size={15} />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage - 1)}
          disabled={safeCurrentPage <= 1}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
          title={isNo ? "Forrige side" : "Previous page"}
        >
          <ChevronLeft size={15} />
        </button>

        {/* Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (typeof p === "string") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-slate-400 text-xs font-bold"
                >
                  •••
                </span>
              );
            }

            const isActive = p === safeCurrentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => handlePageClick(p)}
                className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold transition shadow-2xs ${
                  isActive
                    ? "bg-blue-600 text-white border border-blue-600 shadow-sm"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page */}
        <button
          type="button"
          onClick={() => handlePageClick(safeCurrentPage + 1)}
          disabled={safeCurrentPage >= totalPages}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
          title={isNo ? "Neste side" : "Next page"}
        >
          <ChevronRight size={15} />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => handlePageClick(totalPages)}
          disabled={safeCurrentPage >= totalPages}
          className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs"
          title={isNo ? "Siste side" : "Last page"}
        >
          <ChevronsRight size={15} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
