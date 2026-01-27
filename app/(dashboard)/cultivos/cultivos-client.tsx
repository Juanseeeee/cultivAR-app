"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCultivoDialog } from "@/components/cultivos/create-cultivo-dialog"
import { Search, Sprout, MapPin, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Cultivo {
  id: string
  nombre: string
  variedad: string
  estado_actual: string
  cantidad_plantas: number
  metodo_cultivo: string
  ubicacion_descripcion: string
  fecha_inicio: string
}

const estadoColors: Record<string, string> = {
  germinacion: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  vegetativo: "bg-green-500/10 text-green-700 border-green-200",
  floracion: "bg-purple-500/10 text-purple-700 border-purple-200",
  cosecha: "bg-orange-500/10 text-orange-700 border-orange-200",
  secado: "bg-amber-500/10 text-amber-700 border-amber-200",
  curado: "bg-blue-500/10 text-blue-700 border-blue-200",
  finalizado: "bg-gray-500/10 text-gray-700 border-gray-200",
}

const estadoLabels: Record<string, string> = {
  germinacion: "Germinación",
  vegetativo: "Vegetativo",
  floracion: "Floración",
  cosecha: "Cosecha",
  secado: "Secado",
  curado: "Curado",
  finalizado: "Finalizado",
}

export function CultivosClient({ cultivos }: { cultivos: Cultivo[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [estadoFilter, setEstadoFilter] = useState<string>("todos")

  const cultivosFiltrados = cultivos.filter((cultivo) => {
    const matchesSearch =
      cultivo.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cultivo.variedad?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesEstado = estadoFilter === "todos" || cultivo.estado_actual === estadoFilter
    return matchesSearch && matchesEstado
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cultivos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus cultivos medicinales comunitarios</p>
        </div>
        <CreateCultivoDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o variedad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={estadoFilter} onValueChange={setEstadoFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los estados</SelectItem>
            <SelectItem value="germinacion">Germinación</SelectItem>
            <SelectItem value="vegetativo">Vegetativo</SelectItem>
            <SelectItem value="floracion">Floración</SelectItem>
            <SelectItem value="cosecha">Cosecha</SelectItem>
            <SelectItem value="secado">Secado</SelectItem>
            <SelectItem value="curado">Curado</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {cultivosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sprout className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron cultivos</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchQuery || estadoFilter !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "Comienza creando tu primer cultivo"}
            </p>
            {!searchQuery && estadoFilter === "todos" && <CreateCultivoDialog />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cultivosFiltrados.map((cultivo) => (
            <Link key={cultivo.id} href={`/cultivos/${cultivo.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sprout className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold leading-tight">{cultivo.nombre}</h3>
                        <p className="text-sm text-muted-foreground">{cultivo.variedad}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Estado</span>
                      <Badge variant="outline" className={estadoColors[cultivo.estado_actual] || estadoColors.finalizado}>
                        {estadoLabels[cultivo.estado_actual] || cultivo.estado_actual}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Plantas</span>
                      <span className="font-medium">{cultivo.cantidad_plantas}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Método</span>
                      <span className="font-medium capitalize">{cultivo.metodo_cultivo}</span>
                    </div>

                    {cultivo.ubicacion_descripcion && (
                      <div className="flex items-start gap-2 text-sm pt-2 border-t">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <span className="text-muted-foreground">{cultivo.ubicacion_descripcion}</span>
                      </div>
                    )}

                    <div className="flex items-start gap-2 text-sm pt-2 border-t">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">
                        Iniciado hace {formatDistanceToNow(new Date(cultivo.fecha_inicio), { locale: es })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
