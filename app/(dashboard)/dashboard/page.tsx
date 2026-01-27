import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { CultivosEtapaChart } from "@/components/dashboard/cultivos-etapa-chart"
import { EntregasChart } from "@/components/dashboard/entregas-chart"
import { AlertasList } from "@/components/dashboard/alertas-list"
import { CultivosActivosList } from "@/components/dashboard/cultivos-activos-list"
import { getEstadisticas, getCultivos, getCultivosPorEtapa } from "@/lib/actions/cultivos"
import { getAlertasPendientes } from "@/lib/actions/alertas"
import { getEntregasPorMes } from "@/lib/actions/entregas"

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground">Cargando datos del dashboard...</p>
        </div>
      </div>
      <Skeleton className="h-10 w-64" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[400px]" />
        <Skeleton className="h-[400px]" />
      </div>
    </div>
  )
}

async function DashboardContent() {
  try {
    const [estadisticas, cultivos, alertas, cultivosPorEtapa, entregasPorMes] = await Promise.all([
      getEstadisticas(),
      getCultivos(),
      getAlertasPendientes(),
      getCultivosPorEtapa(),
      getEntregasPorMes()
    ])

    console.log("[v0] Dashboard data loaded:", { 
      estadisticas, 
      cultivosCount: cultivos.length,
      alertasCount: alertas.length,
      cultivosPorEtapaCount: cultivosPorEtapa.length,
      entregasPorMesCount: entregasPorMes.length
    })

    // Transform alertas for the list component
    const alertasForList = (alertas || []).map((a: Record<string, unknown>) => ({
      id: a.id as string,
      tipo: a.tipo as string,
      titulo: a.titulo as string,
      descripcion: a.descripcion as string,
      prioridad: a.prioridad as string,
      fecha_programada: a.fecha_programada as string,
      cultivo_nombre: (a.cultivos as { nombre: string } | null)?.nombre || "Sin cultivo"
    }))

    // Transform cultivos for the list component
    const cultivosForList = (cultivos || []).slice(0, 5).map((c: Record<string, unknown>) => ({
      id: c.id as string,
      nombre: c.nombre as string,
      variedad: c.variedad as string,
      estado_actual: c.estado_actual as string,
      cantidad_plantas: c.cantidad_plantas as number,
      fecha_inicio: c.fecha_inicio as string
    }))

    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="space-y-1 lg:block hidden">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Monitoreo general de cultivos medicinales comunitarios</p>
        </div>

        <StatsCards stats={estadisticas} />

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <CultivosEtapaChart data={cultivosPorEtapa} />
          <EntregasChart data={entregasPorMes} />
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <AlertasList alertas={alertasForList} />
          <CultivosActivosList cultivos={cultivosForList} />
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading dashboard data:", error)
    return <div>Error loading dashboard data</div>
  }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  )
}
