"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ollama } from "@/lib/ollama"
import {
  Code2,
  Brain,
  Play,
  BarChart3,
  Rocket,
  Zap,
  Shield,
  Activity,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"

export default function Page() {
  const [ollamaStatus, setOllamaStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [modelsCount, setModelsCount] = useState(0)
  const [hasLlama3, setHasLlama3] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const status = await ollama.checkStatus()
      setOllamaStatus(status.status === 'online' ? 'online' : 'offline')

      if (status.models) {
        setModelsCount(status.models.length)
      }

      setHasLlama3(status.hasLlama3 || false)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      setOllamaStatus('offline')
    }
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
                <h2 className="text-3xl font-bold tracking-tight">Command Center</h2>
                <p className="text-muted-foreground">
                  Welcome to The Ark - Your AI Development Environment
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={ollamaStatus === 'online' ? 'default' : 'destructive'} className="h-8 px-3">
                  {ollamaStatus === 'checking' && <Loader2 className="h-3 w-3 mr-2 animate-spin" />}
                  {ollamaStatus === 'online' && <CheckCircle className="h-3 w-3 mr-2" />}
                  {ollamaStatus === 'offline' && <XCircle className="h-3 w-3 mr-2" />}
                  Ollama {ollamaStatus}
                </Badge>
                <Button onClick={loadDashboardData}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* System Status */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    AI Models
                  </CardTitle>
                  <Brain className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{modelsCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {ollamaStatus === 'online' ? (hasLlama3 ? 'Llama 3 ready' : 'Available') : 'Offline'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    System Status
                  </CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${ollamaStatus === 'online' ? 'text-green-500' : ollamaStatus === 'checking' ? 'text-yellow-500' : 'text-red-500'}`}>
                    {ollamaStatus === 'checking' ? 'Checking...' : ollamaStatus === 'online' ? 'Online' : 'Offline'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ollamaStatus === 'online' ? 'All systems operational' : 'Check Ollama service'}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Performance
                  </CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-muted-foreground">
                    Optimal efficiency
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Security
                  </CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">Secure</div>
                  <p className="text-xs text-muted-foreground">
                    No threats detected
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link href="/development">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Code2 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Development IDE</CardTitle>
                        <CardDescription>
                          Code with AI assistance
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Open the integrated development environment with Monaco editor and AI chat
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/models">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Brain className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle>AI Models</CardTitle>
                        <CardDescription>
                          Manage your models
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      View, download, and configure AI models via Ollama integration
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/playground">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Play className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Playground</CardTitle>
                        <CardDescription>
                          Test AI prompts
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Experiment with different models, prompts and parameters
                    </p>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/analytics">
                <Card className="hover:bg-accent cursor-pointer transition-colors">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <CardTitle>Analytics</CardTitle>
                        <CardDescription>
                          View statistics
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Detailed charts and metrics about system usage and performance
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Latest system events and AI interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-muted-foreground">15:42</span>
                    <span>Model llama3:8b initialized successfully</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-muted-foreground">15:38</span>
                    <span>AI chat session started in Development IDE</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-muted-foreground">15:30</span>
                    <span>Code completion generated 127 lines</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-muted-foreground">15:15</span>
                    <span>New file created: src/components/Dashboard.tsx</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
