"use client"

import { Home, MapPin, Users, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"

import { useTranslation } from "react-i18next"

const RadioGroup = ({ name, options, selectedValue, onChange, color, hasError }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
    {options.map(({ label, value }) => {
      const isActive = selectedValue === value
      return (
        <label
          key={value}
          className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center ${
            isActive
              ? `${color.border} ${color.bg} dark:${color.bg}/30 shadow-md dark:shadow-teal-500/20`
              : hasError
                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30 hover:bg-red-100 dark:hover:bg-red-900/30"
                : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"
          }`}
        >
          <input type="radio" name={name} checked={isActive} onChange={() => onChange(value)} className="hidden" />
          <span
            className={`font-medium text-xs sm:text-sm leading-tight ${
              isActive
                ? `${color.text} dark:text-teal-400`
                : hasError
                  ? "text-red-700 dark:text-red-400"
                  : "text-gray-700 dark:text-white"
            }`}
          >
            {label}
          </span>
        </label>
      )
    })}
  </div>
)

export function EnvironmentSection({
  formData,
  getFieldError,
  isFieldTouched,
  arrayErrors,
  onChange,
  onNestedChange,
  onAddItem,
  onRemoveItem,
}) {
  const { t } = useTranslation()
  // formData is already the environment data from parent component
  const environmentData = formData || {}

  const colorSchemes = {
    teal: { bg: "bg-teal-50", border: "border-teal-400", text: "text-teal-800" },
  }

  const breedingPlaceError = getFieldError("environment.breedingPlace")
  const hasBreedingPlaceError = breedingPlaceError || isFieldTouched("environment.breedingPlace")

  // Predefined breeding place options (logic values)
  const predefinedOptions = ["home", "garden", "both"]

  const breedingOptions = [
    { label: t("examinations.environment.breeding_options.home"), value: "home" },
    { label: t("examinations.environment.breeding_options.garden"), value: "garden" },
    { label: t("examinations.environment.breeding_options.both"), value: "both" },
    { label: t("examinations.environment.breeding_options.other"), value: "other" },
  ]

  // Handle backend data initialization for breeding place
  // Map old Arabic strings to new ones if necessary
  const [hasProcessedBackendData, setHasProcessedBackendData] = useState(false)

  useEffect(() => {
    const backendBreedingPlace = environmentData.breedingPlace

    if (!hasProcessedBackendData && backendBreedingPlace) {
      let mappedValue = backendBreedingPlace
      if (backendBreedingPlace === "منزل") mappedValue = "home"
      else if (backendBreedingPlace === "حديقة") mappedValue = "garden"
      else if (backendBreedingPlace === "بينهما") mappedValue = "both"
      else if (backendBreedingPlace === "غير ذلك") mappedValue = "other"

      if (mappedValue !== backendBreedingPlace) {
        onChange("breedingPlace", mappedValue)
      } else if (!predefinedOptions.includes(backendBreedingPlace) && backendBreedingPlace !== "other") {
        onChange("breedingPlace", "other")
        onChange("customBreedingPlace", backendBreedingPlace)
      }
      setHasProcessedBackendData(true)
    }
  }, [environmentData.breedingPlace, hasProcessedBackendData, onChange])

  return (
    <FormSection title={t("examinations.environment.title")} icon={Home}>
      <FormGrid>
        <div className="col-span-full lg:col-span-2">
          <FormFieldWrapper>
            <FormFieldHeader icon={MapPin} label={`${t("examinations.environment.breeding_place")} *`} />
            <RadioGroup
              name="breedingPlace"
              options={breedingOptions}
              selectedValue={environmentData.breedingPlace}
              onChange={(value) => onChange("breedingPlace", value)}
              color={colorSchemes.teal}
              hasError={hasBreedingPlaceError}
            />
            {hasBreedingPlaceError && <p className="text-sm text-red-600 mt-2">{breedingPlaceError}</p>}
            {environmentData.breedingPlace === "other" && (
              <div className="mt-3">
                <Input
                  value={environmentData.customBreedingPlace || ""}
                  onChange={(e) => onChange("customBreedingPlace", e.target.value)}
                  placeholder={t("examinations.environment.placeholders.custom_breeding_place")}
                />
              </div>
            )}
          </FormFieldWrapper>
        </div>

        <div className="col-span-full lg:col-span-3">
          <FormFieldWrapper>
            <FormFieldHeader icon={Users} label={t("examinations.environment.other_animals")} className="break-words" />

            <div className="space-y-4">
              {environmentData.otherAnimals?.map((animal, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-500/30 dark:shadow-teal-500/10"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      {t("examinations.environment.type")}: {animal.type}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-zinc-400">
                      {t("examinations.environment.count")}: {animal.count}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => onRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="bg-gray-50 dark:bg-zinc-800 p-4 rounded-lg border dark:border-zinc-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end">
                  <div className="lg:col-span-5 space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white">
                      {t("examinations.environment.type")}
                    </label>
                    <Input
                      value={environmentData.newAnimal?.type || ""}
                      onChange={(e) => onNestedChange("type", e.target.value)}
                      placeholder={t("examinations.environment.placeholders.animal_type")}
                      className={arrayErrors?.type ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {arrayErrors?.type && <p className="text-sm text-red-600">{arrayErrors.type}</p>}
                  </div>

                  <div className="lg:col-span-3 space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-white">
                      {t("examinations.environment.count")}
                    </label>
                    <Input
                      type="number"
                      value={environmentData.newAnimal?.count || ""}
                      onChange={(e) => onNestedChange("count", Number.parseInt(e.target.value) || 0)}
                      placeholder={t("examinations.environment.placeholders.animal_count")}
                      className={arrayErrors?.count ? "border-red-500 focus:border-red-500 focus:ring-red-500" : ""}
                    />
                    {arrayErrors?.count && <p className="text-sm text-red-600">{arrayErrors.count}</p>}
                  </div>

                  <div className="lg:col-span-4">
                    <Button
                      type="button"
                      onClick={onAddItem}
                      className="bg-teal-600 hover:bg-teal-700 text-white w-full transition-colors whitespace-normal leading-tight py-2 px-3 h-auto min-h-[2.5rem]"
                    >
                      {t("examinations.environment.add_animal")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </FormFieldWrapper>
        </div>
      </FormGrid>
    </FormSection>
  )
}
