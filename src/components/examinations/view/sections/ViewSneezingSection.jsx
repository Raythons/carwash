"use client"

import { useTranslation } from "react-i18next"
import { Wind, AlertCircle } from "lucide-react"

export function ViewSneezingSection({ data }) {
  const { t } = useTranslation()
  const d = data ?? {}
  const fmt = (v) => (v === true ? t("common.yes") : v === false ? t("common.no") : (v ?? "—"))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-950/30 dark:to-cyan-950/30 rounded-lg">
          <Wind className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("examinations.sneezing.title")}</h3>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div className="text-xs font-medium text-teal-700 dark:text-teal-400">
                {t("examinations.sneezing.question")}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{fmt(d.hasSneezing)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <div className="text-xs font-medium text-teal-700 dark:text-teal-400">
                {t("examinations.sneezing.details")}
              </div>
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white whitespace-pre-wrap">
              {fmt(d.sneezingDetails)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
