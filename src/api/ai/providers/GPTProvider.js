import { IAIProvider } from '../IAIProvider'
import { buildPrompt } from '../../../utils/promptBuilder'

export class GPTProvider extends IAIProvider {
  async generateDiagnosis(apiKey, model, examinationData, language, userMessage) {
    if (!apiKey) {
      throw new Error('API key is required for GPT')
    }

    try {
      // Build prompt using bilingual prompt builder
      const prompt = buildPrompt(examinationData, language, userMessage)
      
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert veterinarian providing diagnosis suggestions.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 4096,
          temperature: 0.7
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content
      }
      
      throw new Error('No response from GPT')
    } catch (error) {
      console.error('GPT error:', error)
      throw new Error(`Failed to get diagnosis from GPT: ${error.message}`)
    }
  }

  getSupportedModels() {
    return [
      { value: 'gpt-4', label: 'GPT-4' },
      { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
      { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    ]
  }

  validateApiKey(apiKey) {
    // OpenAI keys start with "sk-"
    return apiKey && apiKey.startsWith('sk-') && apiKey.length > 40
  }

  getProviderName() {
    return 'GPT'
  }
}
