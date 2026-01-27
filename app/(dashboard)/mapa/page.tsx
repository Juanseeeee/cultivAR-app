"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sprout } from "lucide-react"
import { mockCultivos } from "@/lib/mock-data"

export default function MapaPage() {
  const cultivosConUbicacion = mockCultivos.filter((c) => c.latitud && c.longitud && c.activo)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mapa de Cultivos</h1>
        <p className="text-muted-foreground mt-1">Visualiza la ubicación geográfica de todos tus cultivos</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="w-full h-[600px] bg-muted relative overflow-hidden rounded-lg">
            <iframe
              title="Mapa de cultivos"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-58.8,-35.5,-57.0,-34.0&layer=mapnik"
              style={{ border: 0 }}
            />
            <div className="absolute top-4 right-4 bg-background/95 backdrop-blur rounded-lg shadow-lg p-4 max-w-xs">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Cultivos Geolocalizados
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {cultivosConUbicacion.length} de {mockCultivos.filter((c) => c.activo).length} cultivos activos
              </p>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {cultivosConUbicacion.map((cultivo) => (
                  <div key={cultivo.id} className="p-2 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start gap-2">
                      <Sprout className="h-4 w-4 text-primary mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{cultivo.nombre}</p>
                        <p className="text-xs text-muted-foreground truncate">{cultivo.ubicacion_descripcion}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {cultivo.latitud?.toFixed(4)}, {cultivo.longitud?.toFixed(4)}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {cultivo.cantidad_plantas}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Geolocalización de Cultivos</h4>
              <p className="text-sm text-muted-foreground">
                Todos tus cultivos con coordenadas GPS aparecen en el mapa. Esto ayuda a mantener un registro preciso de
                las ubicaciones y facilita la trazabilidad para fines medicinales y legales.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sprout className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Añadir Ubicación a Cultivos</h4>
              <p className="text-sm text-muted-foreground">
                Al crear un nuevo cultivo, puedes usar tu ubicación actual o ingresar coordenadas manualmente. La
                geolocalización es opcional pero recomendada para mejor trazabilidad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
