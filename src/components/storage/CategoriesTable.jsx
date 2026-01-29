"use client"
import { useMemo, useCallback, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Edit, Trash2, Plus, Package } from "lucide-react"
import GenericTable from "../common/GenericTable"
import ConfirmDialog from "../common/ConfirmDialog"
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton"
import { useCategories, useDeleteCategory } from "../../hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

export default function CategoriesTable() {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  const { t, i18n } = useTranslation()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [selectedToDelete, setSelectedToDelete] = useState(null)

  // Simple page extraction from URL
  const currentPage = useMemo(() => {
    const pageParam = urlSearchParams.get("page")
    const pageNum = pageParam ? Number.parseInt(pageParam, 10) : 1
    return pageNum > 0 ? pageNum : 1
  }, [urlSearchParams])

  const searchTerm = urlSearchParams.get("search") || ""
  const searchColumn = urlSearchParams.get("searchColumn") || "name"

  // Build parameters for the query
  const listParams = {
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
    ...(searchColumn && searchColumn !== "all" && { searchBy: searchColumn }),
  }

  const { data: categoriesData, isLoading, isError, error, isFetching } = useCategories(listParams)

  // Safely extract data with fallbacks
  const categories = categoriesData?.items ?? []
  const totalCount = categoriesData?.totalCount ?? 0
  const pageSize = categoriesData?.pageSize ?? 15
  const hasNextPage = categoriesData?.hasNextPage ?? false
  const hasPreviousPage = categoriesData?.hasPreviousPage ?? false

  // Calculate last page
  const lastPage = Math.max(1, Math.ceil(totalCount / pageSize))

  const deleteCategory = useDeleteCategory()

  // Simple page change handler
  const handlePageChange = useCallback(
    (newPage) => {
      if (newPage === currentPage || newPage < 1) {
        return
      }
      const newParams = new URLSearchParams(urlSearchParams)
      newParams.set("page", newPage.toString())
      setUrlSearchParams(newParams)
    },
    [currentPage, urlSearchParams, setUrlSearchParams],
  )

  const categoryColumns = useMemo(
    () => [
      {
        header: t("storage.categories.table.category_name"),
        accessor: "name",
        cellClassName: "font-medium text-primary-900",
      },
      {
        header: t("storage.categories.table.description"),
        accessor: "description",
        render: (category) => category.description || t("storage.categories.table.no_description"),
      },
      {
        header: t("storage.categories.table.product_count"),
        accessor: "productCount",
        render: (category) => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span>{category.productCount || 0}</span>
          </div>
        ),
      },
    ],
    [t],
  )

  const renderCategoryActions = useCallback(
    (category) => (
      <div className="flex gap-2 justify-end">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="text-amber-600 border-amber-300 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 bg-transparent"
          title={t("storage.categories.actions.edit")}
        >
          <Link to={`/clinic/storage/categories/edit/${category.id}`}>
            <Edit className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-red-600 border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent"
          title={t("storage.categories.actions.delete")}
          onClick={() => {
            setSelectedToDelete(category)
            setConfirmOpen(true)
          }}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    ),
    [],
  )

  // Pagination props for GenericTable
  const paginationProps = {
    page: currentPage,
    pageSize: pageSize,
    totalCount: totalCount,
    lastPage: lastPage,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
  }

  return (
    <div className="w-full max-w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("storage.categories.title")}</h1>
        <Link
          to="/clinic/storage/categories/add"
          className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 text-base font-medium shadow-md"
        >
          <span>{t("storage.categories.add_category")}</span>
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <GenericTable
        columns={categoryColumns}
        data={categories}
        pagination={paginationProps}
        onPageChange={handlePageChange}
        renderActions={renderCategoryActions}
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
        emptyMessage={t("storage.categories.empty_message")}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("storage.categories.delete_dialog.title")}
        description={
          selectedToDelete ? t("storage.categories.delete_dialog.description", { name: selectedToDelete.name }) : ""
        }
        confirmText={t("storage.categories.delete_dialog.confirm")}
        cancelText={t("storage.categories.delete_dialog.cancel")}
        onConfirm={async () => {
          if (selectedToDelete) {
            try {
              await deleteCategory.mutateAsync(selectedToDelete.id)
              toast.success(t("storage.categories.messages.delete_success"))
              setConfirmOpen(false)
              setSelectedToDelete(null)
            } catch (error) {
              console.error("Error deleting category:", error)
            }
          }
        }}
        isLoading={deleteCategory.isPending}
        variant="destructive"
      />
    </div>
  )
}
