"use client"

import { useTranslation } from "react-i18next"
import { Wind, AlertCircle } from "lucide-react"

import { Textarea } from "../../ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function SneezingSection({ formData, onChange }) {
  const { t } = useTranslation()
  const hasSneezing = formData.hasSneezing || false

  return (
    <FormSection title={t("examinations.sneezing.title")} icon={Wind}>
      <FormGrid className="grid-cols-1">
        <FormFieldWrapper>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="hasSneezing"
              checked={hasSneezing}
              onCheckedChange={(checked) => onChange("hasSneezing", checked)}
              className="flex-shrink-0"
            />
            <Label
              htmlFor="hasSneezing"
              className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer break-words"
            >
              {t("examinations.sneezing.question")}
            </Label>
          </div>
        </FormFieldWrapper>

        {hasSneezing && (
          <FormFieldWrapper>
            <FormFieldHeader icon={AlertCircle} label={t("examinations.sneezing.details")} />
            <Textarea
              value={formData.sneezingDetails || ""}
              onChange={(e) => onChange("sneezingDetails", e.target.value)}
              placeholder={t("examinations.sneezing.placeholders.details")}
              rows={4}
            />
          </FormFieldWrapper>
        )}
      </FormGrid>
    </FormSection>
  )
}
