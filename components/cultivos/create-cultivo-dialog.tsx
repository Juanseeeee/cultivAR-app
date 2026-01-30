"use client"

import type React from "react"
//agunte la mariwana
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { createCultivo } from "@/lib/actions/cultivos"

export function CreateCultivoDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Generate a name from variedad if not provided
    const variedad = formData.get("variedad") as string
    if (!formData.get("nombre")) {
      formData.set("nombre", `Cultivo ${variedad} - ${new Date().toLocaleDateString()}`)
    }

    try {
      await createCultivo(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creando cultivo:", err)
      setError("No se pudo crear el cultivo. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Cultivo
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cultivo</DialogTitle>
          <DialogDescription>Ingresa los datos del nuevo cultivo comunitario.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="variedad">Variedad *</Label>
                <Input id="variedad" name="variedad" placeholder="ej: Critical Kush" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad_plantas">Cantidad de Plantas *</Label>
                <Input
                  id="cantidad_plantas"
                  name="cantidad_plantas"
                  type="number"
                  min="1"
                  placeholder="ej: 10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion">Ubicación *</Label>
              <Input id="ubicacion" name="ubicacion" placeholder="ej: La Plata, Buenos Aires" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitud">Latitud (opcional)</Label>
                <Input id="latitud" name="latitud" type="number" step="any" placeholder="ej: -34.9214" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitud">Longitud (opcional)</Label>
                <Input id="longitud" name="longitud" type="number" step="any" placeholder="ej: -57.9544" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_cultivo">Tipo de Cultivo *</Label>
                <Select name="tipo_cultivo" required>
                  <SelectTrigger id="tipo_cultivo">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="indoor">Indoor</SelectItem>
                    <SelectItem value="outdoor">Outdoor</SelectItem>
                    <SelectItem value="greenhouse">Greenhouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo">Método de Cultivo *</Label>
                <Select name="metodo" required>
                  <SelectTrigger id="metodo">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tierra">Tierra</SelectItem>
                    <SelectItem value="hidroponico">Hidropónico</SelectItem>
                    <SelectItem value="aeroponico">Aeropónico</SelectItem>
                    <SelectItem value="coco">Coco</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas Adicionales</Label>
              <Textarea id="notas" name="notas" placeholder="Información adicional sobre el cultivo..." rows={4} />
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Cultivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
