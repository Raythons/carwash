"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { CalendarDays, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { useAppointments } from "@/hooks/queries/useAppointmentQueries";
import { useSurgeryAppointments } from "@/hooks/queries/useSurgeryQueries";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTranslation } from "react-i18next";
import { formatTime12Ar } from "@/utilities/dateTime";
// Clinic scoping is handled via X-Clinic-Id header in api interceptor

// Modes to avoid magic strings
export const MODE_APPOINTMENTS = "appointments";
export const MODE_SURGERY = "surgery";
export const MODE_BOTH = "both";

// use shared time formatter: "03:39 مساء"
const formatTime = (timeString) => formatTime12Ar(timeString);

// Helper to calculate expected end time
const calculateExpectedEndTime = (startTime, durationMinutes) => {
  if (!startTime || !durationMinutes || durationMinutes <= 0) return null;
  
  try {
    // Parse time string (HH:mm format)
    const [hours, minutes] = startTime.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours, minutes, 0, 0);
    
    // Add duration
    const endDate = new Date(startDate.getTime() + (durationMinutes * 60 * 1000));
    
    // Format back to HH:mm
    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');
    return `${endHours}:${endMinutes}`;
  } catch (error) {
    return null;
  }
};

// helper to format Date to yyyy-MM-dd
const toDateOnly = (d) => {
  if (!d) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// safe parser for yyyy-MM-dd to avoid timezone shifts
const parseDateOnly = (s) => {
  if (!s || s.length !== 10) return undefined;
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return undefined;
  return new Date(y, m - 1, d);
};

// mode: 'appointments' | 'surgery' | 'both'
export default function DateAppointmentsDropdown({ 
  date, 
  title, 
  mode = MODE_APPOINTMENTS,
  editMode = false,
  editingItemId = null,
  editingItemType = null, // 'appointment' | 'surgery'
  editingItemName = null
}) {
  const { t, i18n } = useTranslation();
  const displayTitle = title ?? t("appointments.dropdown.title");

  // local state: default to prop date if valid, otherwise today
  const initialDateStr = useMemo(() => {
    if (date && date.length === 10) return date;
    return toDateOnly(new Date());
  }, [date]);
  const [selectedDateStr, setSelectedDateStr] = useState(initialDateStr);
  const [selectedDate, setSelectedDate] = useState(() => (selectedDateStr ? parseDateOnly(selectedDateStr) : undefined));
  const [dateOpen, setDateOpen] = useState(false);

  // keep in sync if parent passes a new valid date
  useEffect(() => {
    if (date && date.length === 10 && date !== selectedDateStr) {
      setSelectedDateStr(date);
      setSelectedDate(parseDateOnly(date));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const canFetch = useMemo(() => Boolean(selectedDateStr && selectedDateStr.length === 10), [selectedDateStr]);

  // Normalize helpers to keep naming identical regardless of endpoint casing
  const normalizeAppointment = (a) => ({
    type: "appointment",
    id: a.id ?? a.Id,
    time: a.time ?? a.Time ?? a.appointmentTime ?? a.AppointmentTime,
    ownerName: a.ownerName ?? a.OwnerName,
    animalName: a.animalName ?? a.AnimalName,
    isCanceled: a.isCanceled ?? a.IsCanceled ?? false,
    status: a.status ?? a.Status ?? undefined,
  });

  // For surgery appointments, also try to read an expected/estimated time if provided by API
  const normalizeSurgery = (s) => ({
    type: "surgery",
    id: s.id ?? s.Id,
    time: s.time ?? s.Time ?? s.appointmentTime ?? s.AppointmentTime,
    ownerName: s.ownerName ?? s.OwnerName,
    animalName: s.animalName ?? s.AnimalName,
    durationMinutes: s.durationMinutes ?? s.DurationMinutes ?? null,
    status: s.status ?? s.Status ?? undefined,
    expectedTime:
      s.expectedTime ?? s.ExpectedTime ?? s.expectedSurgeryTime ?? s.ExpectedSurgeryTime ?? s.estimatedTime ?? s.EstimatedTime ?? null,
  });

  // Always fetch both appointments and surgeries regardless of mode
  const appointmentsQuery = useAppointments(
    canFetch
      ? { page: 1, pageSize: 100, searchBy: "date", searchTerm: selectedDateStr, orderBy: "time", orderDir: "asc" }
      : { enabled: false }
  );

  // Always fetch surgery appointments regardless of mode
  const surgeriesQuery = useSurgeryAppointments(
    canFetch
      ? { page: 1, pageSize: 100, searchBy: "date", searchTerm: selectedDateStr }
      : { enabled: false }
  );

  const handleDateChange = (d) => {
    if (d) {
      setSelectedDate(d);
      setSelectedDateStr(toDateOnly(d));
    }
    setDateOpen(false);
  };

  // Always check both queries since we always fetch both
  const isLoading = appointmentsQuery.isLoading || surgeriesQuery.isLoading;
  const isError = appointmentsQuery.isError || surgeriesQuery.isError;

  const combinedItems = useMemo(() => {
    if (!canFetch) return [];
    const cancelled = (item) => {
      if (item.type === "appointment") return Boolean(item.isCanceled);
      if (item.type === "surgery") {
        const status = (item.status ?? "").trim();
        return status === "ملغي" || status === "Canceled" || status === "Cancelled";
      }
      return false;
    };
    // Normalize from hooks' shapes
    const apptItems = ((appointmentsQuery.data?.Items ?? [])).map((a) => normalizeAppointment({
      id: a.id,
      time: a.appointmentTime,
      appointmentTime: a.appointmentTime,
      ownerName: a.ownerName,
      animalName: a.animalName,
      isCanceled: a.isCanceled,
      status: a.status,
    }));
    const surgRaw = surgeriesQuery.data;
    const surgPayload = (surgRaw?.isSuccess ?? surgRaw?.IsSuccess ?? false)
      ? (surgRaw?.data ?? surgRaw?.Data ?? surgRaw)
      : null;
    const surgItems = ((surgPayload?.items ?? surgPayload?.Items) ?? []).map(normalizeSurgery);
    if (mode === MODE_APPOINTMENTS) return apptItems.filter((i) => !cancelled(i));
    if (mode === MODE_SURGERY) return surgItems.filter((i) => !cancelled(i));
    const a = apptItems.filter((i) => !cancelled(i));
    const s = surgItems.filter((i) => !cancelled(i));
    // simple merge then sort by time ascending (fallbacks push undefined to end)
    const merged = [...a, ...s];
    merged.sort((x, y) => {
      const xt = x.time ?? "";
      const yt = y.time ?? "";
      return xt.localeCompare(yt);
    });
    return merged;
  }, [appointmentsQuery.data, surgeriesQuery.data, canFetch, mode]);

  // local search filter by owner or animal name
  const [search, setSearch] = useState("");
  const matchSearch = useCallback((txt) => {
    if (!search.trim()) return true;
    const s = search.trim().toLowerCase();
    return (txt ?? "").toLowerCase().includes(s);
  }, [search]);
  const filterItem = (item) => matchSearch(item.ownerName) || matchSearch(item.animalName);

  // Check if selected date is today
  const isToday = useMemo(() => {
    if (!selectedDateStr) return false;
    const todayStr = toDateOnly(new Date());
    return selectedDateStr === todayStr;
  }, [selectedDateStr]);

  return (
    <div dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}>
      <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">{displayTitle}</label>
      <div className="mb-2">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className={`w-full justify-between font-normal dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 ${isToday ? 'ring-2 ring-green-500 border-green-500 dark:ring-green-600 dark:border-green-600' : ''}`}>
              <div className="flex items-center gap-2">
                {selectedDate ? selectedDate.toLocaleDateString(i18n.language === 'ar' ? "en-SA" : "en-GB") : t("appointments.form.select_date_placeholder")}
                {isToday && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                    {t("appointments.dropdown.today")}
                  </span>
                )}
              </div>
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0 dark:bg-zinc-900 dark:border-zinc-800" align="start">
            <Calendar mode="single" selected={selectedDate} captionLayout="dropdown" onSelect={handleDateChange} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="mb-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("appointments.dropdown.search_placeholder")}
          className={`w-full h-9 px-3 border border-gray-300 dark:border-zinc-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 bg-white dark:bg-zinc-800 dark:text-zinc-100 ${i18n.language === 'ar' ? 'text-right' : 'text-left'}`}
        />
      </div>
      <div className="border rounded-lg p-3 max-h-60 overflow-y-auto bg-gray-50 dark:bg-zinc-900/50 dark:border-zinc-800">
        {editMode && editingItemName && (
          <div className="mb-3 pb-2 border-b border-blue-200 dark:border-primary-900/50">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-blue-700 dark:text-primary-300 bg-blue-50 dark:bg-primary-900/20 rounded-lg py-2 px-3">
              <div className="w-2 h-2 bg-blue-500 dark:bg-primary-500 rounded-full animate-pulse"></div>
              <span className="hidden sm:inline">{t("appointments.dropdown.editing")}:</span>
              <span className="font-semibold truncate max-w-[150px] sm:max-w-none">{editingItemName}</span>
              <span className="text-xs bg-blue-200 dark:bg-primary-800 text-blue-800 dark:text-primary-100 px-2 py-0.5 rounded-full">
                {editingItemType === 'surgery' ? t("appointments.dropdown.surgery") : t("appointments.dropdown.appointment")}
              </span>
            </div>
          </div>
        )}
        {canFetch && isToday && !editMode && (
          <div className="mb-3 pb-2 border-b border-green-200 dark:border-green-900/50">
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 rounded-lg py-2 px-3">
              <div className="w-2 h-2 bg-green-500 dark:bg-green-500 rounded-full animate-pulse"></div>
              <span>{t("appointments.dropdown.today_items")}</span>
            </div>
          </div>
        )}
        {!canFetch ? (
          <div className="text-sm text-gray-500 dark:text-zinc-500 text-center">{t("appointments.dropdown.select_date_desc")}</div>
        ) : isLoading ? (
          <div className="text-sm text-gray-500 dark:text-zinc-500 text-center">{t("common.loading")}</div>
        ) : isError ? (
          <div className="text-sm text-red-600 dark:text-red-400 text-center">{t("common.error_occurred")}</div>
        ) : (combinedItems?.length ?? 0) === 0 ? (
          <div className="text-sm text-gray-500 dark:text-zinc-500 text-center">
            {isToday ? t("appointments.dropdown.no_items_today") : t("appointments.dropdown.no_items_date")}
          </div>
        ) : (
          mode === MODE_BOTH ? (
            <div className="space-y-3">
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-zinc-400 mb-2 uppercase tracking-wider">{t("appointments.dropdown.appointments")}:</div>
                <div className="space-y-3">
                  {combinedItems.filter(item => item.type === "appointment").filter(filterItem).map((item) => {
                    const isBeingEdited = editMode && editingItemType === 'appointment' && editingItemId === item.id;
                    return (
                    <div key={`appointment-${item.id}`} className={`relative p-3 border-b border-gray-200 dark:border-zinc-800 last:border-b-0 transition-all duration-200 rounded-lg ${isBeingEdited ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 'bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
                      {isBeingEdited && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                      )}
                      
                      {/* Flex Column Layout - Each field in its own column */}
                      <div className="flex flex-col gap-2 text-sm">
                        {/* Time */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                          <span className="font-bold text-gray-900 dark:text-zinc-100">
                            {item.time ? formatTime(item.time) : "—"}
                          </span>
                        </div>
                        
                        {/* Owner & Animal */}
                        <div className="flex flex-col gap-1 border-t border-gray-100 dark:border-zinc-700/50 pt-2 mt-1">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                            <span className="text-gray-800 dark:text-zinc-200 font-medium break-words">
                              {item.ownerName}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                            <span className="text-gray-600 dark:text-zinc-400 break-words italic">
                              {item.animalName}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-700 dark:text-zinc-400 mb-2 uppercase tracking-wider">{t("appointments.dropdown.surgeries")}:</div>
                <div className="space-y-3">
                  {combinedItems.filter(item => item.type === "surgery").filter(filterItem).map((item) => {
                    const expectedEndTime = calculateExpectedEndTime(item.time, item.durationMinutes);
                    const isBeingEdited = editMode && editingItemType === 'surgery' && editingItemId === item.id;
                    return (
                      <div key={`surgery-${item.id}`} className={`relative p-3 border-b border-gray-200 dark:border-zinc-800 last:border-b-0 transition-all duration-200 rounded-lg ${isBeingEdited ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800' : 'bg-white dark:bg-zinc-800/50 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}>
                        {isBeingEdited && (
                          <div className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                        )}
                        
                        {/* Flex Column Layout - Each field in its own column */}
                        <div className="flex flex-col gap-2 text-sm">
                          {/* Time with Surgery Badge */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
                            <span className="font-bold text-gray-900 dark:text-zinc-100">
                              {item.time ? formatTime(item.time) : "—"}
                            </span>
                            <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 text-[10px] font-bold uppercase">
                              {t("appointments.dropdown.surgery")}
                            </span>
                          </div>
                          
                          {/* Owner & Animal */}
                          <div className="flex flex-col gap-1 border-t border-gray-100 dark:border-zinc-700/50 pt-2 mt-1">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                              <span className="text-gray-800 dark:text-zinc-200 font-medium break-words">
                                {item.ownerName}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <CalendarDays className="w-4 h-4 text-zinc-400 dark:text-zinc-500 flex-shrink-0" />
                              <span className="text-gray-600 dark:text-zinc-400 break-words italic">
                                {item.animalName}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 space-y-1">
                          {typeof item.durationMinutes === "number" && item.durationMinutes > 0 && (
                            <div className={`text-[10px] text-zinc-500 flex items-center gap-2 ${i18n.language === 'ar' ? 'mr-6' : 'ml-6'}`}>
                              <span>{t("surgery_appointments.duration")}: <span className="font-medium text-zinc-700 dark:text-zinc-300">{item.durationMinutes}</span> {t("surgery_appointments.minutes")}</span>
                            </div>
                          )}
                          {expectedEndTime && (
                            <div className={`text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1 ${i18n.language === 'ar' ? 'mr-6' : 'ml-6'}`}>
                              <Clock className="w-3 h-3" />
                              <span>{t("surgery_appointments.expected_end")}:</span>
                              <span className="font-medium">{formatTime(expectedEndTime)}</span>
                            </div>
                          )}
                          {item.expectedTime && (
                            <div className={`text-[10px] text-red-600 dark:text-red-400 flex items-center gap-1 ${i18n.language === 'ar' ? 'mr-6' : 'ml-6'}`}>
                              <Clock className="w-3 h-3" />
                              <span>{t("surgery_appointments.expected_time")}:</span>
                              <span className="font-medium">{formatTime(item.expectedTime)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <ul className="space-y-3 text-sm">
              {combinedItems.filter(filterItem).map((item) => {
                const expectedEndTime = item.type === "surgery" ? calculateExpectedEndTime(item.time, item.durationMinutes) : null;
                return (
                  <li key={`${item.type}-${item.id}`} className="bg-white dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                        <span className="font-bold text-gray-900 dark:text-zinc-100">
                          {item.time ? formatTime(item.time) : "—"}
                        </span>
                        {item.type === "surgery" && (
                          <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 text-[10px] font-bold uppercase">
                            {t("appointments.dropdown.surgery")}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-right">
                        <span className="text-gray-800 dark:text-zinc-200 font-medium text-xs break-words">
                          {item.ownerName}
                        </span>
                        <User className="w-3 h-3 text-zinc-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 border-t border-gray-50 dark:border-zinc-700/30 pt-1">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        <span className="italic">{item.animalName}</span>
                      </div>
                      
                      {item.type === "surgery" && (expectedEndTime || item.expectedTime) && (
                        <div className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(expectedEndTime || item.expectedTime)}</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )
        )}
      </div>
      <p className="text-[10px] text-gray-400 dark:text-zinc-500 mt-2 italic">{t("appointments.dropdown.filter_desc")}</p>
    </div>
  );
}
