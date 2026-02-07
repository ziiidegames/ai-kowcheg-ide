"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Rocket,
  Send,
  Copy,
  RotateCcw,
  Sparkles,
  Zap,
  Settings2,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { ollama } from '@/lib/ollama'
import { useToast } from "@/hooks/use-toast"

export default function PlaygroundPage() {
  const [temperature, setTemperature] = useState([0.7])
  const [maxTokens, setMaxTokens] = useState([2048])
  const [topP, setTopP] = useState([0.9])
  const [systemPrompt, setSystemPrompt] = useState("")
  const [userPrompt, setUserPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [generating, setGenerating] = useState(false)
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const { toast } = useToast()

  // Проверка статуса Ollama при загрузке
  useEffect(() => {
    checkOllamaStatus()
  }, [])

  const checkOllamaStatus = async () => {
    const statusData = await ollama.checkStatus()
    setStatus(statusData.status === 'online' ? 'online' : 'offline')

    if (statusData.status === 'online' && !statusData.hasLlama3) {
      toast({
        title: "Model Not Found",
        description: "Llama 3:8b not found. Install it with: ollama pull llama3:8b",
        variant: "destructive"
      })
    }
  }

  const generateResponse = async () => {
    if (!userPrompt.trim()) {
      toast({
        title: "Empty Prompt",
        description: "Please enter a prompt to generate a response.",
        variant: "destructive"
      })
      return
    }

    setGenerating(true)
    setOutput("")

    try {
      const response = await ollama.generate({
        prompt: userPrompt,
        system: systemPrompt || "You are a helpful AI assistant in The Ark system. Be creative and helpful.",
        temperature: temperature[0],
        max_tokens: maxTokens[0],
      })

      setOutput(response.response)
      toast({
        title: "Success",
        description: "Response generated successfully!",
      })
    } catch (error) {
      console.error('Generation failed:', error)
      setOutput('Failed to generate. Make sure Ollama is running with Llama 3:8b')
      toast({
        title: "Generation Failed",
        description: "Make sure Ollama is running with Llama 3:8b model.",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleReset = () => {
    setSystemPrompt("")
    setUserPrompt("")
    setOutput("")
    setTemperature([0.7])
    setMaxTokens([2048])
    setTopP([0.9])
    toast({
      title: "Reset Complete",
      description: "All fields have been cleared.",
    })
  }

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output)
      toast({
        title: "Copied!",
        description: "Response copied to clipboard.",
      })
    }
  }

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'creative':
        setTemperature([0.9])
        setMaxTokens([3072])
        setTopP([0.95])
        break
      case 'balanced':
        setTemperature([0.7])
        setMaxTokens([2048])
        setTopP([0.9])
        break
      case 'precise':
        setTemperature([0.3])
        setMaxTokens([1024])
        setTopP([0.8])
        break
      case 'fast':
        setTemperature([0.5])
        setMaxTokens([512])
        setTopP([0.85])
        break
    }
    toast({
      title: "Preset Applied",
      description: `${preset.charAt(0).toUpperCase() + preset.slice(1)} preset has been applied.`,
    })
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex-1 space-y-4 p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">AI Playground</h2>
                <p className="text-muted-foreground">
                  Test and experiment with AI models
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={status === 'online' ? 'default' : status === 'offline' ? 'destructive' : 'secondary'}>
                  {status === 'checking' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  {status === 'online' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {status === 'offline' && <AlertCircle className="h-3 w-3 mr-1" />}
                  Ollama {status}
                </Badge>
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid gap-4 lg:grid-cols-3">
              {/* Input Section */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Prompt Input
                    </CardTitle>
                    <CardDescription>
                      Enter your prompt and configure the AI response
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Model</Label>
                      <Select defaultValue="llama3" disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an AI model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="llama3">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">Chat</Badge>
                              <span>Llama 3 - 8B</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>System Prompt (Optional)</Label>
                      <Textarea
                        value={systemPrompt}
                        onChange={(e) => setSystemPrompt(e.target.value)}
                        placeholder="Set the behavior and context for the AI..."
                        className="min-h-[100px] font-mono text-sm"
                        disabled={generating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>User Prompt</Label>
                      <Textarea
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Enter your prompt here..."
                        className="min-h-[200px]"
                        disabled={generating}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                            e.preventDefault()
                            generateResponse()
                          }
                        }}
                      />
                      <p className="text-xs text-muted-foreground">
                        Press Ctrl+Enter to generate
                      </p>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleReset}
                        disabled={generating}
                      >
                        Clear All
                      </Button>
                      <Button
                        className="gap-2"
                        onClick={generateResponse}
                        disabled={generating || !userPrompt.trim() || status !== 'online'}
                      >
                        {generating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4" />
                            Generate Response
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Response</CardTitle>
                    <CardDescription>
                      {generating ? "Generating response..." : output ? "Generated output" : "Output will appear here"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] w-full rounded-md border bg-muted/50 p-4">
                      {generating ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">
                              Llama 3 is thinking...
                            </p>
                          </div>
                        </div>
                      ) : output ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          <pre className="whitespace-pre-wrap font-sans">{output}</pre>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-sm text-muted-foreground">
                            Enter a prompt and click Generate to see the AI response
                          </p>
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings2 className="h-5 w-5" />
                      Model Parameters
                    </CardTitle>
                    <CardDescription>Fine-tune the AI behavior</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Temperature</Label>
                        <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                      </div>
                      <Slider
                        value={temperature}
                        onValueChange={setTemperature}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Controls randomness: 0 = focused, 1 = creative
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Max Tokens</Label>
                        <span className="text-sm text-muted-foreground">{maxTokens[0]}</span>
                      </div>
                      <Slider
                        value={maxTokens}
                        onValueChange={setMaxTokens}
                        max={4096}
                        step={256}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum length of the response
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Top P</Label>
                        <span className="text-sm text-muted-foreground">{topP[0]}</span>
                      </div>
                      <Slider
                        value={topP}
                        onValueChange={setTopP}
                        max={1}
                        step={0.1}
                        className="w-full"
                      />
                      <p className="text-xs text-muted-foreground">
                        Nucleus sampling threshold
                      </p>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label>Quick Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset('creative')}
                          disabled={generating}
                        >
                          Creative
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset('balanced')}
                          disabled={generating}
                        >
                          Balanced
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset('precise')}
                          disabled={generating}
                        >
                          Precise
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => applyPreset('fast')}
                          disabled={generating}
                        >
                          Fast
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
