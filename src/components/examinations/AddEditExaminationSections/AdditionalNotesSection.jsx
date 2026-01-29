"use client"

import { useTranslation } from "react-i18next"
import { Textarea } from "../../ui/Textarea"

export function AdditionalNotesSection({ formData, onChange }) {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 dark:border-zinc-700 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          {t("examinations.additional_notes.title")}
        </h2>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-white">
          {t("examinations.additional_notes.question")}
        </label>
        <Textarea
          value={formData.additionalNotes || ""}
          onChange={(e) => onChange("additionalNotes", e.target.value)}
          placeholder={t("examinations.additional_notes.placeholder")}
          rows={4}
        />
        <div className="min-h-[20px]"></div>
      </div>
    </div>
  )
}
