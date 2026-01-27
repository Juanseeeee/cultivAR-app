"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateEntregaDialog } from "@/components/entregas/create-entrega-dialog"
import { Search, Package, Download, User, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { generateEntregaPDF } from "@/lib/pdf-generator-real"
import type { Cultivo as CultivoType, Entrega as EntregaType, UsuarioFinal } from "@/lib/types/database"

interface Entrega {
  id: string
  cultivo_id: string
  usuario_final_id: string
  tipo_producto: string
  cantidad_gramos: number
  lote: string
  notas: string
  fecha_entrega: string
  cultivo_nombre: string
  usuario_nombre: string
}

interface Cultivo {
  id: string
  nombre: string
}

interface Usuario {
  id: string
  nombre_completo: string
  documento: string
}

export function EntregasClient({
  entregas,
  cultivos,
  usuarios
}: {
  entregas: Entrega[]
  cultivos: Cultivo[]
  usuarios: Usuario[]
}) {
  const [searchQuery, setSearchQuery] = useState("")
  const [tipoFilter, setTipoFilter] = useState<string>("todos")

  const entregasFiltradas = entregas.filter((entrega) => {
    const matchesSearch =
      entrega.usuario_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrega.cultivo_nombre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrega.lote?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTipo = tipoFilter === "todos" || entrega.tipo_producto === tipoFilter

    return matchesSearch && matchesTipo
  })

  const totalGramos = entregasFiltradas.reduce((sum, e) => sum + e.cantidad_gramos, 0)

  const handleDownloadPDF = async (entregaId: string) => {
    const entrega = entregas.find((e) => e.id === entregaId)
    if (!entrega) return

    // Find the associated cultivo and usuario
    const cultivo = cultivos.find(c => c.id === entrega.cultivo_id)
    const usuario = usuarios.find(u => u.id === entrega.usuario_final_id)

    if (!cultivo || !usuario) {
      console.error("[v0] Missing cultivo or usuario for entrega")
      return
    }

    // Create proper typed objects for PDF generation
    const entregaData: EntregaType = {
      id: entrega.id,
      cultivo_id: entrega.cultivo_id,
      usuario_final_id: entrega.usuario_final_id,
      cultivador_id: '', // Not used in PDF
      tipo_producto: entrega.tipo_producto,
      cantidad_gramos: entrega.cantidad_gramos,
      lote: entrega.lote,
      notas: entrega.notas,
      fecha_entrega: entrega.fecha_entrega,
      created_at: entrega.fecha_entrega
    }

    const cultivoData: CultivoType = {
      id: cultivo.id,
      nombre: cultivo.nombre,
      variedad: '',
      cantidad_plantas: 0,
      fecha_inicio: new Date().toISOString(),
      estado_actual: '',
      activo: true,
      cultivador_id: '',
      created_at: new Date().toISOString(),
      metodo_cultivo: null,
      medio_cultivo: null,
      ubicacion_descripcion: null,
      latitud: null,
      longitud: null,
      notas: null,
      fecha_estimada_cosecha: null
    }

    const usuarioData: UsuarioFinal = {
      id: usuario.id,
      nombre_completo: usuario.nombre_completo,
      documento: usuario.documento,
      cultivador_id: '',
      activo: true,
      created_at: new Date().toISOString(),
      email: null,
      telefono: null,
      condicion_medica: null,
      dosis_recomendada: null,
      notas: null
    }

    await generateEntregaPDF(entregaData, cultivoData, usuarioData)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entregas</h1>
          <p className="text-muted-foreground mt-1">Registro de entregas y trazabilidad de producto medicinal</p>
        </div>
        <CreateEntregaDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por usuario, cultivo o lote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tipoFilter} onValueChange={setTipoFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Tipo de producto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los tipos</SelectItem>
            <SelectItem value="flor">Flor</SelectItem>
            <SelectItem value="aceite">Aceite</SelectItem>
            <SelectItem value="extracto">Extracto</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entregas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{entregasFiltradas.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registros</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Entregado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalGramos}g</div>
            <p className="text-xs text-muted-foreground mt-1">Producto medicinal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Usuarios Atendidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{new Set(entregasFiltradas.map((e) => e.usuario_final_id)).size}</div>
            <p className="text-xs text-muted-foreground mt-1">Pacientes unicos</p>
          </CardContent>
        </Card>
      </div>

      {entregasFiltradas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron entregas</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchQuery || tipoFilter !== "todos"
                ? "Intenta ajustar los filtros de busqueda"
                : "Comienza registrando tu primera entrega"}
            </p>
            {!searchQuery && tipoFilter === "todos" && <CreateEntregaDialog />}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {entregasFiltradas
            .sort((a, b) => new Date(b.fecha_entrega).getTime() - new Date(a.fecha_entrega).getTime())
            .map((entrega) => (
              <Card key={entrega.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="h-6 w-6 text-primary" />
                      </div>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{entrega.lote || `Entrega ${entrega.id.slice(0, 8)}`}</h3>
                              <Badge variant="outline" className="capitalize">
                                {entrega.tipo_producto}
                              </Badge>
                            </div>
                            <p className="text-2xl font-bold text-primary">{entrega.cantidad_gramos}g</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-start gap-2">
                            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Usuario Final</p>
                              <p className="font-medium">{entrega.usuario_nombre}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Cultivo Origen</p>
                              <p className="font-medium">{entrega.cultivo_nombre}</p>
                            </div>
                          </div>

                          <div className="flex items-start gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-muted-foreground text-xs">Fecha de Entrega</p>
                              <p className="font-medium">
                                {format(new Date(entrega.fecha_entrega), "d MMM yyyy, HH:mm", { locale: es })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {entrega.notas && (
                          <div className="pt-3 border-t">
                            <p className="text-sm text-muted-foreground">{entrega.notas}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(entrega.id)}>
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  )
}
