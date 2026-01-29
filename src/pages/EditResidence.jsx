"use client"

import { useParams, Link, useNavigate } from "react-router-dom"
import { useQueryClient } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Save, Calendar, CalendarIcon, Plus, Edit2, Trash2, Home } from "lucide-react"
import {
  useResidenceById,
  useUpdateResidence,
  useAddResidenceDay,
  useUpdateResidenceDay,
  useDeleteResidenceDay,
  usePayResidenceDay,
} from "../hooks/queries/useResidenceQueries"
import { FormField } from "../components/ui/FormField"
import { Input } from "../components/ui/Input"
import { Textarea } from "../components/ui/Textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/Select"
import { Calendar as CalendarComponent } from "../components/ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/Popover"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ar, enUS } from "date-fns/locale"
import ConfirmDialog from "../components/common/ConfirmDialog"
import { formatCurrency } from "@/constants/currency"
import { formatNumberWithThousands } from "@/utilities/number"
import { toDateOnly } from "@/utilities/date"

// Status options
const getResidenceStatusOptions = (t) => [
  {
    value: 1,
    label: t("residences.status.under_observation"),
    description: t("residences.status.observation_desc"),
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    value: 2,
    label: t("residences.status.post_surgery"),
    description: t("residences.status.post_surgery_desc"),
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    value: 3,
    label: t("residences.status.moderate"),
    description: t("residences.status.moderate_desc"),
    color: "text-yellow-600 dark:text-yellow-400",
  },
  {
    value: 4,
    label: t("residences.status.critical"),
    description: t("residences.status.critical_desc"),
    color: "text-red-600 dark:text-red-400",
  },
]

// Helper function to get status info
const getStatusInfo = (statusValue, t) => {
  const options = getResidenceStatusOptions(t)
  return options.find((option) => option.value === statusValue) || options[0]
}

// Helper function to get status badge classes
const getStatusBadgeClasses = (statusValue) => {
  const baseClasses = "px-3 py-1 rounded-full text-xs font-medium"

  switch (statusValue) {
    case 1: // تحت الملاحظة
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400`
    case 2: // عملية تحت الملاحظة
      return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400`
    case 3: // تحت الملاحظة وسط
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
    case 4: // عناية مركزة
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-zinc-400`
  }
}

export default function EditResidence() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { t, i18n } = useTranslation()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const dateLocale = i18n.language === "ar" ? ar : enUS
  const isRtl = i18n.language === "ar"
  const RESIDENCE_STATUS_OPTIONS = getResidenceStatusOptions(t)

  // Date picker states
  const [startDateOpen, setStartDateOpen] = useState(false)
  const [expectedDateOpen, setExpectedDateOpen] = useState(false)
  const [actualDateOpen, setActualDateOpen] = useState(false)

  // Day management states
  const [showAddDay, setShowAddDay] = useState(false)
  const [newDayData, setNewDayData] = useState({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
  const [newDayAmountInput, setNewDayAmountInput] = useState("")
  const [newDayReceivedInput, setNewDayReceivedInput] = useState("")
  const [newDayDateOpen, setNewDayDateOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, dayId: null })
  const [payConfirm, setPayConfirm] = useState({ open: false, dayId: null, amount: 0 })
  const [editingDay, setEditingDay] = useState(null)
  const [editDayData, setEditDayData] = useState({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
  const [editDayAmountInput, setEditDayAmountInput] = useState("")
  const [editDayReceivedInput, setEditDayReceivedInput] = useState("")
  const [editDayDateOpen, setEditDayDateOpen] = useState(false)

  // Form data state
  const [formData, setFormData] = useState({
    reason: "",
    status: "",
    startDate: new Date(),
    expectedEndDate: null,
    actualEndDate: null,
    notes: "",
  })

  const { data: residence, isLoading, error } = useResidenceById(id)
  const updateResidenceMutation = useUpdateResidence()
  const addDayMutation = useAddResidenceDay()
  const updateDayMutation = useUpdateResidenceDay()
  const deleteDayMutation = useDeleteResidenceDay()
  const payDayMutation = usePayResidenceDay()

  // Debug: Log residence data
  useEffect(() => {
    if (residence) {
      console.log("EditResidence - Residence data:", residence)
      console.log("EditResidence - Residence days:", residence.residenceDays)
      console.log("EditResidence - Days length:", residence.residenceDays?.length)
    }
  }, [residence])

  // Reset form when residence data is loaded
  useEffect(() => {
    if (residence) {
      setFormData({
        reason: residence.reason || "",
        status: residence.status?.toString() || "1",
        startDate: residence.startDate ? new Date(residence.startDate) : new Date(),
        expectedEndDate: residence.expectedEndDate ? new Date(residence.expectedEndDate) : null,
        actualEndDate: residence.actualEndDate ? new Date(residence.actualEndDate) : null,
        notes: residence.notes || "",
      })
    }
  }, [residence])

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle date changes
  const handleDateChange = (field) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.reason || !formData.status) {
      toast.error(t("examinations.validation.required_fields"))
      return
    }

    setIsSubmitting(true)
    try {
      const updateData = {
        id: Number.parseInt(id),
        reason: formData.reason,
        status: Number.parseInt(formData.status),
        startDate: toDateOnly(formData.startDate),
        expectedEndDate: toDateOnly(formData.expectedEndDate),
        actualEndDate: toDateOnly(formData.actualEndDate),
        notes: formData.notes || null,
      }

      await updateResidenceMutation.mutateAsync({
        id: Number.parseInt(id),
        data: updateData,
      })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      navigate(`/clinic/residences/${id}`)
    } catch (error) {
      // Error toast is handled in the hook
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add new day
  const handleAddDay = async () => {
    if (!newDayData.amount || newDayData.amount <= 0) {
      toast.error(t("residences.add_day.error_amount"))
      return
    }

    try {
      await addDayMutation.mutateAsync({
        residenceId: Number.parseInt(id),
        date: toDateOnly(newDayData.date),
        cost: newDayData.amount,
        receivedAmount: newDayData.receivedAmount || 0,
        notes: newDayData.notes || null,
      })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setShowAddDay(false)
      setNewDayData({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
      setNewDayAmountInput("")
      setNewDayReceivedInput("")
    } catch (error) {
      // Error toast is handled in the hook
    }
  }

  // Delete day
  const handleDeleteDay = async () => {
    try {
      await deleteDayMutation.mutateAsync(deleteConfirm.dayId)

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setDeleteConfirm({ open: false, dayId: null })
    } catch (error) {
      // Error toast is handled in the hook
    }
  }

  // Edit day
  const handleEditDay = (day) => {
    const amount = day.payment?.amount || 0
    const receivedAmount = day.payment?.receivedAmount || 0
    setEditingDay(day.id)
    setEditDayData({
      date: new Date(day.date),
      amount: amount,
      receivedAmount: receivedAmount,
      notes: day.notes || "",
    })
    setEditDayAmountInput(formatNumberWithThousands(amount))
    setEditDayReceivedInput(formatNumberWithThousands(receivedAmount))
  }

  const handleSaveDay = async () => {
    if (!editDayData.amount || editDayData.amount <= 0) {
      toast.error(t("residences.add_day.error_amount"))
      return
    }

    try {
      await updateDayMutation.mutateAsync({
        dayId: editingDay,
        data: {
          date: toDateOnly(editDayData.date),
          amount: editDayData.amount,
          receivedAmount: editDayData.receivedAmount || 0,
          notes: editDayData.notes || null,
        },
      })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })

      setEditingDay(null)
      setEditDayData({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
      setEditDayAmountInput("")
      setEditDayReceivedInput("")
    } catch (error) {
      // Error toast is handled in the hook
    }
  }

  const handleCancelEditDay = () => {
    setEditingDay(null)
    setEditDayData({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
    setEditDayAmountInput("")
    setEditDayReceivedInput("")
  }

  // Pay day
  const handlePayDay = async () => {
    if (!payConfirm.dayId) return
    try {
      await payDayMutation.mutateAsync({ dayId: payConfirm.dayId })

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["residence", id] })
      queryClient.invalidateQueries({ queryKey: ["residences"] })
      setPayConfirm({ open: false, dayId: null, amount: 0 })
    } catch (error) {
      // Error toast is handled in the hook
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
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border dark:border-zinc-800 p-8 text-center">
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

  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6" dir={isRtl ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
          <Button asChild variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
            <Link to={`/clinic/residences/${id}`}>
              <ArrowLeft className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
              {t("owners.back")}
            </Link>
          </Button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {t("owners.edit_tooltip")} - {residence.animalName}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Residence Days Management */}
        <div className="space-y-6">
          {/* Animal Info */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800 p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t("residences.animal_info")}
            </h2>
 
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 flex-shrink-0">
                  {t("animals_form.name")}:
                </span>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white font-medium break-words">
                  {residence.animalName}
                </span>
              </div>
 
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 flex-shrink-0">
                  {t("appointments.table.owner")}:
                </span>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white break-words">
                  {residence.ownerName}
                </span>
              </div>
 
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 flex-shrink-0">
                  {t("sidebar.clinics")}:
                </span>
                <span className="text-sm sm:text-base text-gray-900 dark:text-white break-words">
                  {residence.clinicName || t("residences.status.not_specified")}
                </span>
              </div>
 
              <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
                <span className="text-sm font-medium text-gray-600 dark:text-zinc-400 flex-shrink-0">
                  {t("residences.status_label")}:
                </span>
                <span className={getStatusBadgeClasses(residence.status)}>
                  {getStatusInfo(residence.status, t).label}
                </span>
              </div>
            </div>
          </div>

          {/* Days Management */}
          {residence && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                {t("residences.current_days")}
              </h2>
              <Button
                onClick={() => setShowAddDay(true)}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 w-full sm:w-auto"
                size="sm"
              >
                <Plus className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                {t("residences.add_day_btn")}
              </Button>
            </div>
 
            {/* Days List */}
            <div className="space-y-2 sm:space-y-3 max-h-96 overflow-y-auto overflow-x-hidden">
              {residence.residenceDays && residence.residenceDays.length > 0 ? (
                residence.residenceDays.map((day) => (
                  <div
                    key={day.id}
                    className="border border-gray-200 dark:border-zinc-800 rounded-lg p-2 sm:p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                      {editingDay === day.id ? (
                        // Edit Mode
                        <div className="space-y-2 sm:space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                            <FormField label={t("residences.add_day.date_label")} required>
                              <Popover open={editDayDateOpen} onOpenChange={setEditDayDateOpen}>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="w-full justify-start text-start font-normal text-sm h-8 bg-transparent"
                                  >
                                    <CalendarIcon className="rtl:ml-2 ltr:mr-2 h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                                      {editDayData.date ? (
                                        format(editDayData.date, "PPP", { locale: dateLocale })
                                      ) : (
                                        t("appointments.form.select_date_placeholder")
                                      )}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={editDayData.date}
                                    onSelect={(date) => {
                                      setEditDayData((prev) => ({ ...prev, date: date || new Date() }))
                                      setEditDayDateOpen(false)
                                    }}
                                    disabled={(date) => date < new Date("1900-01-01")}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                            </FormField>
                            <FormField label={t("residences.add_day.amount_label")} required>
                              <Input
                                type="text"
                                value={editDayAmountInput}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // Remove all non-digit characters
                                  const digitsOnly = value.replace(/[^\d]/g, "")
                                  const numericValue = digitsOnly ? Number.parseInt(digitsOnly, 10) : 0
                                  const formattedValue = numericValue > 0 ? formatNumberWithThousands(numericValue) : ""

                                  setEditDayAmountInput(formattedValue)
                                  setEditDayData((prev) => ({
                                    ...prev,
                                    amount: numericValue,
                                    receivedAmount: numericValue, // Auto-fill received amount
                                  }))
                                  setEditDayReceivedInput(
                                    numericValue > 0 ? formatNumberWithThousands(numericValue) : "",
                                  )
                                }}
                                placeholder="0"
                                className="h-8 text-sm"
                              />
                            </FormField>
                            <FormField label={t("examinations.payment.received_amount_label")}>
                              <Input
                                type="text"
                                value={editDayReceivedInput}
                                onChange={(e) => {
                                  const value = e.target.value
                                  // Remove all non-digit characters
                                  const digitsOnly = value.replace(/[^\d]/g, "")
                                  const numericValue = digitsOnly ? Number.parseInt(digitsOnly, 10) : 0
                                  const formattedValue = numericValue > 0 ? formatNumberWithThousands(numericValue) : ""

                                  setEditDayReceivedInput(formattedValue)
                                  setEditDayData((prev) => ({ ...prev, receivedAmount: numericValue }))
                                }}
                                placeholder="0"
                                className="h-8 text-sm"
                              />
                            </FormField>
                          </div>
                          <FormField label={t("residences.add_day.notes_label")}>
                            <Textarea
                              value={editDayData.notes}
                              onChange={(e) => setEditDayData((prev) => ({ ...prev, notes: e.target.value }))}
                              placeholder={t("residences.add_day.notes_placeholder")}
                              rows={2}
                              className="text-sm"
                            />
                          </FormField>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <Button
                              onClick={handleSaveDay}
                              disabled={updateDayMutation.isPending}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 w-full sm:w-auto"
                            >
                              {updateDayMutation.isPending ? t("appointments.form.saving") : t("appointments.form.save")}
                            </Button>
                            <Button
                              onClick={handleCancelEditDay}
                              variant="outline"
                              size="sm"
                              disabled={updateDayMutation.isPending}
                              className="w-full sm:w-auto bg-transparent"
                            >
                              {t("appointments.cancel.back")}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-gray-900 dark:text-white text-sm">
                                {t("residences.days_count", { count: day.dayNumber })}
                              </span>
                              <span className="text-xs text-gray-600 dark:text-gray-300">
                                {format(new Date(day.date), "PPP", { locale: dateLocale })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Button
                                onClick={() => handleEditDay(day)}
                                size="sm"
                                variant="outline"
                                className="p-1.5 h-7 w-7"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                onClick={() => setDeleteConfirm({ open: true, dayId: day.id })}
                                size="sm"
                                variant="outline"
                                className="p-1.5 h-7 w-7 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/40"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between sm:flex-col sm:justify-start gap-1">
                              <span className="text-gray-600 dark:text-zinc-400">
                                {t("examinations.payment.required_amount")}:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(day.payment?.amount || 0)}
                              </span>
                            </div>
                            <div className="flex justify-between sm:flex-col sm:justify-start gap-1">
                              <span className="text-gray-600 dark:text-zinc-400">
                                {t("examinations.payment.received_amount_label")}:
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {formatCurrency(day.payment?.receivedAmount || 0)}
                              </span>
                            </div>
                          </div>
                          {day.notes && (
                            <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 p-2 bg-gray-50 dark:bg-zinc-800 rounded break-words">
                              {day.notes}
                            </p>
                          )}
                          {day.payment?.fullyPaid ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded text-xs">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {t("residences.fully_paid")}
                            </span>
                          ) : (
                            <Button
                              onClick={() => setPayConfirm({ open: true, dayId: day.id, amount: day.payment?.amount || 0 })}
                              size="sm"
                              className="w-full mt-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 h-7 text-xs shadow-sm transition-all active:scale-95"
                              disabled={payDayMutation.isPending}
                            >
                              {payDayMutation.isPending ? t("appointments.form.saving") : t("residences.pay_now")}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-zinc-500 text-sm">
                    <Calendar className="w-10 h-10 mx-auto mb-2 text-gray-300 dark:text-zinc-700" />
                    <p>{t("residences.empty_message")}</p>
                  </div>
                )}
              </div>

              {/* Add Day Form */}
              {showAddDay && (
                <div className="mt-4 p-3 sm:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-3">
                    {t("residences.add_day.title")}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                      <FormField label={t("residences.add_day.date_label")} required>
                        <Popover open={newDayDateOpen} onOpenChange={setNewDayDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-start font-normal text-sm h-8 bg-transparent"
                            >
                              <CalendarIcon className="rtl:ml-2 ltr:mr-2 h-3 w-3 flex-shrink-0" />
                              <span className="truncate">
                                {newDayData.date ? (
                                  format(newDayData.date, "PPP", { locale: dateLocale })
                                ) : (
                                  t("appointments.form.select_date_placeholder")
                                )}
                              </span>
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={newDayData.date}
                              onSelect={(date) => {
                                setNewDayData((prev) => ({ ...prev, date: date || new Date() }))
                                setNewDayDateOpen(false)
                              }}
                              disabled={(date) => date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </FormField>
                      <FormField label={t("residences.add_day.amount_label")} required>
                        <Input
                          type="text"
                          value={newDayAmountInput}
                          onChange={(e) => {
                            const value = e.target.value
                            // Remove all non-digit characters
                            const digitsOnly = value.replace(/[^\d]/g, "")
                            const numericValue = digitsOnly ? Number.parseInt(digitsOnly, 10) : 0
                            const formattedValue = numericValue > 0 ? formatNumberWithThousands(numericValue) : ""

                            setNewDayAmountInput(formattedValue)
                            setNewDayData((prev) => ({
                              ...prev,
                              amount: numericValue,
                              receivedAmount: numericValue, // Auto-fill received amount
                            }))
                            setNewDayReceivedInput(numericValue > 0 ? formatNumberWithThousands(numericValue) : "")
                          }}
                          placeholder="0"
                          className="h-8 text-sm"
                        />
                      </FormField>
                      <FormField label={t("examinations.payment.received_amount_label")}>
                        <Input
                          type="text"
                          value={newDayReceivedInput}
                          onChange={(e) => {
                            const value = e.target.value
                            // Remove all non-digit characters
                            const digitsOnly = value.replace(/[^\d]/g, "")
                            const numericValue = digitsOnly ? Number.parseInt(digitsOnly, 10) : 0
                            const formattedValue = numericValue > 0 ? formatNumberWithThousands(numericValue) : ""

                            setNewDayReceivedInput(formattedValue)
                            setNewDayData((prev) => ({ ...prev, receivedAmount: numericValue }))
                          }}
                          placeholder="0"
                          className="h-8 text-sm"
                        />
                      </FormField>
                    </div>
                    <FormField label={t("residences.add_day.notes_label")}>
                      <Textarea
                        value={newDayData.notes}
                        onChange={(e) => setNewDayData((prev) => ({ ...prev, notes: e.target.value }))}
                        placeholder={t("residences.add_day.notes_placeholder")}
                        rows={2}
                        className="text-sm"
                      />
                    </FormField>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        onClick={handleAddDay}
                        disabled={addDayMutation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 w-full sm:w-auto"
                      >
                        {addDayMutation.isPending ? t("appointments.form.saving") : t("residences.add_day.add_btn")}
                      </Button>
                      <Button
                        onClick={() => {
                          setShowAddDay(false)
                          setNewDayData({ date: new Date(), amount: 0, receivedAmount: 0, notes: "" })
                          setNewDayAmountInput("")
                          setNewDayReceivedInput("")
                        }}
                        variant="outline"
                        size="sm"
                        disabled={addDayMutation.isPending}
                        className="w-full sm:w-auto"
                      >
                        {t("appointments.cancel.back")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow border dark:border-zinc-800 p-4 sm:p-6"
          >
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t("residences.new_residency_subtitle")}
            </h2>
 
            <div className="space-y-4">
              <FormField label={t("residences.reason_label")} required>
                <Input
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  placeholder={t("residences.reason_placeholder")}
                  required
                />
              </FormField>
 
              <FormField label={t("residences.status_label")} required>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("residences.status_placeholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {RESIDENCE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        <div className="flex items-center gap-2">
                          <span className={option.color}>{option.label}</span>
                          <span className="text-xs text-gray-500 dark:text-zinc-500">- {option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t("residences.start_date")} required>
                  <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-start font-normal bg-transparent">
                        <CalendarIcon className="rtl:ml-2 ltr:mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {formData.startDate ? (
                            format(formData.startDate, "PPP", { locale: dateLocale })
                          ) : (
                            t("appointments.form.select_date_placeholder")
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) => {
                          handleDateChange("startDate")(date)
                          setStartDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>

                <FormField label={t("residences.expected_end_date")}>
                  <Popover open={expectedDateOpen} onOpenChange={setExpectedDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-start font-normal bg-transparent">
                        <CalendarIcon className="rtl:ml-2 ltr:mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {formData.expectedEndDate ? (
                            format(formData.expectedEndDate, "PPP", { locale: dateLocale })
                          ) : (
                            t("appointments.form.select_date_placeholder")
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.expectedEndDate}
                        onSelect={(date) => {
                          handleDateChange("expectedEndDate")(date)
                          setExpectedDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>
              </div>

              {formData.actualEndDate && (
                <FormField label={t("residences.ended_at_label")}>
                  <Popover open={actualDateOpen} onOpenChange={setActualDateOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-start font-normal bg-transparent">
                        <CalendarIcon className="rtl:ml-2 ltr:mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">
                          {formData.actualEndDate ? (
                            format(formData.actualEndDate, "PPP", { locale: dateLocale })
                          ) : (
                            t("appointments.form.select_date_placeholder")
                          )}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.actualEndDate}
                        onSelect={(date) => {
                          handleDateChange("actualEndDate")(date)
                          setActualDateOpen(false)
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FormField>
              )}

              <FormField label={t("residences.notes_label")}>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder={t("residences.notes_placeholder")}
                  rows={4}
                />
              </FormField>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-6">
              <Button
                type="submit"
                disabled={isSubmitting || updateResidenceMutation.isPending}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                <Save className="w-4 h-4 rtl:ml-2 ltr:mr-2" />
                {isSubmitting || updateResidenceMutation.isPending ? t("appointments.form.saving") : t("appointments.form.save")}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/clinic/residences/${id}`)}
                disabled={isSubmitting || updateResidenceMutation.isPending}
                className="w-full sm:w-auto"
              >
                {t("appointments.cancel.back")}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm({ open, dayId: deleteConfirm.dayId })}
        onConfirm={handleDeleteDay}
        title={t("appointments.cancel.btn")}
        description={t("residences.delete_confirm_desc")}
        confirmLabel={t("common.yes")}
        cancelLabel={t("common.no")}
        isLoading={deleteDayMutation.isPending}
        confirmVariant="destructive"
      />

      {/* Payment Confirmation Dialog */}
      <ConfirmDialog
        open={payConfirm.open}
        onOpenChange={(open) => setPayConfirm({ open, dayId: payConfirm.dayId, amount: payConfirm.amount })}
        onConfirm={handlePayDay}
        title={t("residences.confirm_payment_title") || t("common.confirm")}
        description={t("residences.confirm_payment_desc", { amount: formatCurrency(payConfirm.amount) })}
        confirmLabel={t("common.yes")}
        cancelLabel={t("common.no")}
        isLoading={payDayMutation.isPending}
        confirmVariant="default"
      />
    </div>
  )
}
