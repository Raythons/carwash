// Date/Time utilities for localized formatting
import i18n from "@/i18n";

// Convert Arabic-Indic digits to Western digits
const normalizeDigits = (input) => {
  if (input == null) return "";
  const map = {
    "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
    "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9",
  };
  return String(input).replace(/[٠-٩]/g, (d) => map[d] || d);
};

// Parse various time string formats to { hours, minutes }
// Accepts: "15:39", "15.39", "1539", "15", {hours, minutes}
export const parseTimeToHM = (value) => {
  if (!value && value !== 0) return null;

  // Support object input { hours, minutes }
  if (typeof value === "object" && value !== null && typeof value.hours === "number") {
    const h = Math.max(0, Math.min(23, value.hours));
    const m = Math.max(0, Math.min(59, Number(value.minutes ?? 0)));
    return { hours: h, minutes: m };
  }

  let s = normalizeDigits(value).trim();
  if (!s) return null;

  // Normalize separators and drop timezone/letters for parsing
  s = s.replace(/\./g, ":");

  // If just 3-4 digits like 939 or 1539
  if (/^\d{3,4}$/.test(s) && !s.includes(":")) {
    const padded = s.padStart(4, "0");
    s = `${padded.slice(0, 2)}:${padded.slice(2)}`;
  }

  // If contains colon(s), take first two parts as HH and mm, ignore seconds and beyond
  if (s.includes(":")) {
    const parts = s.split(":");
    const hStr = (parts[0] ?? "").replace(/\D/g, "").slice(0, 2);
    const mStr = (parts[1] ?? "0").replace(/\D/g, "").slice(0, 2) || "0";
    const hours = Number.parseInt(hStr, 10);
    const minutes = Number.parseInt(mStr, 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
    return {
      hours: Math.max(0, Math.min(23, hours)),
      minutes: Math.max(0, Math.min(59, minutes)),
    };
  }

  // Fallback strict match HH or HHmm
  const match = s.match(/^(\d{1,2})(\d{2})?$/);
  if (!match) return null;
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2] ?? "0", 10);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return {
    hours: Math.max(0, Math.min(23, hours)),
    minutes: Math.max(0, Math.min(59, minutes)),
  };
};

// Convert to 12-hour format with localized period
export const to12HourLocalized = (value) => {
  const hm = parseTimeToHM(value);
  if (!hm) return null;

  const { hours, minutes } = hm;
  const isPM = hours >= 12;
  const periodKey = isPM ? "common.pm" : "common.am";
  const period = i18n.t(periodKey);
  
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12;

  // For time display, we usually want to use English digits unless explicitly stated otherwise
  // But here we'll follow the system language's convention via i18n.t
  return {
    hour12,
    minute: minutes,
    period,
    hour12Padded: String(hour12).padStart(2, "0"),
    minutePadded: String(minutes).padStart(2, "0"),
  };
};

// Backward compatibility alias
export const to12HourArabic = to12HourLocalized;

// Convenience formatter: returns string like "03:39 PM" or "03:39 مساءً"
export const formatTime12Ar = (value) => {
  const res = to12HourLocalized(value);
  if (!res) return "";
  
  // Keep using formatTime12Ar name for compatibility, but it's now localized
  return `${res.hour12Padded}:${res.minutePadded} ${res.period}`;
};

// Calculate expected days between start and expected end date
export const calculateExpectedDays = (startDate, expectedEndDate) => {
  if (!startDate || !expectedEndDate) return 0
  const start = new Date(startDate)
  const end = new Date(expectedEndDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Include both start and end days
}

// Calculate current days from start date to today or actual end date
export const calculateCurrentDays = (startDate, actualEndDate) => {
  if (!startDate) return 0
  const start = new Date(startDate)
  const end = actualEndDate ? new Date(actualEndDate) : new Date()
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays + 1 // Include both start and end days
}

// Format date with correct locale for consistent display
export const formatDateEnSA = (dateString, customLocale) => {
  if (!dateString) return i18n.t("common.not_specified")
  const date = new Date(dateString)
  const locale = customLocale || (i18n.language === 'ar' ? 'ar-EG' : 'en-GB')
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format date with full month name for detailed views
export const formatDateLong = (dateString, customLocale) => {
  if (!dateString) return i18n.t("common.not_specified")
  const date = new Date(dateString)
  const locale = customLocale || (i18n.language === 'ar' ? 'ar-EG' : 'en-GB')
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default {
  normalizeDigits,
  parseTimeToHM,
  to12HourLocalized,
  formatTime12Ar,
  calculateExpectedDays,
  calculateCurrentDays,
  formatDateEnSA,
  formatDateLong,
};
