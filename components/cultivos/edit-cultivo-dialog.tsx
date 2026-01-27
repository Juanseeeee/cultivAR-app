"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateCultivo } from "@/lib/actions/cultivos"
import { useToast } from "@/hooks/use-toast"
import type { Cultivo } from "@/lib/types/database"

interface EditCultivoDialogProps {
  cultivo: Cultivo
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCultivoDialog({ cultivo, open, onOpenChange }: EditCultivoDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      await updateCultivo(cultivo.id, formData)
      toast({
        title: "Cultivo actualizado",
        description: "Los cambios han sido guardados exitosamente",
      })
      onOpenChange(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error updating cultivo:", err)
      setError("No se pudo actualizar el cultivo. Intenta de nuevo.")
      toast({
        title: "Error",
        description: "No se pudo actualizar el cultivo. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Cultivo</DialogTitle>
          <DialogDescription>Modifica los datos del cultivo "{cultivo.nombre}"</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del cultivo *</Label>
              <Input id="nombre" name="nombre" defaultValue={cultivo.nombre} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="variedad">Variedad *</Label>
              <Input id="variedad" name="variedad" defaultValue={cultivo.variedad} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad_plantas">Cantidad de plantas *</Label>
              <Input
                id="cantidad_plantas"
                name="cantidad_plantas"
                type="number"
                min="1"
                defaultValue={cultivo.cantidad_plantas}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo_cultivo">Método de cultivo</Label>
              <Select name="metodo_cultivo" defaultValue={cultivo.metodo_cultivo || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interior">Interior</SelectItem>
                  <SelectItem value="exterior">Exterior</SelectItem>
                  <SelectItem value="invernadero">Invernadero</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medio_cultivo">Medio de cultivo</Label>
              <Select name="medio_cultivo" defaultValue={cultivo.medio_cultivo || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tierra">Tierra</SelectItem>
                  <SelectItem value="hidroponico">Hidropónico</SelectItem>
                  <SelectItem value="aeroponico">Aeropónico</SelectItem>
                  <SelectItem value="coco">Coco</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ubicacion_descripcion">Ubicación</Label>
              <Input
                id="ubicacion_descripcion"
                name="ubicacion_descripcion"
                defaultValue={cultivo.ubicacion_descripcion || ""}
                placeholder="Ej: Sala de cultivo 1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notas">Notas adicionales</Label>
            <Textarea
              id="notas"
              name="notas"
              rows={3}
              defaultValue={cultivo.notas || ""}
              placeholder="Observaciones, objetivos, etc."
            />
          </div>

          {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
