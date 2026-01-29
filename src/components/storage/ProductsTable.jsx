"use client"
import { useMemo, useCallback, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Eye, Edit, Trash2, Plus, Package, AlertCircle } from "lucide-react"
import GenericSearchComponent from "../common/GenericSearchComponent"
import GenericTable from "../common/GenericTable"
import ConfirmDialog from "../common/ConfirmDialog"
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton"
import { useProducts, useDeleteProduct } from "../../hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

export default function ProductsTable() {
  const { t, i18n } = useTranslation()
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedToDelete, setSelectedToDelete] = useState(null)

  const currentPage = useMemo(() => {
    const pageParam = urlSearchParams.get("page")
    const pageNum = pageParam ? Number.parseInt(pageParam, 10) : 1
    return pageNum > 0 ? pageNum : 1
  }, [urlSearchParams])

  const searchTerm = urlSearchParams.get("search") || ""
  const categoryId = urlSearchParams.get("categoryId") || ""

  const listParams = {
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
    ...(categoryId && { categoryId: Number(categoryId) }),
  }

  const { data, isLoading, isError, error, isFetching } = useProducts(listParams)
  const deleteProduct = useDeleteProduct()

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
      if (categoryId) newParams.set("categoryId", categoryId)
      newParams.set("page", "1")
      setUrlSearchParams(newParams)
    },
    [urlSearchParams, setUrlSearchParams, categoryId],
  )

  const {
    Items: products = [],
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

  const productColumns = useMemo(
    () => [
      {
        header: t("storage.products.table.product_name"),
        accessor: "name",
        cellClassName: "font-medium text-primary-900 dark:text-zinc-100",
        render: (product) => (
          <Link
            to={`/clinic/storage/products/${product.id}`}
            className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:underline font-medium"
          >
            {product.name}
          </Link>
        ),
      },
      {
        header: t("storage.products.table.category"),
        accessor: "categoryName",
      },
      {
        header: t("storage.products.table.total_stock"),
        accessor: "totalStock",
        render: (product) => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span
              className={product.totalStock < product.minStockLevel ? "text-red-600 dark:text-red-400 font-medium" : ""}
            >
              {product.totalStock || 0}
            </span>
            {product.totalStock < product.minStockLevel && (
              <AlertCircle
                className="w-4 h-4 text-red-500 dark:text-red-400"
                title={t("storage.products.table.low_stock_warning")}
              />
            )}
          </div>
        ),
      },
      {
        header: t("storage.products.table.status"),
        accessor: "isActive",
        render: (product) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
            }`}
          >
            {product.isActive ? t("storage.products.table.active") : t("storage.products.table.inactive")}
          </span>
        ),
      },
    ],
    [t],
  )

  const renderProductActions = useCallback(
    (product) => (
      <div className="flex gap-2 justify-end">
        <Button 
          asChild 
          variant="outline" 
          size="icon"
          className="text-blue-600 border-blue-300 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/30 bg-transparent"
          title={t("storage.products.actions.view")}
        >
          <Link to={`/clinic/storage/products/${product.id}`}>
            <Eye className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="text-amber-600 border-amber-300 hover:bg-amber-50 bg-transparent dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/30"
          title={t("storage.products.actions.edit")}
        >
          <Link to={`/clinic/storage/products/edit/${product.id}`}>
            <Edit className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30"
          title={t("storage.products.actions.delete")}
          onClick={() => {
            setSelectedToDelete(product)
            setConfirmOpen(true)
          }}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    ),
    [t],
  )

  return (
    <div className="w-full max-w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("storage.products.title")}</h1>
        <Link
          to="/clinic/storage/products/add"
          className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 text-base font-medium shadow-md"
        >
          <span>{t("storage.products.add_product")}</span>
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <GenericSearchComponent
        searchColumns={[
          { value: "name", label: t("storage.products.table.search_columns.name") },
          { value: "category", label: t("storage.products.table.search_columns.category") },
        ]}
        onSearchChange={handleSearchChange}
        placeholder={t("storage.products.search_placeholder")}
        totalLabel={t("storage.products.total_products")}
        totalCount={totalAccount}
        isRTL={i18n.language === "ar"}
        defaultSearchTerm={searchTerm}
        defaultSearchColumn="name"
        debounceMs={300}
      />

      <GenericTable
        columns={productColumns}
        data={products}
        pagination={commonPaginationProps}
        onPageChange={handlePageChange}
        renderActions={renderProductActions}
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
        emptyMessage={t("storage.products.empty_message")}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("storage.products.delete_dialog.title")}
        description={
          selectedToDelete ? t("storage.products.delete_dialog.description", { name: selectedToDelete.name }) : ""
        }
        confirmText={t("storage.products.delete_dialog.confirm")}
        cancelText={t("storage.products.delete_dialog.cancel")}
        onConfirm={async () => {
          if (selectedToDelete) {
            try {
              await deleteProduct.mutateAsync(selectedToDelete.id)
              toast.success(t("storage.products.messages.delete_success"))
              setConfirmOpen(false)
              setSelectedToDelete(null)
            } catch (error) {
              console.error("Error deleting product:", error)
            }
          }
        }}
        isLoading={deleteProduct.isPending}
        variant="destructive"
      />
    </div>
  )
}
