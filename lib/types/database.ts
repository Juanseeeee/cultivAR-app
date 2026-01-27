export type EstadoCultivo = "germinacion" | "vegetativo" | "floracion" | "cosecha" | "secado" | "curado" | "finalizado"

export type TipoAlerta =
  | "riego"
  | "poda"
  | "nutricion"
  | "control_plagas"
  | "defoliacion"
  | "transplante"
  | "cambio_fotoperiodo"
  | "cosecha"
  | "otro"

export type PrioridadAlerta = "baja" | "media" | "alta" | "urgente"

export interface Cultivador {
  id: string
  nombre_completo: string
  documento?: string
  telefono?: string
  direccion?: string
  provincia?: string
  ciudad?: string
  fecha_registro: string
  estado: "activo" | "inactivo" | "suspendido"
  es_admin: boolean
  metadata?: Record<string, any>
}

export interface Cultivo {
  id: string
  cultivador_id: string
  nombre: string
  variedad?: string
  tipo?: "indica" | "sativa" | "hibrida" | "ruderalis"
  proposito?: "medicinal" | "investigacion" | "personal"
  fecha_inicio: string
  fecha_estimada_cosecha?: string
  estado_actual: EstadoCultivo
  latitud?: number
  longitud?: number
  ubicacion_descripcion?: string
  metodo_cultivo?: "interior" | "exterior" | "invernadero" | "mixto"
  medio_cultivo?: "tierra" | "coco" | "hidroponico" | "aeroponico" | "mixto"
  cantidad_plantas: number
  notas?: string
  activo: boolean
  created_at: string
  updated_at: string
}

export interface CultivoEtapa {
  id: string
  cultivo_id: string
  etapa: EstadoCultivo
  fecha_inicio: string
  fecha_fin?: string
  duracion_dias?: number
  observaciones?: string
  fotos?: string[]
  metricas?: Record<string, any>
  created_at: string
}

export interface Alerta {
  id: string
  cultivo_id: string
  tipo: TipoAlerta
  prioridad: PrioridadAlerta
  titulo: string
  descripcion?: string
  fecha_programada: string
  fecha_completada?: string
  completada: boolean
  recordatorio_dias_antes: number
  recurrente: boolean
  intervalo_dias?: number
  creada_por?: string
  notas_completado?: string
  created_at: string
}

export interface Observacion {
  id: string
  cultivo_id: string
  cultivador_id: string
  fecha_observacion: string
  tipo?: "general" | "riego" | "nutricion" | "problema" | "mejora" | "foto"
  descripcion: string
  fotos?: string[]
  temperatura?: number
  humedad?: number
  ph?: number
  ec?: number
  altura_cm?: number
  tags?: string[]
  created_at: string
}

export interface UsuarioFinal {
  id: string
  cultivador_id: string
  nombre_completo: string
  documento?: string
  telefono?: string
  email?: string
  condicion_medica?: string
  dosis_recomendada?: string
  notas?: string
  activo: boolean
  fecha_registro: string
}

export interface Entrega {
  id: string
  cultivo_id: string
  usuario_final_id: string
  cultivador_id: string
  fecha_entrega: string
  cantidad_gramos: number
  tipo_producto?: "flor" | "aceite" | "extracto" | "otro"
  lote?: string
  notas?: string
  firma_digital?: string
  comprobante_url?: string
  created_at: string
}

export interface Notificacion {
  id: string
  cultivador_id: string
  tipo: "alerta_vencida" | "alerta_proxima" | "cambio_etapa" | "problema_cultivo" | "sistema" | "entrega"
  titulo: string
  mensaje?: string
  leida: boolean
  url_accion?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface EstadisticasCultivador {
  cultivador_id: string
  total_cultivos: number
  cultivos_activos: number
  cultivos_finalizados: number
  alertas_pendientes: number
  total_entregas: number
  total_gramos_entregados: number
  total_usuarios_finales: number
}
