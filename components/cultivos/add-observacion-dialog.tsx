"use client"

import type React from "react"

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
import { Textarea } from "@/components/ui/textarea"
import { Plus, Upload } from "lucide-react"
import { createObservacion } from "@/lib/actions/cultivos"
import { useToast } from "@/hooks/use-toast"

interface AddObservacionDialogProps {
  cultivoId: string
}

export function AddObservacionDialog({ cultivoId }: AddObservacionDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      
      // Call server action
      await createObservacion(cultivoId, formData)

      toast({
        title: "Observación agregada",
        description: "La observación ha sido registrada exitosamente",
      })

      // TODO: Subir fotos a Supabase Storage cuando esté conectado
      if (selectedFiles.length > 0) {
        console.log("[v0] Fotos pendientes de subir:", selectedFiles)
      }

      setOpen(false)
      setSelectedFiles([])
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creating observacion:", err)
      setError("No se pudo crear la observación. Intenta de nuevo.")
      toast({
        title: "Error",
        description: "No se pudo crear la observación. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Observación
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nueva Observación</DialogTitle>
          <DialogDescription>Registra el progreso y mediciones del cultivo.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el estado actual del cultivo..."
                required
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="altura_cm">Altura (cm)</Label>
                <Input id="altura_cm" name="altura_cm" type="number" step="0.1" placeholder="ej: 45.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ph">pH</Label>
                <Input id="ph" name="ph" type="number" step="0.1" min="0" max="14" placeholder="ej: 6.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="temperatura">Temperatura (°C)</Label>
                <Input id="temperatura" name="temperatura" type="number" step="0.1" placeholder="ej: 24.5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="humedad">Humedad (%)</Label>
                <Input id="humedad" name="humedad" type="number" step="0.1" min="0" max="100" placeholder="ej: 65" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fotos">Fotos</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <Input
                  id="fotos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Label htmlFor="fotos" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click para seleccionar fotos</p>
                </Label>
                {selectedFiles.length > 0 && (
                  <p className="text-sm mt-2">{selectedFiles.length} archivo(s) seleccionado(s)</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Observación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
