"use client"

import { useTranslation } from "react-i18next"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { Utensils, Apple, Clock, TrendingUp, Droplets } from "lucide-react"
import { useEffect, useState, useMemo } from "react"

export function DietSection({ formData, onChange, onCheckboxChange, getFieldError, isFieldTouched, isSubmitted }) {
  const { t } = useTranslation()
  const dietData = formData || {}

  // Predefined food type options (logic values)
  const predefinedFoodTypes = ["dry_food", "wet_food", "home_food", "mixture", "fresh_veggies"]

  // Map Arabic values from backend to our keys
  const foodTypeMap = useMemo(
    () => ({
      "دراي فود": "dry_food",
      "ويت فود": "wet_food",
      "طعام المنزل": "home_food",
      خليط: "mixture",
      "خضروات طازجة": "fresh_veggies",
    }),
    [],
  )

  const waterIntakeMap = useMemo(
    () => ({
      طبيعية: "normal",
      قليلة: "low",
      كثيرة: "high",
      "لا يشرب": "none",
    }),
    [],
  )

  const foodOptions = useMemo(
    () => [
      { label: t("examinations.diet.food_options.dry_food"), value: "dry_food" },
      { label: t("examinations.diet.food_options.wet_food"), value: "wet_food" },
      { label: t("examinations.diet.food_options.home_food"), value: "home_food" },
      { label: t("examinations.diet.food_options.mixture"), value: "mixture" },
      { label: t("examinations.diet.food_options.fresh_veggies"), value: "fresh_veggies" },
      { label: t("examinations.diet.food_options.other"), value: "other" },
    ],
    [t],
  )

  const waterOptions = useMemo(
    () => [
      { label: t("examinations.diet.water_options.normal"), value: "normal" },
      { label: t("examinations.diet.water_options.low"), value: "low" },
      { label: t("examinations.diet.water_options.high"), value: "high" },
      { label: t("examinations.diet.water_options.none"), value: "none" },
    ],
    [t],
  )

  // Handle backend data initialization
  const [hasProcessedBackendData, setHasProcessedBackendData] = useState(false)

  useEffect(() => {
    if (!hasProcessedBackendData && formData) {
      // Process foodType
      const backendFoodType = dietData.foodType
      if (backendFoodType) {
        if (typeof backendFoodType === "string") {
          const mapped = foodTypeMap[backendFoodType]
          if (mapped) {
            onChange("foodType", [mapped])
          } else if (backendFoodType !== "غير ذلك" && !predefinedFoodTypes.includes(backendFoodType)) {
            onChange("showCustomFoodType", true)
            onChange("customFoodType", backendFoodType)
            onChange("foodType", [])
          }
        } else if (Array.isArray(backendFoodType)) {
          const mappedArray = backendFoodType.map((item) => foodTypeMap[item] || item)
          const predefined = mappedArray.filter((item) => predefinedFoodTypes.includes(item))
          const others = mappedArray.filter((item) => !predefinedFoodTypes.includes(item))

          if (predefined.length > 0) onChange("foodType", predefined)
          if (others.length > 0) {
            onChange("showCustomFoodType", true)
            onChange("customFoodType", others.join(", "))
          }
        }
      }

      // Process waterIntake
      const backendWater = dietData.waterIntake
      if (backendWater && waterIntakeMap[backendWater]) {
        onChange("waterIntake", waterIntakeMap[backendWater])
      } else if (backendWater && !Object.values(waterIntakeMap).includes(backendWater)) {
        // Keep as is if already a key or not mappable
      }

      setHasProcessedBackendData(true)
    }
  }, [
    formData,
    hasProcessedBackendData,
    onChange,
    dietData.foodType,
    dietData.waterIntake,
    foodTypeMap,
    waterIntakeMap,
    predefinedFoodTypes,
  ])

  const getFoodTypeString = () => {
    if (!dietData.foodType || !Array.isArray(dietData.foodType)) {
      return dietData.customFoodType || t("examinations.diet.not_specified")
    }
    const displayArray = dietData.foodType.map((val) => t(`examinations.diet.food_options.${val}`))
    if (dietData.showCustomFoodType && dietData.customFoodType && dietData.customFoodType.trim()) {
      displayArray.push(dietData.customFoodType.trim())
    }
    return displayArray.length > 0 ? displayArray.join(", ") : t("examinations.diet.not_specified")
  }

  const handleFoodTypeChange = (value, checked) => {
    if (value === "other") {
      onChange("showCustomFoodType", checked)
      if (!checked) {
        onChange("customFoodType", "")
      }
    } else {
      onCheckboxChange("foodType", value, checked)
    }
  }

  return (
    <FormSection title={t("examinations.diet.title")} icon={Utensils}>
      <FormGrid>
        {/* Food Type */}
        <FormFieldWrapper className="md:col-span-2">
          <FormFieldHeader icon={Apple} label={`${t("examinations.diet.food_type")} *`} />
          <div className="p-3 bg-gray-50 dark:bg-zinc-800 dark:border-zinc-700 rounded-md border mb-3">
            <p className="text-sm text-gray-600 dark:text-zinc-400">{t("examinations.diet.currently_selected")}</p>
            <p className="text-sm font-medium text-gray-800 dark:text-white break-words">{getFoodTypeString()}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {foodOptions.map(({ label, value }) => (
              <label
                key={value}
                className={`flex items-center space-x-2 space-x-reverse cursor-pointer p-3 rounded-md border transition-colors hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:border-green-500/50 ${
                  (value === "other" ? dietData.showCustomFoodType : dietData.foodType?.includes(value))
                    ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-500/50"
                    : "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={
                    value === "other"
                      ? dietData.showCustomFoodType || false
                      : dietData.foodType?.includes(value) || false
                  }
                  onChange={(e) => handleFoodTypeChange(value, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium leading-tight text-gray-700 dark:text-zinc-300 break-words">
                  {label}
                </span>
              </label>
            ))}
          </div>
          <div className="min-h-[20px] mt-1">
            {getFieldError("diet.foodType") && (isSubmitted || isFieldTouched("diet.foodType")) && (
              <p className="text-sm text-red-600 break-words">{getFieldError("diet.foodType")}</p>
            )}
            {(!dietData.foodType || dietData.foodType.length === 0) &&
              (!dietData.showCustomFoodType || !dietData.customFoodType?.trim()) &&
              isSubmitted && (
                <p className="text-sm text-red-600 break-words">
                  {t("examinations.diet.validation.food_type_required")}
                </p>
              )}
          </div>
          {dietData.showCustomFoodType && (
            <div className="mt-3">
              <Input
                value={dietData.customFoodType || ""}
                onChange={(e) => onChange("customFoodType", e.target.value)}
                placeholder={t("examinations.diet.placeholders.custom_food_type")}
                className="w-full"
              />
            </div>
          )}
        </FormFieldWrapper>

        {/* Meals Info */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Clock} label={`${t("examinations.diet.meals_info")} *`} />
          <Textarea
            value={dietData.mealsPerDayAndHowToGive || ""}
            onChange={(e) => onChange("mealsPerDayAndHowToGive", e.target.value)}
            placeholder={t("examinations.diet.placeholders.meals_info")}
            rows={3}
            className={`w-full ${
              getFieldError("diet.mealsPerDay") && (isSubmitted || isFieldTouched("diet.mealsPerDay"))
                ? "border-red-500"
                : ""
            }`}
          />
          <div className="min-h-[20px] mt-1">
            {getFieldError("diet.mealsPerDay") && (isSubmitted || isFieldTouched("diet.mealsPerDay")) && (
              <p className="text-sm text-red-600 break-words">{getFieldError("diet.mealsPerDay")}</p>
            )}
          </div>
        </FormFieldWrapper>

        {/* Sudden Diet Change */}
        <FormFieldWrapper>
          <FormFieldHeader icon={TrendingUp} label={t("examinations.diet.sudden_change")} />
          <Input
            value={dietData.suddenDietChange || ""}
            onChange={(e) => onChange("suddenDietChange", e.target.value)}
            placeholder={t("examinations.diet.placeholders.sudden_change")}
            className="w-full"
          />
        </FormFieldWrapper>

        {/* Water Intake */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Droplets} label={`${t("examinations.diet.water_intake")} *`} />
          <div className="grid grid-cols-2 gap-2 pt-2">
            {waterOptions.map(({ label, value }) => (
              <label
                key={value}
                className={`flex items-center justify-center cursor-pointer p-3 rounded-lg border-2 transition-all duration-200 text-center min-h-[44px] ${
                  dietData.waterIntake === value
                    ? "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-400 dark:border-cyan-500 dark:shadow-cyan-500/50 shadow-md"
                    : "bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700"
                }`}
              >
                <input
                  type="radio"
                  name="waterIntake"
                  value={value}
                  checked={dietData.waterIntake === value}
                  onChange={(e) => onChange("waterIntake", e.target.value)}
                  className="hidden"
                />
                <span
                  className={`font-medium text-xs sm:text-sm leading-tight break-words ${
                    dietData.waterIntake === value
                      ? "text-cyan-800 dark:text-cyan-300"
                      : "text-gray-700 dark:text-zinc-300"
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>
          <div className="min-h-[20px] mt-1">
            {getFieldError("diet.waterIntake") && (isSubmitted || isFieldTouched("diet.waterIntake")) && (
              <p className="text-sm text-red-600 break-words">{getFieldError("diet.waterIntake")}</p>
            )}
          </div>
        </FormFieldWrapper>

        {/* Appetite Changes */}
        <FormFieldWrapper>
          <FormFieldHeader icon={TrendingUp} label={t("examinations.diet.appetite_changes")} />
          <Input
            value={dietData.appetiteChanges || ""}
            onChange={(e) => onChange("appetiteChanges", e.target.value)}
            placeholder={t("examinations.diet.placeholders.appetite_changes")}
            className="w-full"
          />
        </FormFieldWrapper>
      </FormGrid>
    </FormSection>
  )
}
