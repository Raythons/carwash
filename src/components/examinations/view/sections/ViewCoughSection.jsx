"use client"

import { useTranslation } from "react-i18next"
import { Wind, Clock, Hash, Type, Blinds as Lungs } from "lucide-react"

export function ViewCoughSection({ data }) {
  const { t } = useTranslation()
  const d = data ?? {}
  const fmt = (v) => (v === true ? t("common.yes") : v === false ? t("common.no") : (v ?? "—"))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-sky-100 dark:bg-sky-900/30 rounded-xl">
          <Wind className="w-5 h-5 text-sky-600 dark:text-sky-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.cough.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 border border-sky-200 dark:border-sky-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-sky-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Wind className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <div className="text-sm font-medium text-sky-700 dark:text-sky-300">
                {t("examinations.cough.question")}
              </div>
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{fmt(d.hasCough)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-sky-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-green-500 dark:text-green-400" />
              <div className="text-sm font-medium text-green-700 dark:text-green-300">
                {t("examinations.cough.start")}
              </div>
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{fmt(d.coughStart)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-sky-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Hash className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <div className="text-sm font-medium text-orange-700 dark:text-orange-300">
                {t("examinations.cough.frequency")}
              </div>
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{fmt(d.coughFrequency)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-sky-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Type className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <div className="text-sm font-medium text-purple-700 dark:text-purple-300">
                {t("examinations.cough.type")}
              </div>
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{fmt(d.coughType)}</div>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-sky-100 dark:border-gray-700 md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <Lungs className="w-4 h-4 text-red-500 dark:text-red-400" />
              <div className="text-sm font-medium text-red-700 dark:text-red-300">
                {t("examinations.cough.difficulty")}
              </div>
            </div>
            <div className="text-base font-semibold text-gray-800 dark:text-white">{fmt(d.breathingDifficulty)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
