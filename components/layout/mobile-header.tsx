"use client"

import React from "react"

import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Sprout, 
  Bell, 
  Calendar, 
  Users, 
  Package, 
  Settings,
  Map 
} from "lucide-react"

const navigationMap: Record<string, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  "/dashboard": { name: "Dashboard", icon: LayoutDashboard },
  "/cultivos": { name: "Cultivos", icon: Sprout },
  "/alertas": { name: "Alertas", icon: Bell },
  "/calendario": { name: "Calendario", icon: Calendar },
  "/mapa": { name: "Mapa", icon: Map },
  "/usuarios-finales": { name: "Usuarios Finales", icon: Users },
  "/entregas": { name: "Entregas", icon: Package },
  "/configuracion": { name: "Configuración", icon: Settings },
}

export function MobileHeader() {
  const pathname = usePathname()
  
  // Find current page info
  const currentPage = Object.entries(navigationMap).find(([path]) => 
    pathname === path || pathname?.startsWith(path + "/")
  )
  
  const PageIcon = currentPage?.[1]?.icon || LayoutDashboard
  const pageName = currentPage?.[1]?.name || "FECANBO"

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 shadow-sm sm:px-6 lg:hidden">
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
          <PageIcon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-semibold leading-tight">{pageName}</span>
          <span className="text-xs text-muted-foreground leading-tight">FECANBO</span>
        </div>
      </div>
    </div>
  )
}
