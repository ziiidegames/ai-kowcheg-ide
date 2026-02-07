"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ollama, OllamaMessage } from '@/lib/ollama'
import {
  Send,
  Bot,
  User,
  Loader2,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

interface AIChatProps {
  systemPrompt?: string
  onResponse?: (response: string) => void
  placeholder?: string
  className?: string
}

export function AIChat({
  systemPrompt = "You are a helpful AI assistant in The Ark system.",
  onResponse,
  placeholder = "Ask Llama 3 anything...",
  className = ""
}: AIChatProps) {
  const [messages, setMessages] = useState<OllamaMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Проверка статуса Ollama при загрузке
  useEffect(() => {
    checkOllamaStatus()
  }, [])

  // Автоскролл к последнему сообщению
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const checkOllamaStatus = async () => {
    const status = await ollama.checkStatus()
    setStatus(status.status === 'online' ? 'online' : 'offline')

    if (status.status === 'online' && !status.hasLlama3) {
      console.warn('Llama 3:8b not found. Install it with: ollama pull llama3:8b')
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || status !== 'online') return

    const userMessage: OllamaMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      // Добавляем системный промпт если это первое сообщение
      const chatMessages = messages.length === 0
        ? [{ role: 'system' as const, content: systemPrompt }, userMessage]
        : updatedMessages

      const response = await ollama.chat({
        messages: chatMessages,
        temperature: 0.7,
        max_tokens: 2048,
      })

      const assistantMessage: OllamaMessage = {
        role: 'assistant',
        content: response.message.content
      }

      setMessages([...updatedMessages, assistantMessage])

      // Callback с ответом
      if (onResponse) {
        onResponse(response.message.content)
      }
    } catch (error) {
      console.error('Failed to send message:', error)
      const errorMessage: OllamaMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure Ollama is running with Llama 3:8b model.'
      }
      setMessages([...updatedMessages, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4" />
          <span className="text-sm font-medium">Llama 3:8b</span>
        </div>
        <Badge variant={status === 'online' ? 'default' : status === 'offline' ? 'destructive' : 'secondary'}>
          {status === 'checking' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
          {status === 'online' && <CheckCircle className="h-3 w-3 mr-1" />}
          {status === 'offline' && <AlertCircle className="h-3 w-3 mr-1" />}
          {status}
        </Badge>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground text-sm py-8">
              Start a conversation with Llama 3
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0">
                {message.role === 'user' ? (
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">
                  {message.role === 'user' ? 'You' : 'Llama 3'}
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="text-xs text-muted-foreground mb-1">Llama 3</div>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={placeholder}
            disabled={loading || status !== 'online'}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim() || status !== 'online'}
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        {status === 'offline' && (
          <p className="text-xs text-destructive mt-2">
            Ollama is offline. Start it with: ollama serve
          </p>
        )}
      </div>
    </div>
  )
}
