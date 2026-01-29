/**
 * AI Provider Interface - Strategy Pattern
 * All AI providers must implement this interface
 */
export class IAIProvider {
  /**
   * Generate diagnosis based on examination data
   * @param {string} apiKey - API key for the provider
   * @param {string} model - Model identifier (e.g., "gemini-2.0-flash-exp")
   * @param {Object} examinationData - Complete examination form data
   * @param {string} language - Language code ('en' or 'ar')
   * @param {string} userMessage - Optional user message/question
   * @returns {Promise<string>} Generated diagnosis text
   */
  async generateDiagnosis(apiKey, model, examinationData, language, userMessage) {
    throw new Error('generateDiagnosis() must be implemented by concrete provider')
  }

  /**
   * Get list of supported models for this provider
   * @returns {Array<{value: string, label: string}>} Array of model options
   */
  getSupportedModels() {
    throw new Error('getSupportedModels() must be implemented by concrete provider')
  }

  /**
   * Validate API key format (basic validation)
   * @param {string} apiKey - API key to validate
   * @returns {boolean} True if valid format
   */
  validateApiKey(apiKey) {
    throw new Error('validateApiKey() must be implemented by concrete provider')
  }

  /**
   * Get provider name
   * @returns {string} Provider name
   */
  getProviderName() {
    throw new Error('getProviderName() must be implemented by concrete provider')
  }
}
