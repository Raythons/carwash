"use client"

import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CalendarIcon, XCircle, ChevronDown, History, Clock, FileText } from "lucide-react"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { toDateOnly } from "@/utilities/date"

import { FormSection } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

export function PreviousConditionsSection({
  formData,
  historicalConditions,
  arrayErrors,
  onNestedChange,
  onAddItem,
  onRemoveItem,
}) {
  const { t, i18n } = useTranslation()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  const locale = i18n.language === "ar" ? "ar-SA" : "en-US"

  return (
    <FormSection title={t("examinations.previous.title")} icon={History}>
      {historicalConditions && historicalConditions.length > 0 && (
        <div className="mb-6 border-b border-gray-200 dark:border-zinc-700 pb-4">
          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            className="flex justify-between items-center w-full text-sm sm:text-base font-semibold text-gray-800 dark:text-white hover:bg-gray-50 dark:hover:bg-zinc-800 p-2 rounded-md transition-colors"
          >
            <span className="flex items-center gap-2">
              <History className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <span className="truncate">
                {t("examinations.previous.history_show")} ({historicalConditions.length})
              </span>
            </span>
            <ChevronDown
              className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 transition-transform duration-300 ${showHistory ? "rotate-180" : ""}`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${showHistory ? "max-h-[500px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}
          >
            <div className="max-h-[400px] overflow-y-auto pl-4">
              <ul className="space-y-2">
                {historicalConditions.map((item, index) => (
                  <li
                    key={index}
                    className="p-2 sm:p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border-l-4 border-blue-400 dark:border-blue-500 dark:shadow-blue-500/10"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
                      <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white break-words">
                        {item.condition}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400 flex-shrink-0">
                        {format(new Date(item.date), "yyyy-MM-dd")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Conditions Added in Current Examination */}
        {formData?.conditions && formData.conditions.length > 0 && (
          <div className="space-y-3">
            <FormFieldHeader icon={FileText} label={t("examinations.previous.added_in_current")} />

            {formData.conditions.map((condition, index) => (
              <div
                key={index}
                className="flex flex-row items-center gap-2 sm:gap-3 bg-gray-50 dark:bg-zinc-800 p-2 sm:p-3 rounded-lg border border-gray-200 dark:border-zinc-700"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                    <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-white break-words">
                      {condition.condition}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400 flex-shrink-0">
                      {condition.date ? format(new Date(condition.date), "yyyy-MM-dd") : ""}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0 h-8 w-8 p-0"
                  title={t("examinations.previous.remove_button")}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Condition Form */}
        <div className="space-y-4">
          <FormFieldHeader icon={FileText} label={t("examinations.previous.add_new")} />

          <div className="space-y-4 bg-gray-50 dark:bg-zinc-800 p-3 sm:p-4 rounded-lg border dark:border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormFieldWrapper>
                <FormFieldHeader icon={FileText} label={t("examinations.previous.condition_label")} />
                <Input
                  value={formData?.newCondition?.condition || ""}
                  onChange={(e) => onNestedChange("condition", e.target.value)}
                  placeholder={t("examinations.previous.placeholders.condition")}
                  className={`${arrayErrors?.condition ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                />
                <div className="min-h-[20px]">
                  {arrayErrors?.condition && <p className="text-sm text-red-600">{arrayErrors.condition}</p>}
                </div>
              </FormFieldWrapper>

              <FormFieldWrapper>
                <FormFieldHeader icon={Clock} label={t("examinations.previous.date_label")} />
                <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-between font-normal ${arrayErrors?.date ? "border-red-500" : ""}`}
                    >
                      {formData?.newCondition?.date
                        ? new Date(formData.newCondition.date).toLocaleDateString(locale)
                        : t("examinations.previous.placeholders.date")}
                      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData?.newCondition?.date ? new Date(formData.newCondition.date) : undefined}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date) {
                          const dateString = toDateOnly(date)
                          onNestedChange("date", dateString)
                        }
                        setDatePickerOpen(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <div className="min-h-[20px]">
                  {arrayErrors?.date && <p className="text-sm text-red-600">{arrayErrors.date}</p>}
                </div>
              </FormFieldWrapper>
            </div>

            <Button
              type="button"
              onClick={onAddItem}
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white w-full transition-colors"
            >
              {t("examinations.previous.add_button")}
            </Button>
          </div>
        </div>
      </div>
    </FormSection>
  )
}
