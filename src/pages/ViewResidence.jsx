"use client"

import { useParams, Link } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Edit, Calendar, Clock, DollarSign, CheckCircle, XCircle, CreditCard, Home } from "lucide-react"
import {
  useResidenceById,
  usePayResidenceDay,
  usePayAllResidenceDays,
  useEndResidence,
} from "../hooks/queries/useResidenceQueries"
import { usePermissions, PERMISSIONS } from "../hooks/usePermissions"
import { toast } from "react-toastify"
import { useState } from "react"
import ConfirmDialog from "../components/common/ConfirmDialog"
import { Input } from "../components/ui/Input"
import { FormField } from "../components/ui/FormField"
import { formatDateEnSA, formatDateLong } from "../utilities/dateTime"
import { formatCurrency } from "../constants/currency"

// Status configuration
const getResidenceStatusConfig = (t) => ({
  1: {
    name: t("residences.status.under_observation"),
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  2: {
    name: t("residences.status.post_surgery"),
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
    icon: Calendar,
  },
  3: {
    name: t("residences.status.moderate"),
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: Clock,
  },
  4: {
    name: t("residences.status.critical"),
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    icon: Clock,
  },
})

// Status Badge Component
function StatusBadge({ status }) {
  const { t } = useTranslation()
  const residenceStatusConfig = getResidenceStatusConfig(t)
  const config = residenceStatusConfig[status] || {
    name: t("residences.status.not_specified"),
    color: "bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400",
    icon: Clock,
  }
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.name}
    </span>
  )
}

// Day Card Component
function ResidenceDayCard({ day, onPayDay }) {
  const { t } = useTranslation()
  return (
    <div
      className={`border rounded-lg p-3 sm:p-4 ${day.payment?.fullyPaid ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700" : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
            {t("residences.days_count", { count: day.dayNumber })}
          </span>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">{formatDateEnSA(day.date)}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {day.payment?.fullyPaid ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-medium">
              <CheckCircle className="w-3 h-3 flex-shrink-0" />
              {t("residences.fully_paid")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full text-xs font-medium">
              <XCircle className="w-3 h-3 flex-shrink-0" />
              {t("examinations.payment.unpaid")}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {t("examinations.payment.required_amount")}:
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
            {formatCurrency(day.payment?.amount || 0)}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {t("examinations.payment.received_amount_label")}:
          </span>
          <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
            {formatCurrency(day.payment?.receivedAmount || 0)}
          </span>
        </div>

        {day.notes && (
          <div className="mt-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">{t("residences.reason_label")}:</span>
            <p className="text-xs sm:text-sm text-gray-800 dark:text-zinc-200 mt-1 p-2 bg-gray-100 dark:bg-zinc-900 rounded break-words">
              {day.notes}
            </p>
          </div>
        )}

        {day.paidAt && (
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>{t("examinations.payment.date_label")}:</span>
            <span>{formatDateEnSA(day.paidAt)}</span>
          </div>
        )}

        {!day.payment?.fullyPaid && (
          <Button
            onClick={() => onPayDay(day.id, day.payment?.amount || 0)}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-xs sm:text-sm"
            size="sm"
          >
            <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
            <span className="truncate">
              {t("residences.pay_now")} {formatCurrency(day.payment?.amount || 0)}
            </span>
          </Button>
        )}
      </div>
    </div>
  )
}

export default function ViewResidence() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()
  const isRtl = i18n.language === "ar"
  const { hasPermission } = usePermissions()
  const [confirmPayDay, setConfirmPayDay] = useState({ open: false, dayId: null, amount: 0 })
  const [confirmPayAll, setConfirmPayAll] = useState(false)
  const [showEndDialog, setShowEndDialog] = useState(false)
  const [endDate, setEndDate] = useState("")

  const { data: residence, isLoading, error } = useResidenceById(id)
  const payDayMutation = usePayResidenceDay()
  const payAllMutation = usePayAllResidenceDays()
  const endResidenceMutation = useEndResidence()
  const handlePayDay = (dayId, amount) => {
    setConfirmPayDay({ open: true, dayId, amount })
  }

  const handlePayDayAction = async () => {
    try {
      await payDayMutation.mutateAsync({
        dayId: confirmPayDay.dayId,
      })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setConfirmPayDay({ open: false, dayId: null, amount: 0 })
    } catch (error) {
      // Error toast is now handled in the hook
    }
  }

  const handlePayAll = async () => {
    try {
      await payAllMutation.mutateAsync({ residenceId: Number.parseInt(id) })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setConfirmPayAll(false)
    } catch (error) {
      // Error toast is now handled in the hook
    }
  }

  const handleEndResidence = async () => {
    if (!endDate) {
      toast.error(t("examinations.validation.date_required_item"))
      return
    }

    try {
      await endResidenceMutation.mutateAsync({ id: Number.parseInt(id), endDate })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setShowEndDialog(false)
      setEndDate("")
    } catch (error) {
      // Error toast is now handled in the hook
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
          <div className="h-64 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !residence) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-8 text-center border dark:border-zinc-800">
            <div className="text-red-500 dark:text-red-400 mb-4">
              <Home className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {t("owners.not_found")}
            </h2>
            <p className="text-gray-600 dark:text-zinc-400 mb-6">{t("owners.not_found_desc")}</p>
            <div className="flex items-center justify-center gap-3">
              <Button asChild variant="outline">
                <Link to="/clinic/residences">
                  <ArrowLeft className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                  {t("residences.back_to_list")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const unpaidDays = residence.residenceDays?.filter((day) => !day.payment?.fullyPaid) || []
  const totalUnpaidAmount = unpaidDays.reduce(
    (sum, day) => sum + ((day.payment?.amount || 0) - (day.payment?.receivedAmount || 0)),
    0,
  )

  // Calculate summary amounts manually
  const totalAmount = residence.residenceDays?.reduce((sum, day) => sum + (day.payment?.amount || 0), 0) || 0
  const paidAmount = residence.residenceDays?.reduce((sum, day) => sum + (day.payment?.receivedAmount || 0), 0) || 0
  const remainingAmount = totalAmount - paidAmount

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col gap-3 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button asChild variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
            <Link to="/clinic/residences">
              <ArrowLeft className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
              <span className="hidden sm:inline">{t("owners.back")}</span>
            </Link>
          </Button>
          <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white break-words min-w-0 flex-1">
            {t("residences.animal_info")} - {residence.animalName}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto sm:self-end">
          {hasPermission(PERMISSIONS.RESIDENCES_EDIT) && !residence.actualEndDate && (
            <Button
              onClick={() => {
                setEndDate(new Date().toISOString().split("T")[0])
                setShowEndDialog(true)
              }}
              className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-600 flex-1 sm:flex-initial text-xs sm:text-sm"
              size="sm"
            >
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
              <span className="truncate">{t("residences.end_residency")}</span>
            </Button>
          )}
          {hasPermission(PERMISSIONS.RESIDENCES_EDIT) && (
            <Button asChild className="flex-1 sm:flex-initial" size="sm">
              <Link to={`/clinic/residences/${id}/edit`} className="text-xs sm:text-sm">
                <Edit className="w-3 h-3 sm:w-4 sm:h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
                {t("owners.edit_tooltip")}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Residence Info */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-zinc-800">
              {t("residences.animal_info")}
            </h2>

            <div className="space-y-3 sm:space-y-4">
              <div className={`${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-blue-50 to-transparent dark:from-blue-900/40 dark:to-transparent p-3 rounded-lg border-s-4 border-blue-500 dark:border-blue-400 min-w-0`}>
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-zinc-400 block mb-1">
                  {t("animals_form.name")}
                </label>
                <p
                  className="text-sm sm:text-base text-gray-900 dark:text-white font-semibold break-words hyphens-auto"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {residence.animalName}
                </p>
              </div>

              <div className={`${isRtl ? "bg-gradient-to-l" : "bg-gradient-to-r"} from-purple-50 to-transparent dark:from-purple-900/40 dark:to-transparent p-3 rounded-lg border-s-4 border-purple-500 dark:border-purple-400 min-w-0`}>
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-zinc-400 block mb-1">
                  {t("appointments.table.owner")}
                </label>
                <p
                  className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-words hyphens-auto"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {residence.ownerName}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-zinc-400 block mb-1">
                  {t("residences.reason_label")}
                </label>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">{residence.reason}</p>
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-zinc-400 block mb-2">
                  {t("residences.status_label")}
                </label>
                <StatusBadge status={residence.status} />
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700">
                  <label className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t("residences.start_date")}
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    {formatDateLong(residence.startDate)}
                  </p>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-700">
                  <label className="text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-400 block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {t("residences.expected_end_date")}
                  </label>
                  <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                    {formatDateLong(residence.expectedEndDate)}
                  </p>
                </div>

                {residence.actualEndDate && (
                  <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-700">
                    <label className="text-xs sm:text-sm font-medium text-red-700 dark:text-red-400 block mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {t("residences.ended_at_label")}
                    </label>
                    <p className="text-sm sm:text-base text-gray-900 dark:text-white font-medium">
                      {formatDateLong(residence.actualEndDate)}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg">
                <label className="text-xs sm:text-sm font-medium text-gray-600 dark:text-zinc-400 block mb-1 flex items-center gap-1">
                  <Home className="w-3 h-3" />
                  {t("sidebar.clinics")}
                </label>
                <p className="text-sm sm:text-base text-gray-900 dark:text-white break-words">
                  {residence.clinicName || t("residences.status.not_specified")}
                </p>
              </div>

              {residence.notes && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                  <label className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 block mb-2">
                    {t("residences.notes_label")}
                  </label>
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed break-words">
                    {residence.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                {t("examinations.payment.title")}
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-zinc-800 rounded">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-zinc-400">
                    {t("residences.total_amount")}:
                  </span>
                  <span className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
                  <span className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">
                    {t("examinations.payment.received_amount_label")}:
                  </span>
                  <span className="text-sm sm:text-base font-bold text-green-700 dark:text-green-400">
                    {formatCurrency(paidAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-700">
                  <span className="text-xs sm:text-sm text-red-700 dark:text-red-400 font-medium">
                    {t("examinations.payment.required_amount")}:
                  </span>
                  <span className="text-sm sm:text-base font-bold text-red-700 dark:text-red-400">
                    {formatCurrency(remainingAmount)}
                  </span>
                </div>
              </div>

              {unpaidDays.length > 0 && (
                <Button
                  onClick={() => setConfirmPayAll(true)}
                  className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 text-xs sm:text-sm shadow-md"
                  disabled={payAllMutation.isPending}
                >
                  <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
                  <span className="truncate">
                    {t("examinations.payment.methods.card")} ({formatCurrency(totalUnpaidAmount)})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Residence Days */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-3 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-2">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              {t("residences.current_days")}
              <span className="text-sm sm:text-base text-gray-500 dark:text-zinc-500">
                ({t("residences.days_count_plural", { count: residence.residenceDays?.length || 0 })})
              </span>
            </h2>

            {residence.residenceDays && residence.residenceDays.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto">
                {residence.residenceDays
                  .sort((a, b) => a.dayNumber - b.dayNumber)
                  .map((day) => (
                    <ResidenceDayCard key={day.id} day={day} onPayDay={handlePayDay} />
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-zinc-500">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-zinc-700" />
                <p>{t("residences.empty_message")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End Residence Dialog */}
      <ConfirmDialog
        open={showEndDialog}
        onOpenChange={(open) => {
          setShowEndDialog(open)
          if (!open) setEndDate("")
        }}
        title={t("residences.end_residency")}
        description={t("residences.new_residency_subtitle")}
        confirmLabel={t("residences.end_residency")}
        confirmVariant="default"
        onConfirm={handleEndResidence}
        isLoading={endResidenceMutation.isPending}
      >
        <div className="py-2">
          <FormField label={t("residences.ended_at_label")} required>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={residence.startDate}
              className="dark:bg-zinc-900 dark:border-zinc-800"
            />
          </FormField>
        </div>
      </ConfirmDialog>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        open={confirmPayDay.open}
        onOpenChange={(open) => setConfirmPayDay({ open, dayId: confirmPayDay.dayId, amount: confirmPayDay.amount })}
        onConfirm={handlePayDayAction}
        title={t("residences.confirm_payment_title")}
        description={t("residences.confirm_payment_desc", { amount: formatCurrency(confirmPayDay.amount) })}
        confirmLabel={t("common.yes")}
        cancelLabel={t("common.no")}
        isLoading={payDayMutation.isPending}
        confirmVariant="default"
      />

      <ConfirmDialog
        open={confirmPayAll}
        onOpenChange={setConfirmPayAll}
        onConfirm={handlePayAll}
        title={t("residences.confirm_payment_title")}
        description={t("residences.confirm_payment_desc", { amount: formatCurrency(totalUnpaidAmount) })}
        confirmLabel={t("common.yes")}
        cancelLabel={t("common.no")}
        isLoading={payAllMutation.isPending}
        confirmVariant="default"
      />
    </div>
  )
}
