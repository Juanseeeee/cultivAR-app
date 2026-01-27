"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// ============ GET FUNCTIONS ============

export async function getUsuariosFinales() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("usuarios_finales")
    .select("*")
    .eq("activo", true)
    .order("nombre_completo", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching usuarios finales:", error)
    return []
  }

  return data || []
}

export async function getUsuarioFinalById(id: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("usuarios_finales")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching usuario final:", error)
    return null
  }

  return data
}

// ============ CREATE/UPDATE/DELETE FUNCTIONS ============

export async function createUsuarioFinal(formData: FormData) {
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

  const data = {
    cultivador_id: cultivadorId,
    nombre_completo: formData.get("nombre_completo") as string,
    documento: formData.get("documento") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    condicion_medica: formData.get("condicion_medica") as string,
    notas: formData.get("notas") as string,
    activo: true,
  }

  const { error } = await supabase.from("usuarios_finales").insert(data)

  if (error) {
    console.error("[v0] Error creating usuario final:", error)
    throw new Error(`No se pudo crear el usuario: ${error.message}`)
  }

  revalidatePath("/usuarios-finales")
  revalidatePath("/dashboard")
}

export async function updateUsuarioFinal(id: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const data = {
    nombre_completo: formData.get("nombre_completo") as string,
    documento: formData.get("dni") as string,
    email: formData.get("email") as string,
    telefono: formData.get("telefono") as string,
    direccion: formData.get("direccion") as string,
    condicion_medica: formData.get("diagnostico") as string,
    observaciones_medicas: formData.get("observaciones_medicas") as string,
  }

  const { error } = await supabase.from("usuarios_finales").update(data).eq("id", id)

  if (error) {
    console.error("Error updating usuario final:", error)
    throw new Error("No se pudo actualizar el usuario final")
  }

  revalidatePath("/usuarios-finales")
}
