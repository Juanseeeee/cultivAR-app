"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Navigation } from "lucide-react"

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void
  initialLat?: number
  initialLng?: number
}

export function LocationPicker({ onLocationSelect, initialLat, initialLng }: LocationPickerProps) {
  const [latitude, setLatitude] = useState(initialLat?.toString() || "")
  const [longitude, setLongitude] = useState(initialLng?.toString() || "")
  const [loading, setLoading] = useState(false)

  const getCurrentLocation = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          setLatitude(lat.toString())
          setLongitude(lng.toString())
          onLocationSelect(lat, lng)
          setLoading(false)
        },
        (error) => {
          console.error("[v0] Error getting location:", error)
          alert("No se pudo obtener la ubicación. Por favor, ingresa las coordenadas manualmente.")
          setLoading(false)
        },
      )
    } else {
      alert("Tu navegador no soporta geolocalización")
      setLoading(false)
    }
  }

  const handleManualUpdate = () => {
    const lat = Number.parseFloat(latitude)
    const lng = Number.parseFloat(longitude)
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      onLocationSelect(lat, lng)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          disabled={loading}
          className="flex-1 bg-transparent"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {loading ? "Obteniendo ubicación..." : "Usar Mi Ubicación"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitud</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="-34.9214"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            onBlur={handleManualUpdate}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitud</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-57.9544"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            onBlur={handleManualUpdate}
          />
        </div>
      </div>

      {latitude && longitude && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            Ubicación: {Number.parseFloat(latitude).toFixed(6)}, {Number.parseFloat(longitude).toFixed(6)}
          </span>
        </div>
      )}
    </div>
  )
}
