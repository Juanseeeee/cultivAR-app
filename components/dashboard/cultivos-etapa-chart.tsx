"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface CultivosPorEtapaProps {
  data: Array<{ etapa: string; cantidad: number }>
}

export function CultivosEtapaChart({ data }: CultivosPorEtapaProps) {
  // Handle empty data
  const hasData = data && data.length > 0 && data.some(d => d.cantidad > 0)
  
  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cultivos por Etapa</CardTitle>
          <CardDescription>Distribución actual de cultivos según su fase de desarrollo</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No hay cultivos activos aún</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Cultivos por Etapa</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Distribución actual de cultivos según su fase de desarrollo</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={{
            cantidad: {
              label: "Cantidad",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[250px] sm:h-[300px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 0, right: 10, top: 10, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="etapa" 
                className="text-[10px] sm:text-xs"
                angle={-45}
                textAnchor="end"
                height={70}
                interval={0}
              />
              <YAxis className="text-[10px] sm:text-xs" width={30} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="cantidad" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} maxBarSize={60} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
