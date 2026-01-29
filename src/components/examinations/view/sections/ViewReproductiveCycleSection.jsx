"use client"

import { useTranslation } from "react-i18next"
import { Calendar, Heart } from "lucide-react"

export function ViewReproductiveCycleSection({ data }) {
  const { t, i18n } = useTranslation()
  const locale = i18n.language === "ar" ? "ar-SA" : "en-US"

  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(locale) : "—")

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30 rounded-lg">
          <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("examinations.reproductive.title")}
        </span>
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20 border border-pink-200 dark:border-pink-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
            <Calendar className="w-4 h-4 text-pink-600 dark:text-pink-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-pink-700 dark:text-pink-400 mb-1">
              {t("examinations.reproductive.last_cycle")}
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {fmtDate(data?.lastReproductiveCycle)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
