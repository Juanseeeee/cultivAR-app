"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Check } from "lucide-react"

interface PhotoUploadProps {
  onUpload: (files: File[]) => void
  onSave?: () => void
  maxFiles?: number
  maxSizeMB?: number
}

export function PhotoUpload({ onUpload, onSave, maxFiles = 10, maxSizeMB = 10 }: PhotoUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    // Validar cantidad
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Solo puedes subir un máximo de ${maxFiles} fotos`)
      return
    }

    // Validar tamaño
    const maxSize = maxSizeMB * 1024 * 1024
    const invalidFiles = files.filter((file) => file.size > maxSize)
    if (invalidFiles.length > 0) {
      alert(`Algunas fotos superan el tamaño máximo de ${maxSizeMB}MB`)
      return
    }

    // Validar tipo
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/heic"]
    const invalidTypes = files.filter((file) => !validTypes.includes(file.type))
    if (invalidTypes.length > 0) {
      alert("Solo se permiten archivos JPG, PNG, WEBP y HEIC")
      return
    }

    // Crear previews
    const newPreviews = files.map((file) => URL.createObjectURL(file))

    setSelectedFiles([...selectedFiles, ...files])
    setPreviews([...previews, ...newPreviews])
    onUpload([...selectedFiles, ...files])
  }

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index])
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
    setPreviews(previews.filter((_, i) => i !== index))
    onUpload(selectedFiles.filter((_, i) => i !== index))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSave = async () => {
    if (selectedFiles.length === 0) return
    
    setIsSaving(true)
    try {
      if (onSave) {
        await onSave()
      }
      // Clear after save
      selectedFiles.forEach((_, index) => URL.revokeObjectURL(previews[index]))
      setSelectedFiles([])
      setPreviews([])
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Seleccionar fotos"
      />

      <Card className="border-2 border-dashed hover:border-primary/50 transition-colors cursor-pointer">
        <CardContent className="p-8" onClick={triggerFileInput}>
          <div className="flex flex-col items-center justify-center text-center">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold mb-2">Haz clic para subir fotos</h3>
            <p className="text-sm text-muted-foreground mb-1">o arrastra y suelta archivos aquí</p>
            <p className="text-xs text-muted-foreground">JPG, PNG, WEBP o HEIC (máx. {maxSizeMB}MB cada una)</p>
          </div>
        </CardContent>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {selectedFiles.length} {selectedFiles.length === 1 ? "foto seleccionada" : "fotos seleccionadas"}
            </p>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              size="sm"
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              {isSaving ? "Guardando..." : "Guardar Fotos"}
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white text-xs p-1 rounded truncate">
                  {selectedFiles[index].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
