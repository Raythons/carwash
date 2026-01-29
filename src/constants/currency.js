// Currency constants for the application
import i18n from "../i18n";

// Internal state to hold currency data
let currencyData = {
  symbol: "ل.س",
  code: "SYP",
  nameEn: "Syrian Pound",
  nameAr: "ليرة سورية",
  shortNameEn: "S.P",
  shortNameAr: "ل.س"
};

/**
 * The global CURRENCY object.
 * Properties are getters to ensure values stay updated (especially for localization).
 */
export const CURRENCY = {
  get _data() {
    try {
      const storedUser = localStorage.getItem('authUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user.currency) {
          return {
            symbol: user.currency.symbol || user.currency.Symbol || currencyData.symbol,
            code: user.currency.code || user.currency.Code || currencyData.code,
            nameEn: user.currency.nameEn || user.currency.NameEn || currencyData.nameEn,
            nameAr: user.currency.nameAr || user.currency.NameAr || currencyData.nameAr,
            shortNameEn: user.currency.shortNameEn || user.currency.ShortNameEn || currencyData.shortNameEn,
            shortNameAr: user.currency.shortNameAr || user.currency.ShortNameAr || currencyData.shortNameAr
          };
        }
      }
    } catch (e) {
      console.error("Error parsing authUser for currency:", e);
    }
    return currencyData;
  },

  get SYMBOL() { return this._data.symbol; },
  get CODE() { return this._data.code; },
  get NAME() { 
    return i18n.language === 'ar' ? this._data.nameAr : this._data.nameEn; 
  },
  get SHORT_NAME() { 
    return i18n.language === 'ar' ? this._data.shortNameAr : this._data.shortNameEn; 
  }
};

/**
 * Initializes the global currency data from the backend.
 * @param {Object} data - Currency data from backend
 */
export const initializeCurrency = (data) => {
  if (!data) return;

  currencyData = {
    symbol: data.symbol || data.Symbol || "ل.س",
    code: data.code || data.Code || "SYP",
    nameEn: data.nameEn || data.NameEn || "Syrian Pound",
    nameAr: data.nameAr || data.NameAr || "ليرة سورية",
    shortNameEn: data.shortNameEn || data.ShortNameEn || "S.P",
    shortNameAr: data.shortNameAr || data.ShortNameAr || "ل.س"
  };

  console.log("Currency initialized with:", currencyData);
};

/**
 * Helper function to format currency display
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    useShortName = true,
    prefix = "",
    suffix = ""
  } = options;
  
  if (!amount && amount !== 0) return "-";
  
  const currencyText = useShortName ? CURRENCY.SHORT_NAME : CURRENCY.NAME;
  const displayText = showSymbol ? currencyText : "";
  
  return `${prefix}${amount}${displayText ? ` ${displayText}` : ""}${suffix}`;
};

export default CURRENCY;
