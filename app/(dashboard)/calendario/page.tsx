"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { mockAlertas, mockCultivos } from "@/lib/mock-data"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from "date-fns"
import { es } from "date-fns/locale"

const prioridadColors = {
  baja: "bg-blue-500",
  media: "bg-yellow-500",
  alta: "bg-orange-500",
  urgente: "bg-red-500",
}

export default function CalendarioPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart, { locale: es })
  const calendarEnd = endOfWeek(monthEnd, { locale: es })
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getAlertasForDay = (date: Date) => {
    return mockAlertas.filter((alerta) => !alerta.completada && isSameDay(new Date(alerta.fecha_programada), date))
  }

  const selectedDayAlertas = getAlertasForDay(selectedDate)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendario de Cultivo</h1>
        <p className="text-muted-foreground mt-1">Vista cronológica de alertas y tareas programadas</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="capitalize">{format(currentDate, "MMMM yyyy", { locale: es })}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(new Date())}>
                  Hoy
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}

              {days.map((day, index) => {
                const alertas = getAlertasForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isSelected = isSameDay(day, selectedDate)
                const isToday = isSameDay(day, new Date())

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative min-h-[80px] p-2 rounded-lg border transition-colors text-left
                      ${!isCurrentMonth ? "bg-muted/30 text-muted-foreground" : "bg-card"}
                      ${isSelected ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"}
                      ${isToday && !isSelected ? "border-primary" : ""}
                    `}
                  >
                    <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary font-bold" : ""}`}>
                      {format(day, "d")}
                    </div>
                    <div className="space-y-1">
                      {alertas.slice(0, 3).map((alerta) => (
                        <div
                          key={alerta.id}
                          className={`h-1 rounded-full ${prioridadColors[alerta.prioridad]}`}
                          title={alerta.titulo}
                        />
                      ))}
                      {alertas.length > 3 && <div className="text-xs text-muted-foreground">+{alertas.length - 3}</div>}
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(selectedDate, "d MMMM yyyy", { locale: es })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDayAlertas.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground">No hay alertas programadas para este día</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDayAlertas.map((alerta) => {
                  const cultivo = mockCultivos.find((c) => c.id === alerta.cultivo_id)
                  return (
                    <div key={alerta.id} className="p-3 rounded-lg border bg-card space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                        <Badge
                          variant="outline"
                          className={
                            alerta.prioridad === "urgente"
                              ? "bg-red-500/10 text-red-700 border-red-200"
                              : alerta.prioridad === "alta"
                                ? "bg-orange-500/10 text-orange-700 border-orange-200"
                                : alerta.prioridad === "media"
                                  ? "bg-yellow-500/10 text-yellow-700 border-yellow-200"
                                  : "bg-blue-500/10 text-blue-700 border-blue-200"
                          }
                        >
                          {alerta.prioridad}
                        </Badge>
                      </div>
                      {alerta.descripcion && <p className="text-xs text-muted-foreground">{alerta.descripcion}</p>}
                      {cultivo && <p className="text-xs text-muted-foreground">Cultivo: {cultivo.nombre}</p>}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alerta.fecha_programada), "HH:mm")}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Próximos Eventos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlertas
              .filter((a) => !a.completada)
              .sort((a, b) => new Date(a.fecha_programada).getTime() - new Date(b.fecha_programada).getTime())
              .slice(0, 5)
              .map((alerta) => {
                const cultivo = mockCultivos.find((c) => c.id === alerta.cultivo_id)
                return (
                  <div key={alerta.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <h4 className="font-medium text-sm">{alerta.titulo}</h4>
                      {cultivo && <p className="text-xs text-muted-foreground mt-1">{cultivo.nombre}</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(alerta.fecha_programada), "d MMM", { locale: es })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(alerta.fecha_programada), "HH:mm")}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
