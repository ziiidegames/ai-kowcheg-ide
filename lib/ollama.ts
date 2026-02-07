// Типы для Ollama API
export interface OllamaMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OllamaGenerateOptions {
  prompt: string
  system?: string
  temperature?: number
  max_tokens?: number
  stream?: boolean
}

export interface OllamaChatOptions {
  model?: string
  messages: OllamaMessage[]
  temperature?: number
  max_tokens?: number
}

// Класс для работы с Ollama
export class OllamaService {
  private baseUrl = '/api/ollama'

  // Проверка статуса
  async checkStatus() {
    try {
      const response = await fetch(this.baseUrl)
      return await response.json()
    } catch (error) {
      console.error('Failed to check Ollama status:', error)
      return { status: 'offline', error: 'Cannot connect to Ollama' }
    }
  }

  // Генерация текста
  async generate(options: OllamaGenerateOptions) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to generate:', error)
      throw error
    }
  }

  // Чат с историей
  async chat(options: OllamaChatOptions) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to chat:', error)
      throw error
    }
  }

  // Стриминг генерации
  async generateStream(options: OllamaGenerateOptions) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...options, stream: true }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.body
  }
}

// Экспортируем singleton
export const ollama = new OllamaService()
