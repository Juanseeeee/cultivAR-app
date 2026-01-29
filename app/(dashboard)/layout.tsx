import type React from "react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileHeader } from "@/components/layout/mobile-header"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto lg:ml-64">
        {/* Mobile header with spacing for fixed button */}
        <div className="lg:hidden h-16" />
        
        <MobileHeader />
        
        <div className="container max-w-7xl mx-auto p-4 pb-20 sm:p-6 lg:p-8 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  )
}
