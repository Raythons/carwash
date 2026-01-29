"use client"

import { useTranslation } from "react-i18next"
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, Shield, Syringe, Pill, Bug, X, Plus } from "lucide-react"

import { Input } from "../../ui/Input"
import { Button } from "../../ui/Button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormSection, FormGrid } from "./FormSection"
import { FormFieldWrapper, FormFieldHeader } from "./FormFieldWrapper"
import { toDateOnly } from "@/utilities/date"
import { MODES } from "../AddEditExamination"

export function VaccinesSection({
  formData, // Now correctly receives protectiveAgents object
  historicalProtectiveAgents, // Now correctly receives the array
  arrayErrors,
  updateNestedValue,
  handleAddVaccine,
  handleRemoveVaccine,
  handleAddWormPill,
  handleRemoveWormPill,
  handleAddInsecticide,
  handleRemoveInsecticide,
  readOnly,
  mode,
}) {
  const { t } = useTranslation()
  const [vaccineDateOpen, setVaccineDateOpen] = useState(false)
  const [wormPillDateOpen, setWormPillDateOpen] = useState(false)
  const [insecticideDateOpen, setInsecticideDateOpen] = useState(false)
  const [showHistoryVaccines, setShowHistoryVaccines] = useState(false)
  const [showHistoryWormPills, setShowHistoryWormPills] = useState(false)
  const [showHistoryInsecticides, setShowHistoryInsecticides] = useState(false)

  const newVaccine = formData?.newVaccine || {}
  const newWormPill = formData?.newWormPill || {}
  const newInsecticide = formData?.newInsecticide || {}

  const vaccineDate = newVaccine.date ? new Date(newVaccine.date) : undefined
  const wormPillDate = newWormPill.date ? new Date(newWormPill.date) : undefined
  const insecticideDate = newInsecticide.date ? new Date(newInsecticide.date) : undefined

  const handleDateChange = (date, field, subField, closer) => {
    if (date) {
      // The parent component expects the full path
      updateNestedValue(`protectiveAgents.${field}.${subField}`, toDateOnly(date))
    }
    closer(false)
  }

  const renderList = (items, onRemove, color) =>
    items?.map((item, index) => (
      <div
        key={index}
        className={`flex items-center justify-between gap-2 bg-gradient-to-br ${color.cardBg} dark:bg-gradient-to-br dark:from-zinc-800 dark:to-zinc-900 border ${color.border} dark:border-zinc-700 rounded-lg p-3 shadow-sm dark:shadow-${color.border.split("-")[1]}-500/10`}
      >
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
          <p className="text-xs text-gray-600 dark:text-zinc-400">{format(new Date(item.date), "yyyy-MM-dd")}</p>
        </div>
        {!readOnly && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            className="text-red-500 hover:text-red-700"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    ))

  const colorSchemes = {
    vaccines: {
      bg: "from-blue-100 to-cyan-100",
      icon: "text-blue-600",
      cardBg: "from-blue-50 to-cyan-50",
      border: "border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
    },
    wormPills: {
      bg: "from-green-100 to-emerald-100",
      icon: "text-green-600",
      cardBg: "from-green-50 to-emerald-50",
      border: "border-green-200",
      button: "bg-green-600 hover:bg-green-700",
    },
    insecticides: {
      bg: "from-orange-100 to-amber-100",
      icon: "text-orange-600",
      cardBg: "from-orange-50 to-amber-50",
      border: "border-orange-200",
      button: "bg-orange-600 hover:bg-orange-700",
    },
  }

  return (
    <FormSection title={t("examinations.protective_agents.title")} icon={Shield}>
      {mode === MODES.ADD && historicalProtectiveAgents && historicalProtectiveAgents.length > 0 && (
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mb-4 space-y-3">
          {/* Historical Vaccines */}
          {historicalProtectiveAgents.filter((item) => item.type === "vaccine").length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowHistoryVaccines(!showHistoryVaccines)}
                className="flex justify-between items-center w-full text-sm font-semibold text-gray-800 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20 p-3 rounded-lg transition-colors border border-blue-200 dark:border-blue-500/30 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              >
                <span className="flex items-center gap-2">
                  <Syringe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span>
                    {t("examinations.protective_agents.history_vaccines")} (
                    {historicalProtectiveAgents.filter((item) => item.type === "vaccine").length})
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showHistoryVaccines ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showHistoryVaccines ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
              >
                <div className="p-3 border border-blue-200 dark:border-blue-500/30 rounded-lg bg-blue-50/30 dark:bg-blue-900/10 space-y-2 max-h-48 overflow-y-auto">
                  {historicalProtectiveAgents
                    .filter((item) => item.type === "vaccine")
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg p-3 shadow-sm dark:shadow-blue-500/10"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">
                            {format(new Date(item.date), "yyyy-MM-dd")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Historical Worm Pills */}
          {historicalProtectiveAgents.filter((item) => item.type === "wormPill").length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowHistoryWormPills(!showHistoryWormPills)}
                className="flex justify-between items-center w-full text-sm font-semibold text-gray-800 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/20 p-3 rounded-lg transition-colors border border-green-200 dark:border-green-500/30 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
              >
                <span className="flex items-center gap-2">
                  <Pill className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span>
                    {t("examinations.protective_agents.history_worm_pills")} (
                    {historicalProtectiveAgents.filter((item) => item.type === "wormPill").length})
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showHistoryWormPills ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showHistoryWormPills ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
              >
                <div className="p-3 border border-green-200 dark:border-green-500/30 rounded-lg bg-green-50/30 dark:bg-green-900/10 space-y-2 max-h-48 overflow-y-auto">
                  {historicalProtectiveAgents
                    .filter((item) => item.type === "wormPill")
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-500/30 rounded-lg p-3 shadow-sm dark:shadow-green-500/10"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">
                            {format(new Date(item.date), "yyyy-MM-dd")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Historical Insecticides */}
          {historicalProtectiveAgents.filter((item) => item.type === "insecticide").length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowHistoryInsecticides(!showHistoryInsecticides)}
                className="flex justify-between items-center w-full text-sm font-semibold text-gray-800 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 p-3 rounded-lg transition-colors border border-orange-200 dark:border-orange-500/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
              >
                <span className="flex items-center gap-2">
                  <Bug className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span>
                    {t("examinations.protective_agents.history_insecticides")} (
                    {historicalProtectiveAgents.filter((item) => item.type === "insecticide").length})
                  </span>
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ${showHistoryInsecticides ? "rotate-180" : ""}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${showHistoryInsecticides ? "max-h-[300px] opacity-100 mt-2" : "max-h-0 opacity-0"}`}
              >
                <div className="p-3 border border-orange-200 dark:border-orange-500/30 rounded-lg bg-orange-50/30 dark:bg-orange-900/10 space-y-2 max-h-48 overflow-y-auto">
                  {historicalProtectiveAgents
                    .filter((item) => item.type === "insecticide")
                    .map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-2 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-500/30 rounded-lg p-3 shadow-sm dark:shadow-orange-500/10"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.name}</p>
                          <p className="text-xs text-gray-600 dark:text-zinc-400">
                            {format(new Date(item.date), "yyyy-MM-dd")}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <FormGrid className="lg:grid-cols-3">
        {/* Vaccines */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Syringe} label={t("examinations.protective_agents.vaccines")} />
          <div className="space-y-3">
            {renderList(formData?.vaccines, (index) => handleRemoveVaccine(index), colorSchemes.vaccines)}
            {!readOnly && (
              <>
                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newVaccine.name || ""}
                    onChange={(e) => updateNestedValue("protectiveAgents.newVaccine.name", e.target.value)}
                    placeholder={t("examinations.protective_agents.placeholders.vaccine_name")}
                    className={arrayErrors?.vaccines?.name ? "border-red-500" : ""}
                  />
                  {arrayErrors?.vaccines?.name && <p className="text-sm text-red-600">{arrayErrors.vaccines.name}</p>}
                </div>
                <div className="space-y-2">
                  <Popover open={vaccineDateOpen} onOpenChange={setVaccineDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between font-normal ${arrayErrors?.vaccines?.date ? "border-red-500" : ""}`}
                      >
                        {vaccineDate
                          ? format(vaccineDate, "yyyy-MM-dd")
                          : t("examinations.protective_agents.placeholders.date")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={vaccineDate}
                        onSelect={(date) => handleDateChange(date, "newVaccine", "date", setVaccineDateOpen)}
                        captionLayout="dropdown-buttons"
                        fromYear={2015}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  {arrayErrors?.vaccines?.date && <p className="text-sm text-red-600">{arrayErrors.vaccines.date}</p>}
                </div>
                <Button
                  type="button"
                  onClick={handleAddVaccine}
                  className={`${colorSchemes.vaccines.button} text-white w-full py-2 h-auto min-h-[2.5rem] flex items-center justify-center gap-2 whitespace-normal`}
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight break-words">
                    {t("examinations.protective_agents.add_vaccine")}
                  </span>
                </Button>
              </>
            )}
          </div>
        </FormFieldWrapper>

        {/* Worm Pills */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Pill} label={t("examinations.protective_agents.worm_pills")} />
          <div className="space-y-3">
            {renderList(formData?.wormPills, (index) => handleRemoveWormPill(index), colorSchemes.wormPills)}
            {!readOnly && (
              <>
                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newWormPill.name || ""}
                    onChange={(e) => updateNestedValue("protectiveAgents.newWormPill.name", e.target.value)}
                    placeholder={t("examinations.protective_agents.placeholders.worm_pill_name")}
                    className={arrayErrors?.wormPills?.name ? "border-red-500" : ""}
                  />
                  {arrayErrors?.wormPills?.name && <p className="text-sm text-red-600">{arrayErrors.wormPills.name}</p>}
                </div>
                <div className="space-y-2">
                  <Popover open={wormPillDateOpen} onOpenChange={setWormPillDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between font-normal ${arrayErrors?.wormPills?.date ? "border-red-500" : ""}`}
                      >
                        {wormPillDate
                          ? format(wormPillDate, "yyyy-MM-dd")
                          : t("examinations.protective_agents.placeholders.date")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={wormPillDate}
                        onSelect={(date) => handleDateChange(date, "newWormPill", "date", setWormPillDateOpen)}
                        captionLayout="dropdown-buttons"
                        fromYear={2015}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  {arrayErrors?.wormPills?.date && <p className="text-sm text-red-600">{arrayErrors.wormPills.date}</p>}
                </div>
                <Button
                  type="button"
                  onClick={handleAddWormPill}
                  className={`${colorSchemes.wormPills.button} text-white w-full py-2 h-auto min-h-[2.5rem] flex items-center justify-center gap-2 whitespace-normal`}
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight break-words">
                    {t("examinations.protective_agents.add_worm_pill")}
                  </span>
                </Button>
              </>
            )}
          </div>
        </FormFieldWrapper>

        {/* Insecticides */}
        <FormFieldWrapper>
          <FormFieldHeader icon={Bug} label={t("examinations.protective_agents.insecticides")} />
          <div className="space-y-3">
            {renderList(formData?.insecticides, (index) => handleRemoveInsecticide(index), colorSchemes.insecticides)}
            {!readOnly && (
              <>
                <div className="space-y-2 pt-2 border-t">
                  <Input
                    value={newInsecticide.name || ""}
                    onChange={(e) => updateNestedValue("protectiveAgents.newInsecticide.name", e.target.value)}
                    placeholder={t("examinations.protective_agents.placeholders.insecticide_name")}
                    className={arrayErrors?.insecticides?.name ? "border-red-500" : ""}
                  />
                  {arrayErrors?.insecticides?.name && (
                    <p className="text-sm text-red-600">{arrayErrors.insecticides.name}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Popover open={insecticideDateOpen} onOpenChange={setInsecticideDateOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-between font-normal ${arrayErrors?.insecticides?.date ? "border-red-500" : ""}`}
                      >
                        {insecticideDate
                          ? format(insecticideDate, "yyyy-MM-dd")
                          : t("examinations.protective_agents.placeholders.date")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={insecticideDate}
                        onSelect={(date) => handleDateChange(date, "newInsecticide", "date", setInsecticideDateOpen)}
                        captionLayout="dropdown-buttons"
                        fromYear={2015}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                  {arrayErrors?.insecticides?.date && (
                    <p className="text-sm text-red-600">{arrayErrors.insecticides.date}</p>
                  )}
                </div>
                <Button
                  type="button"
                  onClick={handleAddInsecticide}
                  className={`${colorSchemes.insecticides.button} text-white w-full py-2 h-auto min-h-[2.5rem] flex items-center justify-center gap-2 whitespace-normal`}
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium leading-tight break-words">
                    {t("examinations.protective_agents.add_insecticide")}
                  </span>
                </Button>
              </>
            )}
          </div>
        </FormFieldWrapper>
      </FormGrid>
    </FormSection>
  )
}
