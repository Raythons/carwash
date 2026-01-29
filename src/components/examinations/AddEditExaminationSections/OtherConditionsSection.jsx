"use client"

import { useTranslation } from "react-i18next"
import { Activity, AlertTriangle } from "lucide-react"
import { Textarea } from "../../ui/Textarea"

import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

export function OtherConditionsSection({ formData, onChange }) {
  const { t } = useTranslation()
  const safeFormData = formData || {}

  return (
    <FormSection title={t("examinations.other.title")} icon={Activity}>
      <FormGrid cols={2}>
        <FormFieldWrapper>
          <FormFieldHeader icon={Activity} label={t("examinations.other.paralysis")} />
          <Textarea
            value={safeFormData.paralysisLameness || ""}
            onChange={(e) => onChange("paralysisLameness", e.target.value)}
            placeholder={t("examinations.other.placeholders.paralysis")}
            className="min-h-[100px] resize-vertical"
          />
        </FormFieldWrapper>

        <FormFieldWrapper>
          <FormFieldHeader icon={AlertTriangle} label={t("examinations.other.itching")} />
          <Textarea
            value={safeFormData.itchingHairLoss || ""}
            onChange={(e) => onChange("itchingHairLoss", e.target.value)}
            placeholder={t("examinations.other.placeholders.itching")}
            className="min-h-[100px] resize-vertical"
          />
        </FormFieldWrapper>
      </FormGrid>
    </FormSection>
  )
}
