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
import { Plus } from "lucide-react"
import { createUsuarioFinal } from "@/lib/actions/usuarios"

export function CreateUsuarioDialog() {
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
      await createUsuarioFinal(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("[v0] Error creando usuario:", err)
      setError("No se pudo registrar el usuario. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Usuario Final</DialogTitle>
          <DialogDescription>Ingresa los datos del paciente que recibirá el cannabis medicinal.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                <Input id="nombre_completo" name="nombre_completo" placeholder="ej: María González" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documento">DNI *</Label>
                <Input id="documento" name="documento" placeholder="ej: 12345678" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="ej: maria@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono *</Label>
                <Input id="telefono" name="telefono" placeholder="ej: +54 11 1234-5678" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input id="direccion" name="direccion" placeholder="Calle, número, ciudad..." />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condicion_medica">Diagnóstico Médico *</Label>
              <Input id="condicion_medica" name="condicion_medica" placeholder="ej: Epilepsia refractaria" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Observaciones Médicas</Label>
              <Textarea
                id="notas"
                name="notas"
                placeholder="Información adicional sobre el tratamiento..."
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
              {loading ? "Registrando..." : "Registrar Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
