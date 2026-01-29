"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface EntregasChartProps {
  data: Array<{ mes: string; entregas: number; gramos: number }>
}

export function EntregasChart({ data }: EntregasChartProps) {
  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Entregas Mensuales</CardTitle>
          <CardDescription>Evolución de entregas y cantidad de producto en los últimos meses</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No hay datos de entregas aún</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">Entregas Mensuales</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Evolución de entregas y cantidad de producto en los últimos meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            entregas: {
              label: "Entregas",
              color: "hsl(var(--chart-2))",
            },
            gramos: {
              label: "Gramos",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[250px] sm:h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="mes" 
                className="text-[10px] sm:text-xs"
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis yAxisId="left" className="text-[10px] sm:text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-[10px] sm:text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="entregas"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="gramos"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
