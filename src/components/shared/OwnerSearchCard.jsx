"use client"
import { useTranslation } from "react-i18next"

const OwnerSearchCard = ({ owners, selectedOwner, onOwnerSelect, isSearching, searchTerm }) => {
  const { t } = useTranslation()

  if (!searchTerm || searchTerm.trim().length < 2) {
    return null
  }

  return (
    <div className="space-y-2">
      {isSearching ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 dark:border-primary-400 mx-auto"></div>
          <span className="text-primary-600 dark:text-primary-400 mt-2 block">{t("common.searching")}</span>
        </div>
      ) : owners.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {owners.map((owner) => (
            <div
              key={owner.id}
              onClick={() => onOwnerSelect(owner)}
              className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                selectedOwner?.id === owner.id
                  ? "border-primary-500 dark:border-primary-400 bg-primary-50 dark:bg-primary-900/30"
                  : "border-gray-200 dark:border-zinc-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-25 dark:hover:bg-primary-900/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-primary-900 dark:text-white">{owner.name ?? owner.Name}</h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400">{owner.phone ?? owner.Phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 dark:text-zinc-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">{t("common.no_results_found")}</p>
          <p className="text-gray-400 dark:text-zinc-500 text-xs mt-1">{t("common.check_input_info")}</p>
        </div>
      )}
    </div>
  )
}

export default OwnerSearchCard
