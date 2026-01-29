"use client"
import { useMemo, useCallback } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Eye, Plus, DollarSign, Package } from "lucide-react"
import GenericSearchComponent from "../common/GenericSearchComponent"
import GenericTable from "../common/GenericTable"
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton"
import { useDeals } from "../../hooks/queries/useStorageQueries"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { useTranslation } from "react-i18next"

export default function DealsTable() {
  const { t, i18n } = useTranslation()
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  // removed edit/delete controls — list is view-only from the table

  const currentPage = useMemo(() => {
    const pageParam = urlSearchParams.get("page")
    const pageNum = pageParam ? Number.parseInt(pageParam, 10) : 1
    return pageNum > 0 ? pageNum : 1
  }, [urlSearchParams])

  const searchTerm = urlSearchParams.get("search") || ""

  const listParams = {
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
  }

  const { data, isLoading, isError, error, isFetching } = useDeals(listParams)
  // deletion handled elsewhere (not available from table)

  const formatDate = useCallback(
    (dateString) => {
      if (!dateString) return t("storage.deals.not_specified")
      const options = { year: "numeric", month: "numeric", day: "numeric" }
      return new Date(dateString).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", options)
    },
    [t, i18n.language],
  )

  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === currentPage || newPage < 1) return
      const newParams = new URLSearchParams(urlSearchParams)
      newParams.set("page", newPage.toString())
      setUrlSearchParams(newParams)
    },
    [currentPage, urlSearchParams, setUrlSearchParams],
  )

  const handleSearchChange = useCallback(
    (searchParams) => {
      const currentSearch = urlSearchParams.get("search") || ""
      const newSearch = searchParams.searchTerm?.trim() || ""
      if (currentSearch === newSearch) return

      const newParams = new URLSearchParams()
      if (newSearch) newParams.set("search", newSearch)
      newParams.set("page", "1")
      setUrlSearchParams(newParams)
    },
    [urlSearchParams, setUrlSearchParams],
  )

  const {
    Items: deals = [],
    Page: responsePage = currentPage,
    PageSize: pageSize = 15,
    TotalAccount: totalAccount = 0,
    LastPage: apiLastPage,
    HasNextPage: hasNextPage = false,
    HasPreviousPage: hasPreviousPage = false,
  } = data || {}

  const lastPage = apiLastPage || Math.max(1, Math.ceil((totalAccount || 0) / (pageSize || 1)))

  const commonPaginationProps = {
    page: currentPage,
    pageSize: pageSize,
    totalCount: totalAccount,
    lastPage: lastPage,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
  }

  const dealColumns = useMemo(
    () => [
      {
        header: t("storage.deals.table.deal_number"),
        accessor: "dealNumber",
        cellClassName: "font-medium text-primary-900 dark:text-white",
        render: (deal) => (
          <Link
            to={`/clinic/storage/deals/${deal.id}`}
            className="text-primary-600 hover:text-primary-800 hover:underline font-medium"
          >
            {deal.dealNumber}
          </Link>
        ),
      },
      {
        header: t("storage.deals.table.supplier"),
        accessor: "supplierName",
      },
      {
        header: t("storage.deals.table.deal_date"),
        accessor: "dealDate",
        render: (deal) => formatDate(deal.dealDate),
      },
      {
        header: t("storage.deals.table.total_cost"),
        accessor: "totalCost",
        render: (deal) => (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span className="font-medium text-green-600 dark:text-green-400">
              {formatNumberWithThousands(deal.totalCost)} {CURRENCY.SHORT_NAME}
            </span>
          </div>
        ),
      },
      {
        header: t("storage.deals.table.item_count"),
        accessor: "itemCount",
        render: (deal) => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span>{deal.itemCount || 0}</span>
          </div>
        ),
      },
    ],
    [formatDate, t],
  )

  const renderDealActions = useCallback(
    (deal) => (
      <div className="flex gap-2 justify-end">
        <Button
          asChild
          variant="outline"
          size="icon"
          title={t("storage.deals.actions.view")}
          className="text-blue-600 border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 bg-transparent"
        >
          <Link to={`/clinic/storage/deals/${deal.id}`}>
            <Eye className="w-5 h-5" />
          </Link>
        </Button>
        {/* edit/delete removed from list view */}
      </div>
    ),
    [],
  )

  return (
    <div className="w-full max-w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("storage.deals.title")}</h1>
        <Link
          to="/clinic/storage/deals/add"
          className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 text-base font-medium shadow-md"
        >
          <span>{t("storage.deals.add_deal")}</span>
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <GenericSearchComponent
        searchColumns={[
          { value: "dealNumber", label: t("storage.deals.table.search_columns.deal_number") },
          { value: "supplier", label: t("storage.deals.table.search_columns.supplier") },
        ]}
        orderByColumns={[
          { value: "date", label: t("storage.deals.table.order_columns.date") },
          { value: "totalCost", label: t("storage.deals.table.order_columns.total_cost") },
        ]}
        onSearchChange={handleSearchChange}
        placeholder={t("storage.deals.search_placeholder")}
        totalLabel={t("storage.deals.total_deals")}
        totalCount={totalAccount}
        isRTL={i18n.language === "ar"}
        defaultSearchTerm={searchTerm}
        defaultSearchColumn="dealNumber"
        defaultOrderBy="date"
        defaultSortOrder="desc"
        debounceMs={300}
      />

      <GenericTable
        columns={dealColumns}
        data={deals}
        pagination={commonPaginationProps}
        onPageChange={handlePageChange}
        renderActions={renderDealActions}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        error={error}
        tableContainerClasses="border-primary-200 dark:border-zinc-800"
        tableHeaderClasses="bg-primary-50 dark:bg-zinc-800/50 text-primary-700 dark:text-zinc-200"
        tableRowClasses="bg-white dark:bg-zinc-900 hover:bg-primary-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
        tableCellClasses="text-primary-700 dark:text-zinc-300"
        actionButtonClasses="text-primary-700 border-primary-300 hover:bg-primary-50 bg-transparent dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-800/30"
        skeleton={<AnimalsTableSkeleton />}
        emptyMessage={t("storage.deals.empty_message")}
      />

      {/* Removed inline edit/delete UI — use the deal detail page or management area for those actions */}
    </div>
  )
}
