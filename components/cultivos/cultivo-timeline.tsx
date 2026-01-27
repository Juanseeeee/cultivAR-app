"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, Circle, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cambiarEtapaCultivo } from "@/lib/actions/cultivos"
import { useToast } from "@/hooks/use-toast"

interface Etapa {
  id: string
  cultivo_id: string
  etapa: string
  fecha_inicio: string
  fecha_fin?: string | null
}

interface CultivoTimelineProps {
  cultivoId: string
  etapas?: Etapa[]
}

const etapasInfo = [
  { id: "germinacion", label: "Germinacion", dias: "3-10 dias", descripcion: "Inicio del proceso de germinacion" },
  {
    id: "vegetativo",
    label: "Vegetativo",
    dias: "3-8 semanas",
    descripcion: "Crecimiento vegetativo y desarrollo de estructura",
  },
  {
    id: "floracion",
    label: "Floracion",
    dias: "7-9 semanas",
    descripcion: "Desarrollo de flores y produccion de resina",
  },
  { id: "cosecha", label: "Cosecha", dias: "1-3 dias", descripcion: "Corte y preparacion para secado" },
  { id: "secado", label: "Secado", dias: "7-14 dias", descripcion: "Secado en ambiente controlado" },
  { id: "curado", label: "Curado", dias: "2-4 semanas", descripcion: "Curado para mejorar sabor y potencia" },
  { id: "finalizado", label: "Finalizado", dias: "-", descripcion: "Cultivo completado" },
]

export function CultivoTimeline({ cultivoId, etapas = [] }: CultivoTimelineProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedEtapa, setSelectedEtapa] = useState<string>("")
  
  // Determine completed and current stages from real data
  const etapasCompletadas = etapas
    .filter(e => e.fecha_fin !== null)
    .map(e => e.etapa)
  
  const etapaActualData = etapas.find(e => e.fecha_fin === null)
  const etapaActual = etapaActualData?.etapa || "germinacion"

  // Get next possible stages
  const etapaActualIndex = etapasInfo.findIndex(e => e.id === etapaActual)
  const etapasSiguientes = etapasInfo.slice(etapaActualIndex + 1)

  const handleCambiarEtapa = async () => {
    if (!selectedEtapa) return
    
    setLoading(true)
    try {
      await cambiarEtapaCultivo(cultivoId, selectedEtapa)
      toast({
        title: "Etapa actualizada",
        description: `El cultivo ha avanzado a ${etapasInfo.find(e => e.id === selectedEtapa)?.label}`,
      })
      setOpen(false)
      setSelectedEtapa("")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error changing stage:", error)
      toast({
        title: "Error",
        description: "No se pudo cambiar la etapa. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Linea de Tiempo del Cultivo</CardTitle>
          <CardDescription>Seguimiento de etapas y progreso</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Cambiar Etapa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cambiar Etapa del Cultivo</DialogTitle>
              <DialogDescription>
                Selecciona la siguiente etapa del cultivo. Se cerrará la etapa actual y comenzará la nueva.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Etapa actual: {etapasInfo.find(e => e.id === etapaActual)?.label}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nueva-etapa">Nueva etapa *</Label>
                <Select value={selectedEtapa} onValueChange={setSelectedEtapa}>
                  <SelectTrigger id="nueva-etapa">
                    <SelectValue placeholder="Seleccionar etapa..." />
                  </SelectTrigger>
                  <SelectContent>
                    {etapasSiguientes.map((etapa) => (
                      <SelectItem key={etapa.id} value={etapa.id}>
                        {etapa.label} - {etapa.dias}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button onClick={handleCambiarEtapa} disabled={!selectedEtapa || loading}>
                {loading ? "Guardando..." : "Cambiar Etapa"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {etapasInfo.map((etapa, index) => {
            const isCompletada = etapasCompletadas.includes(etapa.id)
            const isActual = etapa.id === etapaActual
            const isFutura = !isCompletada && !isActual

            // Find the real stage data if it exists
            const etapaData = etapas.find(e => e.etapa === etapa.id)

            return (
              <div key={etapa.id} className="relative">
                {index < etapasInfo.length - 1 && (
                  <div
                    className={`absolute left-3 top-10 w-0.5 h-12 ${
                      isCompletada || isActual ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isCompletada
                        ? "bg-primary text-primary-foreground"
                        : isActual
                          ? "bg-primary/20 border-2 border-primary"
                          : "bg-muted border-2 border-border"
                    }`}
                  >
                    {isCompletada ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : isActual ? (
                      <Circle className="h-3 w-3 fill-primary" />
                    ) : (
                      <Circle className="h-3 w-3" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h4 className="font-semibold">{etapa.label}</h4>
                        <p className="text-sm text-muted-foreground">{etapa.descripcion}</p>
                      </div>
                      {isActual && (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          En progreso
                        </Badge>
                      )}
                      {isCompletada && (
                        <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                          Completada
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Duracion tipica: {etapa.dias}</span>
                      {etapaData?.fecha_inicio && (
                        <span>
                          | Iniciado: {format(new Date(etapaData.fecha_inicio), "d MMM yyyy", { locale: es })}
                        </span>
                      )}
                      {etapaData?.fecha_fin && (
                        <span>
                          | Finalizado: {format(new Date(etapaData.fecha_fin), "d MMM yyyy", { locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
