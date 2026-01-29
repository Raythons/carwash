import api from './index'

/**
 * Get organization AI preferences
 * @returns {Promise} Organization AI preferences
 */
export const getOrganizationAIPreferences = async () => {
  const response = await api.get('/organization/ai-preferences')
  return response.data
}

/**
 * Get decrypted API key for the organization
 * @returns {Promise<string>} Decrypted API key
 */
export const getDecryptedApiKey = async () => {
  const response = await api.get('/organization/ai-preferences/api-key')
  return response.data.apiKey
}

/**
 * Update organization AI preferences
 * @param {Object} preferences - AI preferences to update
 * @param {string} preferences.preferredProvider - Provider name (Gemini, Claude, GPT)
 * @param {string} preferences.preferredModel - Model identifier
 * @param {string} [preferences.apiKey] - Optional API key to update
 * @returns {Promise} Updated preferences
 */
export const updateOrganizationAIPreferences = async (preferences) => {
  const response = await api.put('/organization/ai-preferences', preferences)
  return response.data
}

/**
 * Reset organization AI preferences to defaults
 * @returns {Promise} Empty response
 */
export const resetOrganizationAIPreferences = async () => {
  const response = await api.delete('/organization/ai-preferences')
  return response.data
}
