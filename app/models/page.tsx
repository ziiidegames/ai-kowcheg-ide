"use client"

import { useState, useEffect } from "react"
import { ollama } from "@/lib/ollama"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Download,
  Trash2,
  Play,
  Pause,
  Brain,
  Cpu,
  HardDrive,
  Activity,
  Search,
  RefreshCw
} from "lucide-react"

interface OllamaModel {
  name: string
  size: number
  modified_at: string
  digest: string
}

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [models, setModels] = useState<OllamaModel[]>([])
  const [loading, setLoading] = useState(true)
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline'>('offline')
  const { toast } = useToast()

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const status = await ollama.checkStatus()
      setOllamaStatus(status.status === 'online' ? 'online' : 'offline')

      if (status.status === 'online' && status.models) {
        setModels(status.models)
      }
    } catch (error) {
      console.error('Failed to load models:', error)
      toast({
        title: "Error",
        description: "Failed to connect to Ollama. Make sure it's running.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getModelType = (name: string) => {
    if (name.includes('code')) return 'Code'
    if (name.includes('llama')) return 'Chat'
    if (name.includes('mistral')) return 'Chat'
    return 'General'
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
                <h2 className="text-3xl font-bold tracking-tight">AI Models Hub</h2>
                <p className="text-muted-foreground">
                  Manage and deploy AI models in The Ark
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadModels} disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download Model
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Models</CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{models.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {ollamaStatus === 'online' ? 'Connected' : 'Offline'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatBytes(models.reduce((acc, m) => acc + m.size, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">{models.length} models</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12.4 GB</div>
                  <p className="text-xs text-muted-foreground">of 32 GB available</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">2 chat, 1 code</p>
                </CardContent>
              </Card>
            </div>

            {/* Models Table */}
            <Tabs defaultValue="installed" className="space-y-4">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="installed">Installed Models</TabsTrigger>
                  <TabsTrigger value="available">Available Models</TabsTrigger>
                  <TabsTrigger value="running">Running Models</TabsTrigger>
                </TabsList>
                <div className="flex items-center space-x-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search models..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>

              <TabsContent value="installed" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Installed Models</CardTitle>
                    <CardDescription>
                      Models available for deployment in The Ark
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Model Name</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Memory</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Loading models...</p>
                            </TableCell>
                          </TableRow>
                        ) : models.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                              <p className="text-sm text-muted-foreground">
                                {ollamaStatus === 'offline'
                                  ? 'Ollama is offline. Start it with: ollama serve'
                                  : 'No models installed. Install with: ollama pull llama3:8b'}
                              </p>
                            </TableCell>
                          </TableRow>
                        ) : (
                          models
                            .filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((model) => (
                              <TableRow key={model.digest}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-muted-foreground" />
                                    {model.name}
                                  </div>
                                </TableCell>
                                <TableCell>{formatBytes(model.size)}</TableCell>
                                <TableCell>
                                  <Badge variant="outline">{getModelType(model.name)}</Badge>
                                </TableCell>
                                <TableCell className="text-xs text-muted-foreground">
                                  {new Date(model.modified_at).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">Ready</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" title="Load model">
                                      <Play className="h-4 w-4" />
                                    </Button>
                                    <Button size="sm" variant="outline" title="Delete model">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="available">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Connect to Ollama library to see available models
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="running">
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      No models currently running
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
