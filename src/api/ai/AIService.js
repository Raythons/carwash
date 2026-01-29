/**
 * AI Service - Context class that uses AI provider strategies
 */
export class AIService {
  constructor(provider) {
    this.provider = provider
  }

  /**
   * Generate diagnosis using the configured provider
   * @param {string} apiKey - API key for the provider
   * @param {string} model - Model identifier
   * @param {Object} examinationData - Examination form data
   * @param {string} language - Language code ('en' or 'ar')
   * @param {string} userMessage - Optional user message
   * @returns {Promise<string>} Generated diagnosis
   */
  async generateDiagnosis(apiKey, model, examinationData, language, userMessage) {
    return await this.provider.generateDiagnosis(apiKey, model, examinationData, language, userMessage)
  }

  /**
   * Get supported models for current provider
   * @returns {Array<{value: string, label: string}>}
   */
  getSupportedModels() {
    return this.provider.getSupportedModels()
  }

  /**
   * Validate API key for current provider
   * @param {string} apiKey
   * @returns {boolean}
   */
  validateApiKey(apiKey) {
    return this.provider.validateApiKey(apiKey)
  }

  /**
   * Get provider name
   * @returns {string}
   */
  getProviderName() {
    return this.provider.getProviderName()
  }
}
