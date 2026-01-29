"use client"

import { useTranslation } from "react-i18next"
import { Droplets, Eye, Ear, Heart, Badge as Bandage, MoreHorizontal } from "lucide-react"

import { Textarea } from "../../ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function DischargesSection({ formData, onChange }) {
  const { t } = useTranslation()
  const hasDischarges = formData.hasDischarges || false

  return (
    <FormSection title={t("examinations.discharges.title")} icon={Droplets}>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow-sm dark:shadow-cyan-500/10">
          <Checkbox
            id="hasDischarges"
            checked={hasDischarges}
            onCheckedChange={(checked) => onChange("hasDischarges", checked)}
          />
          <Label htmlFor="hasDischarges" className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer">
            {t("examinations.discharges.question")}
          </Label>
        </div>
      </div>

      {hasDischarges && (
        <FormGrid>
          <FormFieldWrapper>
            <FormFieldHeader icon={Heart} label={t("examinations.discharges.reproductive")} />
            <Textarea
              value={formData.reproductiveDischarge || ""}
              onChange={(e) => onChange("reproductiveDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.reproductive")}
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Ear} label={t("examinations.discharges.ear")} />
            <Textarea
              value={formData.earDischarge || ""}
              onChange={(e) => onChange("earDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.ear")}
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Eye} label={t("examinations.discharges.eye")} />
            <Textarea
              value={formData.eyeDischarge || ""}
              onChange={(e) => onChange("eyeDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.eye")}
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Droplets} label={t("examinations.discharges.nasal")} />
            <Textarea
              value={formData.nasalDischarge || ""}
              onChange={(e) => onChange("nasalDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.nasal")}
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Bandage} label={t("examinations.discharges.wound")} />
            <Textarea
              value={formData.woundDischarge || ""}
              onChange={(e) => onChange("woundDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.wound")}
              rows={3}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={MoreHorizontal} label={t("examinations.discharges.other")} />
            <Textarea
              value={formData.otherDischarge || ""}
              onChange={(e) => onChange("otherDischarge", e.target.value)}
              placeholder={t("examinations.discharges.placeholders.other")}
              rows={3}
            />
          </FormFieldWrapper>
        </FormGrid>
      )}
    </FormSection>
  )
}
