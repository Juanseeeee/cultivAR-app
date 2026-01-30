"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf } from "lucide-react"

export default function RegisterPage() {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nombre_completo: nombre,
          },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })

      if (error) throw error

      if (data.user) {
        // El trigger de base de datos creará automáticamente el registro en cultivadores
        if (data.session) {
          // Email confirmation está deshabilitado, redirigir directamente
          router.push("/dashboard")
          router.refresh()
        } else {
          // Requiere confirmación de email
          alert("Registro exitoso. Por favor verifica tu email para continuar.")
          router.push("/login")
        }
      }
    } catch (err: any) {
      console.error("[v0] Registration error:", err)
      
      // Handle rate limit error specifically
      if (err.status === 429 || err.code === "over_email_send_rate_limit") {
        setError(
          "Se ha excedido el límite de emails de verificación. " +
          "Si ya te registraste anteriormente, intenta iniciar sesión. " +
          "Si es tu primer registro, espera unos minutos y vuelve a intentar."
        )
      } else {
        setError(err.message || "Error al registrarse")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-md">
        <div className="bg-primary text-primary-foreground rounded-b-3xl shadow-sm px-6 pt-12 pb-16">
          <div className="mx-auto w-16 h-16 bg-primary-foreground/15 rounded-2xl flex items-center justify-center">
            <Leaf className="w-8 h-8" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Crear Cuenta</h1>
          <p className="text-sm opacity-90">Únete para gestionar tus cultivos</p>
        </div>
        <div className="-mt-10 px-4">
          <Card className="w-full border-0 shadow-lg rounded-2xl">
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4 pt-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre Completo</Label>
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button type="submit" className="w-full h-11 rounded-xl" disabled={loading}>
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 pb-6">
              <p className="text-sm text-muted-foreground text-center">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Inicia sesión aquí
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
