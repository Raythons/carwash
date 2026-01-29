"use client"

import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { Stethoscope, Activity, Thermometer, Heart, Wind, Clock, Droplets, FileText, Eye } from "lucide-react"

import { Input } from "../../ui/Input"
import { Textarea } from "../../ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const RadioGroup = ({ name, options, selectedValue, onChange, color }) => (
  <div className="grid grid-cols-2 gap-2 pt-2">
    {options.map(({ label, value }) => {
      const isActive = selectedValue === value
      return (
        <label
          key={String(value)}
          className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[44px] ${isActive ? `${color.border} ${color.bg} shadow-md dark:shadow-${color.border.split("-")[1]}-500/50` : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"}`}
        >
          <input type="radio" name={name} checked={isActive} onChange={() => onChange(value)} className="hidden" />
          <span
            className={`font-medium text-xs sm:text-sm leading-tight break-words ${isActive ? color.text : "text-gray-700 dark:text-zinc-300"}`}
          >
            {label}
          </span>
        </label>
      )
    })}
  </div>
)

const SelectField = ({ name, options, selectedValue, onChange, color }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-3">
    {options.map(({ label, value }) => {
      const isActive = selectedValue === value
      return (
        <label
          key={String(value)}
          className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[50px] ${isActive ? `${color.border} ${color.bg} shadow-md dark:shadow-green-500/50` : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"}`}
        >
          <input type="radio" name={name} checked={isActive} onChange={() => onChange(value)} className="hidden" />
          <span
            className={`font-medium text-xs sm:text-sm leading-tight break-words ${isActive ? color.text : "text-gray-700 dark:text-zinc-300"}`}
          >
            {label}
          </span>
        </label>
      )
    })}
  </div>
)

export function ClinicalExaminationSection({ formData, register, errors, onChange, getFieldError, isFieldTouched }) {
  const { t } = useTranslation()
  const safeFormData = formData || {}
  const hasDehydration = safeFormData.hasDehydration || false

  const colorSchemes = {
    blue: { bg: "bg-blue-50", border: "border-blue-400", text: "text-blue-800" },
    red: { bg: "bg-red-50", border: "border-red-400", text: "text-red-800" },
    green: { bg: "bg-green-50", border: "border-green-400", text: "text-green-800" },
  }

  const mucousOptions = [
    { label: t("examinations.clinical.mucous_options.normal_moist"), value: "normal_moist" },
    { label: t("examinations.clinical.mucous_options.normal_sticky"), value: "normal_sticky" },
    { label: t("examinations.clinical.mucous_options.pale"), value: "pale" },
    { label: t("examinations.clinical.mucous_options.cyanotic"), value: "cyanotic" },
    { label: t("examinations.clinical.mucous_options.icteric"), value: "icteric" },
    { label: t("examinations.clinical.mucous_options.congested"), value: "congested" },
    { label: t("examinations.clinical.mucous_options.muddy"), value: "muddy" },
  ]

  const [hasProcessedBackendData, setHasProcessedBackendData] = useState(false)

  useEffect(() => {
    if (!hasProcessedBackendData && formData) {
      const backendMucous = formData.mucousMembranes
      if (backendMucous) {
        if (backendMucous === "طبيعية رطبة") onChange("clinicalExamination.mucousMembranes", "normal_moist")
        else if (backendMucous === "طبيعية دبقة" || backendMucous === "طبيعية دبقة ")
          onChange("clinicalExamination.mucousMembranes", "normal_sticky")
        else if (backendMucous === "شاحبة") onChange("clinicalExamination.mucousMembranes", "pale")
        else if (backendMucous === "مزرقة") onChange("clinicalExamination.mucousMembranes", "cyanotic")
        else if (backendMucous === "مصفرة") onChange("clinicalExamination.mucousMembranes", "icteric")
        else if (backendMucous === "احتقان") onChange("clinicalExamination.mucousMembranes", "congested")
        else if (backendMucous === "لون طيني") onChange("clinicalExamination.mucousMembranes", "muddy")
      }
      setHasProcessedBackendData(true)
    }
  }, [formData, hasProcessedBackendData, onChange])

  return (
    <FormSection title={t("examinations.clinical.title")} icon={Stethoscope}>
      {/* Vital Signs Section */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-500/50 dark:shadow-blue-500/20 dark:shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t("examinations.clinical.vitals")}
          </h3>
        </div>
      </div>

      <FormGrid>
        {/* Dehydration Assessment - Responsive layout */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <div className="space-y-3">
              {/* Checkbox */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id="hasDehydration"
                  checked={hasDehydration}
                  onCheckedChange={(checked) => {
                    onChange("clinicalExamination.hasDehydration", checked)
                    if (!checked) {
                      onChange("clinicalExamination.dehydrationPercentage", null)
                    }
                  }}
                  className="flex-shrink-0"
                />
                <Label
                  htmlFor="hasDehydration"
                  className="text-md font-semibold text-gray-800 dark:text-white cursor-pointer"
                >
                  {t("examinations.clinical.dehydration")}
                </Label>
              </div>

              {/* Percentage field - shown when checkbox is checked */}
              {hasDehydration && (
                <div className="space-y-2">
                  <FormFieldHeader
                    icon={Droplets}
                    label={t("examinations.clinical.dehydration_percentage")}
                    className="mb-0"
                  />
                  <Input
                    type="number"
                    step="0.1"
                    value={safeFormData.dehydrationPercentage || ""}
                    onChange={(e) => onChange("clinicalExamination.dehydrationPercentage", e.target.value)}
                    placeholder={t("examinations.clinical.placeholders.percentage")}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </FormFieldWrapper>
        </div>

        {/* Temperature */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Thermometer} label={t("examinations.clinical.temperature")} />
          <Input
            type="number"
            step="0.1"
            value={safeFormData.temperature || ""}
            onChange={(e) => onChange("clinicalExamination.temperature", e.target.value)}
            placeholder={t("examinations.clinical.placeholders.temperature")}
          />
        </FormFieldWrapper>

        {/* Heart Rate */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Heart} label={t("examinations.clinical.heart_rate")} />
          <Input
            type="number"
            value={safeFormData.heartRate || ""}
            onChange={(e) => onChange("clinicalExamination.heartRate", e.target.value)}
            placeholder={t("examinations.clinical.placeholders.heart_rate")}
          />
        </FormFieldWrapper>

        {/* Respiratory Rate */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Wind} label={t("examinations.clinical.respiratory_rate")} />
          <Input
            type="number"
            value={safeFormData.respiratoryRate || ""}
            onChange={(e) => onChange("clinicalExamination.respiratoryRate", e.target.value)}
            placeholder={t("examinations.clinical.placeholders.respiratory_rate")}
          />
        </FormFieldWrapper>

        {/* Capillary Refill Time (CRT) */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Clock} label={t("examinations.clinical.crt")} />
          <Input
            type="number"
            step="0.1"
            value={safeFormData.capillaryRefillTime || ""}
            onChange={(e) => onChange("clinicalExamination.capillaryRefillTime", e.target.value)}
            placeholder={t("examinations.clinical.placeholders.crt")}
          />
        </FormFieldWrapper>

        {/* Mucous Membranes */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={Eye} label={t("examinations.clinical.mucous_membranes")} />
            <SelectField
              name="clinicalExamination.mucousMembranes"
              options={mucousOptions}
              selectedValue={safeFormData.mucousMembranes}
              onChange={(value) => onChange("clinicalExamination.mucousMembranes", value)}
              color={colorSchemes.green}
            />
          </FormFieldWrapper>
        </div>

        {/* Petechial Hemorrhage */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Droplets} label={t("examinations.clinical.petechial")} />
          <RadioGroup
            name="clinicalExamination.petechialHemorrhage"
            options={[
              { label: t("common.yes"), value: true },
              { label: t("common.no"), value: false },
            ]}
            selectedValue={safeFormData.petechialHemorrhage}
            onChange={(value) => onChange("clinicalExamination.petechialHemorrhage", value)}
            color={colorSchemes.red}
          />
        </FormFieldWrapper>

        {/* Lymph Node Enlargement */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Activity} label={t("examinations.clinical.lymph_node")} />
          <RadioGroup
            name="clinicalExamination.lymphNodeEnlargement"
            options={[
              { label: t("common.yes"), value: true },
              { label: t("common.no"), value: false },
            ]}
            selectedValue={safeFormData.lymphNodeEnlargement}
            onChange={(value) => onChange("clinicalExamination.lymphNodeEnlargement", value)}
            color={colorSchemes.blue}
          />
        </FormFieldWrapper>

        {/* Clinical Examination Notes */}
        <div className="md:col-span-2 lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={FileText} label={t("examinations.clinical.notes")} />
            <Textarea
              value={safeFormData.clinicalExaminationNotes || ""}
              onChange={(e) => onChange("clinicalExamination.clinicalExaminationNotes", e.target.value)}
              placeholder={t("examinations.clinical.placeholders.notes")}
              rows={4}
            />
          </FormFieldWrapper>
        </div>
      </FormGrid>
    </FormSection>
  )
}
