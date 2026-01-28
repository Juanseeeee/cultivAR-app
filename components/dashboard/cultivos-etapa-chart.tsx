 "use client"
 
 import Link from "next/link"
 import Image from "next/image"
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
 
 interface CultivosPorEtapaProps {
   data: Array<{ etapa: string; cantidad: number }>
   clickable?: boolean
 }
 
 const etapaSlugMap: Record<string, string> = {
   "Germinación": "germinacion",
   "Vegetativo": "vegetativo",
   "Floración": "floracion",
   "Cosecha": "cosecha",
   "Secado": "secado",
 }
 
 const etapaImageMap: Record<string, string> = {
  "Germinación": "/germinacion.jpg",
  "Vegetativo": "/vegetativo.jpg",
  "Floración": "/floracion.png",
  "Cosecha": "/cosecha.jpg",
  "Secado": "/secado.jpeg",
 }
 
 export function CultivosEtapaChart({ data, clickable = false }: CultivosPorEtapaProps) {
   const hasData = data && data.length > 0 && data.some(d => d.cantidad >= 0)
   
   if (!hasData) {
     return (
       <Card>
         <CardHeader>
           <CardTitle>Cultivos por Etapa</CardTitle>
           <CardDescription>Distribución actual de cultivos según su fase de desarrollo</CardDescription>
         </CardHeader>
         <CardContent className="flex h-[160px] items-center justify-center">
           <p className="text-muted-foreground">No hay cultivos activos aún</p>
         </CardContent>
       </Card>
     )
   }
 
  const byName: Record<string, { etapa: string; cantidad: number } | undefined> = {}
  for (const d of data) byName[d.etapa] = d
  const order = ["Germinación", "Vegetativo", "Floración", "Cosecha", "Secado"]
  const list = order.map(name => byName[name] || { etapa: name, cantidad: 0 })
  const renderCard = (d: { etapa: string; cantidad: number }, fullWidth = false) => {
    const slug = etapaSlugMap[d.etapa] || ""
    const imageSrc = etapaImageMap[d.etapa] || etapaImageMap["Germinación"]
    const content = (
      <Card className="overflow-hidden rounded-2xl border bg-muted p-0 gap-0">
        <div className={`relative w-full ${fullWidth ? "h-28 sm:h-36" : "h-24 sm:h-28"}`}>
          <Image
            src={imageSrc}
            alt={`Etapa ${d.etapa}`}
            fill
            className="object-cover w-full h-full"
            sizes="(max-width: 768px) 100vw, 600px"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          <div className="absolute left-3 top-3">
            <span className="text-xs sm:text-sm font-semibold text-white">{d.etapa}</span>
          </div>
          <div className="absolute right-3 bottom-3">
            <span className="text-xs sm:text-sm font-medium text-white">
              {d.cantidad > 0 ? `${d.cantidad} activos` : "Sin activos"}
            </span>
          </div>
        </div>
      </Card>
    )
    return clickable && slug ? <Link href={`/cultivos?estado=${slug}`} className="block">{content}</Link> : content
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      <div>{renderCard(list[0])}</div>
      <div>{renderCard(list[1])}</div>
      <div className="col-span-2">{renderCard(list[2], true)}</div>
      <div>{renderCard(list[3])}</div>
      <div>{renderCard(list[4])}</div>
    </div>
  )
 }
