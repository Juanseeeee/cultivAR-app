"use client"

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

const navigationMap: Record<string, { name: string; icon: typeof LayoutDashboard }> = {
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
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <PageIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-base leading-none">{pageName}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">FECANBO</p>
          </div>
        </div>
      </div>
    </header>
  )
}
