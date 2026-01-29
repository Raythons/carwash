import { IAIProvider } from '../IAIProvider'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { buildPrompt } from '../../../utils/promptBuilder'

export class GeminiProvider extends IAIProvider {
  async generateDiagnosis(apiKey, model, examinationData, language, userMessage) {
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    }

    try {
      if (!apiKey) {
        throw new Error('Gemini API key is required. Please configure it in Settings.')
      }

      const genAI = new GoogleGenerativeAI(apiKey)
      
      const geminiModel = genAI.getGenerativeModel({ 
        model: model || 'gemini-2.0-flash-exp',
        generationConfig
      })

      // Build prompt using bilingual prompt builder
      const prompt = buildPrompt(examinationData, language, userMessage)
      
      const result = await geminiModel.generateContent(prompt)
      const response = result.response
      
      // Extract text from response
      let text = ''
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0]
        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
          text = candidate.content.parts.map(part => part.text || '').join('')
        }
      }
      
      if (!text || text.length === 0) {
        try {
          text = response.text()
        } catch (e) {
          console.warn('response.text() failed:', e)
        }
      }
      
      if (!text || text.length === 0) {
        throw new Error('No response from AI')
      }
      
      return text
    } catch (error) {
      console.error('Gemini error:', error)
      throw new Error(`Failed to get diagnosis: ${error.message || 'Unknown error'}`)
    }
  }

  getSupportedModels() {
    return [
      { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash (Experimental)' },
      { value: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro' },
      { value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
    ]
  }

  validateApiKey(apiKey) {
    // Basic validation - Gemini keys start with "AIza"
    return apiKey && apiKey.startsWith('AIza') && apiKey.length > 30
  }

  getProviderName() {
    return 'Gemini'
  }
}
