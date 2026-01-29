"use client"

import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"
import { ClipboardList, Clock, Activity, User, Plane } from "lucide-react"

import { useTranslation } from "react-i18next"

export function VisitInformationSection({ register, errors }) {
  const { t } = useTranslation()
  const getError = (field) => errors.visitInformation?.[field.split(".").pop()]?.message

  const progressOptions = [
    { value: "improving", label: t("examinations.visit.progress_options.improving") },
    { value: "worsening", label: t("examinations.visit.progress_options.worsening") },
    { value: "stable", label: t("examinations.visit.progress_options.stable") },
  ]

  return (
    <FormSection title={t("examinations.visit.title")} icon={ClipboardList}>
      <FormGrid>
        <FormFieldWrapper className="md:col-span-2">
          <FormFieldHeader icon={ClipboardList} label={t("examinations.visit.main_reason")} />
          <span className="text-red-500 text-sm">*</span>
          <Textarea
            {...register("visitInformation.mainReason", {
              required: t("examinations.visit.validation.main_reason_required"),
            })}
            placeholder={t("examinations.visit.placeholders.main_reason")}
            className={getError("visitInformation.mainReason") ? "border-red-500" : ""}
            rows={3}
          />
          {getError("visitInformation.mainReason") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
              {getError("visitInformation.mainReason")}
            </p>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormFieldHeader icon={Clock} label={t("examinations.visit.symptoms_started")} />
          <Input
            {...register("visitInformation.symptomsStarted")}
            placeholder={t("examinations.visit.placeholders.symptoms_started")}
            className={getError("visitInformation.symptomsStarted") ? "border-red-500" : ""}
          />
          {getError("visitInformation.symptomsStarted") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
              {getError("visitInformation.symptomsStarted")}
            </p>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <FormFieldHeader icon={Activity} label={t("examinations.visit.disease_progress")} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg border dark:border-zinc-700">
            {progressOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center justify-center gap-2 p-2 sm:p-3 bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-all duration-200 text-center min-h-[44px]"
              >
                <input
                  type="radio"
                  {...register("visitInformation.diseaseProgress")}
                  value={option.value}
                  className="h-4 w-4 flex-shrink-0 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-zinc-600"
                />
                <span className="text-xs sm:text-sm text-gray-700 dark:text-white font-medium select-none break-words">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </FormFieldWrapper>

        <FormFieldWrapper className="md:col-span-2">
          <FormFieldHeader icon={ClipboardList} label={t("examinations.visit.previous_treatments")} />
          <Textarea
            {...register("visitInformation.previousTreatments")}
            placeholder={t("examinations.visit.placeholders.previous_treatments")}
            className={getError("visitInformation.previousTreatments") ? "border-red-500" : ""}
            rows={3}
          />
          {getError("visitInformation.previousTreatments") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
              {getError("visitInformation.previousTreatments")}
            </p>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormFieldHeader icon={User} label={t("examinations.visit.ownership")} />
          <Input
            {...register("visitInformation.ownership")}
            placeholder={t("examinations.visit.placeholders.ownership")}
            className={getError("visitInformation.ownership") ? "border-red-500" : ""}
          />
          {getError("visitInformation.ownership") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">{getError("visitInformation.ownership")}</p>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormFieldHeader icon={Plane} label={t("examinations.visit.travel_history")} />
          <Input
            {...register("visitInformation.travelHistory")}
            placeholder={t("examinations.visit.placeholders.travel_history")}
            className={getError("visitInformation.travelHistory") ? "border-red-500" : ""}
          />
          {getError("visitInformation.travelHistory") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">
              {getError("visitInformation.travelHistory")}
            </p>
          )}
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormFieldHeader icon={Activity} label={t("examinations.visit.exercise")} />
          <Input
            {...register("visitInformation.exercise")}
            placeholder={t("examinations.visit.placeholders.exercise")}
            className={getError("visitInformation.exercise") ? "border-red-500" : ""}
          />
          {getError("visitInformation.exercise") && (
            <p className="mt-1 text-xs sm:text-sm text-red-600 break-words">{getError("visitInformation.exercise")}</p>
          )}
        </FormFieldWrapper>
      </FormGrid>
    </FormSection>
  )
}
