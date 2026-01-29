"use client"

import { useTranslation } from "react-i18next"
import { Pill, Syringe, Clock, CalendarIcon, FileText } from "lucide-react"

export function ViewTreatmentSection({ data }) {
  const { t, i18n } = useTranslation()
  const d = data ?? {}
  const fmt = (v) => (v === null || v === undefined || v === "" ? "—" : v)
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(i18n.language) : "—")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
          <Syringe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t("examinations.treatment.title")}</h3>
      </div>

      {/* Treatments List */}
      <div className="space-y-4">
        {Array.isArray(d.treatments) && d.treatments.length > 0 ? (
          d.treatments.map((tr, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
                  <Pill className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {t("examinations.treatment.treatment_number", { index: idx + 1 })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    {t("examinations.treatment.medicine_label")}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{fmt(tr?.medicine)}</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    {t("examinations.treatment.dosage_label")}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">{fmt(tr?.dosage)}</div>
                </div>
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="text-xs font-medium text-blue-700 dark:text-blue-400 mb-1">
                    {t("examinations.treatment.method_label")}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {fmt(tr?.administrationMethod)}
                  </div>
                </div>
              </div>

              {tr?.recommendations && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <div className="text-xs font-medium text-blue-700 dark:text-blue-400">
                      {t("examinations.treatment.recommendations_label")}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{tr.recommendations}</div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-500 dark:text-gray-400 text-center">
            {t("examinations.treatment.no_treatments")}
          </div>
        )}
      </div>

      {/* Follow-up */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white dark:bg-gray-800/50 rounded-lg shadow-sm">
            <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white">
            {t("examinations.treatment.follow_up_title")}
          </h4>
        </div>

        <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 shadow-sm border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-3">
            <CalendarIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div>
              <div className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                {t("examinations.treatment.follow_up_date_label")}
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{fmtDate(d.followUpDate)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
