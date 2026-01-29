"use client"

import { useState, useCallback, useMemo } from "react"
import { toast } from "react-toastify"
import { useNavigate, Link } from "react-router-dom"
import { CalendarIcon, Clock, Search, ArrowRight, Plus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/Button"
// import { Button  } from '../ui/Button';
import { Calendar } from "../ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover"
import AnimalCard from "../Animals/AnimalCard"
import DateAppointmentsDropdown, { MODE_BOTH } from "./DateAppointmentsDropdown"
import OwnerSearchCard from "../shared/OwnerSearchCard"
import { useOwners, useOwnerAnimals } from "@/hooks/queries/useOwnerQueries"
import { useCreateAppointment } from "@/hooks/queries/useAppointmentQueries"

export default function AddAppointment() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [selectedAnimal, setSelectedAnimal] = useState(null)
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const today = new Date()
    const y = today.getFullYear()
    const m = String(today.getMonth() + 1).padStart(2, "0")
    const d = String(today.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  })

  const [appointmentTime, setAppointmentTime] = useState("")
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [notes, setNotes] = useState("")

  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const formatYMDLocal = useCallback((dateObj) => {
    if (!dateObj) return ""
    const y = dateObj.getFullYear()
    const m = String(dateObj.getMonth() + 1).padStart(2, "0")
    const d = String(dateObj.getDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }, [])

  const parseYMDLocal = useCallback((ymd) => {
    if (!ymd) return undefined
    const [y, m, d] = ymd.split("-").map((v) => Number.parseInt(v, 10))
    if (!y || !m || !d) return undefined
    return new Date(y, m - 1, d)
  }, [])

  const today = useMemo(() => formatYMDLocal(new Date()), [formatYMDLocal])

  const { data: ownersPage, isLoading: isSearchingOwners } = useOwners(
    {
      page: 1,
      pageSize: 100,
      searchTerm,
      searchBy: "name",
    },
    {
      enabled: searchTerm.trim().length >= 2,
    },
  )

  const owners = useMemo(() => {
    if (!ownersPage) return []
    return ownersPage.items ?? ownersPage.Items ?? []
  }, [ownersPage])

  const { data: ownerAnimals } = useOwnerAnimals(selectedOwner?.id, {
    enabled: !!selectedOwner?.id,
  })

  const createMutation = useCreateAppointment()

  const handleMutationSuccess = () => {
    toast.success(t("common.success"))
    navigate("/clinic/appointments")
  }

  const handleMutationError = (err) => {
    // Global API interceptor already shows toast error, so we don't need to show it here
    console.error("Create appointment error:", err)
  }

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value
    setSearchTerm(value)
    setSelectedOwner(null)
    setSelectedAnimal(null)
  }, [])

  const handleOwnerSelect = useCallback((owner) => {
    setSelectedOwner(owner)
    setSelectedAnimal(null)
    setSearchTerm(owner.name ?? owner.Name ?? "")
  }, [])

  const handleAnimalSelect = useCallback((animal) => {
    setSelectedAnimal(animal)
  }, [])

  const handleDateChange = (date) => {
    if (date) {
      const dateString = formatYMDLocal(date)
      setAppointmentDate(dateString)
    }
    setDatePickerOpen(false)
  }

  const handleTimeChange = (e) => {
    let value = e.target.value
    value = value.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    setAppointmentTime(value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedOwner || !selectedAnimal || !appointmentDate || !appointmentTime) {
      toast.warn(t("common.complete_required_fields"))
      return
    }
    const payload = {
      appointmentDate,
      appointmentTime,
      firstTime: isFirstVisit,
      notes: notes?.trim() || undefined,
      ownerId: selectedOwner.id,
      animalId: selectedAnimal.id,
    }

    createMutation.mutate(payload, {
      onSuccess: handleMutationSuccess,
      onError: handleMutationError,
    })
  }

  const selectedDate = appointmentDate ? parseYMDLocal(appointmentDate) : undefined
  const minDate = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  return (
    <div className="w-full max-w-4xl mx-auto dark:bg-zinc-900" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      <div className="flex items-center gap-4 mb-6">
        <Link
          to="/clinic/appointments"
          className="p-2 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          {i18n.language === "ar" ? (
            <ArrowRight className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          ) : (
            <ArrowRight className="w-6 h-6 text-primary-600 dark:text-primary-400 rotate-180" />
          )}
        </Link>
        <h1 className="text-3xl font-bold text-primary-800 dark:text-white">{t("appointments.add_title")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-700/50 p-6">
          <h2 className="text-xl font-semibold text-primary-800 dark:text-white mb-4">
            {t("appointments.form.owner_search")}
          </h2>

          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={t("appointments.form.owner_placeholder")}
              className={`w-full h-12 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 bg-white dark:bg-zinc-800 dark:text-zinc-100 ${i18n.language === "ar" ? "pr-4 pl-10 text-right" : "pl-4 pr-10 text-left"}`}
            />
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-zinc-500 ${i18n.language === "ar" ? "left-3" : "right-3"}`}
            />
          </div>

          <OwnerSearchCard
            owners={owners}
            selectedOwner={selectedOwner}
            onOwnerSelect={handleOwnerSelect}
            isSearching={isSearchingOwners}
            searchTerm={searchTerm}
          />
        </div>

        {selectedOwner && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-700/50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-primary-800 dark:text-white">
                {t("appointments.form.animal_select")}
              </h2>
              <Link
                to={`/clinic/owners/${selectedOwner.id}`}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>{t("appointments.form.add_animal")}</span>
              </Link>
            </div>

            {(ownerAnimals?.length ?? 0) > 0 ? (
              <div className="space-y-4">
                {ownerAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    showExaminationsLink={false}
                    selectable={true}
                    isSelected={selectedAnimal?.id === animal.id}
                    onSelect={handleAnimalSelect}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-zinc-400 mb-4">{t("appointments.form.no_animals")}</p>
                <Link
                  to={`/clinic/owners/${selectedOwner.id}`}
                  className="bg-primary-500 dark:bg-primary-600 hover:bg-primary-600 dark:hover:bg-primary-500 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t("appointments.form.add_animal")}</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {selectedAnimal && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-primary-200 dark:border-primary-700/50 p-6">
            <h2 className="text-xl font-semibold text-primary-800 dark:text-white mb-4">
              {t("appointments.form.details")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/*  Enhanced date picker using Popover and Calendar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    <CalendarIcon className={`w-4 h-4 inline ${i18n.language === "ar" ? "ml-1" : "mr-1"}`} />
                    {t("appointments.form.date")}
                  </label>
                  <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full h-11 justify-between font-normal dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 ${i18n.language === "ar" ? "text-right" : "text-left"}`}
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString(i18n.language === "ar" ? "en-SA" : "en-GB")
                          : t("appointments.form.select_date_placeholder")}
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0 dark:bg-zinc-900 dark:border-zinc-800" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        disabled={(date) => date < minDate}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/*  Enhanced time picker with better input handling */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    <Clock className={`w-4 h-4 inline ${i18n.language === "ar" ? "ml-1" : "mr-1"}`} />
                    {t("appointments.form.time")}
                  </label>
                  <div className="relative">
                    <input
                      type="time"
                      value={appointmentTime}
                      onChange={handleTimeChange}
                      required
                      className={`w-full h-11 px-3 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:bg-zinc-800 dark:text-zinc-100 dark:[&::-webkit-calendar-picker-indicator]:invert ${i18n.language === "ar" ? "pr-5 text-right" : "pl-5 text-left"}`}
                      style={{ direction: i18n.language === "ar" ? "rtl" : "ltr" }}
                    />
                  </div>
                </div>

                {/* Same-day appointments quick view (filtered by selected date) */}
                <DateAppointmentsDropdown
                  mode={MODE_BOTH}
                  date={appointmentDate}
                  title={t("appointments.form.all_day_title")}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    {t("appointments.form.first_visit")}
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center dark:text-zinc-200">
                      <input
                        type="radio"
                        name="firstVisit"
                        checked={isFirstVisit === true}
                        onChange={() => setIsFirstVisit(true)}
                        className={i18n.language === "ar" ? "ml-2" : "mr-2"}
                      />
                      {t("common.yes")}
                    </label>
                    <label className="flex items-center dark:text-zinc-200">
                      <input
                        type="radio"
                        name="firstVisit"
                        checked={isFirstVisit === false}
                        onChange={() => setIsFirstVisit(false)}
                        className={i18n.language === "ar" ? "ml-2" : "mr-2"}
                      />
                      {t("common.no")}
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">
                    {t("appointments.table.notes")}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:bg-zinc-800 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500"
                    placeholder={t("appointments.form.notes_placeholder")}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? t("appointments.form.saving") : t("appointments.form.save")}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
