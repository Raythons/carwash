"use client"

import { useTranslation } from "react-i18next"
import { Home, MapPin, Users } from "lucide-react"

export function ViewEnvironmentSection({ data }) {
  const { t } = useTranslation()

  const v = (x) => (x === undefined || x === null || x === "" ? "—" : x)

  const getBreedingPlaceLabel = (value) => {
    if (!value) return "—"
    const mapping = {
      "داخل المنزل": "home",
      "في الحديقة": "garden",
      كلاهما: "both",
      "غير ذلك": "other",
      home: "home",
      garden: "garden",
      both: "both",
      other: "other",
    }
    const key = mapping[value] || value
    return t(`examinations.environment.breeding_options.${key}`, { defaultValue: value })
  }

  const list = (arr, empty = "—") =>
    Array.isArray(arr) && arr.length > 0 ? (
      <ul className="list-disc pr-5 space-y-2">
        {arr.map((it, idx) => (
          <li
            key={idx}
            className="text-sm text-gray-700 dark:text-white bg-gray-50 dark:bg-gray-800/50 p-2 rounded border dark:border-gray-700"
          >
            {typeof it === "object" && it ? (
              <span>
                {t("examinations.environment.type")}: {v(it.type)}{" "}
                {it.count !== undefined && `— ${t("examinations.environment.count")}: ${v(it.count)}`}
              </span>
            ) : (
              v(it)
            )}
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-3 rounded border dark:border-gray-700 block text-center">
        {empty}
      </span>
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
          <Home className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white">{t("examinations.environment.title")}</span>
      </div>

      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-teal-500 dark:text-teal-400" />
              <p className="text-sm font-medium text-teal-700 dark:text-teal-400">
                {t("examinations.environment.breeding_place")}
              </p>
            </div>
            <p className="font-medium text-gray-800 dark:text-white">{getBreedingPlaceLabel(data?.breedingPlace)}</p>
            {(data?.breedingPlace === "غير ذلك" || data?.breedingPlace === "other") && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border dark:border-gray-700">
                {v(data?.customBreedingPlace)}
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-4 border border-teal-100 dark:border-teal-800">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                {t("examinations.environment.other_animals")}
              </p>
            </div>
            {list(data?.otherAnimals)}
          </div>
        </div>
      </div>
    </div>
  )
}
