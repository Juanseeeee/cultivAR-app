import { Suspense } from "react"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { getCultivoById, getObservacionesByCultivoId, getEtapasByCultivoId } from "@/lib/actions/cultivos"
import { CultivoDetailClient } from "./cultivo-detail-client"

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32 mt-2" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-96" />
    </div>
  )
}

async function CultivoContent({ id }: { id: string }) {
  const [cultivo, observaciones, etapas] = await Promise.all([
    getCultivoById(id),
    getObservacionesByCultivoId(id),
    getEtapasByCultivoId(id)
  ])

  if (!cultivo) {
    notFound()
  }

  return (
    <CultivoDetailClient 
      cultivo={cultivo} 
      observaciones={observaciones} 
      etapas={etapas} 
    />
  )
}

export default async function CultivoDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CultivoContent id={id} />
    </Suspense>
  )
}
