/**
 * Calculates age from date of birth
 * @param {string|Date} dob - Date of birth in string format (YYYY-MM-DD) or Date object
 * @returns {string} Age in years as a string, or "0" if invalid date
 */
export const calculateAgeFromDOB = (dob) => {
  if (!dob) return "0";
  
  const birthDate = new Date(dob);
  // Check if the date is invalid
  if (isNaN(birthDate.getTime())) return "0";
  
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // Adjust age if birthday hasn't occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  // Ensure age is not negative
  return Math.max(0, age).toString();
};

 // Convert a Date to a DateOnly string (YYYY-MM-DD) using LOCAL date parts to avoid timezone shifts
 export const toDateOnly = (date) => {
  if (!(date instanceof Date) || isNaN(date)) return null;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

 // Parse a DateOnly string (YYYY-MM-DD) into a LOCAL Date object (no timezone shift)
 export const fromDateOnly = (dateOnlyStr) => {
  if (!dateOnlyStr || typeof dateOnlyStr !== "string") return undefined;
  const m = dateOnlyStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) {
    // Fallback: try native Date parsing
    const d = new Date(dateOnlyStr);
    return isNaN(d) ? undefined : d;
  }
  const year = Number(m[1]);
  const monthIndex = Number(m[2]) - 1;
  const day = Number(m[3]);
  return new Date(year, monthIndex, day);
}
/**
 * Calculates date of birth from age
 * @param {string|number} age - Age in years
 * @returns {string} Date of birth in YYYY-MM-DD format, or empty string if invalid age
 */
export const calculateDOBFromAge = (age) => {
  // Convert to number and validate
  const ageNum = Number(age);
  if (isNaN(ageNum) || ageNum < 0) return "";
  
  const today = new Date();
  const currentYear = today.getFullYear();
  const birthYear = currentYear - Math.floor(ageNum);
  
  // Use current month and day to maintain consistency
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  
  return `${birthYear}-${month}-${day}`;
};

export const formatAppointmentDate = (dateString) => {
  if (!dateString) return "";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const appointmentDate = new Date(dateString);
  appointmentDate.setHours(0, 0, 0, 0);
  const diffTime = appointmentDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "غداً";
  if (diffDays === -1) return "أمس";
  if (diffDays < 0) return `منذ ${Math.abs(diffDays)} أيام`;
  return `${diffDays} أيام`;
};
