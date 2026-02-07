import { NextRequest, NextResponse } from 'next/server'

// Базовый URL для Ollama API
const OLLAMA_API_URL = process.env.NEXT_PUBLIC_OLLAMA_BASE_URL || 'http://localhost:11434'

// Проверка доступности Ollama
export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`)
    const data = await response.json()

    // Проверяем есть ли llama3:8b среди установленных моделей
    const hasLlama3 = data.models?.some((model: any) =>
      model.name.includes('llama3') || model.name.includes('llama-3')
    )

    return NextResponse.json({
      status: 'online',
      models: data.models || [],
      hasLlama3: hasLlama3,
      message: hasLlama3 ? 'Llama 3:8b ready' : 'Llama 3:8b not found. Run: ollama pull llama3:8b'
    })
  } catch (error) {
    return NextResponse.json({
      status: 'offline',
      error: 'Ollama is not running. Start it with: ollama serve'
    }, { status: 500 })
  }
}

// Генерация контента через Llama 3
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, system, temperature = 0.7, max_tokens = 2048, stream = false } = body

    // Формируем запрос к Ollama
    const response = await fetch(`${OLLAMA_API_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3:8b',
        prompt: prompt,
        system: system || "You are a helpful AI assistant in The Ark system. Be concise and helpful.",
        stream: stream,
        options: {
          temperature: temperature,
          num_predict: max_tokens,
        }
      }),
    })

    if (stream) {
      // Для стриминга возвращаем поток
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Для обычного запроса ждем полный ответ
      const data = await response.json()
      return NextResponse.json({
        response: data.response,
        model: data.model,
        created_at: data.created_at,
        total_duration: data.total_duration,
      })
    }
  } catch (error) {
    console.error('Ollama API error:', error)
    return NextResponse.json({
      error: 'Failed to generate response',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Endpoint для chat режима (с историей)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { model = 'llama3:8b', messages, temperature = 0.7, max_tokens = 2048 } = body

    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: temperature,
          num_predict: max_tokens,
        }
      }),
    })

    const data = await response.json()
    return NextResponse.json({
      message: data.message,
      model: data.model,
      created_at: data.created_at,
      total_duration: data.total_duration,
    })
  } catch (error) {
    console.error('Ollama chat error:', error)
    return NextResponse.json({
      error: 'Failed to chat',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
