"use client"

import { useTranslation } from "react-i18next"
import { FlaskConical, AlertCircle, Droplets, Clock } from "lucide-react"

export function ViewVomitingSection({ data }) {
  const { t } = useTranslation()
  const d = data ?? {}

  const fmt = (v) => (v === true ? t("common.yes") : v === false ? t("common.no") : (v ?? "—"))

  const getVomitContentLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      دم: "blood",
      طعام: "food",
      شراب: "drink",
      ماء: "drink",
      عصارة: "juice",
      "طعام غير مهضوم": "undigested_food",
      "سائل أصفر": "yellow_liquid",
      "رغوة بيضاء": "white_foam",
      "عصارة صفراوية": "bile",
      "غير ذلك": "other",
      blood: "blood",
      food: "food",
      drink: "drink",
      juice: "juice",
      undigested_food: "undigested_food",
      yellow_liquid: "yellow_liquid",
      white_foam: "white_foam",
      bile: "bile",
      other: "other",
    }

    // If it's a comma-separated string (from backend)
    if (typeof value === "string" && value.includes("،")) {
      return value
        .split("،")
        .map((s) => {
          const trimmed = s.trim()
          const key = mapping[trimmed] || trimmed
          return t(`examinations.vomiting.content_options.${key}`, { defaultValue: trimmed })
        })
        .join("، ")
    }

    const key = mapping[value] || value
    return t(`examinations.vomiting.content_options.${key}`, { defaultValue: value })
  }

  const getFoodRelationLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      "بعد الأكل مباشرة": "immediately_after",
      "بعد الأكل فورًا": "soon_after",
      "بعده 1/2 ساعة أو ساعة": "half_to_one_hour",
      "ليس له علاقة بالأكل": "no_relation",
      "ليس له عالقة بالأكل": "no_relation", // Typos handling
      immediately_after: "immediately_after",
      soon_after: "soon_after",
      half_to_one_hour: "half_to_one_hour",
      no_relation: "no_relation",
    }
    const key = mapping[value] || value
    return t(`examinations.vomiting.food_relation_options.${key}`, { defaultValue: value })
  }

  const vomitContentText =
    (d.vomitContent && getVomitContentLabel(d.vomitContent.toString().trim())) ||
    (d.customVomitContent && d.customVomitContent.toString().trim()) ||
    "—"

  const fields = [
    { key: "hasVomiting", label: t("examinations.vomiting.question"), icon: AlertCircle, formatter: fmt },
    { key: "vomitingFrequency", label: t("examinations.vomiting.frequency"), icon: Clock, formatter: (v) => v || "—" },
    { key: "dipstick", label: t("examinations.vomiting.dipstick"), icon: FlaskConical, formatter: (v) => v || "—" },
    { key: "waterVomiting", label: t("examinations.vomiting.water_vomiting"), icon: Droplets, formatter: fmt },
    {
      key: "vomitingFoodRelation",
      label: t("examinations.vomiting.food_relation"),
      icon: FlaskConical,
      formatter: getFoodRelationLabel,
    },
    {
      key: "vomitConsistency",
      label: t("examinations.vomiting.consistency"),
      icon: FlaskConical,
      formatter: (v) => v || "—",
    },
    { key: "retching", label: t("examinations.vomiting.retching"), icon: AlertCircle, formatter: fmt },
    { key: "withDiarrhea", label: t("examinations.vomiting.with_diarrhea"), icon: Droplets, formatter: fmt },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-lg">
          <FlaskConical className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("examinations.vomiting.title")}</h3>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.key}
              className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-red-100 dark:border-red-900/50"
            >
              <div className="flex items-center gap-2 mb-2">
                <field.icon className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div className="text-xs font-medium text-red-700 dark:text-red-400">{field.label}</div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                {field.formatter ? field.formatter(d[field.key]) : d[field.key] || "—"}
              </div>
            </div>
          ))}

          <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-red-100 dark:border-red-900/50 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <FlaskConical className="w-4 h-4 text-red-600 dark:text-red-400" />
              <div className="text-xs font-medium text-red-700 dark:text-red-400">
                {t("examinations.vomiting.content")}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap break-words">
              {vomitContentText}
            </div>
          </div>

          {d.withDiarrhea === true && (
            <div className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm border border-red-100 dark:border-red-900/50 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-red-600 dark:text-red-400" />
                <div className="text-xs font-medium text-red-700 dark:text-red-400">
                  {t("examinations.vomiting.placeholders.diarrhea_details")}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                {fmt(d.diarrheaDetails)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
