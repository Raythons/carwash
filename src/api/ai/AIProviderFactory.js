import { GeminiProvider } from './providers/GeminiProvider'
import { ClaudeProvider } from './providers/ClaudeProvider'
import { GPTProvider } from './providers/GPTProvider'

/**
 * Factory to create AI provider instances
 */
export class AIProviderFactory {
  /**
   * Create provider instance based on type
   * @param {string} providerType - 'Gemini', 'Claude', or 'GPT'
   * @returns {IAIProvider} Provider instance
   */
  static createProvider(providerType) {
    switch (providerType?.toLowerCase()) {
      case 'gemini':
        return new GeminiProvider()
      case 'claude':
        return new ClaudeProvider()
      case 'gpt':
        return new GPTProvider()
      default:
        // Default to Gemini
        return new GeminiProvider()
    }
  }

  /**
   * Get list of all available providers
   * @returns {Array<{value: string, label: string}>}
   */
  static getAvailableProviders() {
    return [
      { value: 'Gemini', label: 'Google Gemini' },
      { value: 'Claude', label: 'Anthropic Claude' },
      { value: 'GPT', label: 'OpenAI GPT' },
    ]
  }
}
