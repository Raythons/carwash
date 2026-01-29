// Utilities for handling decimal text inputs with free typing and normalization
// Provides two functions:
// - handleDecimalChangeWithField: updates form via onChange(field, value)
// - handleDecimalChange: returns normalized values to let caller decide how to set state

/**
 * Normalizes a decimal text input allowing free typing (digits, comma/dot),
 * converts comma to dot, keeps only first dot, limits fractional digits.
 * Special-cases a single dot to avoid NaN in consumers.
 *
 * @param {string} raw - Raw input string from event.target.value
 * @param {number} maxDecimals - Max decimal places to keep (default 2)
 * @returns {{normalized: string, finalNum: number|null, sendValueToRHF: string}}
 *          normalized: string to display in the input
 *          finalNum: parsed float or null when empty/invalid
 *          sendValueToRHF: value to pass to RHF register.onChange (empty when dot-only)
 */
export function normalizeDecimalInput(raw, maxDecimals = 2) {
  if (raw === "") {
    return { normalized: "", finalNum: null, sendValueToRHF: "" }
  }
  const withDot = String(raw).replace(/,/g, ".")
  const onlyAllowed = withDot.replace(/[^0-9.]/g, "")
  const parts = onlyAllowed.split(".")
  let normalized = parts[0]
  if (parts.length > 1) normalized += "." + parts[1].slice(0, maxDecimals)

  if (normalized === ".") {
    return { normalized, finalNum: null, sendValueToRHF: "" }
  }

  const num = parseFloat(normalized)
  const finalNum = Number.isNaN(num) ? null : num
  return { normalized, finalNum, sendValueToRHF: normalized }
}

/**
 * Handles decimal input change and updates via onChange(field, value) and RHF register.
 * Keeps a local input state for display and prevents NaN on dot-only.
 *
 * @param {Event} e - The input change event
 * @param {{ setInput: Function, field: string, reg: any, onChange: Function, maxDecimals?: number }} opts
 */
export function handleDecimalChangeWithField(e, { setInput, field, reg, onChange, maxDecimals = 2 }) {
  const v = e.target.value
  const { normalized, finalNum, sendValueToRHF } = normalizeDecimalInput(v, maxDecimals)
  // Update form state
  onChange(field, finalNum)
  // Update local UI state
  setInput(normalized)
  // Notify RHF (avoid sending '.')
  const ev = { ...e, target: { ...e.target, value: sendValueToRHF } }
  reg.onChange(ev)
}

/**
 * Handles decimal input change but does NOT call onChange(field,...).
 * Returns values so caller can decide how to set form/state.
 *
 * @param {Event} e - The input change event
 * @param {{ maxDecimals?: number }} opts
 * @returns {{ normalized: string, finalNum: number|null, sendValueToRHF: string }}
 */
export function handleDecimalChange(e, { maxDecimals = 2 } = {}) {
  return normalizeDecimalInput(e.target.value, maxDecimals)
}

/**
 * Formats a number with thousands separator (commas) for display
 * @param {number|string} value - The number to format
 * @returns {string} - Formatted number with commas as thousands separator
 */
export function formatNumberWithThousands(value) {
  if (!value && value !== 0) return ""
  const num = value.toString().replace(/[^\d.-]/g, "")
  if (!num) return ""
  
  // Split into integer and decimal parts
  const parts = num.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Add thousands separator to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  
  // Combine with decimal part if it exists
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

/**
 * Removes thousands separator (commas) from formatted number
 * @param {string} value - The formatted number string
 * @returns {number} - Plain number without thousands separator
 */
export function parseFormattedNumber(value) {
  if (!value) return 0
  const str = value.toString()
  
  // Check if it contains commas (thousands separators)
  if (str.includes(',')) {
    // Remove all commas and convert to number
    const cleanStr = str.replace(/,/g, "")
    return cleanStr ? parseInt(cleanStr, 10) : 0
  }
  
  // Check if it contains dots (decimal point)
  if (str.includes('.')) {
    return parseFloat(str) || 0
  }
  
  // No separators, just convert to number
  const cleanStr = str.replace(/[^\d]/g, "")
  return cleanStr ? parseInt(cleanStr, 10) : 0
}
