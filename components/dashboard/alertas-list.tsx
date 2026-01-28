import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react"
import type { Alerta } from "@/lib/types/database"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface AlertasListProps {
  alertas: Alerta[]
}

const prioridadColors = {
  baja: "bg-blue-500/10 text-blue-700 border-blue-200",
  media: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  alta: "bg-orange-500/10 text-orange-700 border-orange-200",
  urgente: "bg-red-500/10 text-red-700 border-red-200",
}

const tipoIcons = {
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

export function AlertasList({ alertas }: AlertasListProps) {
  const alertasPendientes = alertas.filter((a) => !a.completada).slice(0, 5)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm">Alertas Recientes</CardTitle>
          <CardDescription className="text-xs">Pendientes más próximos</CardDescription>
        </div>
        <Link href="/alertas">
          <Button variant="outline" size="sm" className="text-xs h-8 px-3 rounded-lg">
            Ver todas
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alertasPendientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
            </div>
          ) : (
            alertasPendientes.map((alerta) => {
              const isPast = new Date(alerta.fecha_programada) < new Date()
              return (
                <div
                  key={alerta.id}
                  className="flex items-start gap-2 p-2 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="text-xl mt-0.5">{tipoIcons[alerta.tipo]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-xs leading-tight">{alerta.titulo}</p>
                      <Badge variant="outline" className={`text-[11px] px-2 ${prioridadColors[alerta.prioridad]}`}>
                        {alerta.prioridad}
                      </Badge>
                    </div>
                    {alerta.descripcion && (
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{alerta.descripcion}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                      {isPast ? (
                        <span className="flex items-center gap-1 text-destructive font-medium">
                          <AlertCircle className="h-3 w-3" />
                          Vencida hace {formatDistanceToNow(new Date(alerta.fecha_programada), { locale: es })}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          en {formatDistanceToNow(new Date(alerta.fecha_programada), { locale: es })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
