"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ZoomIn, Download, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Photo {
  id: string
  url: string
  fecha: string
  descripcion?: string
}

interface PhotoGalleryProps {
  photos: Photo[]
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)

  if (photos.length === 0) {
    return null
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Dialog key={photo.id}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow overflow-hidden group">
                <CardContent className="p-0 relative">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.descripcion || "Foto del cultivo"}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  {photo.fecha && (
                    <div className="p-2 bg-background">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(photo.fecha), "d MMM yyyy", { locale: es })}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </DialogTrigger>
            <DialogContent className="max-w-4xl p-0">
              <div className="relative">
                <img
                  src={photo.url || "/placeholder.svg"}
                  alt={photo.descripcion || "Foto del cultivo"}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
                <div className="p-6 bg-background">
                  {photo.descripcion && <p className="text-lg mb-2">{photo.descripcion}</p>}
                  {photo.fecha && (
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(photo.fecha), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
                    </p>
                  )}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <a href={photo.url} download>
                        <Download className="h-4 w-4 mr-2" />
                        Descargar
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </>
  )
}
