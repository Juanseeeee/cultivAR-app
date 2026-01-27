"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// ============ GET FUNCTIONS ============

export async function getAlertas() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("alertas")
    .select(`
      *,
      cultivos (
        id,
        nombre,
        variedad
      )
    `)
    .order("fecha_programada", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching alertas:", error)
    return []
  }

  return data || []
}

export async function getAlertasPendientes() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("alertas")
    .select(`
      *,
      cultivos (
        id,
        nombre,
        variedad
      )
    `)
    .eq("completada", false)
    .order("fecha_programada", { ascending: true })
    .limit(10)

  if (error) {
    console.error("[v0] Error fetching alertas pendientes:", error)
    return []
  }

  return data || []
}

// ============ CREATE/UPDATE/DELETE FUNCTIONS ============

export async function createAlerta(formData: FormData) {
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

  // Get first cultivo if not provided
  let cultivoId = formData.get("cultivo_id") as string
  if (!cultivoId) {
    const { data: firstCultivo } = await supabase
      .from("cultivos")
      .select("id")
      .eq("activo", true)
      .limit(1)
      .single()
    
    cultivoId = firstCultivo?.id
  }

  if (!cultivoId) {
    throw new Error("No hay cultivos activos. Crea un cultivo primero.")
  }

  const data = {
    cultivo_id: cultivoId,
    creada_por: cultivadorId,
    tipo: formData.get("tipo") as string,
    titulo: formData.get("titulo") as string,
    descripcion: formData.get("descripcion") as string,
    prioridad: formData.get("prioridad") as string,
    fecha_programada: formData.get("fecha_programada") as string,
    completada: false,
  }

  const { error } = await supabase.from("alertas").insert(data)

  if (error) {
    console.error("[v0] Error creating alerta:", error)
    throw new Error(`No se pudo crear la alerta: ${error.message}`)
  }

  revalidatePath("/alertas")
  revalidatePath("/dashboard")
}

export async function toggleAlerta(id: string, completada: boolean) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase
    .from("alertas")
    .update({
      completada,
      fecha_completada: completada ? new Date().toISOString() : null,
    })
    .eq("id", id)

  if (error) {
    console.error("Error toggling alerta:", error)
    throw new Error("No se pudo actualizar la alerta")
  }

  revalidatePath("/alertas")
  revalidatePath("/dashboard")
}

export async function deleteAlerta(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("alertas").delete().eq("id", id)

  if (error) {
    console.error("Error deleting alerta:", error)
    throw new Error("No se pudo eliminar la alerta")
  }

  revalidatePath("/alertas")
}
