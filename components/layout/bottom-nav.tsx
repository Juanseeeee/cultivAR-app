 "use client"
 
 import Link from "next/link"
 import { usePathname } from "next/navigation"
 import {
   Home,
   LayoutDashboard,
   Sprout,
   Bell,
   Settings,
 } from "lucide-react"
 
 const items = [
   { href: "/inicio", label: "Inicio", icon: Home },
   { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
   { href: "/cultivos", label: "Cultivos", icon: Sprout },
   { href: "/alertas", label: "Alertas", icon: Bell },
   { href: "/configuracion", label: "Ajustes", icon: Settings },
 ]
 
 export function BottomNav() {
   const pathname = usePathname()
 
   return (
     <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
       <div className="mx-4 mb-4 rounded-2xl bg-card/95 backdrop-blur border shadow-lg">
         <ul className="grid grid-cols-5 gap-1 px-2 py-2">
           {items.map((item) => {
             const active = pathname === item.href || pathname?.startsWith(item.href + "/")
             const Icon = item.icon
             return (
               <li key={item.href} className="flex">
                 <Link
                   href={item.href}
                   className={`flex w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs ${
                     active
                       ? "bg-primary text-primary-foreground"
                       : "text-muted-foreground hover:bg-muted hover:text-foreground"
                   }`}
                 >
                   <Icon className="h-5 w-5" />
                   {item.label}
                 </Link>
               </li>
             )
           })}
         </ul>
       </div>
     </nav>
   )
 }
