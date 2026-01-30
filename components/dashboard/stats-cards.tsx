import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, AlertCircle, Package, Users, TrendingUp, Clock } from "lucide-react"
import type { EstadisticasCultivador } from "@/lib/types/database"

interface StatsCardsProps {
  stats: EstadisticasCultivador
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Cultivos Activos</CardTitle>
          <Sprout className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.cultivos_activos}</div>
          <p className="text-xs text-muted-foreground mt-1">de {stats.total_cultivos} totales</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Alertas Pendientes</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.alertas_pendientes}</div>
          <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Entregas</CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.total_entregas}</div>
          <p className="text-xs text-muted-foreground mt-1">Completadas</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Producción Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.total_gramos_entregados}g</div>
          <p className="text-xs text-muted-foreground mt-1">Gramos entregados</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Usuarios Finales</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.total_usuarios_finales}</div>
          <p className="text-xs text-muted-foreground mt-1">Receptores activos</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xs sm:text-sm font-medium">Finalizados</CardTitle>
          <Clock className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold">{stats.cultivos_finalizados}</div>
          <p className="text-xs text-muted-foreground mt-1">Cultivos completados</p>
        </CardContent>
      </Card>
    </div>
  )
}
