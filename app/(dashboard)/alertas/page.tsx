import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getAlertas } from "@/lib/actions/alertas"
import { getCultivos } from "@/lib/actions/cultivos"
import { AlertasClient } from "./alertas-client"

function AlertasSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <Skeleton className="h-[400px]" />
    </div>
  )
}

async function AlertasContent() {
  const [alertas, cultivos] = await Promise.all([
    getAlertas(),
    getCultivos()
  ])

  const alertasData = alertas.map((a: Record<string, unknown>) => ({
    id: a.id as string,
    cultivo_id: a.cultivo_id as string,
    tipo: a.tipo as string,
    titulo: a.titulo as string,
    descripcion: a.descripcion as string || "",
    prioridad: a.prioridad as string,
    fecha_programada: a.fecha_programada as string,
    completada: a.completada as boolean || false,
    recurrente: a.recurrente as boolean || false,
    intervalo_dias: a.intervalo_dias as number || null,
    cultivo_nombre: (a.cultivos as { nombre: string } | null)?.nombre || "Sin cultivo"
  }))

  const cultivosData = cultivos.map((c: Record<string, unknown>) => ({
    id: c.id as string,
    nombre: c.nombre as string,
    activo: c.activo as boolean
  }))

  return <AlertasClient alertas={alertasData} cultivos={cultivosData} />
}

export default function AlertasPage() {
  return (
    <Suspense fallback={<AlertasSkeleton />}>
      <AlertasContent />
    </Suspense>
  )
}
