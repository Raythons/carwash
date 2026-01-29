"use client"

import { useTranslation } from "react-i18next"
import { ClipboardList, Clock, Activity, User, Plane } from "lucide-react"

export function ViewVisitInformationSection({ data }) {
  const { t } = useTranslation()

  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)

  // Map backend values to logical keys if needed
  const getProgressLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      تحسن: "improving",
      سوء: "worsening",
      استقرار: "stable",
      improving: "improving",
      worsening: "worsening",
      stable: "stable",
    }
    const key = mapping[value] || value
    return t(`examinations.visit.progress_options.${key}`, { defaultValue: value })
  }

  const fields = [
    { key: "mainReason", label: t("examinations.visit.main_reason"), icon: ClipboardList, span: "md:col-span-2" },
    { key: "symptomsStarted", label: t("examinations.visit.symptoms_started"), icon: Clock },
    {
      key: "diseaseProgress",
      label: t("examinations.visit.disease_progress"),
      icon: Activity,
      formatter: getProgressLabel,
    },
    { key: "ownership", label: t("examinations.visit.ownership"), icon: User },
    { key: "travelHistory", label: t("examinations.visit.travel_history"), icon: Plane },
    { key: "exercise", label: t("examinations.visit.exercise"), icon: Activity },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-lg">
          <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">{t("examinations.visit.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {fields.map((field) => (
            <div
              key={field.key}
              className={`bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-800 ${field.span || ""}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <field.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">{field.label}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                {field.formatter ? field.formatter(data?.[field.key]) : v(data?.[field.key])}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
              {t("examinations.visit.previous_treatments")}
            </p>
          </div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap break-words">
            {v(data?.previousTreatments)}
          </p>
        </div>
      </div>
    </div>
  )
}
