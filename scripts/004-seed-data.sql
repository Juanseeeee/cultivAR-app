-- FECANBO - Datos de ejemplo
-- Script 4: Datos iniciales para pruebas (SOLO PARA DESARROLLO)

-- NOTA: Este script es solo para desarrollo/pruebas
-- No ejecutar en producción con datos reales

-- Los usuarios se crearán a través del sistema de autenticación
-- Este script asume que ya existen algunos usuarios en auth.users

-- Insertar alertas técnicas predefinidas comunes
CREATE TABLE IF NOT EXISTS alertas_plantillas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  etapa_recomendada TEXT,
  dias_desde_inicio INTEGER,
  prioridad TEXT DEFAULT 'media'
);

INSERT INTO alertas_plantillas (tipo, titulo, descripcion, etapa_recomendada, dias_desde_inicio, prioridad) VALUES
('riego', 'Verificar riego', 'Revisar humedad del sustrato y ajustar riego según necesidad', 'vegetativo', 3, 'media'),
('nutricion', 'Aplicar nutrientes vegetativos', 'Aplicar fertilizantes ricos en nitrógeno para etapa vegetativa', 'vegetativo', 7, 'media'),
('poda', 'Poda apical (topping)', 'Realizar poda apical para promover crecimiento lateral', 'vegetativo', 21, 'alta'),
('defoliacion', 'Defoliación selectiva', 'Remover hojas que bloquean luz a sitios de floración', 'floracion', 14, 'media'),
('nutricion', 'Cambiar a nutrientes de floración', 'Cambiar a fertilizantes ricos en fósforo y potasio', 'floracion', 1, 'alta'),
('control_plagas', 'Inspección de plagas', 'Revisar plantas en busca de plagas o enfermedades', 'vegetativo', 7, 'media'),
('cambio_fotoperiodo', 'Cambiar fotoperiodo a 12/12', 'Cambiar ciclo de luz a 12 horas luz / 12 horas oscuridad para inducir floración', 'vegetativo', 30, 'alta'),
('riego', 'Reducir riego pre-cosecha', 'Reducir frecuencia de riego una semana antes de cosecha', 'floracion', 49, 'alta'),
('cosecha', 'Verificar tricomas', 'Revisar tricomas con lupa para determinar punto óptimo de cosecha', 'floracion', 56, 'urgente'),
('otro', 'Iniciar secado', 'Colgar plantas en ambiente controlado para secado', 'cosecha', 1, 'urgente');

-- Crear vista para estadísticas del dashboard
CREATE OR REPLACE VIEW estadisticas_cultivador AS
SELECT 
  c.cultivador_id,
  COUNT(DISTINCT c.id) as total_cultivos,
  COUNT(DISTINCT CASE WHEN c.activo = TRUE THEN c.id END) as cultivos_activos,
  COUNT(DISTINCT CASE WHEN c.estado_actual = 'finalizado' THEN c.id END) as cultivos_finalizados,
  COUNT(DISTINCT a.id) as alertas_pendientes,
  COUNT(DISTINCT e.id) as total_entregas,
  COALESCE(SUM(e.cantidad_gramos), 0) as total_gramos_entregados,
  COUNT(DISTINCT uf.id) as total_usuarios_finales
FROM cultivadores cu
LEFT JOIN cultivos c ON c.cultivador_id = cu.id
LEFT JOIN alertas a ON a.cultivo_id = c.id AND a.completada = FALSE AND a.fecha_programada <= NOW()
LEFT JOIN entregas e ON e.cultivador_id = cu.id
LEFT JOIN usuarios_finales uf ON uf.cultivador_id = cu.id AND uf.activo = TRUE
GROUP BY cu.id;
