"use client"

import type { Cultivo, Entrega, UsuarioFinal } from "./types/database"

export async function generateCultivoPDF(cultivo: Cultivo) {
  // Esta es una implementación simplificada
  // En producción, podrías usar librerías como jsPDF o react-pdf

  const content = `
FECANBO - Federación Cannábica Bonaerense
Reporte de Cultivo Medicinal

========================================

INFORMACIÓN DEL CULTIVO
========================================
Nombre: ${cultivo.nombre}
Variedad: ${cultivo.variedad || "N/A"}
Tipo: ${cultivo.tipo || "N/A"}
Propósito: ${cultivo.proposito || "medicinal"}

Estado Actual: ${cultivo.estado_actual}
Fecha de Inicio: ${new Date(cultivo.fecha_inicio).toLocaleDateString("es-AR")}
${cultivo.fecha_estimada_cosecha ? `Fecha Estimada de Cosecha: ${new Date(cultivo.fecha_estimada_cosecha).toLocaleDateString("es-AR")}` : ""}

DETALLES DE CULTIVO
========================================
Cantidad de Plantas: ${cultivo.cantidad_plantas}
Método de Cultivo: ${cultivo.metodo_cultivo || "N/A"}
Medio de Cultivo: ${cultivo.medio_cultivo || "N/A"}

${cultivo.ubicacion_descripcion ? `Ubicación: ${cultivo.ubicacion_descripcion}` : ""}
${cultivo.latitud && cultivo.longitud ? `Coordenadas: ${cultivo.latitud}, ${cultivo.longitud}` : ""}

${cultivo.notas ? `\nNOTAS:\n${cultivo.notas}` : ""}

========================================
Documento generado el ${new Date().toLocaleString("es-AR")}
Sistema FECANBO - Trazabilidad de Cannabis Medicinal
  `.trim()

  // Crear un blob con el contenido del PDF
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  // Descargar el archivo
  const link = document.createElement("a")
  link.href = url
  link.download = `cultivo-${cultivo.nombre.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function generateEntregaPDF(entrega: Entrega, cultivo: Cultivo, usuario: UsuarioFinal) {
  const content = `
FECANBO - Federación Cannábica Bonaerense
Comprobante de Entrega de Cannabis Medicinal

========================================

INFORMACIÓN DE LA ENTREGA
========================================
Fecha de Entrega: ${new Date(entrega.fecha_entrega).toLocaleString("es-AR")}
Número de Lote: ${entrega.lote || "N/A"}
Tipo de Producto: ${entrega.tipo_producto || "N/A"}
Cantidad Entregada: ${entrega.cantidad_gramos}g

INFORMACIÓN DEL CULTIVO
========================================
Nombre: ${cultivo.nombre}
Variedad: ${cultivo.variedad || "N/A"}
Método: ${cultivo.metodo_cultivo || "N/A"}

INFORMACIÓN DEL USUARIO FINAL
========================================
Nombre: ${usuario.nombre_completo}
Documento: ${usuario.documento || "N/A"}
Condición Médica: ${usuario.condicion_medica || "N/A"}
Dosis Recomendada: ${usuario.dosis_recomendada || "N/A"}

${entrega.notas ? `\nNOTAS DE LA ENTREGA:\n${entrega.notas}` : ""}

========================================
Documento generado el ${new Date().toLocaleString("es-AR")}

Este comprobante certifica la entrega de cannabis medicinal
para uso terapéutico bajo el marco regulatorio vigente.

Sistema FECANBO - Trazabilidad de Cannabis Medicinal
  `.trim()

  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)

  const link = document.createElement("a")
  link.href = url
  link.download = `entrega-${entrega.lote || entrega.id}-${new Date().toISOString().split("T")[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
