import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Droplets, Sprout, AlertTriangle, TrendingUp, Camera, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Observacion {
  id: string
  cultivo_id: string
  descripcion: string
  tipo?: string | null
  fecha?: string
  created_at: string
  temperatura?: number | null
  humedad?: number | null
  ph?: number | null
  altura_cm?: number | null
  foto_url?: string | null
}

interface ObservacionesListProps {
  cultivoId: string
  observaciones?: Observacion[]
}

const tipoConfig: Record<string, { icon: typeof Sprout; label: string; color: string }> = {
  riego: { icon: Droplets, label: "Riego", color: "bg-blue-500/10 text-blue-700 border-blue-200" },
  nutricion: { icon: Sprout, label: "Nutricion", color: "bg-green-500/10 text-green-700 border-green-200" },
  problema: { icon: AlertTriangle, label: "Problema", color: "bg-red-500/10 text-red-700 border-red-200" },
  mejora: { icon: TrendingUp, label: "Mejora", color: "bg-purple-500/10 text-purple-700 border-purple-200" },
  foto: { icon: Camera, label: "Foto", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
  general: { icon: FileText, label: "General", color: "bg-gray-500/10 text-gray-700 border-gray-200" },
}

export function ObservacionesList({ cultivoId, observaciones = [] }: ObservacionesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Observaciones y Registros</CardTitle>
        <CardDescription>Historial de anotaciones, mediciones y eventos</CardDescription>
      </CardHeader>
      <CardContent>
        {observaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Sprout className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No hay observaciones registradas</p>
            <p className="text-sm text-muted-foreground">
              Usa el boton "Nueva Observacion" para agregar la primera
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {observaciones.map((obs) => {
              const tipo = obs.tipo || "general"
              const config = tipoConfig[tipo] || tipoConfig.general
              const Icon = config.icon
              const fechaDisplay = obs.fecha || obs.created_at

              return (
                <div key={obs.id} className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="outline" className={config.color}>
                        {config.label}
                      </Badge>
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(fechaDisplay), "d MMM yyyy, HH:mm", { locale: es })}
                      </time>
                    </div>
                    <p className="text-sm">{obs.descripcion}</p>
                    {(obs.temperatura || obs.humedad || obs.ph || obs.altura_cm) && (
                      <div className="flex flex-wrap gap-3 mt-3 text-xs">
                        {obs.temperatura && (
                          <span className="text-muted-foreground">
                            Temp: <span className="font-medium text-foreground">{obs.temperatura}C</span>
                          </span>
                        )}
                        {obs.humedad && (
                          <span className="text-muted-foreground">
                            Humedad: <span className="font-medium text-foreground">{obs.humedad}%</span>
                          </span>
                        )}
                        {obs.ph && (
                          <span className="text-muted-foreground">
                            pH: <span className="font-medium text-foreground">{obs.ph}</span>
                          </span>
                        )}
                        {obs.altura_cm && (
                          <span className="text-muted-foreground">
                            Altura: <span className="font-medium text-foreground">{obs.altura_cm}cm</span>
                          </span>
                        )}
                      </div>
                    )}
                    {obs.foto_url && (
                      <div className="mt-3">
                        <img 
                          src={obs.foto_url || "/placeholder.svg"} 
                          alt="Foto de observacion" 
                          className="max-w-xs rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
