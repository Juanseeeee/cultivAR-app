import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getEntregas } from "@/lib/actions/entregas"
import { getCultivos } from "@/lib/actions/cultivos"
import { getUsuariosFinales } from "@/lib/actions/usuarios"
import { EntregasClient } from "./entregas-client"

export const dynamic = 'force-dynamic'

function EntregasSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-5 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[200px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  )
}

async function EntregasContent() {
  const [entregas, cultivos, usuarios] = await Promise.all([
    getEntregas(),
    getCultivos(),
    getUsuariosFinales()
  ])

  const entregasData = entregas.map((e: Record<string, unknown>) => ({
    id: e.id as string,
    cultivo_id: e.cultivo_id as string,
    usuario_final_id: e.usuario_final_id as string,
    tipo_producto: e.tipo_producto as string,
    cantidad_gramos: e.cantidad_gramos as number,
    lote: e.lote as string || "",
    notas: e.notas as string || "",
    fecha_entrega: e.fecha_entrega as string,
    cultivo_nombre: (e.cultivos as { nombre: string } | null)?.nombre || "Sin cultivo",
    usuario_nombre: (e.usuarios_finales as { nombre_completo: string } | null)?.nombre_completo || "Sin usuario"
  }))

  const cultivosData = cultivos.map((c: Record<string, unknown>) => ({
    id: c.id as string,
    nombre: c.nombre as string
  }))

  const usuariosData = usuarios.map((u: Record<string, unknown>) => ({
    id: u.id as string,
    nombre_completo: u.nombre_completo as string,
    documento: u.documento as string || ""
  }))

  return <EntregasClient entregas={entregasData} cultivos={cultivosData} usuarios={usuariosData} />
}

export default function EntregasPage() {
  return (
    <Suspense fallback={<EntregasSkeleton />}>
      <EntregasContent />
    </Suspense>
  )
}
