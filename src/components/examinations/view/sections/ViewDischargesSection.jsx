"use client"

import { useTranslation } from "react-i18next"
import { Droplets, Eye, Ear, Heart, Badge as Bandage, MoreHorizontal } from "lucide-react"

export function ViewDischargesSection({ data }) {
  const { t } = useTranslation()
  const b = (v) => (v ? t("common.yes") : v === false ? t("common.no") : "—")
  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)
  const has = data?.hasDischarges

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
          <Droplets className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.discharges.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-200 dark:border-cyan-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
              <p className="text-sm font-medium text-cyan-700 dark:text-cyan-400">
                {t("examinations.discharges.question")}
              </p>
            </div>
            <p className="font-semibold text-gray-800 dark:text-white text-base">{b(has)}</p>
          </div>
        </div>

        {has && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-pink-500 dark:text-pink-400" />
                <p className="text-sm font-medium text-pink-700 dark:text-pink-400">
                  {t("examinations.discharges.reproductive")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.reproductiveDischarge)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <Ear className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  {t("examinations.discharges.ear")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.earDischarge)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  {t("examinations.discharges.eye")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.eyeDischarge)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <Droplets className="w-4 h-4 text-green-500 dark:text-green-400" />
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  {t("examinations.discharges.nasal")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.nasalDischarge)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <Bandage className="w-4 h-4 text-red-500 dark:text-red-400" />
                <p className="text-sm font-medium text-red-700 dark:text-red-400">
                  {t("examinations.discharges.wound")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.woundDischarge)}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-cyan-100 dark:border-cyan-800">
              <div className="flex items-center gap-2 mb-3">
                <MoreHorizontal className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  {t("examinations.discharges.other")}
                </p>
              </div>
              <p className="font-medium text-gray-800 dark:text-white break-words whitespace-pre-wrap">
                {v(data?.otherDischarge)}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
