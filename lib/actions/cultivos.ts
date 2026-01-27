"use server"

import { revalidatePath } from "next/cache"
import { getSupabaseServerClient } from "@/lib/supabase/server"

// ============ GET FUNCTIONS ============

export async function getCultivos() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("cultivos")
    .select("*")
    .eq("activo", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching cultivos:", error)
    return []
  }

  return data || []
}

export async function getCultivoById(id: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("cultivos")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("[v0] Error fetching cultivo:", error)
    return null
  }

  return data
}

export async function getEtapasByCultivoId(cultivoId: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("cultivo_etapas")
    .select("*")
    .eq("cultivo_id", cultivoId)
    .order("fecha_inicio", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching etapas:", error)
    return []
  }

  return data || []
}

export async function getObservacionesByCultivoId(cultivoId: string) {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("observaciones")
    .select("*")
    .eq("cultivo_id", cultivoId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching observaciones:", error)
    return []
  }

  return data || []
}

export async function getEstadisticas() {
  try {
    const supabase = await getSupabaseServerClient()
    
    console.log("[v0] Fetching estadisticas from Supabase...")
    
    // Get all cultivos counts
    const { count: totalCultivos, error: totalError } = await supabase
      .from("cultivos")
      .select("*", { count: "exact", head: true })

    if (totalError) {
      console.error("[v0] Error getting total cultivos:", totalError)
    }

    const { count: cultivosActivos, error: activosError } = await supabase
      .from("cultivos")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)

    if (activosError) {
      console.error("[v0] Error getting cultivos activos:", activosError)
    }

    const { count: cultivosFinalizados, error: finalizadosError } = await supabase
      .from("cultivos")
      .select("*", { count: "exact", head: true })
      .eq("activo", false)

    if (finalizadosError) {
      console.error("[v0] Error getting cultivos finalizados:", finalizadosError)
    }

    // Get pending alerts
    const { count: alertasPendientes, error: alertasError } = await supabase
      .from("alertas")
      .select("*", { count: "exact", head: true })
      .eq("completada", false)

    if (alertasError) {
      console.error("[v0] Error getting alertas:", alertasError)
    }

    // Get total entregas and gramos
    const { data: entregasData, error: entregasError } = await supabase
      .from("entregas")
      .select("cantidad_gramos")

    if (entregasError) {
      console.error("[v0] Error getting entregas:", entregasError)
    }

    const totalEntregas = entregasData?.length || 0
    const totalGramosEntregados = entregasData?.reduce((sum, e) => sum + (e.cantidad_gramos || 0), 0) || 0

    // Get users count
    const { count: totalUsuariosFinales, error: usuariosError } = await supabase
      .from("usuarios_finales")
      .select("*", { count: "exact", head: true })
      .eq("activo", true)

    if (usuariosError) {
      console.error("[v0] Error getting usuarios:", usuariosError)
    }

    const stats = {
      cultivador_id: "", // Not needed for display
      total_cultivos: totalCultivos || 0,
      cultivos_activos: cultivosActivos || 0,
      cultivos_finalizados: cultivosFinalizados || 0,
      alertas_pendientes: alertasPendientes || 0,
      total_entregas: totalEntregas,
      total_gramos_entregados: totalGramosEntregados,
      total_usuarios_finales: totalUsuariosFinales || 0,
    }

    console.log("[v0] Estadisticas fetched:", stats)
    
    return stats
  } catch (error) {
    console.error("[v0] Error in getEstadisticas:", error)
    // Return default values if there's an error
    return {
      cultivador_id: "",
      total_cultivos: 0,
      cultivos_activos: 0,
      cultivos_finalizados: 0,
      alertas_pendientes: 0,
      total_entregas: 0,
      total_gramos_entregados: 0,
      total_usuarios_finales: 0,
    }
  }
}

export async function getCultivosPorEtapa() {
  try {
    const supabase = await getSupabaseServerClient()
    
    const etapas = ["germinacion", "vegetativo", "floracion", "cosecha", "secado"]
    const result = []

    for (const etapa of etapas) {
      const { count, error } = await supabase
        .from("cultivos")
        .select("*", { count: "exact", head: true })
        .eq("activo", true)
        .eq("estado_actual", etapa)

      if (error) {
        console.error(`[v0] Error getting cultivos for etapa ${etapa}:`, error)
      }

      const etapaNames: Record<string, string> = {
        germinacion: "Germinación",
        vegetativo: "Vegetativo",
        floracion: "Floración",
        cosecha: "Cosecha",
        secado: "Secado"
      }

      result.push({
        etapa: etapaNames[etapa] || etapa,
        cantidad: count || 0
      })
    }

    return result
  } catch (error) {
    console.error("[v0] Error in getCultivosPorEtapa:", error)
    return []
  }
}

// ============ CREATE/UPDATE/DELETE FUNCTIONS ============

export async function createCultivo(formData: FormData) {
  const supabase = await getSupabaseServerClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  // For now, if no user, we'll create without cultivador_id and let RLS handle it
  // Or use a default admin user if needed
  let cultivadorId = user?.id

  // If no authenticated user, check if there's a cultivador we can use
  if (!cultivadorId) {
    const { data: firstCultivador } = await supabase
      .from("cultivadores")
      .select("id")
      .limit(1)
      .single()
    
    cultivadorId = firstCultivador?.id
  }

  // Map form tipo_cultivo values to database expected values
  const tipoMap: Record<string, string> = {
    indoor: "interior",
    outdoor: "exterior",
    greenhouse: "invernadero"
  }
  
  const metodoMap: Record<string, string> = {
    tierra: "tierra",
    hidroponico: "hidroponico",
    aeroponico: "aeroponico",
    coco: "coco"
  }

  const tipoValue = formData.get("tipo_cultivo") as string
  const metodoValue = formData.get("metodo") as string

  const data = {
    cultivador_id: cultivadorId,
    nombre: formData.get("nombre") as string,
    variedad: formData.get("variedad") as string,
    cantidad_plantas: Number.parseInt(formData.get("cantidad_plantas") as string),
    ubicacion_descripcion: formData.get("ubicacion") as string,
    latitud: formData.get("latitud") ? Number.parseFloat(formData.get("latitud") as string) : null,
    longitud: formData.get("longitud") ? Number.parseFloat(formData.get("longitud") as string) : null,
    metodo_cultivo: tipoMap[tipoValue] || "interior",
    medio_cultivo: metodoMap[metodoValue] || "tierra",
    notas: formData.get("notas") as string,
    estado_actual: "germinacion",
    fecha_inicio: new Date().toISOString().split('T')[0],
    activo: true,
  }

  const { data: cultivo, error } = await supabase.from("cultivos").insert(data).select().single()

  if (error) {
    console.error("[v0] Error creating cultivo:", error)
    throw new Error(`No se pudo crear el cultivo: ${error.message}`)
  }

  // Create initial stage
  await supabase.from("cultivo_etapas").insert({
    cultivo_id: cultivo.id,
    etapa: "germinacion",
    fecha_inicio: new Date().toISOString(),
  })

  revalidatePath("/cultivos")
  revalidatePath("/dashboard")
  return cultivo
}

export async function updateCultivo(cultivoId: string, formData: FormData) {
  const supabase = await getSupabaseServerClient()

  const updateData = {
    nombre: formData.get("nombre") as string,
    variedad: formData.get("variedad") as string,
    cantidad_plantas: Number.parseInt(formData.get("cantidad_plantas") as string),
    metodo_cultivo: formData.get("metodo_cultivo") as string || null,
    medio_cultivo: formData.get("medio_cultivo") as string || null,
    ubicacion_descripcion: formData.get("ubicacion_descripcion") as string || null,
    notas: formData.get("notas") as string || null,
  }

  const { error } = await supabase
    .from("cultivos")
    .update(updateData)
    .eq("id", cultivoId)

  if (error) {
    console.error("[v0] Error updating cultivo:", error)
    throw new Error("No se pudo actualizar el cultivo")
  }

  revalidatePath(`/cultivos/${cultivoId}`)
  revalidatePath("/cultivos")
  revalidatePath("/dashboard")
}

export async function deleteCultivo(id: string) {
  const supabase = await getSupabaseServerClient()

  const { error } = await supabase.from("cultivos").update({ activo: false }).eq("id", id)

  if (error) {
    console.error("Error deleting cultivo:", error)
    throw new Error("No se pudo eliminar el cultivo")
  }

  revalidatePath("/cultivos")
}

export async function cambiarEtapaCultivo(cultivoId: string, nuevaEtapa: string) {
  const supabase = await getSupabaseServerClient()

  // Close current stage
  const { error: updateError } = await supabase
    .from("cultivo_etapas")
    .update({ fecha_fin: new Date().toISOString() })
    .eq("cultivo_id", cultivoId)
    .is("fecha_fin", null)

  if (updateError) {
    console.error("[v0] Error closing current stage:", updateError)
    throw new Error("No se pudo cerrar la etapa actual")
  }

  // Create new stage
  const { error: insertError } = await supabase
    .from("cultivo_etapas")
    .insert({
      cultivo_id: cultivoId,
      etapa: nuevaEtapa,
      fecha_inicio: new Date().toISOString(),
    })

  if (insertError) {
    console.error("[v0] Error creating new stage:", insertError)
    throw new Error("No se pudo crear la nueva etapa")
  }

  // Update cultivo current state
  const { error: cultivoError } = await supabase
    .from("cultivos")
    .update({ estado_actual: nuevaEtapa })
    .eq("id", cultivoId)

  if (cultivoError) {
    console.error("[v0] Error updating cultivo state:", cultivoError)
    throw new Error("No se pudo actualizar el estado del cultivo")
  }

  revalidatePath(`/cultivos/${cultivoId}`)
  revalidatePath("/cultivos")
  revalidatePath("/dashboard")
}

export async function createObservacion(cultivoId: string, formData: FormData) {
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
    cultivo_id: cultivoId,
    cultivador_id: cultivadorId,
    descripcion: formData.get("descripcion") as string,
    altura_cm: formData.get("altura_cm") ? Number.parseFloat(formData.get("altura_cm") as string) : null,
    ph: formData.get("ph") ? Number.parseFloat(formData.get("ph") as string) : null,
    temperatura: formData.get("temperatura") ? Number.parseFloat(formData.get("temperatura") as string) : null,
    humedad: formData.get("humedad") ? Number.parseInt(formData.get("humedad") as string) : null,
  }

  const { data: observacion, error } = await supabase.from("observaciones").insert(data).select().single()

  if (error) {
    console.error("[v0] Error creating observacion:", error)
    throw new Error(`No se pudo crear la observación: ${error.message}`)
  }

  revalidatePath(`/cultivos/${cultivoId}`)
  return observacion
}
