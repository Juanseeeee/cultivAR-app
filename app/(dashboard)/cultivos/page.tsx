import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCultivos } from "@/lib/actions/cultivos"
import { CultivosClient } from "./cultivos-client"

function CultivosListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  )
}

async function CultivosContent() {
  const cultivos = await getCultivos()
  
  // Transform to match expected format
  const cultivosData = cultivos.map((c: Record<string, unknown>) => ({
    id: c.id as string,
    nombre: c.nombre as string,
    variedad: c.variedad as string || "",
    estado_actual: c.estado_actual as string,
    cantidad_plantas: c.cantidad_plantas as number,
    metodo_cultivo: c.metodo_cultivo as string || "indoor",
    ubicacion_descripcion: c.ubicacion_descripcion as string || "",
    fecha_inicio: c.fecha_inicio as string
  }))

  return <CultivosClient cultivos={cultivosData} />
}

export default function CultivosPage() {
  return (
    <Suspense fallback={<CultivosListSkeleton />}>
      <CultivosContent />
    </Suspense>
  )
}
