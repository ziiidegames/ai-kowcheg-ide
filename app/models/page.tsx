"use client"

import { useState } from "react"
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

export default function ModelsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Пример данных моделей (потом будем загружать из Ollama API)
  const models = [
    { name: "llama3:8b", size: "4.7 GB", type: "Chat", status: "ready", memory: "5.2 GB" },
    { name: "codellama:13b", size: "7.4 GB", type: "Code", status: "ready", memory: "8.1 GB" },
    { name: "mistral:7b", size: "4.1 GB", type: "Chat", status: "downloading", progress: 67 },
  ]

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
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
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
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">3 running, 9 stopped</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45.2 GB</div>
                  <p className="text-xs text-muted-foreground">of 500 GB available</p>
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
                        {models.map((model) => (
                          <TableRow key={model.name}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Brain className="h-4 w-4 text-muted-foreground" />
                                {model.name}
                              </div>
                            </TableCell>
                            <TableCell>{model.size}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{model.type}</Badge>
                            </TableCell>
                            <TableCell>{model.memory}</TableCell>
                            <TableCell>
                              {model.status === "downloading" ? (
                                <div className="flex items-center gap-2">
                                  <Progress value={model.progress} className="w-20" />
                                  <span className="text-sm">{model.progress}%</span>
                                </div>
                              ) : (
                                <Badge variant={model.status === "ready" ? "secondary" : "default"}>
                                  {model.status}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline">
                                  <Play className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
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
