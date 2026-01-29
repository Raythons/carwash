"use client"

import { useTranslation } from "react-i18next"
import { Zap, AlertCircle, Video, Activity, Clock, Utensils } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"

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

export function ConvulsionsSection({ formData, onChange }) {
  const { t } = useTranslation()
  const hasConvulsions = formData.hasConvulsions || false

  const colorSchemes = {
    red: { bg: "bg-red-50", border: "border-red-400", text: "text-red-800" },
    blue: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-800" },
    purple: { bg: "bg-purple-50", border: "border-purple-400", text: "text-purple-800" },
    green: { bg: "bg-green-50", border: "border-green-400", text: "text-green-800" },
    orange: { bg: "bg-orange-50", border: "border-orange-400", text: "text-orange-800" },
  }

  const radioOptions = [
    { label: t("common.yes"), value: true },
    { label: t("common.no"), value: false },
  ]

  return (
    <FormSection title={t("examinations.convulsions.title")} icon={Zap}>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow-sm dark:shadow-purple-500/10">
          <Checkbox
            id="hasConvulsions"
            checked={hasConvulsions}
            onCheckedChange={(checked) => onChange("hasConvulsions", checked)}
          />
          <Label
            htmlFor="hasConvulsions"
            className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer"
          >
            {t("examinations.convulsions.question")}
          </Label>
        </div>
      </div>

      {hasConvulsions && (
        <FormGrid className="lg:grid-cols-2">
          <div className="lg:col-span-2">
            <FormFieldWrapper>
              <FormFieldHeader icon={AlertCircle} label={t("examinations.convulsions.details")} />
              <Textarea
                value={formData.convulsionDetails || ""}
                onChange={(e) => onChange("convulsionDetails", e.target.value)}
                placeholder={t("examinations.convulsions.placeholders.details")}
                rows={4}
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper>
            <FormFieldHeader icon={Video} label={t("examinations.convulsions.video")} />
            <RadioGroup
              name="videoRecording"
              options={radioOptions}
              selectedValue={formData.videoRecording}
              onChange={(value) => onChange("videoRecording", value)}
              color={colorSchemes.blue}
            />
          </FormFieldWrapper>

          <div className="lg:col-span-2">
            <FormFieldWrapper>
              <FormFieldHeader icon={Activity} label={t("examinations.convulsions.symptoms")} />
              <Input
                value={formData.seizureSymptoms || ""}
                onChange={(e) => onChange("seizureSymptoms", e.target.value)}
                placeholder={t("examinations.convulsions.placeholders.symptoms")}
                className="w-full"
              />
            </FormFieldWrapper>
          </div>

          <FormFieldWrapper>
            <FormFieldHeader icon={AlertCircle} label={t("examinations.convulsions.strong_convulsions")} />
            <RadioGroup
              name="seizureWithStrongConvulsions"
              options={radioOptions}
              selectedValue={formData.seizureWithStrongConvulsions}
              onChange={(value) => onChange("seizureWithStrongConvulsions", value)}
              color={colorSchemes.purple}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Clock} label={t("examinations.convulsions.sudden_collapse")} />
            <RadioGroup
              name="suddenCollapse"
              options={radioOptions}
              selectedValue={formData.suddenCollapse}
              onChange={(value) => onChange("suddenCollapse", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Utensils} label={t("examinations.convulsions.after_food")} />
            <RadioGroup
              name="seizureAfterFood"
              options={radioOptions}
              selectedValue={formData.seizureAfterFood}
              onChange={(value) => onChange("seizureAfterFood", value)}
              color={colorSchemes.green}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Activity} label={t("examinations.convulsions.after_exercise")} />
            <RadioGroup
              name="seizureAfterExercise"
              options={radioOptions}
              selectedValue={formData.seizureAfterExercise}
              onChange={(value) => onChange("seizureAfterExercise", value)}
              color={colorSchemes.blue}
            />
          </FormFieldWrapper>
        </FormGrid>
      )}
    </FormSection>
  )
}
