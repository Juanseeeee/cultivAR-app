-- FECANBO - Functions and Triggers
-- Script 3: Funciones y triggers para automatización

-- Función para actualizar timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at en cultivos
CREATE TRIGGER update_cultivos_updated_at
  BEFORE UPDATE ON cultivos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para crear perfil de cultivador automáticamente
CREATE OR REPLACE FUNCTION create_cultivador_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO cultivadores (id, nombre_completo, metadata)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'),
    NEW.raw_user_meta_data
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil cuando se registra un usuario
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_cultivador_profile();

-- Función para crear notificación cuando se vence una alerta
CREATE OR REPLACE FUNCTION check_alertas_vencidas()
RETURNS void AS $$
BEGIN
  INSERT INTO notificaciones (cultivador_id, tipo, titulo, mensaje, metadata)
  SELECT 
    c.cultivador_id,
    'alerta_vencida',
    'Alerta vencida: ' || a.titulo,
    'La alerta programada para ' || a.fecha_programada::date || ' no fue completada.',
    jsonb_build_object('alerta_id', a.id, 'cultivo_id', a.cultivo_id)
  FROM alertas a
  JOIN cultivos c ON c.id = a.cultivo_id
  WHERE a.completada = FALSE
    AND a.fecha_programada < NOW()
    AND NOT EXISTS (
      SELECT 1 FROM notificaciones n
      WHERE n.metadata->>'alerta_id' = a.id::text
      AND n.tipo = 'alerta_vencida'
    );
END;
$$ LANGUAGE plpgsql;

-- Función para crear notificación de alertas próximas
CREATE OR REPLACE FUNCTION check_alertas_proximas()
RETURNS void AS $$
BEGIN
  INSERT INTO notificaciones (cultivador_id, tipo, titulo, mensaje, metadata)
  SELECT 
    c.cultivador_id,
    'alerta_proxima',
    'Recordatorio: ' || a.titulo,
    'Tienes una alerta programada para ' || a.fecha_programada::date || '.',
    jsonb_build_object('alerta_id', a.id, 'cultivo_id', a.cultivo_id)
  FROM alertas a
  JOIN cultivos c ON c.id = a.cultivo_id
  WHERE a.completada = FALSE
    AND a.fecha_programada::date = (CURRENT_DATE + (a.recordatorio_dias_antes || ' days')::interval)
    AND NOT EXISTS (
      SELECT 1 FROM notificaciones n
      WHERE n.metadata->>'alerta_id' = a.id::text
      AND n.tipo = 'alerta_proxima'
      AND n.created_at::date = CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;

-- Función para calcular duración de etapas cuando se cierra
CREATE OR REPLACE FUNCTION calcular_duracion_etapa()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.fecha_fin IS NOT NULL AND OLD.fecha_fin IS NULL THEN
    NEW.duracion_dias := EXTRACT(DAY FROM (NEW.fecha_fin - NEW.fecha_inicio));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular duración automáticamente
CREATE TRIGGER calculate_etapa_duracion
  BEFORE UPDATE ON cultivo_etapas
  FOR EACH ROW
  EXECUTE FUNCTION calcular_duracion_etapa();

-- Función para notificar cambio de etapa
CREATE OR REPLACE FUNCTION notificar_cambio_etapa()
RETURNS TRIGGER AS $$
DECLARE
  v_cultivador_id UUID;
BEGIN
  SELECT cultivador_id INTO v_cultivador_id
  FROM cultivos WHERE id = NEW.cultivo_id;
  
  INSERT INTO notificaciones (cultivador_id, tipo, titulo, mensaje, metadata)
  VALUES (
    v_cultivador_id,
    'cambio_etapa',
    'Cambio de etapa registrado',
    'El cultivo ha cambiado a la etapa: ' || NEW.etapa,
    jsonb_build_object('cultivo_id', NEW.cultivo_id, 'etapa', NEW.etapa)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para notificar cambios de etapa
CREATE TRIGGER notify_etapa_change
  AFTER INSERT ON cultivo_etapas
  FOR EACH ROW
  EXECUTE FUNCTION notificar_cambio_etapa();
