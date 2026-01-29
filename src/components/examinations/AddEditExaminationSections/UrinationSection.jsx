"use client"

import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { Droplets, Clock, Palette, Activity, AlertTriangle } from "lucide-react"

import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const RadioGroup = ({ name, options, selectedValue, onChange, color }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 pt-2">
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

export function UrinationSection({ formData, onChange }) {
  const { t } = useTranslation()
  const hasUrinationIssues = formData.hasUrinationIssues || false

  const colorSchemes = {
    cyan: { bg: "bg-cyan-50", border: "border-cyan-400", text: "text-cyan-800" },
    red: { bg: "bg-red-50", border: "border-red-400", text: "text-red-800" },
  }

  const patternOptions = [
    { label: t("examinations.urination.pattern_options.continuous"), value: "continuous" },
    { label: t("examinations.urination.pattern_options.intermittent"), value: "intermittent" },
  ]

  const bloodLocationOptions = [
    { label: t("examinations.urination.blood_location_options.beginning"), value: "beginning" },
    { label: t("examinations.urination.blood_location_options.beginning_and_end"), value: "beginning_and_end" },
    { label: t("examinations.urination.blood_location_options.end"), value: "end" },
    { label: t("examinations.urination.blood_location_options.throughout"), value: "throughout" },
  ]

  // Handle backend data initialization
  const [hasProcessedBackendData, setHasProcessedBackendData] = useState(false)

  useEffect(() => {
    if (!hasProcessedBackendData && formData) {
      // Process Pattern
      const backendPattern = formData.urinationPattern
      if (backendPattern) {
        if (backendPattern === "متواصل") onChange("urinationPattern", "continuous")
        else if (backendPattern === "متقطع") onChange("urinationPattern", "intermittent")
      }

      // Process Blood Location
      const backendLocation = formData.bloodLocation
      if (backendLocation) {
        if (backendLocation === "في أوله") onChange("bloodLocation", "beginning")
        else if (backendLocation === "واله اخره" || backendLocation === "في أوله وآخره")
          onChange("bloodLocation", "beginning_and_end")
        else if (backendLocation === "في آخره") onChange("bloodLocation", "end")
        else if (backendLocation === "على طوله") onChange("bloodLocation", "throughout")
      }

      setHasProcessedBackendData(true)
    }
  }, [formData, hasProcessedBackendData, onChange])

  return (
    <FormSection title={t("examinations.urination.title")} icon={Droplets}>
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="flex items-center space-x-2 space-x-reverse bg-white dark:bg-zinc-900 p-4 rounded-lg border dark:border-zinc-700 shadow-sm dark:shadow-cyan-500/10">
          <Checkbox
            id="hasUrinationIssues"
            checked={hasUrinationIssues}
            onCheckedChange={(checked) => onChange("hasUrinationIssues", checked)}
          />
          <Label
            htmlFor="hasUrinationIssues"
            className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer"
          >
            {t("examinations.urination.question")}
          </Label>
        </div>
      </div>

      {hasUrinationIssues && (
        <FormGrid>
          <FormFieldWrapper>
            <FormFieldHeader icon={Clock} label={t("examinations.urination.frequency")} />
            <Input
              value={formData.urinationFrequency || ""}
              onChange={(e) => onChange("urinationFrequency", e.target.value)}
              placeholder={t("examinations.urination.placeholders.frequency")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Droplets} label={t("examinations.urination.volume")} />
            <Input
              value={formData.urineVolume || ""}
              onChange={(e) => onChange("urineVolume", e.target.value)}
              placeholder={t("examinations.urination.placeholders.volume")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Palette} label={t("examinations.urination.color")} />
            <Input
              value={formData.urineColor || ""}
              onChange={(e) => onChange("urineColor", e.target.value)}
              placeholder={t("examinations.urination.placeholders.color")}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={Activity} label={t("examinations.urination.pattern")} />
            <RadioGroup
              name="urinationPattern"
              options={patternOptions}
              selectedValue={formData.urinationPattern}
              onChange={(value) => onChange("urinationPattern", value)}
              color={colorSchemes.cyan}
            />
          </FormFieldWrapper>

          <FormFieldWrapper>
            <FormFieldHeader icon={AlertTriangle} label={t("examinations.urination.blood")} />
            <RadioGroup
              name="bloodInUrine"
              options={[
                { label: t("common.yes"), value: true },
                { label: t("common.no"), value: false },
              ]}
              selectedValue={formData.bloodInUrine}
              onChange={(value) => onChange("bloodInUrine", value)}
              color={colorSchemes.red}
            />
          </FormFieldWrapper>

          {formData.bloodInUrine === true && (
            <FormFieldWrapper>
              <FormFieldHeader icon={AlertTriangle} label={t("examinations.urination.blood_location")} />
              <RadioGroup
                name="bloodLocation"
                options={bloodLocationOptions}
                selectedValue={formData.bloodLocation}
                onChange={(value) => onChange("bloodLocation", value)}
                color={colorSchemes.red}
              />
            </FormFieldWrapper>
          )}

          <div className="lg:col-span-2">
            <FormFieldWrapper>
              <FormFieldHeader icon={AlertTriangle} label={t("examinations.urination.details")} />
              <Textarea
                value={formData.problemDetails || ""}
                onChange={(e) => onChange("problemDetails", e.target.value)}
                placeholder={t("examinations.urination.placeholders.details")}
                rows={4}
              />
            </FormFieldWrapper>
          </div>
        </FormGrid>
      )}
    </FormSection>
  )
}
