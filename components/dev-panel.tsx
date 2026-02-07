'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Settings2, X } from 'lucide-react'

export function DevPanel() {
  const [isOpen, setIsOpen] = useState(false)

  // Параметры чата
  const [chatConfig, setChatConfig] = useState({
    bottom: 24,        // отступ снизу
    maxWidth: 768,     // макс ширина
    padding: 8,        // внутренние отступы
    height: 40,        // высота инпута
    borderRadius: 8,   // скругление
    blur: 12,          // размытие фона
    opacity: 95,       // прозрачность
  })

  // Применяем стили к чату в реальном времени
  useEffect(() => {
    const chatElement = document.querySelector('#chat-container')
    if (chatElement) {
      (chatElement as HTMLElement).style.cssText = `
        bottom: ${chatConfig.bottom}px !important;
        max-width: ${chatConfig.maxWidth}px !important;
      `

      const card = chatElement.querySelector('.chat-card')
      if (card) {
        (card as HTMLElement).style.cssText = `
          padding: ${chatConfig.padding}px !important;
          border-radius: ${chatConfig.borderRadius}px !important;
          backdrop-filter: blur(${chatConfig.blur}px) !important;
        `
      }

      const input = chatElement.querySelector('input')
      if (input) {
        (input as HTMLElement).style.height = `${chatConfig.height}px`
      }
    }
  }, [chatConfig])

  if (!isOpen) {
    return (
      <Button
        size="icon"
        className="fixed top-20 right-4 z-50"
        onClick={() => setIsOpen(true)}
        title="Open Live Editor"
      >
        <Settings2 className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Card className="fixed top-20 right-4 w-80 p-4 z-50 bg-background/95 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Live Editor</h3>
        <Button size="icon" variant="ghost" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {/* Отступ снизу */}
        <div>
          <label className="text-sm text-muted-foreground">
            Bottom: {chatConfig.bottom}px
          </label>
          <Slider
            value={[chatConfig.bottom]}
            onValueChange={([value]) => setChatConfig({...chatConfig, bottom: value})}
            min={0}
            max={100}
            step={1}
          />
        </div>

        {/* Максимальная ширина */}
        <div>
          <label className="text-sm text-muted-foreground">
            Max Width: {chatConfig.maxWidth}px
          </label>
          <Slider
            value={[chatConfig.maxWidth]}
            onValueChange={([value]) => setChatConfig({...chatConfig, maxWidth: value})}
            min={400}
            max={1200}
            step={10}
          />
        </div>

        {/* Внутренние отступы */}
        <div>
          <label className="text-sm text-muted-foreground">
            Padding: {chatConfig.padding}px
          </label>
          <Slider
            value={[chatConfig.padding]}
            onValueChange={([value]) => setChatConfig({...chatConfig, padding: value})}
            min={0}
            max={24}
            step={2}
          />
        </div>

        {/* Высота инпута */}
        <div>
          <label className="text-sm text-muted-foreground">
            Input Height: {chatConfig.height}px
          </label>
          <Slider
            value={[chatConfig.height]}
            onValueChange={([value]) => setChatConfig({...chatConfig, height: value})}
            min={32}
            max={64}
            step={4}
          />
        </div>

        {/* Скругление углов */}
        <div>
          <label className="text-sm text-muted-foreground">
            Border Radius: {chatConfig.borderRadius}px
          </label>
          <Slider
            value={[chatConfig.borderRadius]}
            onValueChange={([value]) => setChatConfig({...chatConfig, borderRadius: value})}
            min={0}
            max={24}
            step={2}
          />
        </div>

        {/* Размытие */}
        <div>
          <label className="text-sm text-muted-foreground">
            Blur: {chatConfig.blur}px
          </label>
          <Slider
            value={[chatConfig.blur]}
            onValueChange={([value]) => setChatConfig({...chatConfig, blur: value})}
            min={0}
            max={24}
            step={2}
          />
        </div>

        {/* Прозрачность */}
        <div>
          <label className="text-sm text-muted-foreground">
            Opacity: {chatConfig.opacity}%
          </label>
          <Slider
            value={[chatConfig.opacity]}
            onValueChange={([value]) => setChatConfig({...chatConfig, opacity: value})}
            min={50}
            max={100}
            step={5}
          />
        </div>

        {/* Кнопка копирования конфига */}
        <Button
          className="w-full"
          onClick={() => {
            navigator.clipboard.writeText(JSON.stringify(chatConfig, null, 2))
            alert('Config copied! Send it to Claude!')
          }}
        >
          Copy Config for Claude
        </Button>
      </div>
    </Card>
  )
}
