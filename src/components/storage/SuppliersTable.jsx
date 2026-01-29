"use client"
import { useMemo, useCallback, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Button } from "../ui/Button"
import { Edit, Trash2, Plus, Phone, Mail } from "lucide-react"
import GenericSearchComponent from "../common/GenericSearchComponent"
import GenericTable from "../common/GenericTable"
import ConfirmDialog from "../common/ConfirmDialog"
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton"
import { useSuppliers, useDeleteSupplier } from "../../hooks/queries/useStorageQueries"
import { toast } from "react-toastify"
import { useTranslation } from "react-i18next"

export default function SuppliersTable() {
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

  const listParams = {
    page: currentPage,
    pageSize: 15,
    ...(searchTerm && { searchTerm: searchTerm.trim() }),
  }

  const { data, isLoading, isError, error, isFetching } = useSuppliers(listParams)
  const deleteSupplier = useDeleteSupplier()

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
    Items: suppliers = [],
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

  const supplierColumns = useMemo(
    () => [
      {
        header: t("storage.suppliers.table.supplier_name"),
        accessor: "name",
        cellClassName: "font-medium text-primary-900 dark:text-white",
      },
      {
        header: t("storage.suppliers.table.contact_person"),
        accessor: "contactPerson",
        render: (supplier) => supplier.contactPerson || t("storage.suppliers.table.not_specified"),
      },
      {
        header: t("storage.suppliers.table.phone"),
        accessor: "phoneNumber",
        render: (supplier) => (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span>{supplier.phoneNumber || t("storage.suppliers.table.not_specified")}</span>
          </div>
        ),
      },
      {
        header: t("storage.suppliers.table.email"),
        accessor: "email",
        render: (supplier) => (
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span>{supplier.email || t("storage.suppliers.table.not_specified")}</span>
          </div>
        ),
        hidden: true,
        cellClassName: "hidden lg:table-cell",
      },
      {
        header: t("storage.suppliers.table.status"),
        accessor: "isActive",
        render: (supplier) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              supplier.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-800/50 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-800/50 dark:text-red-200"
            }`}
          >
            {supplier.isActive ? t("storage.suppliers.table.active") : t("storage.suppliers.table.inactive")}
          </span>
        ),
      },
    ],
    [t],
  )

  const renderSupplierActions = useCallback(
    (supplier) => (
      <div className="flex gap-2 justify-end">
        <Button
          asChild
          variant="outline"
          size="icon"
          className="text-amber-600 border-amber-300 dark:border-amber-900 hover:bg-amber-50 dark:hover:bg-amber-950/30 bg-transparent"
          title={t("storage.suppliers.actions.edit")}
        >
          <Link to={`/clinic/storage/suppliers/edit/${supplier.id}`}>
            <Edit className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="text-red-600 border-red-300 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 bg-transparent"
          title={t("storage.suppliers.actions.delete")}
          onClick={() => {
            setSelectedToDelete(supplier)
            setConfirmOpen(true)
          }}
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>
    ),
    [],
  )

  return (
    <div className="w-full max-w-full" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("storage.suppliers.title")}</h1>
        <Link
          to="/clinic/storage/suppliers/add"
          className="bg-primary-500 hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors duration-300 text-base font-medium shadow-md"
        >
          <span>{t("storage.suppliers.add_supplier")}</span>
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      <GenericSearchComponent
        searchColumns={[{ value: "name", label: t("storage.suppliers.table.search_column_name") }]}
        onSearchChange={handleSearchChange}
        placeholder={t("storage.suppliers.search_placeholder")}
        totalLabel={t("storage.suppliers.total_suppliers")}
        totalCount={totalAccount}
        isRTL={i18n.language === "ar"}
        defaultSearchTerm={searchTerm}
        defaultSearchColumn="name"
        debounceMs={300}
      />

      <GenericTable
        columns={supplierColumns}
        data={suppliers}
        pagination={commonPaginationProps}
        onPageChange={handlePageChange}
        renderActions={renderSupplierActions}
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
        emptyMessage={t("storage.suppliers.empty_message")}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("storage.suppliers.delete_dialog.title")}
        description={
          selectedToDelete ? t("storage.suppliers.delete_dialog.description", { name: selectedToDelete.name }) : ""
        }
        confirmText={t("storage.suppliers.delete_dialog.confirm")}
        cancelText={t("storage.suppliers.delete_dialog.cancel")}
        onConfirm={async () => {
          if (selectedToDelete) {
            try {
              await deleteSupplier.mutateAsync(selectedToDelete.id)
              toast.success(t("storage.suppliers.messages.delete_success"))
              setConfirmOpen(false)
              setSelectedToDelete(null)
            } catch (error) {
              console.error("Error deleting supplier:", error)
            }
          }
        }}
        isLoading={deleteSupplier.isPending}
        variant="destructive"
      />
    </div>
  )
}
