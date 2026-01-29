"use client"

import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Textarea } from "../../ui/Textarea"
import { Heart, Calendar } from "lucide-react"

import { useTranslation } from "react-i18next"

export function ReproductiveCycleSection({ basicInfo, register, errors }) {
  const { t } = useTranslation()
  if (basicInfo?.gender !== "أنثى" || basicInfo?.neutered !== false) {
    return null
  }

  const getError = (field) => errors.reproductiveCycle?.[field.split(".").pop()]?.message

  return (
    <FormSection title={t("examinations.reproductive.title")} icon={Heart}>
      <FormGrid>
        <FormFieldWrapper className="md:col-span-2">
          <FormFieldHeader icon={Calendar} label={t("examinations.reproductive.last_cycle")} />
          <Textarea
            {...register("reproductiveCycle.lastReproductiveCycle")}
            placeholder={t("examinations.reproductive.placeholders.last_cycle")}
            rows={4}
            className={getError("reproductiveCycle.lastReproductiveCycle") ? "border-red-500" : ""}
          />
          {getError("reproductiveCycle.lastReproductiveCycle") && (
            <p className="mt-1 text-sm text-red-600">{getError("reproductiveCycle.lastReproductiveCycle")}</p>
          )}
        </FormFieldWrapper>
      </FormGrid>
    </FormSection>
  )
}
