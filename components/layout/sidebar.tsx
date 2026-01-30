"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Sprout,
  Bell,
  Calendar,
  Users,
  Package,
  Settings,
  LogOut,
  Leaf,
  Menu,
  X,
  Map,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cultivos", href: "/cultivos", icon: Sprout },
  { name: "Alertas", href: "/alertas", icon: Bell },
  { name: "Calendario", href: "/calendario", icon: Calendar },
  { name: "Mapa", href: "/mapa", icon: Map },
  { name: "Usuarios Finales", href: "/usuarios-finales", icon: Users },
  { name: "Entregas", href: "/entregas", icon: Package },
  { name: "Configuración", href: "/configuracion", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <>
      {/* Mobile menu button - Fixed bottom right for easy thumb access */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        aria-label="Abrir menú"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "flex h-full w-64 flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6 pb-4",
        "lg:fixed lg:inset-y-0 lg:z-50 lg:flex",
        "fixed inset-y-0 z-50 transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center gap-2 pt-4 lg:pt-0">
          <Leaf className="h-8 w-8 text-primary" />
          <div className="flex flex-col">
            <span className="text-lg font-bold">FECANBO</span>
            <span className="text-xs text-muted-foreground">Gestión de Cultivos</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul className="flex flex-1 flex-col gap-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Logout */}
          <div className="mt-auto pb-6 lg:pb-0">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground px-4 py-3"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </Button>
          </div>
        </nav>
      </div>
    </>
  )
}
