"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings } from "lucide-react"

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground mt-1">Ajusta las preferencias del sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración del Sistema
          </CardTitle>
          <CardDescription>Personaliza el comportamiento de FECANBO según tus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Las opciones de configuración estarán disponibles próximamente. Aquí podrás gestionar notificaciones,
            preferencias de usuario, integración con sistema 1780, y más.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
