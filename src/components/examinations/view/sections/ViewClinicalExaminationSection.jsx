"use client"

import { useTranslation } from "react-i18next"
import { Stethoscope, Activity, Thermometer, Heart, Wind, Clock, Droplets, FileText, Eye } from "lucide-react"

export function ViewClinicalExaminationSection({ data }) {
  const { t } = useTranslation()
  const fmt = (v) => (v === undefined || v === null || v === "" ? "—" : v)
  const fmtBool = (v) => (v === true ? t("common.yes") : v === false ? t("common.no") : "—")

  const clinicalData = data || {}

  const getMucousMembraneLabel = (value) => {
    if (!value) return "—"

    // Check if it's already a key or an Arabic string from backend
    const mapping = {
      normal_moist: t("examinations.clinical.mucous_options.normal_moist"),
      normal_sticky: t("examinations.clinical.mucous_options.normal_sticky"),
      pale: t("examinations.clinical.mucous_options.pale"),
      cyanotic: t("examinations.clinical.mucous_options.cyanotic"),
      icteric: t("examinations.clinical.mucous_options.icteric"),
      congested: t("examinations.clinical.mucous_options.congested"),
      muddy: t("examinations.clinical.mucous_options.muddy"),
      // Arabic values from backend
      "طبيعية رطبة": t("examinations.clinical.mucous_options.normal_moist"),
      "طبيعية دبقة": t("examinations.clinical.mucous_options.normal_sticky"),
      "طبيعية دبقة ": t("examinations.clinical.mucous_options.normal_sticky"),
      شاحبة: t("examinations.clinical.mucous_options.pale"),
      مزرقة: t("examinations.clinical.mucous_options.cyanotic"),
      مصفرة: t("examinations.clinical.mucous_options.icteric"),
      احتقان: t("examinations.clinical.mucous_options.congested"),
      "لون طيني": t("examinations.clinical.mucous_options.muddy"),
    }

    return mapping[value] || value
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
          <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.clinical.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Vital Signs Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              {t("examinations.clinical.vitals")}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Temperature */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.temperature")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmt(clinicalData.temperature)} {clinicalData.temperature ? t("examinations.clinical.units.temp") : ""}
              </p>
            </div>

            {/* Heart Rate */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.heart_rate")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmt(clinicalData.heartRate)} {clinicalData.heartRate ? t("examinations.clinical.units.bpm") : ""}
              </p>
            </div>

            {/* Respiratory Rate */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Wind className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.respiratory_rate")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmt(clinicalData.respiratoryRate)}{" "}
                {clinicalData.respiratoryRate ? t("examinations.clinical.units.brpm") : ""}
              </p>
            </div>

            {/* Capillary Refill Time */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span className="font-medium text-gray-700 dark:text-white">{t("examinations.clinical.crt")}</span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmt(clinicalData.capillaryRefillTime)}{" "}
                {clinicalData.capillaryRefillTime ? t("examinations.clinical.units.sec") : ""}
              </p>
            </div>

            {/* Dehydration */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.dehydration")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {clinicalData.hasDehydration
                  ? `${fmt(clinicalData.dehydrationPercentage)}${clinicalData.dehydrationPercentage ? "%" : ""}`
                  : t("examinations.clinical.no_dehydration")}
              </p>
            </div>

            {/* Mucous Membranes */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.mucous_membranes")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {getMucousMembraneLabel(clinicalData.mucousMembranes)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Findings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-4">
            {t("examinations.clinical.additional_findings")}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Petechial Hemorrhage */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="w-4 h-4 text-red-500 dark:text-red-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.petechial")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmtBool(clinicalData.petechialHemorrhage)}
              </p>
            </div>

            {/* Lymph Node Enlargement */}
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="font-medium text-gray-700 dark:text-white">
                  {t("examinations.clinical.lymph_node")}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {fmtBool(clinicalData.lymphNodeEnlargement)}
              </p>
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        {clinicalData.clinicalExaminationNotes && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                {t("examinations.clinical.notes")}
              </h3>
            </div>
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-blue-100 dark:border-gray-700">
              <p className="text-gray-800 dark:text-white leading-relaxed whitespace-pre-wrap break-words">
                {fmt(clinicalData.clinicalExaminationNotes)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
