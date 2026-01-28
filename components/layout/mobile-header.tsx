"use client"

import { usePathname } from "next/navigation"
import Image from "next/image"
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
  "/inicio": { name: "Inicio", icon: LayoutDashboard },
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
  
  const currentPage = Object.entries(navigationMap).find(([path]) => 
    pathname === path || pathname?.startsWith(path + "/")
  )
  
  const PageIcon = currentPage?.[1]?.icon || LayoutDashboard
  const pageName = currentPage?.[1]?.name || "FECANBO"
  const isInicio = pathname === "/inicio"

  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-primary text-primary-foreground rounded-b-2xl shadow-sm">
      {isInicio ? (
        <div className="h-16 flex items-center justify-center px-4">
          <Image
            src="/cultivarlogo.png"
            alt="CultivAR"
            width={120}
            height={32}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>
      ) : (
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-foreground/15 rounded-lg flex items-center justify-center">
              <PageIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-semibold text-base leading-none">{pageName}</h1>
              <p className="text-xs mt-0.5">FECANBO</p>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
