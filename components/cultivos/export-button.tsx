"use client"

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { generateCultivoPDF } from "@/lib/pdf-generator-real"
import type { Cultivo } from "@/lib/types/database"
import { cn } from "@/lib/utils"

interface ExportButtonProps {
  cultivo: Cultivo
  className?: string
}

export function ExportButton({ cultivo, className }: ExportButtonProps) {
  const handleExport = () => {
    generateCultivoPDF(cultivo)
  }

  return (
    <Button variant="outline" onClick={handleExport} size="sm" className={cn(className)}>
      <Download className="h-4 w-4 mr-1.5" />
      <span className="hidden xs:inline">Exportar</span>
      <span className="xs:hidden">PDF</span>
    </Button>
  )
}
