import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MobileHeader } from "@/components/layout/mobile-header"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getAlertasPendientes } from "@/lib/actions/alertas"
import Image from "next/image"
import { getCultivosPorEtapa } from "@/lib/actions/cultivos"
import { CreateCultivoDialog } from "@/components/cultivos/create-cultivo-dialog"
import { AddObservacionDialog } from "@/components/cultivos/add-observacion-dialog"
import { CultivosEtapaChart } from "@/components/dashboard/cultivos-etapa-chart"
 
export const dynamic = 'force-dynamic'
 
export default async function InicioPage() {
  const supabase = await getSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Link href="/login">
          <Button>Ir a Login</Button>
        </Link>
      </div>
    )
  }
 
  const bannerHref = "/configuracion"
  const alerts = await getAlertasPendientes()
  const alertsForList = (alerts || []).slice(0, 3).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    tipo: a.tipo as string,
    titulo: a.titulo as string,
    descripcion: a.descripcion as string,
    prioridad: a.prioridad as string,
    fecha_programada: a.fecha_programada as string,
    cultivo_nombre: (a.cultivos as { nombre: string } | null)?.nombre || "Sin cultivo"
  }))
  const cultivosPorEtapa = await getCultivosPorEtapa()
 
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="lg:hidden h-16" />
      <MobileHeader />
      <div className="container max-w-7xl mx-auto p-4 pb-32 sm:p-6 lg:p-8 lg:pb-8">
        <div className="mx-auto max-w-md space-y-4">
          <Link href={bannerHref} className="block">
            <Card className="overflow-hidden rounded-2xl border-0 shadow-lg bg-muted">
              <div className="relative h-24 sm:h-28">
                <div className="absolute inset-0 bg-gradient-to-b from-muted/70 via-muted/50 to-muted/70" />
                <Image
                  src="/bannerlrc.png"
                  alt="Publicidad"
                  fill
                  className="object-cover banner-fade"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                <Image
                  src="/fecannbo.png"
                  alt="Publicidad"
                  fill
                  className="object-cover banner-fade"
                  priority
                  sizes="(max-width: 768px) 100vw, 600px"
                  style={{ animationDelay: "5s" }}
                />
              </div>
            </Card>
          </Link>
 
          <div className="space-y-2">
            <h2 className="text-sm font-semibold">Acciones rápidas</h2>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <CreateCultivoDialog
                triggerContent={
                  <button className="flex items-center gap-2 h-8 px-3 rounded-md border bg-background text-sm whitespace-nowrap hover:bg-accent transition-colors">
                    <span className="text-base">➕</span>
                    <span className="font-medium">Cultivo</span>
                  </button>
                }
              />
              <AddObservacionDialog
                defaultTipo="riego"
                triggerContent={
                  <button className="flex items-center gap-2 h-8 px-3 rounded-md border bg-background text-sm whitespace-nowrap hover:bg-accent transition-colors">
                    <span className="text-base">💧</span>
                    <span className="font-medium">Riego</span>
                  </button>
                }
              />
              <AddObservacionDialog
                defaultTipo="nutricion"
                triggerContent={
                  <button className="flex items-center gap-2 h-8 px-3 rounded-md border bg-background text-sm whitespace-nowrap hover:bg-accent transition-colors">
                    <span className="text-base">🧪</span>
                    <span className="font-medium">Fertilización</span>
                  </button>
                }
              />
              <AddObservacionDialog
                defaultTipo="general"
                triggerContent={
                  <button className="flex items-center gap-2 h-8 px-3 rounded-md border bg-background text-sm whitespace-nowrap hover:bg-accent transition-colors">
                    <span className="text-base">📝</span>
                    <span className="font-medium">Observación</span>
                  </button>
                }
              />
            </div>
          </div>
 
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold">Últimas alertas</h2>
                <Link href="/alertas" className="text-xs text-primary">Ver todas</Link>
              </div>
              <div className="space-y-2">
                {alertsForList.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No hay alertas pendientes</p>
                ) : (
                  alertsForList.map((a) => (
                    <Link key={a.id} href="/alertas" className="block">
                      <div className="flex items-center gap-3 p-2 rounded-lg border bg-card hover:bg-muted transition-colors">
                        <div className="text-lg">🔔</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{a.titulo}</p>
                          {a.descripcion && (
                            <p className="text-[11px] text-muted-foreground truncate">{a.descripcion}</p>
                          )}
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">{a.prioridad}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Cultivos por etapa</h2>
              <Link href="/cultivos" className="text-xs text-primary">Ver cultivos</Link>
            </div>
            <CultivosEtapaChart data={cultivosPorEtapa} clickable />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
