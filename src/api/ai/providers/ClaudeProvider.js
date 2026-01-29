import { IAIProvider } from '../IAIProvider'
import { buildPrompt } from '../../../utils/promptBuilder'

export class ClaudeProvider extends IAIProvider {
  async generateDiagnosis(apiKey, model, examinationData, language, userMessage) {
    if (!apiKey) {
      throw new Error('API key is required for Claude')
    }

    try {
      // Build prompt using bilingual prompt builder
      const prompt = buildPrompt(examinationData, language, userMessage)
      
      // Call Anthropic API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model || 'claude-3-sonnet-20240229',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.content && data.content.length > 0) {
        return data.content[0].text
      }
      
      throw new Error('No response from Claude')
    } catch (error) {
      console.error('Claude error:', error)
      throw new Error(`Failed to get diagnosis from Claude: ${error.message}`)
    }
  }

  getSupportedModels() {
    return [
      { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
      { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
      { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
    ]
  }

  validateApiKey(apiKey) {
    // Claude keys start with "sk-ant-"
    return apiKey && apiKey.startsWith('sk-ant-') && apiKey.length > 40
  }

  getProviderName() {
    return 'Claude'
  }
}
