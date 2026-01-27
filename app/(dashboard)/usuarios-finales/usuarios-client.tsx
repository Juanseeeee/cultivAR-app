"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { CreateUsuarioDialog } from "@/components/usuarios/create-usuario-dialog"
import { Search, Users, Mail, Phone, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Usuario {
  id: string
  nombre_completo: string
  documento: string
  email: string
  telefono: string
  direccion: string
  condicion_medica: string
  dosis_recomendada: string
  activo: boolean
  fecha_registro: string
}

export function UsuariosClient({ usuarios }: { usuarios: Usuario[] }) {
  const [searchQuery, setSearchQuery] = useState("")

  const usuariosFiltrados = usuarios.filter(
    (usuario) =>
      usuario.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      usuario.condicion_medica?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios Finales</h1>
          <p className="text-muted-foreground mt-1">Gestiona pacientes y receptores de cannabis medicinal</p>
        </div>
        <CreateUsuarioDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre o condicion medica..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{usuarios.filter((u) => u.activo).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Activos</p>
          </CardContent>
        </Card>
      </div>

      {usuariosFiltrados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchQuery ? "Intenta ajustar los filtros de busqueda" : "Comienza agregando un usuario final"}
            </p>
            {!searchQuery && <CreateUsuarioDialog />}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {usuariosFiltrados.map((usuario) => (
            <Card key={usuario.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold leading-tight">{usuario.nombre_completo}</h3>
                      {usuario.documento && <p className="text-sm text-muted-foreground">DNI: {usuario.documento}</p>}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200">
                    Activo
                  </Badge>
                </div>

                <div className="space-y-3">
                  {usuario.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{usuario.email}</span>
                    </div>
                  )}

                  {usuario.telefono && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{usuario.telefono}</span>
                    </div>
                  )}

                  {usuario.condicion_medica && (
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Condicion Medica</p>
                      <p className="text-sm font-medium">{usuario.condicion_medica}</p>
                    </div>
                  )}

                  {usuario.dosis_recomendada && (
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-1">Dosis Recomendada</p>
                      <p className="text-sm">{usuario.dosis_recomendada}</p>
                    </div>
                  )}

                  <div className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Registrado{" "}
                      {usuario.fecha_registro
                        ? format(new Date(usuario.fecha_registro), "MMM yyyy", { locale: es })
                        : "Recientemente"}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8">
                      <FileText className="h-3 w-3 mr-1" />
                      Ver Historial
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
