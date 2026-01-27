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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"
import { createAlerta } from "@/lib/actions/alertas"

export function CreateAlertaDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    
    // Generate a titulo from tipo
    const tipo = formData.get("tipo") as string
    const tipoLabels: Record<string, string> = {
      riego: "Riego",
      fertilizacion: "Fertilización",
      poda: "Poda",
      control_plagas: "Control de Plagas",
      cosecha: "Cosecha",
      general: "General"
    }
    formData.set("titulo", `Alerta de ${tipoLabels[tipo] || tipo}`)

    try {
      await createAlerta(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creando alerta:", err)
      setError("No se pudo crear la alerta. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Alerta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nueva Alerta</DialogTitle>
          <DialogDescription>Programa una alerta técnica para tus cultivos.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Alerta *</Label>
              <Select name="tipo" required>
                <SelectTrigger id="tipo">
                  <SelectValue placeholder="Selecciona..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riego">Riego</SelectItem>
                  <SelectItem value="fertilizacion">Fertilización</SelectItem>
                  <SelectItem value="poda">Poda</SelectItem>
                  <SelectItem value="control_plagas">Control de Plagas</SelectItem>
                  <SelectItem value="cosecha">Cosecha</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prioridad">Prioridad *</Label>
              <Select name="prioridad" required defaultValue="media">
                <SelectTrigger id="prioridad">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="baja">Baja</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_programada">Fecha Programada *</Label>
              <Input id="fecha_programada" name="fecha_programada" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe la tarea a realizar..."
                required
                rows={4}
              />
            </div>
          </div>
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive mb-4">
              {error}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Alerta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
