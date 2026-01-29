"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Calendar as CalendarIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toDateOnly } from "@/utilities/date";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/utilities/cn";

const GenericSearchComponent = ({
  searchColumns = [],
  orderByColumns = [],
  onSearchChange,
  placeholder,
  searchByLabel,
  orderByLabel,
  sortOrderLabel,
  noOrderLabel,
  totalLabel,
  totalCount = 0,
  defaultSearchTerm = "",
  defaultSearchColumn = "",
  // Support both naming conventions
  defaultOrderBy = "",
  defaultSortBy = "",
  defaultSortOrder = "asc",
  debounceMs = 300,
  // Date search (disabled by default)
  enableDateSearch = false,
  dateLabel,
  dateKey = "date",
  defaultSearchDate = "",
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [searchBy, setSearchBy] = useState(defaultSearchColumn || "");
  const [sortBy, setSortBy] = useState(defaultOrderBy || defaultSortBy || "");
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchDate, setSearchDate] = useState(""); // yyyy-MM-dd
  const [searchDateOpen, setSearchDateOpen] = useState(false);
  const [searchDateObj, setSearchDateObj] = useState(undefined); // Date

  const isDateSelected = enableDateSearch && (searchBy === dateKey);

  // Fallbacks for localized labels
  const actualPlaceholder = placeholder || t("common.search_placeholder");
  const actualSearchByLabel = searchByLabel || t("common.search_by");
  const actualOrderByLabel = orderByLabel || t("common.order_by");
  const actualSortOrderLabel = sortOrderLabel || t("common.sort_order");
  const actualNoOrderLabel = noOrderLabel || t("common.no_order");
  const actualTotalLabel = totalLabel || t("common.total_results");
  const actualDateLabel = dateLabel || t("common.date");

  // Initialize state from defaults only once
  useEffect(() => {
    setSearchTerm(defaultSearchTerm);
    setSearchBy(defaultSearchColumn || "");
    setSortBy(defaultOrderBy || defaultSortBy || "");
    setSortOrder(defaultSortOrder);
    setSearchDate(defaultSearchDate || "");
    setSearchDateObj(defaultSearchDate ? new Date(defaultSearchDate) : undefined);
    setIsInitialized(true);
  }, []); // Empty dependency array - only run once

  // Only trigger search changes after initialization
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    const timer = setTimeout(() => {
      const normalizedSearchColumn = searchBy === "all" ? "" : searchBy;
      const normalizedOrderBy = sortBy === "none" ? "" : sortBy;
      const payload = {
        // New naming convention (used by most tables)
        searchTerm: isDateSelected ? "" : searchTerm.trim(),
        searchColumn: normalizedSearchColumn,
        orderBy: normalizedOrderBy,
        sortOrder,
        isSearchByDate: isDateSelected,
        searchDate: isDateSelected ? searchDate : "",
        // Legacy naming (for backward compatibility)
        searchBy: normalizedSearchColumn,
        sortBy: normalizedOrderBy,
      };
      onSearchChange(payload);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, searchBy, sortBy, sortOrder, isInitialized, searchDate, isDateSelected]);

  const handleSearchTermChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchByChange = useCallback((value) => {
    setSearchBy(value);
    // Reset date term when leaving/entering date mode
    if (value !== dateKey) {
      setSearchDate("");
      setSearchDateObj(undefined);
      setSearchDateOpen(false);
    }
  }, []);

  const handleSortByChange = useCallback((value) => {
    setSortBy(value === "none" ? "" : value);
  }, []);

  const handleSortOrderChange = useCallback((value) => {
    setSortOrder(value);
  }, []);

  const handleSearchDateChange = useCallback((e) => {
    // not used with popover calendar anymore; keep for safety if ever needed
    setSearchDate(e.target.value);
  }, []);

  const handleCalendarSelect = useCallback((date) => {
    if (date) {
      setSearchDateObj(date);
      setSearchDate(toDateOnly(date));
      setSearchDateOpen(false);
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    // Only clear search term and sorting, preserve selected column
    setSearchTerm("");
    setSearchDate("");
    setSortBy("");
    setSortOrder("asc");
  }, []);

  return (
    <div className={cn("w-full space-y-4 p-2")} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row md:flex-wrap gap-4 items-stretch md:items-end">
        {/* Search Input / Date Picker */}
        <div className="w-full md:flex-[1_1_320px] md:min-w-[280px] flex flex-col space-y-2">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", isRTL ? "text-right" : "text-left")}>
            {isDateSelected ? actualDateLabel : t("common.search_term")}
          </label>
          <div className="relative">
            {isDateSelected ? (
              <Popover open={searchDateOpen} onOpenChange={setSearchDateOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-11 justify-between font-normal border border-gray-300 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm dark:text-zinc-300",
                      isRTL ? "text-right" : "text-left"
                    )}
                  >
                    {searchDateObj ? searchDateObj.toLocaleDateString(isRTL ? "ar-SA" : "en-US") : t("common.select_date")}
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto overflow-hidden p-0" align={isRTL ? "end" : "start"}>
                  <Calendar mode="single" selected={searchDateObj} captionLayout="dropdown" onSelect={handleCalendarSelect} />
                </PopoverContent>
              </Popover>
            ) : (
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchTermChange}
                placeholder={actualPlaceholder}
                className={cn(
                  "w-full h-11 border border-gray-300 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-zinc-900 dark:text-white shadow-sm transition-all duration-200",
                  isRTL ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"
                )}
              />
            )}
            {isDateSelected ? (
              <CalendarIcon className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500", isRTL ? "left-3" : "right-3")} />
            ) : (
              <Search className={cn("absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500", isRTL ? "left-3" : "right-3")} />
            )}
          </div>
        </div>

        {/* Search By Selector */}
        <div className="w-full md:flex-[0_1_200px] md:min-w-[200px] flex flex-col space-y-2 shrink-0">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", isRTL ? "text-right" : "text-left")}>
            {actualSearchByLabel}
          </label>
          <Select value={searchBy} onValueChange={handleSearchByChange}>
            <SelectTrigger className={cn("h-11 border-gray-300 dark:border-zinc-800 rounded-lg shadow-sm bg-white dark:bg-zinc-900 dark:text-zinc-300", isRTL ? "text-right" : "text-left")}>
              <SelectValue placeholder={t("common.select_column")} />
            </SelectTrigger>
            <SelectContent>
              {searchColumns.map((column) => (
                <SelectItem
                  key={column.value}
                  value={column.value}
                  className={isRTL ? "text-right" : "text-left"}
                >
                  {column.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort By Selector */}
        <div className="w-full md:flex-[0_1_200px] md:min-w-[200px] flex flex-col space-y-2 shrink-0">
          <label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", isRTL ? "text-right" : "text-left")}>
            {actualOrderByLabel}
          </label>
          <Select value={sortBy || "none"} onValueChange={handleSortByChange}>
            <SelectTrigger className={cn("h-11 border-gray-300 dark:border-zinc-800 rounded-lg shadow-sm bg-white dark:bg-zinc-900 dark:text-zinc-300", isRTL ? "text-right" : "text-left")}>
              <SelectValue placeholder={t("common.select_order")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none" className={isRTL ? "text-right" : "text-left"}>{actualNoOrderLabel}</SelectItem>
              {orderByColumns.map((column) => (
                <SelectItem
                  key={column.value}
                  value={column.value}
                  className={isRTL ? "text-right" : "text-left"}
                >
                  {column.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort Order Selector - Only show when orderBy is selected */}
        {sortBy && sortBy !== "none" && (
          <div className="w-full md:flex-[0_1_170px] md:min-w-[170px] flex flex-col space-y-2 shrink-0">
            <label className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", isRTL ? "text-right" : "text-left")}>
              {actualSortOrderLabel}
            </label>
            <Select value={sortOrder} onValueChange={handleSortOrderChange}>
              <SelectTrigger className={cn("h-11 border-gray-300 dark:border-zinc-800 rounded-lg shadow-sm bg-white dark:bg-zinc-900 dark:text-zinc-300", isRTL ? "text-right" : "text-left")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc" className={isRTL ? "text-right" : "text-left"}>
                  {t("common.ascending")}
                </SelectItem>
                <SelectItem value="desc" className={isRTL ? "text-right" : "text-left"}>
                  {t("common.descending")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Clear Button */}
        {(searchTerm || searchBy !== "all" || sortBy || sortOrder !== "asc") && (
          <button
            onClick={handleClearSearch}
            className="w-full md:w-auto px-4 py-2 h-11 text-sm font-medium text-gray-600 dark:text-zinc-400 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors duration-200 shrink-0"
          >
            {t("common.clear")}
          </button>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between bg-primary-50 dark:bg-zinc-900 p-3 rounded-lg border border-primary-200 dark:border-zinc-800">
        <div className={cn("text-sm text-primary-700 dark:text-zinc-300 font-semibold", isRTL ? "text-right" : "text-left")}>
          {actualTotalLabel}: <span className="font-bold dark:text-primary-400">{totalCount}</span>
        </div>
      </div>
    </div>
  );
};

export default GenericSearchComponent;
