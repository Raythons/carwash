"use client"

import { useTranslation } from "react-i18next"
import { History, Calendar, FileText, ExternalLink } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ViewPreviousConditionsSection({ data }) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const d = data ?? {}
  const items = Array.isArray(d.conditions) ? d.conditions : []
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(i18n.language) : "—")

  const handleExaminationClick = (examinationId) => {
    if (examinationId) {
      navigate(`/clinic/examinations/${examinationId}`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
          <History className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.previous.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-purple-100 dark:border-purple-800 hover:border-purple-200 dark:hover:border-purple-700 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                    <span className="text-base font-semibold text-gray-800 dark:text-white">
                      {it?.condition ?? "—"}
                    </span>
                    {it?.examinationId && (
                      <button
                        onClick={() => handleExaminationClick(it.examinationId)}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-2 py-1 rounded-md transition-colors duration-200"
                        title={t("examinations.previous.view_exam")}
                      >
                        <span>#{it.examinationId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded">
                      {fmtDate(it?.date)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 border border-purple-100 dark:border-purple-800 text-center">
            <History className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <div className="text-base text-gray-500 dark:text-gray-400">{t("examinations.previous.no_conditions")}</div>
          </div>
        )}
      </div>
    </div>
  )
}
