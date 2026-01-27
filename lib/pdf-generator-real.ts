"use client"

import type { Cultivo, Entrega, UsuarioFinal } from "./types/database"
import { jsPDF } from "jspdf"

export async function generateCultivoPDF(cultivo: Cultivo) {
  const doc = new jsPDF()
  
  const estadoLabels: Record<string, string> = {
    germinacion: "Germinación",
    vegetativo: "Vegetativo",
    floracion: "Floración",
    cosecha: "Cosecha",
    secado: "Secado",
    curado: "Curado",
    finalizado: "Finalizado",
  }

  // Header
  doc.setFillColor(34, 139, 34) // Verde
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text("FECANBO", 105, 15, { align: "center" })
  doc.setFontSize(12)
  doc.text("Federación Cannábica Bonaerense", 105, 23, { align: "center" })
  doc.text("Sistema de Trazabilidad de Cannabis Medicinal", 105, 30, { align: "center" })

  // Reset text color
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text("REPORTE DE CULTIVO MEDICINAL", 105, 50, { align: "center" })

  // Info del cultivo
  let y = 65
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("INFORMACIÓN DEL CULTIVO", 20, y)
  y += 8
  
  doc.setFont("helvetica", "normal")
  const infoLines = [
    `Nombre: ${cultivo.nombre}`,
    `Variedad: ${cultivo.variedad || "N/A"}`,
    `Estado Actual: ${estadoLabels[cultivo.estado_actual] || cultivo.estado_actual}`,
    `Cantidad de Plantas: ${cultivo.cantidad_plantas}`,
    `Fecha de Inicio: ${new Date(cultivo.fecha_inicio).toLocaleDateString("es-AR")}`,
  ]

  if (cultivo.metodo_cultivo) {
    infoLines.push(`Método de Cultivo: ${cultivo.metodo_cultivo}`)
  }
  if (cultivo.medio_cultivo) {
    infoLines.push(`Medio de Cultivo: ${cultivo.medio_cultivo}`)
  }
  if (cultivo.ubicacion_descripcion) {
    infoLines.push(`Ubicación: ${cultivo.ubicacion_descripcion}`)
  }

  infoLines.forEach(line => {
    doc.text(line, 25, y)
    y += 6
  })

  // Ubicación si hay coordenadas
  if (cultivo.latitud && cultivo.longitud) {
    y += 5
    doc.setFont("helvetica", "bold")
    doc.text("GEOLOCALIZACIÓN", 20, y)
    y += 7
    doc.setFont("helvetica", "normal")
    doc.text(`Latitud: ${cultivo.latitud.toFixed(6)}`, 25, y)
    y += 6
    doc.text(`Longitud: ${cultivo.longitud.toFixed(6)}`, 25, y)
    y += 6
  }

  // Notas
  if (cultivo.notas) {
    y += 5
    doc.setFont("helvetica", "bold")
    doc.text("NOTAS ADICIONALES", 20, y)
    y += 7
    doc.setFont("helvetica", "normal")
    const notasLines = doc.splitTextToSize(cultivo.notas, 170)
    doc.text(notasLines, 25, y)
    y += notasLines.length * 6
  }

  // Certificación
  y += 10
  if (y > 240) {
    doc.addPage()
    y = 20
  }
  
  doc.setFillColor(240, 240, 240)
  doc.rect(15, y, 180, 35, 'F')
  y += 10
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("CERTIFICACIÓN", 105, y, { align: "center" })
  y += 7
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const certText = [
    "Este reporte certifica que el cultivo descrito cumple con los estándares",
    "de trazabilidad establecidos por FECANBO y se encuentra registrado en",
    "el Sistema de Trazabilidad de Cannabis Medicinal."
  ]
  certText.forEach(line => {
    doc.text(line, 105, y, { align: "center" })
    y += 5
  })

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado: ${new Date().toLocaleString("es-AR")}`, 105, pageHeight - 20, { align: "center" })
  doc.text("info@fecanbo.org.ar | www.fecanbo.org.ar", 105, pageHeight - 15, { align: "center" })
  doc.text(`Sistema FECANBO v1.0 - ${new Date().getFullYear()}`, 105, pageHeight - 10, { align: "center" })

  // Save
  const fileName = `FECANBO_Cultivo_${cultivo.nombre.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}

export async function generateEntregaPDF(entrega: Entrega, cultivo: Cultivo, usuario: UsuarioFinal) {
  const doc = new jsPDF()
  
  const tipoProducto: Record<string, string> = {
    flor: "Flores (Cannabis)",
    aceite: "Aceite Medicinal",
    extracto: "Extracto Concentrado",
    otro: "Otro Producto",
  }

  // Header
  doc.setFillColor(34, 139, 34)
  doc.rect(0, 0, 210, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(20)
  doc.text("FECANBO", 105, 15, { align: "center" })
  doc.setFontSize(12)
  doc.text("Federación Cannábica Bonaerense", 105, 23, { align: "center" })
  doc.text("Sistema de Trazabilidad de Cannabis Medicinal", 105, 30, { align: "center" })

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text("COMPROBANTE DE ENTREGA", 105, 50, { align: "center" })

  // Info de la entrega
  let y = 65
  doc.setFontSize(10)
  doc.setFont("helvetica", "bold")
  doc.text("INFORMACIÓN DE LA ENTREGA", 20, y)
  y += 8
  
  doc.setFont("helvetica", "normal")
  doc.text(`Fecha: ${new Date(entrega.fecha_entrega).toLocaleString("es-AR")}`, 25, y)
  y += 6
  doc.text(`Lote: ${entrega.lote || "N/A"}`, 25, y)
  y += 6
  doc.text(`ID Entrega: ${entrega.id.slice(0, 8)}...`, 25, y)
  y += 10

  // Producto
  doc.setFont("helvetica", "bold")
  doc.text("PRODUCTO ENTREGADO", 20, y)
  y += 8
  doc.setFont("helvetica", "normal")
  doc.text(`Tipo: ${tipoProducto[entrega.tipo_producto] || entrega.tipo_producto}`, 25, y)
  y += 6
  doc.text(`Cantidad: ${entrega.cantidad_gramos}g`, 25, y)
  y += 10

  // Origen
  doc.setFont("helvetica", "bold")
  doc.text("ORIGEN", 20, y)
  y += 8
  doc.setFont("helvetica", "normal")
  doc.text(`Cultivo: ${cultivo.nombre}`, 25, y)
  y += 10

  // Destinatario
  doc.setFont("helvetica", "bold")
  doc.text("DESTINATARIO", 20, y)
  y += 8
  doc.setFont("helvetica", "normal")
  doc.text(`Nombre: ${usuario.nombre_completo}`, 25, y)
  y += 6
  doc.text(`Documento: ${usuario.documento}`, 25, y)
  y += 10

  // Notas
  if (entrega.notas) {
    doc.setFont("helvetica", "bold")
    doc.text("NOTAS", 20, y)
    y += 7
    doc.setFont("helvetica", "normal")
    const notasLines = doc.splitTextToSize(entrega.notas, 170)
    doc.text(notasLines, 25, y)
    y += notasLines.length * 6 + 5
  }

  // Certificación
  y += 10
  if (y > 240) {
    doc.addPage()
    y = 20
  }
  
  doc.setFillColor(240, 240, 240)
  doc.rect(15, y, 180, 30, 'F')
  y += 10
  doc.setFont("helvetica", "bold")
  doc.setFontSize(11)
  doc.text("CERTIFICACIÓN", 105, y, { align: "center" })
  y += 7
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  const certText = [
    "Este comprobante certifica la entrega del producto descrito",
    "bajo el marco del Sistema de Trazabilidad de FECANBO."
  ]
  certText.forEach(line => {
    doc.text(line, 105, y, { align: "center" })
    y += 5
  })

  // Footer
  const pageHeight = doc.internal.pageSize.height
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado: ${new Date().toLocaleString("es-AR")}`, 105, pageHeight - 20, { align: "center" })
  doc.text("info@fecanbo.org.ar | www.fecanbo.org.ar", 105, pageHeight - 15, { align: "center" })
  doc.text(`Sistema FECANBO v1.0 - ${new Date().getFullYear()}`, 105, pageHeight - 10, { align: "center" })

  // Save
  const fileName = `FECANBO_Entrega_${entrega.lote || entrega.id.slice(0, 8)}_${new Date().toISOString().split("T")[0]}.pdf`
  doc.save(fileName)
}
