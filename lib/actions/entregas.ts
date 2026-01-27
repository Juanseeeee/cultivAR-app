"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// ============ GET FUNCTIONS ============

export async function getEntregas() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("entregas")
    .select(`
      *,
      cultivos (
        id,
        nombre,
        variedad
      ),
      usuarios_finales (
        id,
        nombre_completo,
        documento
      )
    `)
    .order("fecha_entrega", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching entregas:", error)
    return []
  }

  return data || []
}

export async function getEntregasPorMes() {
  const supabase = await getSupabaseServerClient()
  
  // Get entregas from last 6 months
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const { data, error } = await supabase
    .from("entregas")
    .select("fecha_entrega, cantidad_gramos")
    .gte("fecha_entrega", sixMonthsAgo.toISOString())
    .order("fecha_entrega", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching entregas por mes:", error)
    return []
  }

  // Group by month
  const monthlyData: Record<string, { entregas: number; gramos: number }> = {}
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

  data?.forEach((entrega) => {
    const date = new Date(entrega.fecha_entrega)
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { entregas: 0, gramos: 0 }
    }
    monthlyData[monthKey].entregas += 1
    monthlyData[monthKey].gramos += entrega.cantidad_gramos || 0
  })

  return Object.entries(monthlyData).map(([mes, data]) => ({
    mes,
    entregas: data.entregas,
    gramos: Math.round(data.gramos)
  }))
}

// ============ CREATE/UPDATE/DELETE FUNCTIONS ============

export async function createEntrega(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  // Get current user or first cultivador
  const { data: { user } } = await supabase.auth.getUser()
  let cultivadorId = user?.id

  if (!cultivadorId) {
    const { data: firstCultivador } = await supabase
      .from("cultivadores")
      .select("id")
      .limit(1)
      .single()
    
    cultivadorId = firstCultivador?.id
  }

  // Map tipo_producto to valid enum values
  const tipoMap: Record<string, string> = {
    flores: "flor",
    aceite: "aceite",
    extracto: "extracto",
    crema: "otro"
  }

  const tipoValue = formData.get("tipo_producto") as string

  const data = {
    cultivador_id: cultivadorId,
    cultivo_id: formData.get("cultivo_id") as string,
    usuario_final_id: formData.get("usuario_final_id") as string,
    tipo_producto: tipoMap[tipoValue] || "flor",
    cantidad_gramos: Number.parseFloat(formData.get("cantidad_gramos") as string),
    lote: formData.get("lote") as string,
    notas: formData.get("notas") as string,
    fecha_entrega: new Date().toISOString(),
  }

  const { error } = await supabase.from("entregas").insert(data)

  if (error) {
    console.error("[v0] Error creating entrega:", error)
    throw new Error(`No se pudo crear la entrega: ${error.message}`)
  }

  revalidatePath("/entregas")
  revalidatePath("/dashboard")
}
