"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  MessageSquare,
  Code2,
  FolderOpen,
  Terminal,
  Play,
  Save,
  FolderTree,
  FileCode,
  Bot,
  Send
} from "lucide-react"
import { AIChat } from "@/components/ai-chat"

export default function DevelopmentPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

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
                <h2 className="text-3xl font-bold tracking-tight">Development Environment</h2>
                <p className="text-muted-foreground">
                  AI-powered IDE for The Ark system
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Sheet open={isChatOpen} onOpenChange={setIsChatOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bot className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[400px] sm:w-[540px] p-0">
                    <div className="h-full flex flex-col">
                      <SheetHeader className="p-6 pb-4">
                        <SheetTitle>AI Assistant</SheetTitle>
                        <SheetDescription>
                          Powered by Llama 3:8b - Chat with AI about your code
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex-1 overflow-hidden">
                        <AIChat
                          systemPrompt="You are an expert programming assistant in The Ark IDE. Help users with code, debugging, and development tasks. Be concise and provide code examples when relevant."
                          placeholder="Ask about your code..."
                          className="h-full"
                        />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Main IDE Layout */}
            <ResizablePanelGroup direction="horizontal" className="min-h-[700px] rounded-lg border">
              {/* File Explorer Panel */}
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FolderTree className="h-4 w-4" />
                        Explorer
                      </h3>
                      <Button size="icon" variant="ghost">
                        <FolderOpen className="h-4 w-4" />
                      </Button>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-1">
                        {/* Здесь будет дерево файлов */}
                        <div className="text-sm text-muted-foreground p-2">
                          File tree will be loaded here
                        </div>
                        {/* Интеграция с API /api/files */}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Code Editor Panel */}
              <ResizablePanel defaultSize={80}>
                <Tabs defaultValue="code" className="h-full">
                  <div className="flex items-center justify-between px-4 py-2 border-b">
                    <TabsList>
                      <TabsTrigger value="code" className="flex items-center gap-2">
                        <FileCode className="h-3 w-3" />
                        Code
                      </TabsTrigger>
                      <TabsTrigger value="terminal" className="flex items-center gap-2">
                        <Terminal className="h-3 w-3" />
                        Terminal
                      </TabsTrigger>
                      <TabsTrigger value="output" className="flex items-center gap-2">
                        <Play className="h-3 w-3" />
                        Output
                      </TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Play className="mr-2 h-3 w-3" />
                        Run
                      </Button>
                    </div>
                  </div>

                  <TabsContent value="code" className="h-[calc(100%-50px)] p-0 m-0">
                    {/* Здесь будет Monaco Editor */}
                    <div className="h-full w-full flex items-center justify-center bg-muted/10">
                      <div className="text-center space-y-2">
                        <Code2 className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-sm text-muted-foreground">
                          Monaco Editor will be integrated here
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="terminal" className="h-[calc(100%-50px)] p-4">
                    <Card className="h-full bg-black/50">
                      <CardContent className="p-4 font-mono text-sm text-green-400">
                        <p>$ The Ark Terminal v1.0.0</p>
                        <p>$ Ready for commands...</p>
                        <p className="animate-pulse">$ _</p>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="output" className="h-[calc(100%-50px)] p-4">
                    <Card className="h-full">
                      <CardContent className="p-4">
                        <ScrollArea className="h-full">
                          <p className="text-sm text-muted-foreground">
                            Program output will appear here...
                          </p>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
