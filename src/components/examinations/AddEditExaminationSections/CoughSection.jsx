"use client"

import { useTranslation } from "react-i18next"
import { Wind, Clock, Hash, Type, Activity } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "../../ui/Input"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

const RadioGroup = ({ name, options, selectedValue, onChange, color }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
    {options.map(({ label, value }) => {
      const isActive = selectedValue === value
      return (
        <label
          key={String(value)}
          className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[44px] ${isActive ? `${color.border} ${color.bg} dark:${color.bg}/30 shadow-md dark:shadow-${color.border.split("-")[1]}-500/20` : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"}`}
        >
          <input type="radio" name={name} checked={isActive} onChange={() => onChange(value)} className="hidden" />
          <span
            className={`font-medium text-xs sm:text-sm leading-tight break-words ${isActive ? `${color.text} dark:text-${color.text.split("-")[1]}-400` : "text-gray-700 dark:text-white"}`}
          >
            {label}
          </span>
        </label>
      )
    })}
  </div>
)

export function CoughSection({ formData, onChange }) {
  const { t } = useTranslation()
  const hasCough = formData.hasCough || false

  const colorSchemes = {
    green: { bg: "bg-green-50", border: "border-green-400", text: "text-green-800" },
    orange: { bg: "bg-orange-50", border: "border-orange-400", text: "text-orange-800" },
    purple: { bg: "bg-purple-50", border: "border-purple-400", text: "text-purple-800" },
    red: { bg: "bg-red-50", border: "border-red-400", text: "text-red-800" },
  }

  return (
    <FormSection title={t("examinations.cough.title")} icon={Wind}>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow-sm dark:shadow-cyan-500/10">
          <Checkbox id="hasCough" checked={hasCough} onCheckedChange={(checked) => onChange("hasCough", checked)} />
          <Label htmlFor="hasCough" className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer">
            {t("examinations.cough.question")}
          </Label>
        </div>
      </div>

      {hasCough && (
        <FormGrid>
          <FormFieldWrapper>
            <FormFieldHeader icon={Clock} label={t("examinations.cough.start")} />
            <Input
              value={formData.coughStart || ""}
              onChange={(e) => onChange("coughStart", e.target.value)}
              placeholder={t("examinations.cough.placeholders.start")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Hash} label={t("examinations.cough.frequency")} />
            <Input
              value={formData.coughFrequency || ""}
              onChange={(e) => onChange("coughFrequency", e.target.value)}
              placeholder={t("examinations.cough.placeholders.frequency")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Type} label={t("examinations.cough.type")} />
            <Input
              value={formData.coughType || ""}
              onChange={(e) => onChange("coughType", e.target.value)}
              placeholder={t("examinations.cough.placeholders.type")}
              className="w-full"
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Activity} label={t("examinations.cough.difficulty")} />
            <RadioGroup
              name="breathingDifficulty"
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false },
              ]}
              selectedValue={formData.breathingDifficulty}
              onChange={(value) => onChange("breathingDifficulty", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>
        </FormGrid>
      )}
    </FormSection>
  )
}
