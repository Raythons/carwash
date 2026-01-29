"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { WithLoading } from "../ui/WithLoading";
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton";
import { useTranslation } from "react-i18next";
import { cn } from "@/utilities/cn";

const GenericTable = ({
  columns,
  data,
  pagination,
  onPageChange,
  renderActions,
  isLoading,
  isFetching,
  isError,
  error,
  emptyMessage,
  tableContainerClasses = "",
  tableHeaderClasses = "",
  tableRowClasses = "",
  tableCellClasses = "",
  actionButtonClasses = "",
  title = "",
  description = "",
  skeleton: TableSkeleton = <AnimalsTableSkeleton />,
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const { page, pageSize, totalCount, lastPage, hasNextPage, hasPreviousPage } = pagination || {};
  const actualEmptyMessage = emptyMessage || t("common.no_data");

  const computedLastPage = (Number.isFinite(lastPage) && lastPage > 0)
    ? lastPage
    : Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 1)));

  const canGoPrev = (typeof hasPreviousPage === 'boolean') ? hasPreviousPage : page > 1;
  const canGoNext = (typeof hasNextPage === 'boolean') ? hasNextPage : page < computedLastPage;

  const goTo = (targetPage) => {
    if (isFetching) return;
    if (!Number.isFinite(targetPage)) return;
    if (targetPage < 1 || targetPage > computedLastPage) return;
    if (targetPage === page) return;
    onPageChange(targetPage);
  };

  const getVisiblePages = (current, last) => {
    if (last <= 1) return [1];
    if (last <= 4) return Array.from({ length: last }, (_, i) => i + 1);

    let start, end;
    if (current <= 2) {
      start = 1; end = 3;
    } else if (current >= last - 1) {
      start = last - 2; end = last;
    } else {
      start = current - 1; end = current + 1;
    }

    const windowPages = [];
    for (let p = start; p <= end; p++) windowPages.push(p);

    if (!windowPages.includes(last)) {
      return [...windowPages, 'ellipsis', last];
    }
    return windowPages;
  };

  return (
    <div className={`mb-12`} dir={isRTL ? "rtl" : "ltr"}>
      {title && <h2 className={cn("text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2", isRTL ? "text-right" : "text-left")}>{title}</h2>}
      {description && <p className={cn("text-gray-600 dark:text-gray-400 mb-6", isRTL ? "text-right" : "text-left")}>{description}</p>}

      {isError && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-lg my-4 text-center">
          {t("common.error_occurred", { message: error?.message || t("common.unknown_error") })}
        </div>
      )}

      <WithLoading isLoading={isLoading} skeleton={TableSkeleton}>
        <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-sm overflow-hidden border dark:border-zinc-800 mt-6 relative ${tableContainerClasses}`}>
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 z-10 flex items-center justify-center backdrop-blur-sm">
              <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-lg flex items-center gap-3 border dark:border-zinc-700">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
                <span className="text-primary-700 dark:text-zinc-200 font-medium">
                  {t("common.loading_page", { page })}
                </span>
              </div>
            </div>
          )}
          <div className="overflow-x-auto overflow-y-visible">
            <Table className="min-w-full w-max">
              <TableHeader className={tableHeaderClasses}>
                <TableRow>
                  {columns.map((col, index) => !col.hidden && (
                    <TableHead
                      key={col.accessor || `header-${index}`}
                      className={cn(
                        "text-sm font-semibold uppercase tracking-wider dark:text-gray-400",
                        isRTL ? "text-right" : "text-left",
                        col.headerClassName || ""
                      )}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                  {renderActions && (
                    <TableHead className={cn(
                      "text-sm font-semibold uppercase tracking-wider min-w-[120px] dark:text-gray-400",
                      isRTL ? "text-right" : "text-left",
                      tableHeaderClasses
                    )}>
                      {t("common.actions")}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y">
                {data.length > 0 && (
                  data.map((item, rowIndex) => (
                    <TableRow key={item.id || `row-${rowIndex}`} className={cn("dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors", tableRowClasses)}>
                      {columns.map((col, colIndex) => !col.hidden && (
                        <TableCell
                          key={col.accessor || `cell-${colIndex}`}
                          className={cn(
                            "px-4 sm:px-6 py-4 whitespace-nowrap dark:text-gray-300",
                            isRTL ? "text-right" : "text-left",
                            col.cellClassName || tableCellClasses
                          )}
                        >
                          {col.render ? col.render(item) : item[col.accessor]}
                        </TableCell>
                      ))}
                      {renderActions && (
                        <TableCell className={cn(
                          "px-4 sm:px-6 py-4 whitespace-nowrap min-w-[120px]",
                          isRTL ? "text-right" : "text-left",
                          tableCellClasses
                        )}>
                          <div className={cn("flex gap-2", "justify-start")}>
                            {renderActions(item)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {data.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="text-primary-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-5.5l-1-1h-3l-1 1H6a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-primary-900 dark:text-primary-100 mb-2">
                {actualEmptyMessage}
              </h3>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="bg-primary-50 dark:bg-zinc-900 px-4 sm:px-6 py-4 border-t border-primary-200 dark:border-zinc-800 mt-6 rounded-b-lg">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className={cn("text-sm text-primary-700 dark:text-zinc-400", isRTL ? "text-right" : "text-left")}>
              <span className="font-semibold">
                {t("common.current_page", { page })}
              </span>
              <span className="mx-2">|</span>
              <span>
                {t("common.showing_x_of_y", { count: data.length, total: totalCount })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* Previous Button */}
              <Button
                onClick={() => goTo(page - 1)}
                disabled={!canGoPrev || isFetching}
                variant="outline"
                size="sm"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${!canGoPrev || isFetching
                  ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 cursor-not-allowed border dark:border-zinc-700"
                  : "bg-white dark:bg-zinc-800 text-primary-700 dark:text-zinc-300 border border-primary-300 dark:border-zinc-700 hover:bg-primary-50 dark:hover:bg-zinc-700"
                  }`}
              >
                {t("common.previous")}
              </Button>
              {/* Page Numbers with ellipses */}
              <div className="flex items-center gap-2">
                {getVisiblePages(page, computedLastPage).map((token, idx) => {
                  if (token === 'ellipsis') {
                    return (
                      <span key={`e-${idx}`} className="px-2 text-primary-600 select-none">...</span>
                    );
                  }
                  const pageNum = token;
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => goTo(pageNum)}
                      disabled={isFetching || pageNum === page}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${page === pageNum
                        ? "bg-primary-500 text-white shadow-sm"
                        : isFetching
                          ? "bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 cursor-not-allowed border dark:border-zinc-700"
                          : "bg-white dark:bg-zinc-800 text-primary-700 dark:text-zinc-300 border border-primary-300 dark:border-zinc-700 hover:bg-primary-50 dark:hover:bg-zinc-700"
                        }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              {/* Next Button */}
              <Button
                onClick={() => goTo(page + 1)}
                disabled={!canGoNext || isFetching}
                variant="outline"
                size="sm"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${!canGoNext || isFetching
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-primary-700 border border-primary-300 hover:bg-primary-50"
                  }`}
              >
                {t("common.next")}
              </Button>
            </div>
          </div>
        </div>
      </WithLoading>
    </div>
  );
};

export default GenericTable;
