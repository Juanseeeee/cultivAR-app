"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { createEntrega } from "@/lib/actions/entregas"

interface Cultivo {
  id: string
  nombre: string
  variedad: string
}

interface Usuario {
  id: string
  nombre_completo: string
  documento: string
}

interface CreateEntregaDialogProps {
  cultivos?: Cultivo[]
  usuarios?: Usuario[]
}

export function CreateEntregaDialog({ cultivos = [], usuarios = [] }: CreateEntregaDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    try {
      await createEntrega(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creando entrega:", err)
      setError("No se pudo registrar la entrega. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Entrega
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar Entrega</DialogTitle>
          <DialogDescription>Documenta la entrega de cannabis medicinal al usuario final.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cultivo_id">Cultivo de Origen *</Label>
              <Select name="cultivo_id" required>
                <SelectTrigger id="cultivo_id">
                  <SelectValue placeholder="Selecciona el cultivo..." />
                </SelectTrigger>
                <SelectContent>
                  {cultivos.length > 0 ? (
                    cultivos.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.nombre || c.variedad}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hay cultivos disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usuario_final_id">Usuario Final *</Label>
              <Select name="usuario_final_id" required>
                <SelectTrigger id="usuario_final_id">
                  <SelectValue placeholder="Selecciona el usuario..." />
                </SelectTrigger>
                <SelectContent>
                  {usuarios.length > 0 ? (
                    usuarios.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.nombre_completo} (DNI: {u.documento})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No hay usuarios registrados
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo_producto">Tipo de Producto *</Label>
                <Select name="tipo_producto" required>
                  <SelectTrigger id="tipo_producto">
                    <SelectValue placeholder="Selecciona..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flores">Flores</SelectItem>
                    <SelectItem value="aceite">Aceite</SelectItem>
                    <SelectItem value="extracto">Extracto</SelectItem>
                    <SelectItem value="crema">Crema</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad_gramos">Cantidad (gramos) *</Label>
                <Input
                  id="cantidad_gramos"
                  name="cantidad_gramos"
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="ej: 50.0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lote">Número de Lote *</Label>
              <Input id="lote" name="lote" placeholder="ej: LOTE-2024-001" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas de Entrega</Label>
              <Textarea id="notas" name="notas" placeholder="Instrucciones de uso, recomendaciones..." rows={3} />
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
              {loading ? "Registrando..." : "Registrar Entrega"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
