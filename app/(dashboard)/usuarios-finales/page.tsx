import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getUsuariosFinales } from "@/lib/actions/usuarios"
import { UsuariosClient } from "./usuarios-client"

function UsuariosSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    </div>
  )
}

async function UsuariosContent() {
  const usuarios = await getUsuariosFinales()

  const usuariosData = usuarios.map((u: Record<string, unknown>) => ({
    id: u.id as string,
    nombre_completo: u.nombre_completo as string,
    documento: u.documento as string || "",
    email: u.email as string || "",
    telefono: u.telefono as string || "",
    direccion: u.direccion as string || "",
    condicion_medica: u.condicion_medica as string || "",
    dosis_recomendada: u.observaciones_medicas as string || "",
    activo: u.activo as boolean,
    fecha_registro: u.created_at as string
  }))

  return <UsuariosClient usuarios={usuariosData} />
}

export default function UsuariosFinalesPage() {
  return (
    <Suspense fallback={<UsuariosSkeleton />}>
      <UsuariosContent />
    </Suspense>
  )
}
