"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LocationMapProps {
  latitude: number
  longitude: number
  title?: string
  address?: string
}

export function LocationMap({ latitude, longitude, title, address }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapError, setMapError] = useState(false)

  useEffect(() => {
    // TODO: Integrar con Google Maps o Leaflet cuando el usuario lo requiera
    // Por ahora mostramos un mapa estático de OpenStreetMap
    console.log("[v0] Map coordinates:", { latitude, longitude })
  }, [latitude, longitude])

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps?q=${latitude},${longitude}`, "_blank")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {title || "Ubicación del Cultivo"}
          </CardTitle>
          <Button variant="outline" size="sm" onClick={openInGoogleMaps}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Abrir en Maps
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {address && <p className="text-sm text-muted-foreground mb-4">{address}</p>}
        <div
          ref={mapRef}
          className="w-full h-[300px] rounded-lg overflow-hidden bg-muted flex items-center justify-center relative"
        >
          {!mapError ? (
            <iframe
              title="Mapa de ubicación"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`}
              style={{ border: 0 }}
              onError={() => setMapError(true)}
            />
          ) : (
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">No se pudo cargar el mapa</p>
              <p className="text-xs text-muted-foreground">
                Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
              <Button variant="outline" size="sm" className="mt-4 bg-transparent" onClick={openInGoogleMaps}>
                Ver en Google Maps
              </Button>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Lat: {latitude.toFixed(6)}, Lon: {longitude.toFixed(6)}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
