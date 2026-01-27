"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddObservacionDialog } from "@/components/cultivos/add-observacion-dialog"
import { EditCultivoDialog } from "@/components/cultivos/edit-cultivo-dialog"
import { LocationMap } from "@/components/maps/location-map"
import { PhotoGallery } from "@/components/photos/photo-gallery"
import { PhotoUpload } from "@/components/photos/photo-upload"
import { ArrowLeft, MapPin, Edit, Trash2 } from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { CultivoTimeline } from "@/components/cultivos/cultivo-timeline"
import { ObservacionesList } from "@/components/cultivos/observaciones-list"
import { ExportButton } from "@/components/cultivos/export-button"
import { deleteCultivo, createObservacion } from "@/lib/actions/cultivos"
import { useToast } from "@/hooks/use-toast"

const estadoColors: Record<string, string> = {
  germinacion: "bg-yellow-500/10 text-yellow-700 border-yellow-200",
  vegetativo: "bg-green-500/10 text-green-700 border-green-200",
  floracion: "bg-purple-500/10 text-purple-700 border-purple-200",
  cosecha: "bg-orange-500/10 text-orange-700 border-orange-200",
  secado: "bg-amber-500/10 text-amber-700 border-amber-200",
  curado: "bg-blue-500/10 text-blue-700 border-blue-200",
  finalizado: "bg-gray-500/10 text-gray-700 border-gray-200",
}

const estadoLabels: Record<string, string> = {
  germinacion: "Germinación",
  vegetativo: "Vegetativo",
  floracion: "Floración",
  cosecha: "Cosecha",
  secado: "Secado",
  curado: "Curado",
  finalizado: "Finalizado",
}

interface Cultivo {
  id: string
  nombre: string
  variedad: string
  estado_actual: string
  cantidad_plantas: number
  fecha_inicio: string
  fecha_estimada_cosecha?: string | null
  metodo_cultivo?: string | null
  medio_cultivo?: string | null
  ubicacion_descripcion?: string | null
  latitud?: number | null
  longitud?: number | null
  notas?: string | null
}

interface Observacion {
  id: string
  cultivo_id: string
  descripcion: string
  fecha?: string
  created_at: string
  foto_url?: string | null
}

interface Etapa {
  id: string
  cultivo_id: string
  etapa: string
  fecha_inicio: string
  fecha_fin?: string | null
}

interface CultivoDetailClientProps {
  cultivo: Cultivo
  observaciones: Observacion[]
  etapas: Etapa[]
}

export function CultivoDetailClient({ cultivo, observaciones, etapas }: CultivoDetailClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([])
  const [isSavingPhotos, setIsSavingPhotos] = useState(false)

  const diasDesdeInicio = differenceInDays(new Date(), new Date(cultivo.fecha_inicio))
  const diasHastaCosecha = cultivo.fecha_estimada_cosecha
    ? differenceInDays(new Date(cultivo.fecha_estimada_cosecha), new Date())
    : null

  const etapasOrder = ["germinacion", "vegetativo", "floracion", "cosecha", "secado", "curado", "finalizado"]
  const etapaActualIndex = etapasOrder.indexOf(cultivo.estado_actual)
  const progreso = ((etapaActualIndex + 1) / etapasOrder.length) * 100

  const photos = observaciones
    .filter((obs) => obs.foto_url)
    .map((obs) => ({
      id: obs.id,
      url: obs.foto_url!,
      fecha: obs.fecha || obs.created_at,
      descripcion: obs.descripcion,
    }))

  const handlePhotoUpload = (files: File[]) => {
    console.log("[v0] Photos selected:", files)
    setUploadedPhotos(files)
  }

  const handleSavePhotos = async () => {
    if (uploadedPhotos.length === 0) return
    
    setIsSavingPhotos(true)
    try {
      // Create an observation with the photos
      const formData = new FormData()
      formData.append("descripcion", `${uploadedPhotos.length} foto(s) subida(s) el ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`)
      
      // TODO: Upload photos to Supabase Storage when connected
      // For now, create the observation without photo URLs
      await createObservacion(cultivo.id, formData)
      
      toast({
        title: "Fotos guardadas",
        description: `Se han registrado ${uploadedPhotos.length} foto(s) exitosamente`,
      })
      
      setUploadedPhotos([])
      router.refresh()
    } catch (error) {
      console.error("[v0] Error saving photos:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar las fotos. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSavingPhotos(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteCultivo(cultivo.id)
      toast({
        title: "Cultivo eliminado",
        description: "El cultivo ha sido eliminado exitosamente",
      })
      router.push("/cultivos")
    } catch (error) {
      console.error("[v0] Error deleting cultivo:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el cultivo. Intenta de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleEdit = () => {
    setShowEditDialog(true)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header for mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        <Button variant="ghost" size="sm" className="self-start" onClick={() => router.push("/cultivos")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{cultivo.nombre}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{cultivo.variedad}</p>
        </div>
        <div className="flex gap-2">
          <ExportButton cultivo={cultivo} className="flex-1" />
          <Button variant="outline" size="sm" onClick={handleEdit} className="flex-1 bg-transparent">
            <Edit className="h-4 w-4 mr-1.5" />
            <span className="hidden xs:inline">Editar</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      {/* Header for desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/cultivos")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{cultivo.nombre}</h1>
          <p className="text-muted-foreground mt-1">{cultivo.variedad}</p>
        </div>
        <ExportButton cultivo={cultivo} />
        <Button variant="outline" size="icon" onClick={handleEdit}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar cultivo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará permanentemente el cultivo "{cultivo.nombre}" y todos sus registros asociados (observaciones, fotos, etapas).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditCultivoDialog 
        open={showEditDialog} 
        onOpenChange={setShowEditDialog} 
        cultivo={cultivo} 
      />

      {/* Status Badge and Progress */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Badge variant="outline" className={`${estadoColors[cultivo.estado_actual]} border px-3 py-1`}>
          {estadoLabels[cultivo.estado_actual]}
        </Badge>
        <div className="flex-1 w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progreso</span>
            <span className="font-medium">{Math.round(progreso)}%</span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Plantas</CardDescription>
            <CardTitle className="text-3xl">{cultivo.cantidad_plantas}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Días desde inicio</CardDescription>
            <CardTitle className="text-3xl">{diasDesdeInicio}</CardTitle>
          </CardHeader>
        </Card>
        {diasHastaCosecha !== null && (
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Días para cosecha</CardDescription>
              <CardTitle className="text-3xl">{diasHastaCosecha > 0 ? diasHastaCosecha : "Listo"}</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>

      {/* Detalles del cultivo */}
      <Card>
        <CardHeader>
          <CardTitle>Detalles del Cultivo</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Fecha de inicio</p>
            <p className="font-medium">{format(new Date(cultivo.fecha_inicio), "d 'de' MMMM, yyyy", { locale: es })}</p>
          </div>
          {cultivo.metodo_cultivo && (
            <div>
              <p className="text-sm text-muted-foreground">Método de cultivo</p>
              <p className="font-medium capitalize">{cultivo.metodo_cultivo}</p>
            </div>
          )}
          {cultivo.medio_cultivo && (
            <div>
              <p className="text-sm text-muted-foreground">Medio de cultivo</p>
              <p className="font-medium capitalize">{cultivo.medio_cultivo}</p>
            </div>
          )}
          {cultivo.ubicacion_descripcion && (
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Ubicación</p>
              <p className="font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {cultivo.ubicacion_descripcion}
              </p>
            </div>
          )}
          {cultivo.notas && (
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground">Notas</p>
              <p className="font-medium">{cultivo.notas}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mapa de ubicación */}
      {cultivo.latitud && cultivo.longitud && (
        <Card>
          <CardHeader>
            <CardTitle>Ubicación</CardTitle>
            <CardDescription>Ubicación geográfica del cultivo</CardDescription>
          </CardHeader>
          <CardContent>
            <LocationMap 
              latitude={cultivo.latitud} 
              longitude={cultivo.longitud}
              label={cultivo.nombre}
            />
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="timeline" className="text-xs sm:text-sm px-2 py-2.5">
            <span className="hidden sm:inline">Linea de Tiempo</span>
            <span className="sm:hidden">Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="observaciones" className="text-xs sm:text-sm px-2 py-2.5">
            <span className="hidden sm:inline">Observaciones</span>
            <span className="sm:hidden">Obs.</span>
          </TabsTrigger>
          <TabsTrigger value="fotos" className="text-xs sm:text-sm px-2 py-2.5">
            Fotos ({photos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          <CultivoTimeline cultivoId={cultivo.id} etapas={etapas} />
        </TabsContent>

        <TabsContent value="observaciones" className="space-y-4">
          <div className="flex justify-end">
            <AddObservacionDialog cultivoId={cultivo.id} />
          </div>
          <ObservacionesList cultivoId={cultivo.id} observaciones={observaciones} />
        </TabsContent>

        <TabsContent value="fotos" className="space-y-4">
          <PhotoUpload 
            onUpload={handlePhotoUpload} 
            onSave={handleSavePhotos}
            maxFiles={10} 
            maxSizeMB={10} 
          />
          <PhotoGallery photos={photos} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
