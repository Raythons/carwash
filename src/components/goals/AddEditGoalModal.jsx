"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "../ui/Dialog"
import { Button } from "../ui/Button"
import { CalendarIcon } from "lucide-react"
import { useClinic } from "../../contexts/ClinicContext"
import { formatNumberWithThousands, parseFormattedNumber } from "../../utilities/number"
import { useTranslation } from "react-i18next"

export function AddEditGoalModal({ isOpen, onClose, onSubmit, goal, existingGoals, currentYear, isLoading }) {
  const { t, i18n } = useTranslation()
  const { selectedClinic } = useClinic()
  const [formData, setFormData] = useState({
    clinicId: selectedClinic?.id || null,
    month: new Date().getMonth() + 1,
    year: currentYear,
    totalClinicProfit: "",
    startDate: "",
    endDate: "",
  })

  // Local state for formatted amount display
  const [amountInput, setAmountInput] = useState("")

  const [errors, setErrors] = useState({})

  const months = [
    { value: 1, label: t("goals.form.months.1") },
    { value: 2, label: t("goals.form.months.2") },
    { value: 3, label: t("goals.form.months.3") },
    { value: 4, label: t("goals.form.months.4") },
    { value: 5, label: t("goals.form.months.5") },
    { value: 6, label: t("goals.form.months.6") },
    { value: 7, label: t("goals.form.months.7") },
    { value: 8, label: t("goals.form.months.8") },
    { value: 9, label: t("goals.form.months.9") },
    { value: 10, label: t("goals.form.months.10") },
    { value: 11, label: t("goals.form.months.11") },
    { value: 12, label: t("goals.form.months.12") },
  ]

  // Calculate start and end dates based on selected month and year
  const calculateDates = (month, year) => {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const formatAsYMD = (date) => {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, "0")
      const d = String(date.getDate()).padStart(2, "0")
      return `${y}-${m}-${d}`
    }

    return {
      startDate: formatAsYMD(startDate),
      endDate: formatAsYMD(endDate),
    }
  }

  // Update dates when month or year changes
  useEffect(() => {
    if (formData.month && formData.year) {
      const dates = calculateDates(formData.month, formData.year)
      setFormData((prev) => ({
        ...prev,
        startDate: dates.startDate,
        endDate: dates.endDate,
      }))
    }
  }, [formData.month, formData.year])

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen) {
      if (goal) {
        // Editing existing goal
        setFormData({
          clinicId: goal.clinicId || selectedClinic?.id || null,
          month: goal.month,
          year: goal.year,
          totalClinicProfit: goal.totalClinicProfit.toString(),
          startDate: goal.startDate,
          endDate: goal.endDate,
        })
        setAmountInput(formatNumberWithThousands(goal.totalClinicProfit))
      } else {
        // Adding new goal
        const currentMonth = new Date().getMonth() + 1
        const dates = calculateDates(currentMonth, currentYear)
        setFormData({
          clinicId: selectedClinic?.id || null,
          month: currentMonth,
          year: currentYear,
          totalClinicProfit: "",
          startDate: dates.startDate,
          endDate: dates.endDate,
        })
        setAmountInput("")
      }
      setErrors({})
    }
  }, [isOpen, goal, selectedClinic, currentYear])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "month" || name === "year" ? Number.parseInt(value) : value,
    }))

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // Handle amount input with formatting
  const handleAmountChange = (e) => {
    const value = e.target.value
    const plainValue = parseFormattedNumber(value)

    setAmountInput(formatNumberWithThousands(plainValue))
    setFormData((prev) => ({
      ...prev,
      totalClinicProfit: plainValue,
    }))

    // Clear error for this field
    if (errors.totalClinicProfit) {
      setErrors((prev) => ({
        ...prev,
        totalClinicProfit: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.month) {
      newErrors.month = t("goals.errors.month_required")
    }

    if (!formData.year) {
      newErrors.year = t("goals.errors.year_required")
    }

    if (!formData.totalClinicProfit || Number.parseFloat(formData.totalClinicProfit) <= 0) {
      newErrors.totalClinicProfit = t("goals.errors.goal_required")
    }

    // Check if goal already exists for this month/year (only when adding new goal)
    if (!goal && existingGoals.some((g) => g.month === formData.month && g.year === formData.year)) {
      newErrors.month = t("goals.errors.goal_exists")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const submitData = {
      ...formData,
      totalClinicProfit: Number.parseFloat(formData.totalClinicProfit),
    }

    onSubmit(submitData)
  }

  const getAvailableMonths = () => {
    if (goal) {
      // When editing, allow the current month
      return months
    }

    // When adding, only show months that don't have goals
    const usedMonths = existingGoals.filter((g) => g.year === formData.year).map((g) => g.month)

    return months.filter((month) => !usedMonths.includes(month.value))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-md dark:bg-zinc-800 dark:border-zinc-700"
        dir={i18n.language === "ar" ? "rtl" : "ltr"}
      >
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-1">
            <h3
              className={`text-lg font-semibold text-gray-900 dark:text-white ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {goal ? t("goals.form.edit_title") : t("goals.form.add_title")}
            </h3>
          </div>
          {/* Month Selection */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 dark:text-white mb-1 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {t("goals.form.month")} *
            </label>
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 ${
                errors.month ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-zinc-600"
              }`}
              disabled={goal} // Disable month change when editing
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <option value="">{t("goals.form.select_month")}</option>
              {getAvailableMonths().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
            {errors.month && (
              <p
                className={`mt-1 text-sm text-red-600 dark:text-red-400 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
              >
                {errors.month}
              </p>
            )}
          </div>

          {/* Year Selection */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 dark:text-white mb-1 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {t("goals.form.year")} *
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 ${
                errors.year ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-zinc-600"
              }`}
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p
                className={`mt-1 text-sm text-red-600 dark:text-red-400 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
              >
                {errors.year}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <label
              htmlFor="startDate"
              className={`block text-sm font-medium text-gray-700 dark:text-white ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {t("goals.form.start_date")}
            </label>
            <Button
              variant="outline"
              disabled
              className="w-full justify-between font-normal bg-gray-100 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 cursor-not-allowed"
            >
              {formData.startDate
                ? new Date(formData.startDate).toLocaleDateString("en-US", { numberingSystem: "latn" })
                : "-"}
              <CalendarIcon className="h-4 w-4 dark:text-zinc-400" />
            </Button>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label
              htmlFor="endDate"
              className={`block text-sm font-medium text-gray-700 dark:text-white ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {t("goals.form.end_date")}
            </label>
            <Button
              variant="outline"
              disabled
              className="w-full justify-between font-normal bg-gray-100 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 cursor-not-allowed"
            >
              {formData.endDate
                ? new Date(formData.endDate).toLocaleDateString("en-US", { numberingSystem: "latn" })
                : "-"}
              <CalendarIcon className="h-4 w-4 dark:text-zinc-400" />
            </Button>
          </div>

          {/* Total Clinic Profit */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 dark:text-white mb-1 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
            >
              {t("goals.form.financial_goal")} *
            </label>
            <input
              type="text"
              name="totalClinicProfit"
              value={amountInput}
              onChange={handleAmountChange}
              placeholder={t("goals.form.placeholder_amount")}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 dark:bg-zinc-700 dark:text-white dark:border-zinc-600 ${
                errors.totalClinicProfit ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-zinc-600"
              }`}
              dir="ltr"
            />
            {errors.totalClinicProfit && (
              <p
                className={`mt-1 text-sm text-red-600 dark:text-red-400 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
              >
                {errors.totalClinicProfit}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="dark:bg-zinc-700 dark:text-white dark:border-zinc-600 dark:hover:bg-zinc-600 bg-transparent"
            >
              {t("goals.buttons.cancel")}
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {isLoading ? t("goals.buttons.saving") : goal ? t("goals.buttons.update") : t("goals.buttons.add")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
