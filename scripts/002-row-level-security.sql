-- FECANBO - Row Level Security Policies
-- Script 2: Configuración de seguridad a nivel de fila

-- Habilitar RLS en todas las tablas
ALTER TABLE cultivadores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultivo_etapas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE observaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_finales ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Políticas para cultivadores
CREATE POLICY "Los cultivadores pueden ver su propio perfil"
  ON cultivadores FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los cultivadores pueden actualizar su propio perfil"
  ON cultivadores FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Los admins pueden ver todos los cultivadores"
  ON cultivadores FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cultivadores
      WHERE id = auth.uid() AND es_admin = TRUE
    )
  );

-- Políticas para cultivos
CREATE POLICY "Los cultivadores pueden ver sus propios cultivos"
  ON cultivos FOR SELECT
  USING (cultivador_id = auth.uid());

CREATE POLICY "Los cultivadores pueden crear cultivos"
  ON cultivos FOR INSERT
  WITH CHECK (cultivador_id = auth.uid());

CREATE POLICY "Los cultivadores pueden actualizar sus propios cultivos"
  ON cultivos FOR UPDATE
  USING (cultivador_id = auth.uid());

CREATE POLICY "Los cultivadores pueden eliminar sus propios cultivos"
  ON cultivos FOR DELETE
  USING (cultivador_id = auth.uid());

-- Políticas para etapas
CREATE POLICY "Ver etapas de cultivos propios"
  ON cultivo_etapas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = cultivo_etapas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

CREATE POLICY "Crear etapas en cultivos propios"
  ON cultivo_etapas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = cultivo_etapas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

CREATE POLICY "Actualizar etapas de cultivos propios"
  ON cultivo_etapas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = cultivo_etapas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

-- Políticas para alertas
CREATE POLICY "Ver alertas de cultivos propios"
  ON alertas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = alertas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

CREATE POLICY "Crear alertas en cultivos propios"
  ON alertas FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = alertas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

CREATE POLICY "Actualizar alertas de cultivos propios"
  ON alertas FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = alertas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

CREATE POLICY "Eliminar alertas de cultivos propios"
  ON alertas FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM cultivos
      WHERE cultivos.id = alertas.cultivo_id
      AND cultivos.cultivador_id = auth.uid()
    )
  );

-- Políticas para observaciones
CREATE POLICY "Ver observaciones de cultivos propios"
  ON observaciones FOR SELECT
  USING (cultivador_id = auth.uid());

CREATE POLICY "Crear observaciones"
  ON observaciones FOR INSERT
  WITH CHECK (cultivador_id = auth.uid());

CREATE POLICY "Actualizar observaciones propias"
  ON observaciones FOR UPDATE
  USING (cultivador_id = auth.uid());

CREATE POLICY "Eliminar observaciones propias"
  ON observaciones FOR DELETE
  USING (cultivador_id = auth.uid());

-- Políticas para usuarios finales
CREATE POLICY "Ver usuarios finales propios"
  ON usuarios_finales FOR SELECT
  USING (cultivador_id = auth.uid());

CREATE POLICY "Crear usuarios finales"
  ON usuarios_finales FOR INSERT
  WITH CHECK (cultivador_id = auth.uid());

CREATE POLICY "Actualizar usuarios finales propios"
  ON usuarios_finales FOR UPDATE
  USING (cultivador_id = auth.uid());

CREATE POLICY "Eliminar usuarios finales propios"
  ON usuarios_finales FOR DELETE
  USING (cultivador_id = auth.uid());

-- Políticas para entregas
CREATE POLICY "Ver entregas propias"
  ON entregas FOR SELECT
  USING (cultivador_id = auth.uid());

CREATE POLICY "Crear entregas"
  ON entregas FOR INSERT
  WITH CHECK (cultivador_id = auth.uid());

CREATE POLICY "Actualizar entregas propias"
  ON entregas FOR UPDATE
  USING (cultivador_id = auth.uid());

-- Políticas para notificaciones
CREATE POLICY "Ver notificaciones propias"
  ON notificaciones FOR SELECT
  USING (cultivador_id = auth.uid());

CREATE POLICY "Crear notificaciones"
  ON notificaciones FOR INSERT
  WITH CHECK (cultivador_id = auth.uid());

CREATE POLICY "Actualizar notificaciones propias"
  ON notificaciones FOR UPDATE
  USING (cultivador_id = auth.uid());

CREATE POLICY "Eliminar notificaciones propias"
  ON notificaciones FOR DELETE
  USING (cultivador_id = auth.uid());
