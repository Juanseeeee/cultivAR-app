-- FECANBO - Sistema de Gestión de Cultivos Medicinales
-- Script 6: Datos de demostración (ACTUALIZADO)
-- 
-- IMPORTANTE: Este script usa el usuario autenticado actual.
-- Antes de ejecutar, asegúrate de estar registrado en la app.
-- El script tomará automáticamente tu user_id de auth.users

-- ==============================================================================
-- PASO 1: Verificar y obtener el usuario actual
-- ==============================================================================

DO $$
DECLARE
  v_user_id UUID;
  v_cultivador_exists BOOLEAN;
BEGIN
  -- Obtener el primer usuario de auth.users
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No hay usuarios registrados. Por favor regístrate primero en la aplicación en /register';
  END IF;

  -- Verificar si ya existe un cultivador para este usuario
  SELECT EXISTS(SELECT 1 FROM cultivadores WHERE id = v_user_id) INTO v_cultivador_exists;
  
  -- Si no existe, crear el cultivador
  IF NOT v_cultivador_exists THEN
    INSERT INTO cultivadores (id, nombre_completo, documento, telefono, direccion, provincia, ciudad, es_admin, metadata)
    VALUES (
      v_user_id,
      'FECANBO Admin',
      '20-12345678-9',
      '+54 9 11 1234-5678',
      'Av. Corrientes 1234',
      'Buenos Aires',
      'CABA',
      TRUE,
      '{"organizacion": "Federación Cannábica Bonaerense", "cargo": "Coordinador Técnico"}'::jsonb
    )
    ON CONFLICT (id) DO UPDATE SET
      nombre_completo = EXCLUDED.nombre_completo,
      es_admin = EXCLUDED.es_admin;
    
    RAISE NOTICE 'Cultivador creado para usuario: %', v_user_id;
  ELSE
    RAISE NOTICE 'Cultivador ya existe para usuario: %', v_user_id;
  END IF;

  -- Limpiar datos demo anteriores si existen
  DELETE FROM entregas WHERE cultivador_id = v_user_id;
  DELETE FROM alertas WHERE creada_por = v_user_id;
  DELETE FROM observaciones WHERE cultivador_id = v_user_id;
  DELETE FROM cultivo_etapas WHERE cultivo_id IN (SELECT id FROM cultivos WHERE cultivador_id = v_user_id);
  DELETE FROM cultivos WHERE cultivador_id = v_user_id;
  DELETE FROM usuarios_finales WHERE cultivador_id = v_user_id;
  DELETE FROM notificaciones WHERE cultivador_id = v_user_id;
  
  RAISE NOTICE 'Datos demo anteriores limpiados';

  -- ==============================================================================
  -- PASO 2: Insertar Cultivos
  -- ==============================================================================

  INSERT INTO cultivos (id, cultivador_id, nombre, variedad, tipo, proposito, fecha_inicio, estado_actual, latitud, longitud, ubicacion_descripcion, metodo_cultivo, medio_cultivo, cantidad_plantas, notas, activo)
  VALUES
    -- Cultivo 1: En germinación (recién iniciado)
    (gen_random_uuid(), v_user_id, 'Cultivo Medicinal - Charlotte''s Web', 'Charlotte''s Web', 'sativa', 'medicinal', CURRENT_DATE - INTERVAL '5 days', 'germinacion', 
     -34.6037, -58.3816, 'Espacio interior controlado - Zona Norte CABA', 'interior', 'tierra', 8,
     'Cepa rica en CBD (20:1 CBD:THC) indicada para epilepsia pediátrica y espasmos. Germinación exitosa, trasplante previsto en 7 días.', TRUE),
    
    -- Cultivo 2: En vegetativo (30 días)
    (gen_random_uuid(), v_user_id, 'Cultivo Medicinal - ACDC', 'ACDC', 'hibrida', 'medicinal', CURRENT_DATE - INTERVAL '30 days', 'vegetativo',
     -34.6158, -58.5033, 'Invernadero comunitario - La Matanza', 'invernadero', 'coco', 12,
     'Cepa 20:1 CBD:THC para dolor crónico y artritis. Crecimiento vigoroso, 35cm de altura promedio. Programa de riego automático instalado.', TRUE),
    
    -- Cultivo 3: En floración (60 días)
    (gen_random_uuid(), v_user_id, 'Cultivo Medicinal - Harlequin', 'Harlequin', 'sativa', 'medicinal', CURRENT_DATE - INTERVAL '60 days', 'floracion',
     -34.7074, -58.2788, 'Cultivo exterior protegido - Avellaneda', 'exterior', 'tierra', 6,
     'Ratio 5:2 CBD:THC, ideal para ansiedad sin efecto psicoactivo intenso. Flores desarrollándose bien, 3 semanas para cosecha estimada.', TRUE),
    
    -- Cultivo 4: En cosecha (85 días)
    (gen_random_uuid(), v_user_id, 'Cultivo Medicinal - Cannatonic', 'Cannatonic', 'hibrida', 'medicinal', CURRENT_DATE - INTERVAL '85 days', 'cosecha',
     -34.6692, -58.5631, 'Indoor hidropónico - Morón', 'interior', 'hidroponico', 4,
     'CBD:THC 1:1, efectivo para espasmos musculares y dolor neuropático. Tricomas en punto óptimo, cosecha programada para esta semana.', TRUE),
    
    -- Cultivo 5: En secado (90 días)
    (gen_random_uuid(), v_user_id, 'Cultivo Medicinal - Ringo''s Gift', 'Ringo''s Gift', 'hibrida', 'medicinal', CURRENT_DATE - INTERVAL '90 days', 'secado',
     -34.5875, -58.4158, 'Cuarto de secado controlado - Vicente López', 'interior', 'tierra', 5,
     'Cepa 20:1 CBD:THC nombrada en honor al activista Lawrence Ringo. Cosechado hace 5 días, secado en curso con humedad controlada al 50%.', TRUE);

  RAISE NOTICE 'Cultivos insertados exitosamente';

  -- ==============================================================================
  -- PASO 3: Insertar Etapas de Cultivo
  -- ==============================================================================

  -- Para cada cultivo, crear su historial de etapas
  WITH cultivo_ids AS (
    SELECT id, estado_actual, fecha_inicio FROM cultivos WHERE cultivador_id = v_user_id ORDER BY fecha_inicio
  )
  INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, observaciones, duracion_dias)
  SELECT 
    c.id,
    'germinacion',
    c.fecha_inicio,
    CASE WHEN c.estado_actual != 'germinacion' THEN c.fecha_inicio + INTERVAL '7 days' ELSE NULL END,
    'Germinación en papel toalla, 100% de éxito. Trasplante a macetas de 1L.',
    CASE WHEN c.estado_actual != 'germinacion' THEN 7 ELSE NULL END
  FROM cultivo_ids c;

  -- Etapas vegetativo
  WITH cultivo_ids AS (
    SELECT id, estado_actual, fecha_inicio FROM cultivos 
    WHERE cultivador_id = v_user_id 
    AND estado_actual IN ('vegetativo', 'floracion', 'cosecha', 'secado')
    ORDER BY fecha_inicio
  )
  INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, observaciones, duracion_dias)
  SELECT 
    c.id,
    'vegetativo',
    c.fecha_inicio + INTERVAL '7 days',
    CASE WHEN c.estado_actual != 'vegetativo' THEN c.fecha_inicio + INTERVAL '35 days' ELSE NULL END,
    'Crecimiento vegetativo saludable. Fertilización con NPK 18-18-21. Poda apical realizada.',
    CASE WHEN c.estado_actual != 'vegetativo' THEN 28 ELSE NULL END
  FROM cultivo_ids c;

  -- Etapas floración
  WITH cultivo_ids AS (
    SELECT id, estado_actual, fecha_inicio FROM cultivos 
    WHERE cultivador_id = v_user_id 
    AND estado_actual IN ('floracion', 'cosecha', 'secado')
    ORDER BY fecha_inicio
  )
  INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, observaciones, duracion_dias)
  SELECT 
    c.id,
    'floracion',
    c.fecha_inicio + INTERVAL '35 days',
    CASE WHEN c.estado_actual NOT IN ('floracion') THEN c.fecha_inicio + INTERVAL '75 days' ELSE NULL END,
    'Floración iniciada, cambio a fotoperiodo 12/12. Fertilización con PK 13-14. Desarrollo óptimo de cogollos.',
    CASE WHEN c.estado_actual NOT IN ('floracion') THEN 40 ELSE NULL END
  FROM cultivo_ids c;

  -- Etapas cosecha
  WITH cultivo_ids AS (
    SELECT id, estado_actual, fecha_inicio FROM cultivos 
    WHERE cultivador_id = v_user_id 
    AND estado_actual IN ('cosecha', 'secado')
    ORDER BY fecha_inicio
  )
  INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, observaciones, duracion_dias)
  SELECT 
    c.id,
    'cosecha',
    c.fecha_inicio + INTERVAL '75 days',
    CASE WHEN c.estado_actual != 'cosecha' THEN c.fecha_inicio + INTERVAL '80 days' ELSE NULL END,
    'Tricomas en punto óptimo. Cosecha realizada con tijeras esterilizadas. Manicurado inicial.',
    CASE WHEN c.estado_actual != 'cosecha' THEN 5 ELSE NULL END
  FROM cultivo_ids c;

  -- Etapas secado
  WITH cultivo_ids AS (
    SELECT id FROM cultivos 
    WHERE cultivador_id = v_user_id 
    AND estado_actual = 'secado'
  )
  INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, observaciones)
  SELECT 
    c.id,
    'secado',
    CURRENT_DATE - INTERVAL '5 days',
    'Secado en curso. Temperatura: 18-20°C, Humedad: 45-55%. Ventilación adecuada.'
  FROM cultivo_ids c;

  RAISE NOTICE 'Etapas de cultivo insertadas';

  -- ==============================================================================
  -- PASO 4: Insertar Alertas
  -- ==============================================================================

  WITH cultivo_ids AS (
    SELECT id, nombre FROM cultivos WHERE cultivador_id = v_user_id LIMIT 5
  )
  INSERT INTO alertas (cultivo_id, creada_por, tipo, titulo, descripcion, prioridad, fecha_programada, completada, fecha_completada)
  SELECT 
    id,
    v_user_id,
    tipo,
    titulo,
    descripcion,
    prioridad,
    fecha_prog,
    completada,
    CASE WHEN completada THEN fecha_prog ELSE NULL END
  FROM cultivo_ids
  CROSS JOIN (VALUES
    ('riego', 'Riego programado - Solución nutritiva', 'Aplicar riego con solución nutritiva NPK. pH ajustado a 6.0-6.5', 'alta', CURRENT_DATE + INTERVAL '1 day', FALSE),
    ('defoliacion', 'Defoliación preventiva', 'Realizar defoliación de hojas inferiores para mejorar circulación de aire y prevenir hongos.', 'media', CURRENT_DATE + INTERVAL '3 days', FALSE),
    ('control_plagas', 'Control de plagas semanal', 'Inspección visual completa de plantas. Aplicar aceite de neem preventivo si es necesario.', 'alta', CURRENT_DATE + INTERVAL '2 days', FALSE),
    ('nutricion', 'Fertilización fase vegetativa', 'Aplicar fertilizante orgánico rico en nitrógeno. Dosis: 2ml/L.', 'media', CURRENT_DATE - INTERVAL '2 days', TRUE),
    ('otro', 'Medición de parámetros ambientales', 'Verificar temperatura, humedad y pH del medio de cultivo. Registrar en sistema.', 'baja', CURRENT_DATE - INTERVAL '5 days', TRUE),
    ('transplante', 'Trasplante a macetas finales', 'Trasplantar a macetas de 20L con sustrato preparado.', 'urgente', CURRENT_DATE + INTERVAL '4 days', FALSE),
    ('cosecha', 'Preparación para cosecha', 'Revisar tricomas con lupa. Preparar herramientas esterilizadas.', 'alta', CURRENT_DATE + INTERVAL '7 days', FALSE)
  ) AS alerts(tipo, titulo, descripcion, prioridad, fecha_prog, completada)
  LIMIT 7;

  RAISE NOTICE 'Alertas insertadas';

  -- ==============================================================================
  -- PASO 5: Insertar Observaciones
  -- ==============================================================================

  WITH cultivo_ids AS (
    SELECT id FROM cultivos WHERE cultivador_id = v_user_id
  )
  INSERT INTO observaciones (cultivo_id, cultivador_id, descripcion, altura_cm, ph, temperatura, humedad, fotos, created_at)
  SELECT
    id,
    v_user_id,
    descripcion,
    altura,
    ph_val,
    temp,
    hum,
    fotos,
    fecha
  FROM cultivo_ids
  CROSS JOIN (VALUES
    ('Plantas mostrando crecimiento vigoroso. Primer set de hojas verdaderas desarrollado. Sin signos de estrés.', 5, 6.2, 24, 65, ARRAY['/cannabis-plant-flowering.jpg']::TEXT[], CURRENT_TIMESTAMP - INTERVAL '3 days'),
    ('Desarrollo excelente de raíces. Trasplante a macetas de 5L completado. Aplicación de micorrizas.', 12, 6.0, 23, 60, ARRAY['/cannabis-plant-early-flowering-pistils.jpg']::TEXT[], CURRENT_TIMESTAMP - INTERVAL '7 days'),
    ('Inicio de pre-floración observado. Primeros pistilos visibles. Cambio a fertilizante de floración.', 35, 6.3, 22, 55, ARRAY['/cannabis-plant-vegetative-growth-hydroponic.jpg']::TEXT[], CURRENT_TIMESTAMP - INTERVAL '14 days'),
    ('Formación masiva de tricomas. Aroma característico intenso. Estimado 2 semanas para cosecha óptima.', 75, 6.1, 21, 50, ARRAY['/cannabis-buds-with-trichomes.jpg']::TEXT[], CURRENT_TIMESTAMP - INTERVAL '21 days')
  ) AS obs(descripcion, altura, ph_val, temp, hum, fotos, fecha)
  LIMIT 8;

  RAISE NOTICE 'Observaciones insertadas';

  -- ==============================================================================
  -- PASO 6: Insertar Usuarios Finales (Pacientes)
  -- ==============================================================================

  INSERT INTO usuarios_finales (cultivador_id, nombre_completo, documento, email, telefono, condicion_medica, notas, activo)
  VALUES
    (v_user_id, 'María Gonzalez', '27-34567890-4', 'maria.gonzalez@email.com', '+54 9 11 2345-6789',
     'Epilepsia refractaria', 'Paciente pediátrica, 12 años. Cepa recomendada: Charlotte''s Web (alta en CBD). Dosis inicial: 0.5ml aceite 2 veces al día.', TRUE),
    
    (v_user_id, 'Roberto Fernández', '20-45678901-2', 'roberto.f@email.com', '+54 9 11 3456-7890',
     'Artritis reumatoide', 'Dolor crónico en articulaciones. Cepa recomendada: ACDC. Aplicación tópica + oral. Seguimiento mensual.', TRUE),
    
    (v_user_id, 'Laura Martínez', '27-56789012-3', 'laura.martinez@email.com', '+54 9 11 4567-8901',
     'Trastorno de ansiedad generalizada', 'Ansiedad sin tratamiento efectivo con fármacos tradicionales. Cepa: Harlequin (CBD:THC 5:2). Dosis: 1ml 3 veces/día.', TRUE),
    
    (v_user_id, 'Carlos López', '20-67890123-4', 'carlos.lopez@email.com', '+54 9 11 5678-9012',
     'Esclerosis múltiple', 'Espasmos musculares severos. Cepa: Cannatonic (1:1 CBD:THC). Vía sublingual. Control neurológico trimestral.', TRUE),
    
    (v_user_id, 'Ana Rodríguez', '27-78901234-5', 'ana.rodriguez@email.com', '+54 9 11 6789-0123',
     'Fibromialgia', 'Dolor generalizado y fatiga crónica. Protocolo combinado: Ringo''s Gift + fisioterapia. Evaluación mensual.', TRUE);

  RAISE NOTICE 'Usuarios finales (pacientes) insertados';

  -- ==============================================================================
  -- PASO 7: Insertar Entregas
  -- ==============================================================================

  WITH cultivos_finalizados AS (
    SELECT id FROM cultivos WHERE cultivador_id = v_user_id AND estado_actual IN ('cosecha', 'secado') LIMIT 2
  ),
  pacientes AS (
    SELECT id FROM usuarios_finales WHERE cultivador_id = v_user_id LIMIT 5
  )
  INSERT INTO entregas (cultivador_id, cultivo_id, usuario_final_id, tipo_producto, cantidad_gramos, lote, notas, fecha_entrega, created_at)
  SELECT
    v_user_id,
    (SELECT id FROM cultivos_finalizados OFFSET floor(random() * 2) LIMIT 1),
    p.id,
    tipo,
    cantidad,
    'LOTE-' || to_char(fecha, 'YYYYMM') || '-' || substr(md5(random()::text), 1, 6),
    nota,
    fecha,
    fecha
  FROM pacientes p
  CROSS JOIN (VALUES
    ('flor', 15, 'Flores secas Charlotte''s Web. CBD: 18%, THC: 0.8%. Uso pediátrico aprobado.', CURRENT_DATE - INTERVAL '5 days'),
    ('aceite', 30, 'Aceite CBD full spectrum. Concentración: 5%. Vía sublingual.', CURRENT_DATE - INTERVAL '12 days'),
    ('flor', 20, 'Flores ACDC secas y manicuradas. Para infusiones o vaporización.', CURRENT_DATE - INTERVAL '18 days'),
    ('flor', 10, 'Cogollos Harlequin premium. Perfil terpénico: myrceno, limoneno.', CURRENT_DATE - INTERVAL '25 days'),
    ('aceite', 25, 'Aceite Cannatonic 1:1. Ideal para dolor neuropático.', CURRENT_DATE - INTERVAL '35 days'),
    ('flor', 12, 'Flores Ringo''s Gift. Alto CBD, bajo THC. Sin efecto psicoactivo.', CURRENT_DATE - INTERVAL '42 days'),
    ('extracto', 5, 'Extracto concentrado CBD. Uso medicinal bajo supervisión.', CURRENT_DATE - INTERVAL '50 days')
  ) AS entregas_data(tipo, cantidad, nota, fecha)
  LIMIT 9;

  RAISE NOTICE 'Entregas insertadas';

  -- ==============================================================================
  -- PASO 8: Insertar Notificaciones
  -- ==============================================================================

  INSERT INTO notificaciones (cultivador_id, tipo, titulo, mensaje, leida)
  VALUES
    (v_user_id, 'alerta_proxima', 'Alerta de riego pendiente', 'Tienes una alerta de riego programada para mañana en el cultivo Charlotte''s Web.', FALSE),
    (v_user_id, 'entrega', 'Nueva entrega registrada', 'Se ha registrado exitosamente la entrega de 15g de flores a María Gonzalez.', FALSE),
    (v_user_id, 'alerta_proxima', 'Control de plagas requerido', 'Es momento de realizar el control preventivo de plagas en 3 cultivos activos.', FALSE),
    (v_user_id, 'cambio_etapa', 'Cultivo próximo a cosecha', 'El cultivo Harlequin está en semana 8 de floración. Preparar para cosecha en 10-14 días.', TRUE);

  RAISE NOTICE 'Notificaciones insertadas';

  RAISE NOTICE '============================================';
  RAISE NOTICE 'DATOS DE DEMOSTRACIÓN INSERTADOS EXITOSAMENTE';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Usuario: %', v_user_id;
  RAISE NOTICE 'Total Cultivos: 5';
  RAISE NOTICE 'Total Pacientes: 5';
  RAISE NOTICE 'Total Entregas: 9';
  RAISE NOTICE 'Total Alertas: 7 (5 pendientes, 2 completadas)';
  RAISE NOTICE '============================================';

END $$;
