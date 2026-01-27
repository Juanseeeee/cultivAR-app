"use client"

import type { Cultivo, Entrega, UsuarioFinal } from "./types/database"

// Función auxiliar para crear el header del PDF
function createPDFHeader() {
  return `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║    FECANBO - Federación Cannábica Bonaerense                 ║
║    Sistema de Trazabilidad de Cannabis Medicinal             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`
}

// Función auxiliar para crear el footer
function createPDFFooter() {
  return `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📧 Contacto: info@fecanbo.org.ar
🌐 Web: www.fecanbo.org.ar
📱 Atención: Lunes a Viernes 9:00-18:00 hs

Este documento ha sido generado electrónicamente y posee
validez legal para fines de trazabilidad de cannabis medicinal
bajo el marco regulatorio argentino vigente.

Sistema FECANBO v1.0 - ${new Date().getFullYear()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`
}

export async function generateCultivoPDF(cultivo: Cultivo) {
  const estadoLabels: Record<string, string> = {
    germinacion: "Germinación",
    vegetativo: "Vegetativo",
    floracion: "Floración",
    cosecha: "Cosecha",
    secado: "Secado",
    curado: "Curado",
    finalizado: "Finalizado",
  }

  const content = `${createPDFHeader()}

┌───────────────────────────────────────────────────────────────┐
│  📋 REPORTE DE CULTIVO MEDICINAL                              │
└───────────────────────────────────────────────────────────────┘

Fecha de Emisión: ${new Date().toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  })}
Número de Reporte: CULT-${cultivo.id.slice(0, 8).toUpperCase()}

═══════════════════════════════════════════════════════════════
 INFORMACIÓN DEL CULTIVO
═══════════════════════════════════════════════════════════════

🌱 Identificación
   • Nombre del Cultivo: ${cultivo.nombre}
   • Variedad: ${cultivo.variedad || "No especificada"}
   • Estado Actual: ${estadoLabels[cultivo.estado_actual] || cultivo.estado_actual}
   • Finalidad: Cannabis de uso medicinal

📅 Cronología
   • Fecha de Inicio: ${new Date(cultivo.fecha_inicio).toLocaleDateString("es-AR", {
    dateStyle: "long",
  })}
   ${cultivo.fecha_estimada_cosecha ? `• Fecha Est. Cosecha: ${new Date(cultivo.fecha_estimada_cosecha).toLocaleDateString("es-AR", { dateStyle: "long" })}` : "• Fecha Est. Cosecha: A definir"}
   • Días transcurridos: ${Math.floor((new Date().getTime() - new Date(cultivo.fecha_inicio).getTime()) / (1000 * 60 * 60 * 24))} días

═══════════════════════════════════════════════════════════════
 DETALLES TÉCNICOS
═══════════════════════════════════════════════════════════════

🔬 Especificaciones
   • Cantidad de Plantas: ${cultivo.cantidad_plantas} unidades
   • Método de Cultivo: ${cultivo.metodo_cultivo ? cultivo.metodo_cultivo.charAt(0).toUpperCase() + cultivo.metodo_cultivo.slice(1) : "No especificado"}
   • Medio de Cultivo: ${cultivo.medio_cultivo ? cultivo.medio_cultivo.charAt(0).toUpperCase() + cultivo.medio_cultivo.slice(1) : "No especificado"}

${
  cultivo.ubicacion_descripcion || (cultivo.latitud && cultivo.longitud)
    ? `📍 Ubicación
   ${cultivo.ubicacion_descripcion ? `• Descripción: ${cultivo.ubicacion_descripcion}` : ""}
   ${cultivo.latitud && cultivo.longitud ? `• Coordenadas: ${cultivo.latitud}°, ${cultivo.longitud}°` : ""}
`
    : ""
}

${
  cultivo.notas
    ? `═══════════════════════════════════════════════════════════════
 NOTAS Y OBSERVACIONES
═══════════════════════════════════════════════════════════════

${cultivo.notas}

`
    : ""
}
═══════════════════════════════════════════════════════════════
 CERTIFICACIÓN
═══════════════════════════════════════════════════════════════

Este reporte certifica que el cultivo descrito cumple con los
estándares de trazabilidad establecidos por FECANBO y se encuentra
registrado en el Sistema de Trazabilidad de Cannabis Medicinal.

El cultivo está destinado exclusivamente para fines medicinales
y terapéuticos, bajo supervisión de la federación.

${createPDFFooter()}`

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `FECANBO_Cultivo_${cultivo.nombre.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function generateEntregaPDF(entrega: Entrega, cultivo: Cultivo, usuario: UsuarioFinal) {
  const tipoProducto: Record<string, string> = {
    flor: "Flores (Cannabis)",
    aceite: "Aceite Medicinal",
    extracto: "Extracto Concentrado",
    otro: "Otro Producto",
  }

  const content = `${createPDFHeader()}

┌───────────────────────────────────────────────────────────────┐
│  📦 COMPROBANTE DE ENTREGA - CANNABIS MEDICINAL               │
└───────────────────────────────────────────────────────────────┘

Fecha de Emisión: ${new Date().toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  })}
Número de Comprobante: ENT-${entrega.id.slice(0, 8).toUpperCase()}

═══════════════════════════════════════════════════════════════
 INFORMACIÓN DE LA ENTREGA
═══════════════════════════════════════════════════════════════

📅 Fecha de Entrega: ${new Date(entrega.fecha_entrega).toLocaleString("es-AR", {
    dateStyle: "full",
    timeStyle: "short",
  })}

📦 Detalles del Producto
   • Tipo de Producto: ${tipoProducto[entrega.tipo_producto] || entrega.tipo_producto}
   • Cantidad Entregada: ${entrega.cantidad_gramos} gramos
   • Número de Lote: ${entrega.lote || "No especificado"}

═══════════════════════════════════════════════════════════════
 INFORMACIÓN DEL CULTIVO DE ORIGEN
═══════════════════════════════════════════════════════════════

🌱 Cultivo
   • Nombre: ${cultivo.nombre}
   • Variedad: ${cultivo.variedad || "No especificada"}
   • Método: ${cultivo.metodo_cultivo ? cultivo.metodo_cultivo.charAt(0).toUpperCase() + cultivo.metodo_cultivo.slice(1) : "No especificado"}
   • Medio: ${cultivo.medio_cultivo ? cultivo.medio_cultivo.charAt(0).toUpperCase() + cultivo.medio_cultivo.slice(1) : "No especificado"}

═══════════════════════════════════════════════════════════════
 INFORMACIÓN DEL PACIENTE / USUARIO FINAL
═══════════════════════════════════════════════════════════════

👤 Datos del Receptor
   • Nombre Completo: ${usuario.nombre_completo}
   • Documento: ${usuario.documento || "No especificado"}
   ${usuario.email ? `• Email: ${usuario.email}` : ""}
   ${usuario.telefono ? `• Teléfono: ${usuario.telefono}` : ""}

💊 Información Médica
   • Condición Médica: ${usuario.condicion_medica || "No especificada"}
   ${usuario.dosis_recomendada ? `• Dosis Recomendada: ${usuario.dosis_recomendada}` : ""}

${
  entrega.notas
    ? `═══════════════════════════════════════════════════════════════
 NOTAS DE LA ENTREGA
═══════════════════════════════════════════════════════════════

${entrega.notas}

`
    : ""
}
═══════════════════════════════════════════════════════════════
 CERTIFICACIÓN Y TRAZABILIDAD
═══════════════════════════════════════════════════════════════

Este comprobante certifica la entrega de cannabis medicinal para
uso terapéutico exclusivo del paciente identificado anteriormente.

✓ Producto registrado en Sistema de Trazabilidad FECANBO
✓ Cultivo supervisado bajo protocolo medicinal
✓ Entrega documentada y verificable
✓ Cumplimiento del marco regulatorio vigente

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  IMPORTANTE - USO MEDICINAL EXCLUSIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Este producto está destinado exclusivamente para el tratamiento
de la condición médica especificada. Su uso debe ser supervisado
por un profesional de la salud.

Conservar este comprobante como respaldo legal de la entrega.

${createPDFFooter()}`

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `FECANBO_Entrega_${entrega.lote || entrega.id.slice(0, 8)}_${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
