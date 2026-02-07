"use client"

import { useCallback, useState, useRef, useEffect } from 'react'
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Connection,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position
} from 'reactflow'
import 'reactflow/dist/style.css'

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DevPanel } from "@/components/dev-panel"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ollama } from "@/lib/ollama"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  Image as ImageIcon,
  Video,
  FileText,
  Sparkles,
  Send,
  Loader2,
  Plus,
  Bot
} from 'lucide-react'

// Кастомный фрейм-нода
const FrameNode = ({ data, selected }: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'hsl(var(--primary))',
          width: 10,
          height: 10,
          border: '2px solid hsl(var(--background))'
        }}
      />

      <Card className={`w-72 transition-all ${selected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'}`}>
        <CardHeader className="pb-2 px-3 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {data.type === 'image' && <ImageIcon className="h-4 w-4 text-blue-500" />}
              {data.type === 'video' && <Video className="h-4 w-4 text-purple-500" />}
              {data.type === 'text' && <FileText className="h-4 w-4 text-green-500" />}
              <span className="font-medium text-sm">{data.label}</span>
            </div>
            <Badge
              variant={
                data.status === 'complete' ? 'default' :
                data.status === 'generating' ? 'secondary' :
                'outline'
              }
              className="text-xs"
            >
              {data.status === 'generating' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
              {data.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="px-3 pb-3">
          <div className="aspect-video bg-muted rounded-md flex items-center justify-center overflow-hidden">
            {data.content ? (
              <div className="w-full h-full p-2 overflow-hidden">
                <p className="text-xs text-center line-clamp-6">{data.content}</p>
              </div>
            ) : (
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            )}
          </div>

          {data.prompt && (
            <div className="mt-2 p-2 bg-muted/50 rounded text-xs text-muted-foreground line-clamp-2">
              "{data.prompt}"
            </div>
          )}
        </CardContent>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'hsl(var(--primary))',
          width: 10,
          height: 10,
          border: '2px solid hsl(var(--background))'
        }}
      />
    </>
  )
}

const nodeTypes = {
  frame: FrameNode,
}

// Главный компонент
function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [selectedModel, setSelectedModel] = useState('llama3:8b')

  const { toast } = useToast()
  const { project } = useReactFlow()
  const nodeIdCounter = useRef(1)

  // Создание первого фрейма при загрузке
  useEffect(() => {
    if (nodes.length === 0) {
      addNewNode('image', { x: 250, y: 200 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Добавление нового фрейма
  const addNewNode = useCallback((type: string, position?: { x: number, y: number }) => {
    const id = `frame-${nodeIdCounter.current++}`

    // Если позиция не указана, добавляем в центр видимой области
    let nodePosition = position
    if (!nodePosition) {
      const centerX = window.innerWidth / 2 - 140
      const centerY = window.innerHeight / 2 - 150
      nodePosition = project({ x: centerX, y: centerY })
    }

    const newNode: Node = {
      id,
      type: 'frame',
      position: nodePosition,
      data: {
        label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodeIdCounter.current - 1}`,
        type,
        status: 'ready',
        prompt: '',
        content: ''
      }
    }
    setNodes((nds) => [...nds, newNode])

    toast({
      title: "Frame Added",
      description: `${type} frame created`
    })

    return id
  }, [setNodes, project, toast])

  // Соединение нод
  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge({
      ...params,
      animated: true,
      style: { stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2 }
    }, eds))
  }, [setEdges])

  // Клик на ноду
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
    setPrompt(node.data.prompt || '')
  }, [])

  // Генерация контента
  const generateContent = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive"
      })
      return
    }

    setGenerating(true)

    // Если фрейм не выбран - создаём новый текстовый фрейм
    let targetNodeId: string
    if (!selectedNode) {
      targetNodeId = addNewNode('text')
      toast({
        title: "Frame Created",
        description: "New text frame created for your content"
      })
    } else {
      targetNodeId = selectedNode.id
    }

    // Обновляем статус
    setNodes((nds) =>
      nds.map((node) =>
        node.id === targetNodeId
          ? { ...node, data: { ...node.data, status: 'generating', prompt } }
          : node
      )
    )

    try {
      // Получаем информацию о фрейме для system prompt
      const targetFrame = nodes.find(n => n.id === targetNodeId) || selectedNode
      const frameType = targetFrame?.data?.type || 'text'

      // Вызов к Ollama API
      const response = await ollama.chat({
        model: selectedModel,
        messages: [
          {
            role: 'system',
            content: `You are a creative content generator for ${frameType} frames. Generate engaging, descriptive content based on the user's prompt. Keep it concise but impactful (2-3 sentences).`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      })

      const generatedContent = response.message.content

      setNodes((nds) =>
        nds.map((node) =>
          node.id === targetNodeId
            ? { ...node, data: { ...node.data, status: 'complete', content: generatedContent } }
            : node
        )
      )

      toast({
        title: "Success",
        description: "Content generated successfully",
      })

      setPrompt('')
    } catch (error) {
      console.error('Ollama generation failed:', error)

      setNodes((nds) =>
        nds.map((node) =>
          node.id === targetNodeId
            ? { ...node, data: { ...node.data, status: 'ready' } }
            : node
        )
      )

      toast({
        title: "Error",
        description: "Failed to generate content. Make sure Ollama is running.",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="h-full relative">
      {/* Canvas - занимает всю высоту */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background
          gap={20}
          size={1}
          color="hsl(var(--muted-foreground) / 0.2)"
        />

        <Controls
          showInteractive={false}
          className="!left-4 !bottom-4"
        />
      </ReactFlow>

      {/* ЧАТ КАК ОТДЕЛЬНОЕ ОКОШКО ВНИЗУ ПО ЦЕНТРУ */}
      <div id="chat-container" className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50">
        <Card className="chat-card border bg-background/95 backdrop-blur-md shadow-xl">
          <div className="p-2">
            <div className="flex items-center gap-2">
              {/* Выбор модели - компактный */}
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-[120px] h-10 text-sm">
                  <Bot className="w-4 h-4 mr-1.5" />
                  <SelectValue placeholder="Model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="llama3:8b">Llama 3</SelectItem>
                  <SelectItem value="mistral:7b">Mistral</SelectItem>
                  <SelectItem value="codellama:13b">CodeLlama</SelectItem>
                </SelectContent>
              </Select>

              {/* Поле ввода с кнопками внутри */}
              <div className="relative flex-1">
                <Input
                  placeholder="What would you like to create?"
                  className="h-10 pr-20"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && prompt.trim()) {
                      e.preventDefault()
                      generateContent()
                    }
                  }}
                />
                <div className="absolute right-1 top-1 flex gap-1">
                  {/* Кнопка добавления фреймов */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => addNewNode('image')}>
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Image Frame
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewNode('video')}>
                        <Video className="h-4 w-4 mr-2" />
                        Video Frame
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => addNewNode('text')}>
                        <FileText className="h-4 w-4 mr-2" />
                        Text Frame
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Кнопка отправки */}
                  <Button
                    size="icon"
                    className="h-8 w-8"
                    disabled={!prompt.trim() || generating}
                    onClick={generateContent}
                  >
                    {generating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Dev Panel для live-редактирования */}
      <DevPanel />
    </div>
  )
}

export default function DashboardPage() {
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
        <div className="h-[calc(100vh-var(--header-height))] flex flex-col">
          {/* Заголовок страницы */}
          <div className="px-8 pt-6 pb-4">
            <h2 className="text-3xl font-bold tracking-tight">Visual Workflow</h2>
            <p className="text-muted-foreground">
              Create AI-powered content with visual workflows
            </p>
          </div>

          {/* Canvas - занимает всю оставшуюся высоту */}
          <div className="flex-1 overflow-hidden">
            <ReactFlowProvider>
              <FlowEditor />
            </ReactFlowProvider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
