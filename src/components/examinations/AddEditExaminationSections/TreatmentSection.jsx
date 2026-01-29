"use client"

import { useTranslation } from "react-i18next"
import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"
import { Button } from "../../ui/Button"
import { CalendarIcon, Clock, Pill, Syringe, FileText, Plus, Trash2, CalendarIcon as CalendarIcon2 } from "lucide-react"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toDateOnly } from "@/utilities/date"

import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

// Utility function to calculate future date from days
const calculateDateFromDays = (days) => {
  if (!days || isNaN(days)) return ""
  const today = new Date()
  const futureDate = new Date(today)
  futureDate.setDate(today.getDate() + Number.parseInt(days))
  return futureDate
}

// Utility function to calculate days from date
const calculateDaysFromDate = (date) => {
  if (!date) return ""
  const today = new Date()
  const selectedDate = new Date(date)
  const diffTime = selectedDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays.toString()
}

export function TreatmentSection({
  formData,
  newTreatment,
  register,
  errors,
  getFieldError,
  isFieldTouched,
  arrayErrors,
  onAddTreatment,
  onRemoveTreatment,
  onTreatmentInputChange,
}) {
  const { t, i18n } = useTranslation()
  // State for date picker
  const [followUpDateOpen, setFollowUpDateOpen] = React.useState(false)

  const locale = i18n.language === "ar" ? "ar-SA" : "en-US"

  // Convert string date to Date object for calendar
  const followUpDate = formData.followUpDate ? new Date(formData.followUpDate) : undefined

  // Handle follow-up days change and auto-calculate date
  const handleFollowUpDaysChange = (value) => {
    onTreatmentInputChange("followUpDays", value)
    if (value && !isNaN(value) && value > 0) {
      const calculatedDate = calculateDateFromDays(value)
      const dateString = toDateOnly(calculatedDate)
      onTreatmentInputChange("followUpDate", dateString)
    } else if (!value) {
      onTreatmentInputChange("followUpDate", "")
    }
  }

  // Handle follow-up date change and auto-calculate days
  const handleFollowUpDateChange = (date) => {
    if (date) {
      const dateString = toDateOnly(date)
      onTreatmentInputChange("followUpDate", dateString)
      const calculatedDays = calculateDaysFromDate(dateString)
      onTreatmentInputChange("followUpDays", calculatedDays)
    }
    setFollowUpDateOpen(false)
  }

  return (
    <FormSection title={t("examinations.treatment.title")} icon={Pill}>
      {/* Treatment List */}
      <div className="space-y-4 mb-6">
        <FormFieldHeader icon={Pill} label={t("examinations.treatment.added_list")} />
        {formData.treatments?.map((treatment, index) => (
          <div
            key={index}
            className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border border-gray-200 dark:border-zinc-700"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-sm font-medium text-gray-800 dark:text-white flex items-center gap-2">
                <Pill className="h-4 w-4" />
                {t("examinations.treatment.treatment_number", { index: index + 1 })}
              </h4>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onRemoveTreatment(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Medicine and Dosage Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">
                      {t("examinations.treatment.medicine_label")}
                    </span>
                  </div>
                  <span className="text-base text-gray-900 dark:text-white font-medium">{treatment.medicine}</span>
                </div>
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Syringe className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">
                      {t("examinations.treatment.dosage_label")}
                    </span>
                  </div>
                  <span className="text-base text-gray-900 dark:text-white font-medium">{treatment.dosage}</span>
                </div>
              </div>

              {/* Administration Method - Full Width */}
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-gray-200 dark:border-zinc-700">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span className="text-sm font-semibold text-gray-700 dark:text-white">
                    {t("examinations.treatment.method_label")}
                  </span>
                </div>
                <span className="text-base text-gray-900 dark:text-white font-medium">
                  {treatment.administrationMethod}
                </span>
              </div>

              {/* Recommendations - Separated with More Space */}
              {treatment.recommendations && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-500/30 mt-6 dark:shadow-orange-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-semibold text-orange-800 dark:text-orange-400">
                      {t("examinations.treatment.recommendations_label")}
                    </span>
                  </div>
                  <div className="text-base text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                    {treatment.recommendations}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Treatment */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-500/30 mb-6 dark:shadow-blue-500/10">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-400">
            {t("examinations.treatment.add_new_title")}
          </h4>
        </div>

        <div className="space-y-6">
          {/* Medicine and Dosage Row */}
          <FormGrid cols={2}>
            <FormFieldWrapper>
              <FormFieldHeader icon={Pill} label={t("examinations.treatment.medicine_label")} />
              <Input
                value={newTreatment?.medicine || ""}
                onChange={(e) => onTreatmentInputChange("medicine", e.target.value)}
                placeholder={t("examinations.treatment.placeholders.medicine")}
                className={`${arrayErrors?.medicine ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              <div className="min-h-[20px]">
                {arrayErrors?.medicine && <p className="text-sm text-red-600">{arrayErrors.medicine}</p>}
              </div>
            </FormFieldWrapper>

            <FormFieldWrapper>
              <FormFieldHeader icon={Syringe} label={t("examinations.treatment.dosage_label")} />
              <Input
                value={newTreatment?.dosage || ""}
                onChange={(e) => onTreatmentInputChange("dosage", e.target.value)}
                placeholder={t("examinations.treatment.placeholders.dosage")}
                className={`${arrayErrors?.dosage ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
              />
              <div className="min-h-[20px]">
                {arrayErrors?.dosage && <p className="text-sm text-red-600">{arrayErrors.dosage}</p>}
              </div>
            </FormFieldWrapper>
          </FormGrid>

          {/* Administration Method - Full Width */}
          <FormFieldWrapper>
            <FormFieldHeader icon={FileText} label={t("examinations.treatment.method_label")} />
            <Input
              value={newTreatment?.administrationMethod || ""}
              onChange={(e) => onTreatmentInputChange("administrationMethod", e.target.value)}
              placeholder={t("examinations.treatment.placeholders.method")}
              className={`${arrayErrors?.administrationMethod ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
            />
            <div className="min-h-[20px]">
              {arrayErrors?.administrationMethod && (
                <p className="text-sm text-red-600">{arrayErrors.administrationMethod}</p>
              )}
            </div>
          </FormFieldWrapper>

          {/* Recommendations - Full Width with More Space */}
          <div className="pt-4 border-t border-blue-200 dark:border-blue-500/30">
            <FormFieldWrapper>
              <FormFieldHeader icon={FileText} label={t("examinations.treatment.recommendations_label")} />
              <Textarea
                value={newTreatment?.recommendations || ""}
                onChange={(e) => onTreatmentInputChange("recommendations", e.target.value)}
                placeholder={t("examinations.treatment.placeholders.recommendations")}
                rows={4}
                className="min-h-[100px] resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="min-h-[20px]"></div>
            </FormFieldWrapper>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            type="button"
            onClick={onAddTreatment}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("examinations.treatment.add_button")}
          </Button>
        </div>
      </div>

      {/* Follow-up Time Section */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-500/30 dark:shadow-green-500/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
            <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-lg font-semibold text-green-800 dark:text-green-400">
            {t("examinations.treatment.follow_up_title")}
          </h4>
        </div>

        <FormGrid cols={2}>
          <FormFieldWrapper>
            <FormFieldHeader icon={Clock} label={t("examinations.treatment.follow_up_days_label")} />
            <Input
              type="number"
              min="0"
              value={formData.followUpDays || ""}
              onChange={(e) => handleFollowUpDaysChange(e.target.value)}
              placeholder={t("examinations.treatment.placeholders.days")}
              className="focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
            <p className="text-xs text-green-600 break-words">{t("examinations.treatment.auto_calc_tip")}</p>
            <div className="min-h-[20px]"></div>
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={CalendarIcon2} label={t("examinations.treatment.follow_up_date_label")} />
            <Popover open={followUpDateOpen} onOpenChange={setFollowUpDateOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-sm bg-transparent">
                  <span className="truncate">
                    {followUpDate
                      ? followUpDate.toLocaleDateString(locale)
                      : t("examinations.treatment.placeholders.date")}
                  </span>
                  <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={followUpDate}
                  captionLayout="dropdown"
                  onSelect={handleFollowUpDateChange}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-green-600 break-words">{t("examinations.treatment.direct_select_tip")}</p>
            <div className="min-h-[20px]"></div>
          </FormFieldWrapper>
        </FormGrid>

        {/* Display calculated info */}
        {(formData.followUpDays || formData.followUpDate) && (
          <div className="mt-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-green-200 dark:border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span className="font-medium text-gray-800 dark:text-white break-words">
                {t("examinations.treatment.selected_follow_up")}
              </span>
            </div>
            {formData.followUpDate && (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-1">
                <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">{new Date(formData.followUpDate).toLocaleDateString(locale)}</span>
              </div>
            )}
            {formData.followUpDays && (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span className="break-words">
                  {t("examinations.treatment.after_days", { days: formData.followUpDays })}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </FormSection>
  )
}
