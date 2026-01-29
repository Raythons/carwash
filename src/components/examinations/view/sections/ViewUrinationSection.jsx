"use client"

import { useTranslation } from "react-i18next"
import { Droplets, Clock, Palette, Activity, AlertTriangle } from "lucide-react"

export function ViewUrinationSection({ data }) {
  const { t } = useTranslation()
  const d = data ?? {}

  const fmt = (v) => (v === true ? t("common.yes") : v === false ? t("common.no") : (v ?? "—"))

  const getPatternLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      متواصل: "continuous",
      مستمر: "continuous",
      متقطع: "intermittent",
      continuous: "continuous",
      intermittent: "intermittent",
    }
    const key = mapping[value] || value
    return t(`examinations.urination.pattern_options.${key}`, { defaultValue: value })
  }

  const getBloodLocationLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      "في أوله": "beginning",
      "في بداية التبول": "beginning",
      "في آخره": "end",
      "في نهاية التبول": "end",
      "على طوله": "throughout",
      "طوال فترة التبول": "throughout",
      "في أوله وآخره": "beginning_and_end",
      "بداية التبول ونهايته": "beginning_and_end",
      beginning: "beginning",
      end: "end",
      throughout: "throughout",
      beginning_and_end: "beginning_and_end",
    }
    const key = mapping[value] || value
    return t(`examinations.urination.blood_location_options.${key}`, { defaultValue: value })
  }

  const fields = [
    { key: "urinationFrequency", label: t("examinations.urination.frequency"), icon: Clock },
    { key: "urineVolume", label: t("examinations.urination.volume"), icon: Droplets },
    { key: "urineColor", label: t("examinations.urination.color"), icon: Palette },
    { key: "urinationPattern", label: t("examinations.urination.pattern"), icon: Activity, formatter: getPatternLabel },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-950/30 dark:to-blue-950/30 rounded-lg">
          <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("examinations.urination.title")}</h3>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.key}
              className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-cyan-100 dark:border-cyan-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <field.icon className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <div className="text-xs font-medium text-cyan-700 dark:text-cyan-400">{field.label}</div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {field.formatter ? field.formatter(d[field.key]) : fmt(d[field.key])}
              </div>
            </div>
          ))}

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-cyan-100 dark:border-cyan-800 md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <div className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                {t("examinations.urination.blood")}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{fmt(d.bloodInUrine)}</div>
            {d.bloodInUrine === true && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">{t("common.location")}:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {getBloodLocationLabel(d.bloodLocation)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {d.problemDetails && (
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-cyan-100 dark:border-cyan-800 md:col-span-2">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <div className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                  {t("examinations.urination.details")}
                </div>
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
                {d.problemDetails}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
