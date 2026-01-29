"use client"

import { useTranslation } from "react-i18next"
import { Activity, AlertTriangle } from "lucide-react"

export function ViewOtherConditionsSection({ data }) {
  const { t } = useTranslation()
  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
          <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.other.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                {t("examinations.other.paralysis")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(data?.paralysisLameness)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-orange-100 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500 dark:text-red-400" />
              <p className="text-sm font-medium text-red-700 dark:text-red-400">{t("examinations.other.itching")}</p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
              {v(data?.itchingHairLoss)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
