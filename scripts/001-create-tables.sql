-- FECANBO - Sistema de Gestión de Cultivos Medicinales
-- Script 1: Creación de tablas principales

-- Tabla de cultivadores (extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS cultivadores (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre_completo TEXT NOT NULL,
  documento TEXT,
  telefono TEXT,
  direccion TEXT,
  provincia TEXT DEFAULT 'Buenos Aires',
  ciudad TEXT,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo', 'suspendido')),
  es_admin BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabla de cultivos
CREATE TABLE IF NOT EXISTS cultivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivador_id UUID NOT NULL REFERENCES cultivadores(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  variedad TEXT,
  tipo TEXT CHECK (tipo IN ('indica', 'sativa', 'hibrida', 'ruderalis')),
  proposito TEXT DEFAULT 'medicinal' CHECK (proposito IN ('medicinal', 'investigacion', 'personal')),
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  fecha_estimada_cosecha DATE,
  estado_actual TEXT DEFAULT 'germinacion' CHECK (
    estado_actual IN ('germinacion', 'vegetativo', 'floracion', 'cosecha', 'secado', 'curado', 'finalizado')
  ),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  ubicacion_descripcion TEXT,
  metodo_cultivo TEXT CHECK (metodo_cultivo IN ('interior', 'exterior', 'invernadero', 'mixto')),
  medio_cultivo TEXT CHECK (medio_cultivo IN ('tierra', 'coco', 'hidroponico', 'aeroponico', 'mixto')),
  cantidad_plantas INTEGER DEFAULT 1,
  notas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de etapas del cultivo (historial de cambios de etapa)
CREATE TABLE IF NOT EXISTS cultivo_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivo_id UUID NOT NULL REFERENCES cultivos(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL CHECK (
    etapa IN ('germinacion', 'vegetativo', 'floracion', 'cosecha', 'secado', 'curado', 'finalizado')
  ),
  fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_fin TIMESTAMP WITH TIME ZONE,
  duracion_dias INTEGER,
  observaciones TEXT,
  fotos TEXT[], -- Array de URLs de fotos
  metricas JSONB DEFAULT '{}'::jsonb, -- altura, pH, EC, temperatura, humedad, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de alertas técnicas
CREATE TABLE IF NOT EXISTS alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivo_id UUID NOT NULL REFERENCES cultivos(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (
    tipo IN ('riego', 'poda', 'nutricion', 'control_plagas', 'defoliacion', 'transplante', 'cambio_fotoperiodo', 'cosecha', 'otro')
  ),
  prioridad TEXT DEFAULT 'media' CHECK (prioridad IN ('baja', 'media', 'alta', 'urgente')),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_programada TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_completada TIMESTAMP WITH TIME ZONE,
  completada BOOLEAN DEFAULT FALSE,
  recordatorio_dias_antes INTEGER DEFAULT 1,
  recurrente BOOLEAN DEFAULT FALSE,
  intervalo_dias INTEGER, -- Para alertas recurrentes
  creada_por UUID REFERENCES cultivadores(id),
  notas_completado TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de observaciones/registros diarios
CREATE TABLE IF NOT EXISTS observaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivo_id UUID NOT NULL REFERENCES cultivos(id) ON DELETE CASCADE,
  cultivador_id UUID NOT NULL REFERENCES cultivadores(id),
  fecha_observacion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tipo TEXT CHECK (tipo IN ('general', 'riego', 'nutricion', 'problema', 'mejora', 'foto')),
  descripcion TEXT NOT NULL,
  fotos TEXT[], -- Array de URLs
  temperatura DECIMAL(4, 1),
  humedad INTEGER,
  ph DECIMAL(3, 1),
  ec DECIMAL(4, 2), -- Conductividad eléctrica
  altura_cm DECIMAL(5, 1),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de usuarios finales (pacientes/receptores)
CREATE TABLE IF NOT EXISTS usuarios_finales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivador_id UUID NOT NULL REFERENCES cultivadores(id),
  nombre_completo TEXT NOT NULL,
  documento TEXT,
  telefono TEXT,
  email TEXT,
  condicion_medica TEXT,
  dosis_recomendada TEXT,
  notas TEXT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_registro TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de entregas
CREATE TABLE IF NOT EXISTS entregas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivo_id UUID NOT NULL REFERENCES cultivos(id) ON DELETE CASCADE,
  usuario_final_id UUID NOT NULL REFERENCES usuarios_finales(id),
  cultivador_id UUID NOT NULL REFERENCES cultivadores(id),
  fecha_entrega TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cantidad_gramos DECIMAL(8, 2) NOT NULL,
  tipo_producto TEXT CHECK (tipo_producto IN ('flor', 'aceite', 'extracto', 'otro')),
  lote TEXT,
  notas TEXT,
  firma_digital TEXT, -- Para trazabilidad legal
  comprobante_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cultivador_id UUID NOT NULL REFERENCES cultivadores(id),
  tipo TEXT NOT NULL CHECK (
    tipo IN ('alerta_vencida', 'alerta_proxima', 'cambio_etapa', 'problema_cultivo', 'sistema', 'entrega')
  ),
  titulo TEXT NOT NULL,
  mensaje TEXT,
  leida BOOLEAN DEFAULT FALSE,
  url_accion TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_cultivos_cultivador ON cultivos(cultivador_id);
CREATE INDEX IF NOT EXISTS idx_cultivos_estado ON cultivos(estado_actual);
CREATE INDEX IF NOT EXISTS idx_cultivos_activo ON cultivos(activo);
CREATE INDEX IF NOT EXISTS idx_etapas_cultivo ON cultivo_etapas(cultivo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_cultivo ON alertas(cultivo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_fecha ON alertas(fecha_programada);
CREATE INDEX IF NOT EXISTS idx_alertas_completada ON alertas(completada);
CREATE INDEX IF NOT EXISTS idx_observaciones_cultivo ON observaciones(cultivo_id);
CREATE INDEX IF NOT EXISTS idx_entregas_cultivo ON entregas(cultivo_id);
CREATE INDEX IF NOT EXISTS idx_entregas_usuario ON entregas(usuario_final_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_cultivador ON notificaciones(cultivador_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
