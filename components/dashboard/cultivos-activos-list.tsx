import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sprout, MapPin } from "lucide-react"
import type { Cultivo } from "@/lib/types/database"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import Link from "next/link"

interface CultivosActivosListProps {
  cultivos: Cultivo[]
}

const estadoColors = {
  germinacion: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  vegetativo: "bg-green-500/10 text-green-700 border-green-200",
  floracion: "bg-purple-500/10 text-purple-700 border-purple-200",
  cosecha: "bg-orange-500/10 text-orange-700 border-orange-200",
  secado: "bg-amber-500/10 text-amber-700 border-amber-200",
  curado: "bg-blue-500/10 text-blue-700 border-blue-200",
  finalizado: "bg-gray-500/10 text-gray-700 border-gray-200",
}

const estadoLabels = {
  germinacion: "Germinación",
  vegetativo: "Vegetativo",
  floracion: "Floración",
  cosecha: "Cosecha",
  secado: "Secado",
  curado: "Curado",
  finalizado: "Finalizado",
}

export function CultivosActivosList({ cultivos }: CultivosActivosListProps) {
  const cultivosActivos = cultivos.filter((c) => c.activo).slice(0, 4)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Cultivos Activos</CardTitle>
          <CardDescription>Tus cultivos en desarrollo más recientes</CardDescription>
        </div>
        <Link href="/cultivos">
          <Button variant="outline" size="sm">
            Ver todos
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {cultivosActivos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Sprout className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No hay cultivos activos</p>
              <Link href="/cultivos/nuevo">
                <Button variant="outline" size="sm" className="mt-3 bg-transparent">
                  Crear primer cultivo
                </Button>
              </Link>
            </div>
          ) : (
            cultivosActivos.map((cultivo) => (
              <div
                key={cultivo.id}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sprout className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-sm leading-tight">{cultivo.nombre}</p>
                      <p className="text-xs text-muted-foreground">{cultivo.variedad}</p>
                    </div>
                    <Badge variant="outline" className={estadoColors[cultivo.estado_actual]}>
                      {estadoLabels[cultivo.estado_actual]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span>{cultivo.cantidad_plantas} plantas</span>
                    {cultivo.ubicacion_descripcion && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {cultivo.ubicacion_descripcion}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Iniciado hace {formatDistanceToNow(new Date(cultivo.fecha_inicio), { locale: es })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
