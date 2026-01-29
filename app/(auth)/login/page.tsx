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

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      console.log("[v0] Attempting login...")
      
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("[v0] Login result:", { 
        hasUser: !!data.user, 
        hasSession: !!data.session,
        error: error?.message 
      })

      if (error) throw error

      if (data.user && data.session) {
        console.log("[v0] Login successful, redirecting to dashboard...")
        
        // Wait a bit for cookies to be set, then redirect
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Use router push with refresh
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err: any) {
      console.error("[v0] Login error:", err)
      
      // Provide user-friendly error messages
      if (err.message?.includes("Invalid login credentials")) {
        setError("Email o contraseña incorrectos. Verifica tus datos e intenta de nuevo.")
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Por favor verifica tu email antes de iniciar sesión. Revisa tu bandeja de entrada.")
      } else {
        setError(err.message || "Error al iniciar sesión")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Leaf className="w-7 h-7 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">FECANBO</CardTitle>
          <CardDescription>Sistema de Gestión de Cultivos Medicinales</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Regístrate aquí
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
