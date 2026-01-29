"use client"

import { useMemo, useCallback, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

import { Button } from "../ui/button"
import { Eye, Edit, Trash2, Phone, CalendarDays, DollarSign, CreditCard, FileText } from "lucide-react"
import GenericSearchComponent from "../common/GenericSearchComponent"
import GenericTable from "../common/GenericTable"
import ConfirmDialog from "../common/ConfirmDialog"
import AnimalType from "@/components/animals/AnimalType"
import {
  useExaminations,
  useMarkExaminationFullyPaid,
  useDeleteExamination,
} from "@/hooks/queries/useExaminationQueries"
import { AddEditExaminationFollowUp } from "./followup/AddEditExaminationFollowUp"
import AnimalsTableSkeleton from "../Skeletons/animals/AnimalsTableSkeleton"
import { calculateAgeFromDOB } from "@/utilities/date"
import { formatNumberWithThousands } from "@/utilities/number"
import { CURRENCY } from "@/constants/currency"
import { toast } from "react-toastify"
import { cn } from "@/lib/utils"

export default function AnimalsExaminationsTable() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === "ar"
  const [urlSearchParams, setUrlSearchParams] = useSearchParams()
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false)
  const [selectedExaminationForFollowUp, setSelectedExaminationForFollowUp] = useState(null)
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
  const orderBy = urlSearchParams.get("orderBy") || ""
  const orderDir = urlSearchParams.get("orderDir") || "asc"

  // Build the params object for the query
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      pageSize: 15,
    }
    if (searchTerm) params.searchTerm = searchTerm
    if (searchColumn && searchColumn !== "all") params.searchBy = searchColumn
    if (orderBy) {
      params.orderBy = orderBy
      params.orderDir = orderDir
    }
    return params
  }, [currentPage, searchTerm, searchColumn, orderBy, orderDir])

  // Use the centralized hook for data fetching
  const { data: response, isLoading, isError, error, isFetching } = useExaminations(queryParams)

  // Hook for marking examination as fully paid
  const markFullyPaidMutation = useMarkExaminationFullyPaid()

  // Hook for deleting examination
  const deleteExaminationMutation = useDeleteExamination()

  const formatDate = useCallback(
    (dateString) => {
      if (!dateString) return t("examinations.basic.not_specified")
      const options = { year: "numeric", month: "numeric", day: "numeric" }
      return new Date(dateString).toLocaleDateString(i18n.language === "ar" ? "ar-EG" : "en-US", options)
    },
    [i18n.language, t],
  )

  const getFormattedAppointmentDate = useCallback(
    (dateString) => {
      if (!dateString) return ""
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const appointmentDate = new Date(dateString)
      appointmentDate.setHours(0, 0, 0, 0)
      const diffTime = appointmentDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return t("common.today")
      if (diffDays === 1) return t("common.tomorrow")
      if (diffDays === -1) return t("common.yesterday")
      if (diffDays < 0) return t("common.days_ago", { count: Math.abs(diffDays) })
      return t("common.days_remaining", { count: diffDays })
    },
    [t],
  )

  // Delete handlers
  const handleDeleteConfirm = async () => {
    if (selectedToDelete) {
      try {
        await deleteExaminationMutation.mutateAsync(selectedToDelete.id)
        toast.success(t("examinations.list.delete_success"))
        setConfirmOpen(false)
        setSelectedToDelete(null)
      } catch (error) {
        console.error("Delete failed:", error)
      }
    }
  }

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

  // FIXED: Only reset to page 1 when search actually changes, not on every render
  const handleSearchChange = useCallback(
    (searchParams) => {
      const currentSearch = urlSearchParams.get("search") || ""
      const currentSearchColumn = urlSearchParams.get("searchColumn") || ""
      const currentOrderBy = urlSearchParams.get("orderBy") || ""
      const currentOrderDir = urlSearchParams.get("orderDir") || "asc"

      const newSearch = searchParams.searchTerm?.trim() || ""
      const newSearchColumn = searchParams.searchColumn || ""
      const newOrderBy = searchParams.orderBy || ""
      const newOrderDir = searchParams.sortOrder || "asc"

      if (
        currentSearch === newSearch &&
        currentSearchColumn === newSearchColumn &&
        currentOrderBy === newOrderBy &&
        currentOrderDir === newOrderDir
      ) {
        return
      }

      const newParams = new URLSearchParams()
      if (newSearch) {
        newParams.set("search", newSearch)
      }
      if (newSearchColumn && newSearchColumn !== "all") {
        newParams.set("searchColumn", newSearchColumn)
      }
      if (newOrderBy) {
        newParams.set("orderBy", newOrderBy)
        newParams.set("orderDir", newOrderDir)
      }
      newParams.set("page", "1")
      setUrlSearchParams(newParams)
    },
    [urlSearchParams, setUrlSearchParams],
  )

  const { items, pagination } = useMemo(() => {
    let responseData
    if (Array.isArray(response)) {
      responseData = { items: response }
    } else if (response && (response.items || response.Items)) {
      responseData = response
    } else if (response?.data) {
      responseData = response.data
    } else {
      responseData = {}
    }
    const rawItems = responseData.items ?? responseData.Items ?? []
    const transformed = rawItems.map((item) => ({
      id: item.id,
      animalId: item.animalId,
      name: item.animalName || item.name,
      type: item.animalType || item.type,
      breed: item.animalBreed || item.breed,
      addedDate: item.date || item.examinationDate,
      nextAppointment: item.followUpDate,
      owner: item.ownerName || item.owner,
      phone: item.ownerPhone || item.phone,
      age: item.animalDateOfBirth ? calculateAgeFromDOB(item.animalDateOfBirth) : t("examinations.basic.not_specified"),
      payment: item.payment || null,
      totalAmount: item.payment?.amount || 0,
      receivedAmount: item.payment?.receivedAmount || 0,
      remainingAmount:
        item.payment?.remainingAmount || Math.max(0, (item.payment?.amount || 0) - (item.payment?.receivedAmount || 0)),
      isFullyPaid:
        item.payment?.isFullyPaid ?? (item.payment ? item.payment.receivedAmount >= item.payment.amount : false),
    }))

    const totalCount =
      responseData.totalCount ??
      responseData.TotalCount ??
      responseData.TotalAccount ??
      (Array.isArray(rawItems) ? rawItems.length : 0)
    const pageSize = responseData.pageSize ?? responseData.PageSize ?? 15
    const page = responseData.page ?? responseData.Page ?? currentPage
    const computedLastPage = Math.max(1, Math.ceil((totalCount || 0) / (pageSize || 15)))
    const lastPage = responseData.lastPage ?? responseData.LastPage ?? computedLastPage
    const hasNextPage = responseData.hasNextPage ?? responseData.HasNextPage
    const hasPreviousPage = responseData.hasPreviousPage ?? responseData.HasPreviousPage

    const paginationData = {
      page,
      pageSize,
      totalCount,
      lastPage,
      hasNextPage: typeof hasNextPage === "boolean" ? hasNextPage : page < lastPage,
      hasPreviousPage: typeof hasPreviousPage === "boolean" ? hasPreviousPage : page > 1,
    }

    return { items: transformed, pagination: paginationData }
  }, [response, currentPage, t])

  const animalColumns = useMemo(
    () => [
      {
        header: t("examinations.list.animal_name"),
        accessor: "name",
        cellClassName: "font-medium text-primary-900 dark:text-zinc-100",
      },
      {
        header: t("examinations.list.animal_type"),
        accessor: "type",
        render: (animal) => <AnimalType type={animal.type} />,
      },
      {
        header: t("examinations.list.animal_breed"),
        accessor: "breed",
      },
      {
        header: t("examinations.list.owner"),
        accessor: "owner",
      },
      {
        header: t("examinations.list.phone"),
        accessor: "phone",
        render: (animal) => (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span>{animal.phone}</span>
          </div>
        ),
      },
      {
        header: t("examinations.list.date"),
        accessor: "addedDate",
        render: (animal) => formatDate(animal.addedDate),
        hidden: true,
        cellClassName: "hidden md:table-cell",
      },
      {
        header: t("examinations.list.follow_up_date"),
        accessor: "nextAppointment",
        render: (animal) => (
          <div className="flex items-center gap-2">
            <CalendarDays className={cn("text-primary-500 dark:text-primary-400", isRTL ? "ml-2" : "mr-2")} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-1">
              <span className="font-medium text-secondary-700 dark:text-zinc-300">
                {formatDate(animal.nextAppointment)}
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {`( ${getFormattedAppointmentDate(animal.nextAppointment)} )`}
              </span>
            </div>
          </div>
        ),
      },
      {
        header: t("examinations.list.remaining_amount"),
        accessor: "remainingAmount",
        render: (animal) => (
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
            <span
              className={`font-medium ${
                animal.remainingAmount > 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              }`}
            >
              {formatNumberWithThousands(animal.remainingAmount)} {CURRENCY.SHORT_NAME}
            </span>
          </div>
        ),
      },
      {
        header: t("examinations.list.payment_status"),
        accessor: "paymentStatus",
        render: (animal) => (
          <div className="flex items-center justify-center">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                animal.isFullyPaid
                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                  : animal.receivedAmount > 0
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              }`}
            >
              {animal.isFullyPaid ? t("examinations.payment.fully_paid") : t("examinations.payment.exists")}
            </span>
          </div>
        ),
      },
    ],
    [formatDate, isRTL, t, getFormattedAppointmentDate],
  )

  const renderAnimalActions = useCallback(
    (animal) => (
      <>
        <Button asChild variant="outline" size="icon" title={t("examinations.list.details_tooltip")}>
          <Link to={`/clinic/animals/${animal.animalId}/examinations/${animal.id}`}>
            <Eye className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="text-amber-600 border-amber-300 hover:bg-amber-50 bg-transparent dark:text-amber-400 dark:border-amber-700 dark:hover:bg-amber-900/30"
          title={t("examinations.list.edit_tooltip")}
        >
          <Link to={`/clinic/animals/${animal.animalId}/examinations/edit/${animal.id}`}>
            <Edit className="w-5 h-5" />
          </Link>
        </Button>
        {!animal.isFullyPaid && animal.payment && (
          <Button
            variant="outline"
            size="icon"
            className="text-green-600 border-green-300 hover:bg-green-50 bg-transparent dark:text-green-400 dark:border-green-700 dark:hover:bg-green-900/30"
            title={t("examinations.list.pay_full_tooltip")}
            disabled={markFullyPaidMutation.isPending}
            onClick={() => {
              markFullyPaidMutation.mutate(animal.id, {
                onSuccess: () => {
                  toast.success(t("common.success"))
                },
                onError: (error) => {
                  console.error("Mark fully paid error:", error)
                },
              })
            }}
          >
            <CreditCard className="w-5 h-5" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="text-blue-600 border-blue-300 hover:bg-blue-50 bg-transparent dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-900/30 px-3 py-2 min-w-[40px] h-10"
          title={t("examinations.list.add_followup_tooltip")}
          onClick={() => {
            setSelectedExaminationForFollowUp(animal)
            setShowFollowUpDialog(true)
          }}
        >
          <FileText className="w-5 h-5" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-300 hover:bg-red-50 bg-transparent dark:text-red-400 dark:border-red-700 dark:hover:bg-red-900/30 px-3 py-2 min-w-[40px] h-10"
          title={t("examinations.list.delete_tooltip")}
          onClick={() => {
            setSelectedToDelete(animal)
            setConfirmOpen(true)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </>
    ),
    [markFullyPaidMutation, t],
  )

  return (
    <div className="w-full max-w-full dark:bg-zinc-900" dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("examinations.list.title")}</h1>
      </div>

      <GenericSearchComponent
        searchColumns={[
          { value: "name", label: t("examinations.list.animal_name") },
          { value: "breed", label: t("examinations.list.animal_breed") },
          { value: "owner", label: t("examinations.list.owner") },
        ]}
        orderByColumns={[
          { value: "date", label: t("examinations.list.date") },
          { value: "createdat", label: t("common.date") },
        ]}
        onSearchChange={handleSearchChange}
        placeholder={t("examinations.list.search_placeholder")}
        totalLabel={t("examinations.list.total_label")}
        totalCount={pagination.totalCount}
        isRTL={isRTL}
        defaultSearchTerm={searchTerm}
        defaultSearchColumn={searchColumn}
        defaultOrderBy={orderBy}
        defaultSortOrder={orderDir}
        debounceMs={300}
      />

      <GenericTable
        columns={animalColumns}
        data={items}
        pagination={pagination}
        onPageChange={handlePageChange}
        renderActions={renderAnimalActions}
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
        emptyMessage={t("common.no_data")}
      />

      {selectedExaminationForFollowUp && (
        <AddEditExaminationFollowUp
          isOpen={showFollowUpDialog}
          onClose={() => {
            setShowFollowUpDialog(false)
            setSelectedExaminationForFollowUp(null)
          }}
          examinationId={selectedExaminationForFollowUp.id}
          followUp={null}
          isEdit={false}
          examinationData={selectedExaminationForFollowUp}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={t("examinations.list.delete_confirm_title")}
        description={
          selectedToDelete ? t("examinations.list.delete_confirm_desc", { name: selectedToDelete.name }) : ""
        }
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteExaminationMutation.isPending}
        variant="destructive"
      />
    </div>
  )
}
