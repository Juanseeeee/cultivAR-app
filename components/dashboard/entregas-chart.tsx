"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface EntregasChartProps {
  data: Array<{ mes: string; entregas: number; gramos: number }>
}

export function EntregasChart({ data }: EntregasChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entregas</CardTitle>
          <CardDescription>Sin datos disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[120px] items-center justify-center">
          <p className="text-muted-foreground">No hay datos de entregas aún</p>
        </CardContent>
      </Card>
    )
  }

  const last = data[data.length - 1]
  const prev = data[data.length - 2] || { entregas: 0, gramos: 0 }
  const deltaEntregas = last.entregas - prev.entregas
  const deltaGramos = last.gramos - prev.gramos

  const recent = data.slice(-3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">Entregas</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Último mes y tendencia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px]">📦 Entregas (último mes)</div>
            <div className="text-lg font-bold">{last.entregas}</div>
            <div className="text-[11px] text-muted-foreground">
              {deltaEntregas >= 0 ? "▲" : "▼"} {Math.abs(deltaEntregas)} vs mes anterior
            </div>
          </div>
          <div className="rounded-lg border bg-card px-3 py-2">
            <div className="text-[11px]">⚖️ Gramos (último mes)</div>
            <div className="text-lg font-bold">{last.gramos}g</div>
            <div className="text-[11px] text-muted-foreground">
              {deltaGramos >= 0 ? "▲" : "▼"} {Math.abs(deltaGramos)}g vs mes anterior
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card px-3 py-2">
          <div className="text-[11px] mb-1">📅 Últimos 3 meses</div>
          <div className="grid grid-cols-3 gap-2">
            {recent.map((m) => (
              <div key={m.mes} className="rounded border px-2 py-1">
                <div className="text-[10px]">{m.mes}</div>
                <div className="text-[11px]">📦 {m.entregas}</div>
                <div className="text-[11px]">⚖️ {m.gramos}g</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
