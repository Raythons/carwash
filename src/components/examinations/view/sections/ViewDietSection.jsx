"use client"

import { useTranslation } from "react-i18next"
import { Utensils, Droplets, Clock, TrendingUp, Apple } from "lucide-react"

export function ViewDietSection({ data }) {
  const { t } = useTranslation()
  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)

  const getFoodTypeLabel = (value) => {
    if (!value) return ""
    const mapping = {
      "دراي فود": "dry_food",
      "ويت فود": "wet_food",
      معلبات: "wet_food",
      "طعام منزل": "home_food",
      طبيعية: "fresh_veggies",
      خليط: "mixture",
      "غير ذلك": "other",
      dry_food: "dry_food",
      wet_food: "wet_food",
      home_food: "home_food",
      mixture: "mixture",
      fresh_veggies: "fresh_veggies",
      other: "other",
    }

    // If it's a comma-separated string (from backend)
    if (typeof value === "string" && value.includes("،")) {
      return value
        .split("،")
        .map((s) => {
          const trimmed = s.trim()
          const key = mapping[trimmed] || trimmed
          return t(`examinations.diet.food_options.${key}`, { defaultValue: trimmed })
        })
        .join("، ")
    }

    const key = mapping[value] || value
    return t(`examinations.diet.food_options.${key}`, { defaultValue: value })
  }

  const getWaterIntakeLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      طبيعية: "normal",
      قليلة: "low",
      كثيرة: "high",
      "لا يشرب": "none",
      normal: "normal",
      low: "low",
      high: "high",
      none: "none",
    }
    const key = mapping[value] || value
    return t(`examinations.diet.water_options.${key}`, { defaultValue: value })
  }

  // foodType is a string in the response; combine with optional customFoodType
  const baseFood = (data?.foodType || "").toString().trim()
  const customFood = (data?.customFoodType || "").toString().trim()

  const localizedBaseFood = getFoodTypeLabel(baseFood)

  const combinedFoodTypeText = (() => {
    if (localizedBaseFood && customFood) return `${localizedBaseFood}، ${customFood}`
    if (localizedBaseFood) return localizedBaseFood
    if (customFood) return customFood
    return ""
  })()

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl">
          <Utensils className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.diet.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Apple className="w-4 h-4 text-green-500 dark:text-green-400" />
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                {t("examinations.diet.food_type")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(combinedFoodTypeText)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("examinations.diet.meals_info")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(data?.mealsPerDayAndHowToGive)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {t("examinations.diet.sudden_change")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(data?.suddenDietChange)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
                {t("examinations.diet.water_intake")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white">{getWaterIntakeLabel(data?.waterIntake)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-gray-700 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {t("examinations.diet.appetite_changes")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(data?.appetiteChanges)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
