"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  Code2,
  Database,
  Play,
  BookOpen,
  BarChart3,
  Settings,
  Layers
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Development", href: "/development", icon: Code2 },
  { name: "Models", href: "/models", icon: Database },
  { name: "Playground", href: "/playground", icon: Play },
  { name: "Documentation", href: "/documentation", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname === item.href
              ? "bg-muted text-primary"
              : "text-muted-foreground hover:bg-muted"
          )}
        >
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
        </Link>
      ))}
    </nav>
  )
}
