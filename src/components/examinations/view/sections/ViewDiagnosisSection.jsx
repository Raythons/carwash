"use client"

import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import {
  Stethoscope,
  FileText,
  Search,
  Microscope,
  TestTube,
  Droplets,
  Scissors,
  Eye,
  FlaskConical,
  Activity,
  CheckCircle,
} from "lucide-react"

export function ViewDiagnosisSection({ data }) {
  const { t } = useTranslation()
  const fmt = (v) => (v === undefined || v === null || v === "" ? "—" : v)

  // Handle both direct diagnosis data and full examination data
  let diagnosticTools = {}
  let diagnosis = {}

  if (data) {
    if (data.diagnosticTools) {
      diagnosticTools = data.diagnosticTools
      diagnosis = data.diagnosis || {}
    } else {
      diagnosis = data
      diagnosticTools = {}
    }
  }

  const diagnosticToolsConfig = useMemo(
    () => [
      { key: "radiography", label: t("examinations.diagnosis.tools.radiography"), icon: Search },
      { key: "ultrasound", label: t("examinations.diagnosis.tools.ultrasound"), icon: Activity },
      { key: "labTests", label: t("examinations.diagnosis.tools.labTests"), icon: TestTube },
      { key: "bloodSmear", label: t("examinations.diagnosis.tools.bloodSmear"), icon: Droplets },
      { key: "vaginalSmear", label: t("examinations.diagnosis.tools.vaginalSmear"), icon: Microscope },
      { key: "biopsy", label: t("examinations.diagnosis.tools.biopsy"), icon: Scissors },
      { key: "skinScraping", label: t("examinations.diagnosis.tools.skinScraping"), icon: Eye },
      { key: "urineTest", label: t("examinations.diagnosis.tools.urineTest"), icon: FlaskConical },
      { key: "stoolSample", label: t("examinations.diagnosis.tools.stoolSample"), icon: TestTube },
    ],
    [t],
  )

  const usedTools = diagnosticToolsConfig.filter((tool) => diagnosticTools[`${tool.key}Used`] === true)

  const hasAnyDiagnosisData =
    diagnosis.differentialDiagnosis ||
    diagnosis.provisionalDiagnosis ||
    diagnosis.finalDiagnosis ||
    usedTools.length > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.diagnosis.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {hasAnyDiagnosisData ? (
          <div className="space-y-6">
            {/* Diagnostic Tools Section */}
            {usedTools.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                    {t("examinations.diagnosis.tools_title")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {usedTools.map(({ key, label, icon: Icon }) => {
                    const result = diagnosticTools[`${key}Result`] || ""

                    return (
                      <div
                        key={key}
                        className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700 shadow-sm"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="font-medium text-gray-800 dark:text-white">{label}</span>
                          </div>
                        </div>

                        {result && (
                          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 border border-gray-100 dark:border-gray-600">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
                              {t("examinations.diagnosis.result_label")}
                            </p>
                            <p className="text-sm text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap">
                              {fmt(result)}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Diagnosis Types */}
            <div className="space-y-4">
              {/* Differential Diagnosis */}
              {diagnosis.differentialDiagnosis && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {t("examinations.diagnosis.ddx_label")}
                    </h3>
                  </div>
                  <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                    {fmt(diagnosis.differentialDiagnosis)}
                  </p>
                </div>
              )}

              {/* Provisional Diagnosis */}
              {diagnosis.provisionalDiagnosis && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-300">
                      {t("examinations.diagnosis.provisional_label")}
                    </h3>
                  </div>
                  <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                    {fmt(diagnosis.provisionalDiagnosis)}
                  </p>
                </div>
              )}

              {/* Final Diagnosis */}
              {diagnosis.finalDiagnosis && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-green-100 dark:border-green-800 ring-2 ring-green-200 dark:ring-green-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Stethoscope className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                      {t("examinations.diagnosis.final_label")}
                    </h3>
                  </div>
                  <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap break-words font-medium">
                    {fmt(diagnosis.finalDiagnosis)}
                  </p>
                </div>
              )}

              {/* Final Diagnosis Comments */}
              {diagnosis.finalDiagnosisComments && (
                <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                      {t("examinations.diagnosis.final_comments_label")}
                    </h3>
                  </div>
                  <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                    {fmt(diagnosis.finalDiagnosisComments)}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Stethoscope className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">{t("examinations.diagnosis.no_info")}</p>
          </div>
        )}
      </div>
    </div>
  )
}
