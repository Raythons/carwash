"use client"

import { useTranslation } from "react-i18next"
import { Syringe, Pill, Bug, Shield, Calendar } from "lucide-react"

export function ViewProtectiveAgentsSection({ data }) {
  const { t, i18n } = useTranslation()
  const d = data ?? {}
  const fmtDate = (v) => (v ? new Date(v).toLocaleDateString(i18n.language) : "—")

  const SectionList = ({ title, icon: Icon, items, color }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-gradient-to-br ${color.bg} dark:${color.darkBg} rounded-lg`}>
          <Icon className={`w-4 h-4 ${color.icon} dark:${color.darkIcon}`} />
        </div>
        <h4 className="text-md font-semibold text-gray-900 dark:text-white">{title}</h4>
      </div>

      {Array.isArray(items) && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${color.cardBg} dark:${color.darkCardBg} border ${color.border} dark:${color.darkBorder} rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{it?.name ?? "—"}</span>
                <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                  <Calendar className="w-3 h-3" />
                  {fmtDate(it?.date)}
                </div>
              </div>
              {it?.notes && (
                <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap bg-white/50 dark:bg-gray-900/30 rounded-md p-2">
                  {it.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`p-4 rounded-lg border ${color.border} dark:${color.darkBorder} ${color.cardBg} dark:${color.darkCardBg} text-sm text-gray-500 dark:text-gray-400 text-center`}
        >
          {t("common.no_data")}
        </div>
      )}
    </div>
  )

  const colorSchemes = {
    vaccines: {
      bg: "from-blue-100 to-cyan-100",
      darkBg: "from-blue-950/30 to-cyan-950/30",
      icon: "text-blue-600",
      darkIcon: "text-blue-400",
      cardBg: "from-blue-50 to-cyan-50",
      darkCardBg: "from-blue-950/20 to-cyan-950/20",
      border: "border-blue-200",
      darkBorder: "border-blue-800",
    },
    wormPills: {
      bg: "from-green-100 to-emerald-100",
      darkBg: "from-green-950/30 to-emerald-950/30",
      icon: "text-green-600",
      darkIcon: "text-green-400",
      cardBg: "from-green-50 to-emerald-50",
      darkCardBg: "from-green-950/20 to-emerald-950/20",
      border: "border-green-200",
      darkBorder: "border-green-800",
    },
    insecticides: {
      bg: "from-orange-100 to-amber-100",
      darkBg: "from-orange-950/30 to-amber-950/30",
      icon: "text-orange-600",
      darkIcon: "text-orange-400",
      cardBg: "from-orange-50 to-amber-50",
      darkCardBg: "from-orange-950/20 to-amber-950/20",
      border: "border-orange-200",
      darkBorder: "border-orange-800",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg">
          <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t("examinations.protective_agents.title")}
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SectionList
          title={t("examinations.protective_agents.vaccines")}
          icon={Syringe}
          items={d.vaccines}
          color={colorSchemes.vaccines}
        />
        <SectionList
          title={t("examinations.protective_agents.worm_pills")}
          icon={Pill}
          items={d.wormPills}
          color={colorSchemes.wormPills}
        />
        <SectionList
          title={t("examinations.protective_agents.insecticides")}
          icon={Bug}
          items={d.insecticides}
          color={colorSchemes.insecticides}
        />
      </div>
    </div>
  )
}
