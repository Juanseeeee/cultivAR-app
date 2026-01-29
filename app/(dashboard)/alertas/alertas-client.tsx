"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { CreateAlertaDialog } from "@/components/alertas/create-alerta-dialog"
import { AlertCircle, Clock, CheckCircle2, CalendarIcon } from "lucide-react"
import { toggleAlerta } from "@/lib/actions/alertas"
import { format, formatDistanceToNow, isPast, isFuture } from "date-fns"
import { es } from "date-fns/locale"

interface Alerta {
  id: string
  cultivo_id: string
  tipo: string
  titulo: string
  descripcion: string
  prioridad: string
  fecha_programada: string
  completada: boolean
  recurrente: boolean
  intervalo_dias: number | null
  cultivo_nombre: string
}

interface Cultivo {
  id: string
  nombre: string
  activo: boolean
}

const prioridadColors: Record<string, string> = {
  baja: "bg-blue-500/10 text-blue-700 border-blue-200",
  media: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  alta: "bg-orange-500/10 text-orange-700 border-orange-200",
  urgente: "bg-red-500/10 text-red-700 border-red-200",
}

const tipoIcons: Record<string, string> = {
  riego: "💧",
  poda: "✂️",
  nutricion: "🌱",
  control_plagas: "🐛",
  defoliacion: "🍃",
  transplante: "🪴",
  cambio_fotoperiodo: "💡",
  cosecha: "✅",
  otro: "📌",
}

export function AlertasClient({ alertas, cultivos }: { alertas: Alerta[]; cultivos: Cultivo[] }) {
  const [cultivoFilter, setCultivoFilter] = useState<string>("todos")
  const [prioridadFilter, setPrioridadFilter] = useState<string>("todas")
  const [isPending, startTransition] = useTransition()

  const alertasFiltradas = alertas.filter((alerta) => {
    const matchesCultivo = cultivoFilter === "todos" || alerta.cultivo_id === cultivoFilter
    const matchesPrioridad = prioridadFilter === "todas" || alerta.prioridad === prioridadFilter
    return matchesCultivo && matchesPrioridad
  })

  const alertasPendientes = alertasFiltradas.filter((a) => !a.completada)
  const alertasVencidas = alertasPendientes.filter((a) => isPast(new Date(a.fecha_programada)))
  const alertasProximas = alertasPendientes.filter(
    (a) =>
      isFuture(new Date(a.fecha_programada)) &&
      new Date(a.fecha_programada).getTime() - Date.now() < 48 * 60 * 60 * 1000
  )
  const alertasFuturas = alertasPendientes.filter(
    (a) =>
      isFuture(new Date(a.fecha_programada)) &&
      new Date(a.fecha_programada).getTime() - Date.now() >= 48 * 60 * 60 * 1000
  )
  const alertasCompletadas = alertasFiltradas.filter((a) => a.completada)

  const handleToggleAlerta = (alertaId: string, completada: boolean) => {
    startTransition(async () => {
      await toggleAlerta(alertaId, !completada)
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alertas Tecnicas</h1>
          <p className="text-muted-foreground mt-1">Gestiona recordatorios y tareas de cultivo</p>
        </div>
        <CreateAlertaDialog />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={cultivoFilter} onValueChange={setCultivoFilter}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="Filtrar por cultivo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los cultivos</SelectItem>
            {cultivos
              .filter((c) => c.activo)
              .map((cultivo) => (
                <SelectItem key={cultivo.id} value={cultivo.id}>
                  {cultivo.nombre}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Select value={prioridadFilter} onValueChange={setPrioridadFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrar por prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las prioridades</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
            <SelectItem value="baja">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Vencidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alertasVencidas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              Proximas 48h
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alertasProximas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-blue-500" />
              Futuras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alertasFuturas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alertasCompletadas.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vencidas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vencidas">Vencidas ({alertasVencidas.length})</TabsTrigger>
          <TabsTrigger value="proximas">Proximas ({alertasProximas.length})</TabsTrigger>
          <TabsTrigger value="futuras">Futuras ({alertasFuturas.length})</TabsTrigger>
          <TabsTrigger value="completadas">Completadas ({alertasCompletadas.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vencidas" className="mt-6">
          <AlertasList alertas={alertasVencidas} onToggle={handleToggleAlerta} isPending={isPending} />
        </TabsContent>

        <TabsContent value="proximas" className="mt-6">
          <AlertasList alertas={alertasProximas} onToggle={handleToggleAlerta} isPending={isPending} />
        </TabsContent>

        <TabsContent value="futuras" className="mt-6">
          <AlertasList alertas={alertasFuturas} onToggle={handleToggleAlerta} isPending={isPending} />
        </TabsContent>

        <TabsContent value="completadas" className="mt-6">
          <AlertasList alertas={alertasCompletadas} onToggle={handleToggleAlerta} isPending={isPending} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AlertasListProps {
  alertas: Alerta[]
  onToggle: (id: string, completada: boolean) => void
  isPending: boolean
}

function AlertasList({ alertas, onToggle, isPending }: AlertasListProps) {
  if (alertas.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle2 className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No hay alertas en esta categoria</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {alertas.map((alerta) => {
        const isPastDue = !alerta.completada && isPast(new Date(alerta.fecha_programada))

        return (
          <Card key={alerta.id} className={`${isPastDue ? "border-destructive/50" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={alerta.completada}
                  onCheckedChange={() => onToggle(alerta.id, alerta.completada)}
                  disabled={isPending}
                  className="mt-1"
                />

                <div className="text-2xl mt-0.5">{tipoIcons[alerta.tipo] || "📌"}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className={`font-semibold ${alerta.completada ? "line-through text-muted-foreground" : ""}`}>
                        {alerta.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground">Cultivo: {alerta.cultivo_nombre}</p>
                    </div>
                    <Badge variant="outline" className={prioridadColors[alerta.prioridad] || prioridadColors.media}>
                      {alerta.prioridad}
                    </Badge>
                  </div>

                  {alerta.descripcion && <p className="text-sm text-muted-foreground mb-3">{alerta.descripcion}</p>}

                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    {isPastDue ? (
                      <span className="flex items-center gap-1 text-destructive font-medium">
                        <AlertCircle className="h-3 w-3" />
                        Vencida hace {formatDistanceToNow(new Date(alerta.fecha_programada), { locale: es })}
                      </span>
                    ) : alerta.completada ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Completada
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(alerta.fecha_programada), "d MMM yyyy, HH:mm", { locale: es })}
                      </span>
                    )}

                    {alerta.recurrente && alerta.intervalo_dias && (
                      <Badge variant="outline" className="text-xs">
                        Recurrente ({alerta.intervalo_dias}d)
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
