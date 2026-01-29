"use client"

import { useTranslation } from "react-i18next"
import { Zap, Video, Utensils, Activity, AlertCircle, Clock } from "lucide-react"

export function ViewConvulsionsSection({ data }) {
  const { t } = useTranslation()
  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)
  const b = (x) => {
    if (x === true) return t("common.yes")
    if (x === false) return t("common.no")
    if (x === "نعم") return t("common.yes")
    if (x === "لا") return t("common.no")
    return "—"
  }
  const has = data?.hasConvulsions

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl">
          <Zap className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.convulsions.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-red-500 dark:text-red-400" />
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {t("examinations.convulsions.question")}
              </p>
            </div>
            <p className="font-semibold text-gray-800 dark:text-white text-base">{b(has)}</p>
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {t("examinations.convulsions.video")}
              </p>
            </div>
            <p className="font-semibold text-gray-800 dark:text-white text-base">{b(data?.videoRecording)}</p>
          </div>
        </div>

        {has && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  {t("examinations.convulsions.details")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words leading-relaxed">
                {v(data?.convulsionDetails)}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    {t("examinations.convulsions.symptoms")}
                  </p>
                </div>
                <p className="font-medium text-gray-800 dark:text-white whitespace-pre-wrap break-words">
                  {v(data?.seizureSymptoms)}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Utensils className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    {t("examinations.convulsions.after_food")}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-white">{b(data?.seizureAfterFood)}</p>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {t("examinations.convulsions.after_exercise")}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-white">{b(data?.seizureAfterExercise)}</p>
              </div>

              <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-red-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-red-500 dark:text-red-400" />
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    {t("examinations.convulsions.sudden_collapse")}
                  </p>
                </div>
                <p className="font-semibold text-gray-800 dark:text-white">{b(data?.suddenCollapse)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
