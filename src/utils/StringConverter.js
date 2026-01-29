class StringConverter {
  /**
   * Converts a backend-provided string to a localized English version if the current language is English.
   * @param {string} word - The original string from the backend.
   * @param {string} language - The current application language.
   * @returns {string} - The translated or original string.
   */
  static convert(word, language) {
    if (language !== "en") return word;

    const translations = {
      // Payment Breakdown Types
      "إقامة": "Residence",
      "تجارة": "Trade",
      "جراحة": "Surgery",
      "متابعة جراحة": "Surgery Follow-up",
      "معاينة": "Examination",

      // Animal Types
      "كلب": "Dog",
      "قط": "Cat",
      "طير": "Bird",
      "أرنب": "Rabbit",
      "خيل": "Horse",
      "حصان": "Horse",
      "سلحفاة": "Turtle",
      "زواحف": "Reptiles",
    };

    return translations[word] || word;
  }
}

export default StringConverter;
