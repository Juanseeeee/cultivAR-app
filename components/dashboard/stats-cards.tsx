import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, AlertCircle, Package, Users, TrendingUp, Clock } from "lucide-react"
import type { EstadisticasCultivador } from "@/lib/types/database"

interface StatsCardsProps {
  stats: EstadisticasCultivador
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <Sprout className="h-4 w-4 text-primary" />
              Cultivos activos
            </div>
            <div className="text-lg font-bold">{stats.cultivos_activos}</div>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Alertas pendientes
            </div>
            <div className="text-lg font-bold">{stats.alertas_pendientes}</div>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <Package className="h-4 w-4 text-primary" />
              Total entregas
            </div>
            <div className="text-lg font-bold">{stats.total_entregas}</div>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <TrendingUp className="h-4 w-4 text-primary" />
              Producción total
            </div>
            <div className="text-lg font-bold">{stats.total_gramos_entregados}g</div>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <Users className="h-4 w-4 text-primary" />
              Usuarios finales
            </div>
            <div className="text-lg font-bold">{stats.total_usuarios_finales}</div>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
            <div className="flex items-center gap-2 text-[11px]">
              <Clock className="h-4 w-4 text-primary" />
              Finalizados
            </div>
            <div className="text-lg font-bold">{stats.cultivos_finalizados}</div>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground">de {stats.total_cultivos} cultivos totales</p>
      </CardContent>
    </Card>
  )
}
