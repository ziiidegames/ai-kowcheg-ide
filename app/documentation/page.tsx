import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentationPage() {
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
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Documentation</h2>
              <p className="text-muted-foreground mt-2">
                Learn how to use AI Kovcheg IDE
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Getting Started</CardTitle>
                <CardDescription>Quick start guide for The Ark system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    AI Kovcheg IDE is an integrated development environment powered by local AI models.
                    It provides code editing, AI assistance, and model management in one unified interface.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Key Features</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    <li>Monaco-based code editor with syntax highlighting</li>
                    <li>AI-powered code completion and chat assistance</li>
                    <li>Local AI model management via Ollama</li>
                    <li>Playground for testing AI prompts</li>
                    <li>Analytics and usage tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Requirements</CardTitle>
                <CardDescription>Prerequisites for running The Ark</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Ollama installed and running on localhost:11434</li>
                  <li>At least 8GB RAM (16GB recommended)</li>
                  <li>Modern web browser with JavaScript enabled</li>
                  <li>Node.js 18+ for development</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
