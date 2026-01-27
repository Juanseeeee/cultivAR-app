-- FECANBO - Datos de demostración para presentación al cliente
-- Ejecutar después de los scripts 001-003

-- ============================================
-- 1. CULTIVADOR DE PRUEBA
-- ============================================
-- Primero necesitamos un cultivador. Usamos un UUID fijo para referenciarlo
-- NOTA: Si ya tienes un cultivador de 005-insert-test-cultivador.sql, puedes saltear esto

DO $$
DECLARE
  v_cultivador_id UUID := '11111111-1111-1111-1111-111111111111';
BEGIN
  -- Insertar cultivador si no existe
  INSERT INTO cultivadores (id, nombre_completo, documento, telefono, direccion, provincia, ciudad, es_admin, metadata)
  VALUES (
    v_cultivador_id,
    'Administrador FECANBO',
    '30123456',
    '+54 11 5555-1234',
    'Av. Corrientes 1234, Piso 5',
    'Buenos Aires',
    'CABA',
    TRUE,
    '{"rol": "admin", "verificado": true}'::jsonb
  )
  ON CONFLICT (id) DO UPDATE SET
    nombre_completo = EXCLUDED.nombre_completo;
END $$;

-- ============================================
-- 2. CULTIVOS DE EJEMPLO (diversas etapas)
-- ============================================
INSERT INTO cultivos (id, cultivador_id, nombre, variedad, tipo, proposito, fecha_inicio, fecha_estimada_cosecha, estado_actual, latitud, longitud, ubicacion_descripcion, metodo_cultivo, medio_cultivo, cantidad_plantas, notas, activo)
VALUES
  -- Cultivo en Germinación (reciente)
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 
   'Lote GER-2024-001', 'Charlotte''s Web', 'indica', 'medicinal',
   CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '85 days',
   'germinacion', -34.6037, -58.3816, 'Indoor - Sala Principal CABA', 
   'interior', 'tierra', 8,
   'Semillas premium importadas. Alto contenido CBD esperado. Para pacientes con epilepsia.',
   TRUE),
   
  -- Cultivo en Vegetativo
  ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Lote VEG-2024-002', 'ACDC', 'hibrida', 'medicinal',
   CURRENT_DATE - INTERVAL '35 days', CURRENT_DATE + INTERVAL '55 days',
   'vegetativo', -34.5985, -58.4016, 'Invernadero Norte - Quilmes',
   'invernadero', 'coco', 12,
   'Desarrollo excelente. Relación CBD:THC esperada 20:1. Para dolor crónico.',
   TRUE),
   
  -- Cultivo en Floración (avanzado)
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   'Lote FLO-2024-003', 'Harlequin', 'sativa', 'medicinal',
   CURRENT_DATE - INTERVAL '70 days', CURRENT_DATE + INTERVAL '20 days',
   'floracion', -34.6118, -58.4173, 'Indoor - Sala B CABA',
   'interior', 'hidroponico', 6,
   'Semana 5 de floración. Tricomas desarrollándose bien. CBD alto para ansiedad.',
   TRUE),
   
  -- Cultivo en Cosecha
  ('c4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   'Lote COS-2024-004', 'Cannatonic', 'hibrida', 'medicinal',
   CURRENT_DATE - INTERVAL '95 days', CURRENT_DATE + INTERVAL '5 days',
   'cosecha', -34.6083, -58.3712, 'Outdoor - La Plata',
   'exterior', 'tierra', 4,
   'Listo para cosechar esta semana. Rendimiento estimado: 180g/planta. Para espasmos musculares.',
   TRUE),
   
  -- Cultivo en Secado
  ('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   'Lote SEC-2024-005', 'Ringo''s Gift', 'hibrida', 'medicinal',
   CURRENT_DATE - INTERVAL '100 days', NULL,
   'secado', -34.6037, -58.3816, 'Sala de Secado - CABA',
   'interior', 'tierra', 5,
   'En proceso de secado controlado. Humedad ambiente: 55%. Temperatura: 20°C.',
   TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. ETAPAS DE CULTIVO (historial)
-- ============================================
-- Etapas del cultivo en floración (c3333333...)
INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, duracion_dias, observaciones, metricas)
VALUES
  ('c3333333-3333-3333-3333-333333333333', 'germinacion', 
   CURRENT_DATE - INTERVAL '70 days', CURRENT_DATE - INTERVAL '63 days', 7,
   'Germinación exitosa 100%. 6 de 6 semillas brotaron.',
   '{"tasa_germinacion": 100}'::jsonb),
  ('c3333333-3333-3333-3333-333333333333', 'vegetativo',
   CURRENT_DATE - INTERVAL '63 days', CURRENT_DATE - INTERVAL '35 days', 28,
   'Crecimiento vigoroso. Se realizó topping en día 21.',
   '{"altura_final_cm": 45, "ramas_principales": 8}'::jsonb),
  ('c3333333-3333-3333-3333-333333333333', 'floracion',
   CURRENT_DATE - INTERVAL '35 days', NULL, NULL,
   'Floración iniciada con cambio a 12/12. Buenos signos de desarrollo.',
   '{"semana_floracion": 5, "tricomas": "lechosos"}'::jsonb)
ON CONFLICT DO NOTHING;

-- Etapas del cultivo en secado (c5555555...)
INSERT INTO cultivo_etapas (cultivo_id, etapa, fecha_inicio, fecha_fin, duracion_dias, observaciones, metricas)
VALUES
  ('c5555555-5555-5555-5555-555555555555', 'germinacion',
   CURRENT_DATE - INTERVAL '100 days', CURRENT_DATE - INTERVAL '93 days', 7,
   'Germinación normal.',
   '{"tasa_germinacion": 100}'::jsonb),
  ('c5555555-5555-5555-5555-555555555555', 'vegetativo',
   CURRENT_DATE - INTERVAL '93 days', CURRENT_DATE - INTERVAL '65 days', 28,
   'Buen desarrollo vegetativo.',
   '{"altura_final_cm": 50}'::jsonb),
  ('c5555555-5555-5555-5555-555555555555', 'floracion',
   CURRENT_DATE - INTERVAL '65 days', CURRENT_DATE - INTERVAL '10 days', 55,
   'Floración completa. Tricomas 70% lechosos, 20% ámbar.',
   '{"rendimiento_estimado_g": 200}'::jsonb),
  ('c5555555-5555-5555-5555-555555555555', 'cosecha',
   CURRENT_DATE - INTERVAL '10 days', CURRENT_DATE - INTERVAL '7 days', 3,
   'Cosecha completada. Peso húmedo total: 950g.',
   '{"peso_humedo_g": 950}'::jsonb),
  ('c5555555-5555-5555-5555-555555555555', 'secado',
   CURRENT_DATE - INTERVAL '7 days', NULL, NULL,
   'Secado en curso. Control diario de humedad.',
   '{"humedad_actual": 55, "temperatura": 20}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================
-- 4. ALERTAS TÉCNICAS
-- ============================================
INSERT INTO alertas (cultivo_id, tipo, prioridad, titulo, descripcion, fecha_programada, completada, creada_por)
VALUES
  -- Alertas pendientes (próximas)
  ('c2222222-2222-2222-2222-222222222222', 'riego', 'alta',
   'Riego programado - Lote VEG-2024-002',
   'Riego con nutrientes de crecimiento. EC: 1.2, pH: 6.0. Cantidad: 2L por planta.',
   CURRENT_TIMESTAMP + INTERVAL '2 hours', FALSE, '11111111-1111-1111-1111-111111111111'),
   
  ('c3333333-3333-3333-3333-333333333333', 'nutricion', 'media',
   'Aplicar PK Booster - Lote FLO-2024-003',
   'Semana 5 de floración. Aumentar fósforo y potasio. Reducir nitrógeno.',
   CURRENT_TIMESTAMP + INTERVAL '1 day', FALSE, '11111111-1111-1111-1111-111111111111'),
   
  ('c4444444-4444-4444-4444-444444444444', 'cosecha', 'urgente',
   'COSECHA - Lote COS-2024-004',
   'Tricomas 80% ámbar. Cosechar en las próximas 48hs para perfil CBD óptimo.',
   CURRENT_TIMESTAMP + INTERVAL '1 day', FALSE, '11111111-1111-1111-1111-111111111111'),
   
  ('c1111111-1111-1111-1111-111111111111', 'riego', 'media',
   'Primer riego post-germinación',
   'Riego suave con agua pH 6.5. Sin nutrientes aún.',
   CURRENT_TIMESTAMP + INTERVAL '6 hours', FALSE, '11111111-1111-1111-1111-111111111111'),
   
  ('c3333333-3333-3333-3333-333333333333', 'control_plagas', 'alta',
   'Inspección preventiva de plagas',
   'Revisar envés de hojas. Aplicar aceite de neem preventivo si es necesario.',
   CURRENT_TIMESTAMP + INTERVAL '2 days', FALSE, '11111111-1111-1111-1111-111111111111'),
   
  -- Alertas completadas (historial)
  ('c3333333-3333-3333-3333-333333333333', 'cambio_fotoperiodo', 'alta',
   'Cambio a fotoperiodo 12/12',
   'Iniciar floración. Cambiar luces a ciclo 12/12.',
   CURRENT_TIMESTAMP - INTERVAL '35 days', TRUE, '11111111-1111-1111-1111-111111111111'),
   
  ('c5555555-5555-5555-5555-555555555555', 'cosecha', 'urgente',
   'Cosecha completada - Lote SEC-2024-005',
   'Cosecha realizada exitosamente. Peso húmedo: 950g.',
   CURRENT_TIMESTAMP - INTERVAL '7 days', TRUE, '11111111-1111-1111-1111-111111111111')
ON CONFLICT DO NOTHING;

-- ============================================
-- 5. OBSERVACIONES (registros diarios)
-- ============================================
INSERT INTO observaciones (cultivo_id, cultivador_id, fecha_observacion, tipo, descripcion, temperatura, humedad, ph, ec, altura_cm, tags)
VALUES
  -- Observaciones del cultivo en floración
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '2 days', 'general',
   'Plantas mostrando excelente desarrollo de cogollos. Resina visible a simple vista. Aroma intenso a pino y cítricos.',
   24.5, 55, 6.2, 1.4, 65,
   ARRAY['floracion', 'saludable', 'tricomas']),
   
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '5 days', 'nutricion',
   'Aplicación de nutrientes de floración. Respuesta positiva. Sin signos de deficiencias.',
   25.0, 52, 6.0, 1.3, 62,
   ARRAY['nutricion', 'floracion']),
   
  ('c3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '10 days', 'riego',
   'Riego con agua pura para flush ligero. Drenaje adecuado.',
   24.0, 58, 6.5, 0.8, 58,
   ARRAY['riego', 'flush']),
   
  -- Observaciones del cultivo en vegetativo
  ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '1 day', 'general',
   'Crecimiento vigoroso. Hojas de color verde intenso. Se realizó defoliación menor para mejorar ventilación.',
   26.0, 60, 6.0, 1.1, 35,
   ARRAY['vegetativo', 'defoliacion', 'saludable']),
   
  ('c2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '4 days', 'mejora',
   'Topping realizado en plantas 3 y 7 para promover ramificación lateral.',
   25.5, 58, 6.1, 1.2, 30,
   ARRAY['topping', 'entrenamiento']),
   
  -- Observaciones del cultivo en germinación
  ('c1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '3 days', 'general',
   '8 de 8 semillas germinaron exitosamente. Radículas visibles de 1-2cm.',
   23.0, 70, NULL, NULL, 2,
   ARRAY['germinacion', 'exito']),
   
  -- Observaciones del cultivo en secado
  ('c5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '1 day', 'general',
   'Día 6 de secado. Ramas empiezan a crujir al doblar. Estimado 2-3 días más.',
   20.0, 55, NULL, NULL, NULL,
   ARRAY['secado', 'control'])
ON CONFLICT DO NOTHING;

-- ============================================
-- 6. USUARIOS FINALES (pacientes)
-- ============================================
INSERT INTO usuarios_finales (id, cultivador_id, nombre_completo, documento, telefono, email, condicion_medica, dosis_recomendada, notas, activo)
VALUES
  ('u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   'María García Fernández', '25456789', '+54 11 4555-1234', 'maria.garcia@email.com',
   'Epilepsia refractaria', '3 gotas de aceite CBD 3 veces al día',
   'Paciente desde 2023. Excelente respuesta al tratamiento. Redujo convulsiones 80%.', TRUE),
   
  ('u2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   'Roberto Martínez López', '18765432', '+54 11 4555-5678', 'roberto.martinez@email.com',
   'Dolor crónico - Artritis reumatoide', '0.5g de flor vaporizada 2 veces al día',
   'Paciente desde 2022. Complementa con fisioterapia.', TRUE),
   
  ('u3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   'Laura Sánchez Ruiz', '30234567', '+54 11 4555-9012', 'laura.sanchez@email.com',
   'Ansiedad generalizada - Insomnio', '5 gotas de aceite CBD antes de dormir',
   'Paciente desde 2024. Mejoró calidad de sueño significativamente.', TRUE),
   
  ('u4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   'Carlos Pérez Gómez', '22345678', '+54 11 4555-3456', 'carlos.perez@email.com',
   'Espasmos musculares - Esclerosis múltiple', '2 gotas de aceite 4 veces al día',
   'Derivado por neurólogo. Control mensual.', TRUE),
   
  ('u5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   'Ana Torres Vega', '28901234', '+54 11 4555-7890', 'ana.torres@email.com',
   'Fibromialgia', '0.3g de flor + 3 gotas aceite diario',
   'Tratamiento combinado. Buena respuesta.', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. ENTREGAS (historial de trazabilidad)
-- ============================================
INSERT INTO entregas (cultivo_id, usuario_final_id, cultivador_id, fecha_entrega, cantidad_gramos, tipo_producto, lote, notas)
VALUES
  -- Entregas del mes actual
  ('c5555555-5555-5555-5555-555555555555', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '3 days', 30.0, 'aceite',
   'ACE-2024-001', 'Aceite CBD 10%. Extracción CO2. Lote certificado.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '5 days', 15.0, 'flor',
   'FLR-2024-012', 'Flor Ringo''s Gift curada. CBD 15%, THC <1%.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '7 days', 20.0, 'aceite',
   'ACE-2024-002', 'Aceite CBD para insomnio. Terpenos relajantes.'),
   
  -- Entregas del mes pasado
  ('c5555555-5555-5555-5555-555555555555', 'u4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '20 days', 25.0, 'aceite',
   'ACE-2024-003', 'Aceite alta concentración para espasmos.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '35 days', 30.0, 'aceite',
   'ACE-2024-004', 'Entrega mensual regular.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u5555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '40 days', 10.0, 'flor',
   'FLR-2024-008', 'Primera entrega. Prueba de tolerancia.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '45 days', 15.0, 'flor',
   'FLR-2024-007', 'Entrega mensual.'),
   
  -- Entregas de hace 2 meses
  ('c5555555-5555-5555-5555-555555555555', 'u3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '65 days', 20.0, 'aceite',
   'ACE-2024-005', 'Entrega mensual.'),
   
  ('c5555555-5555-5555-5555-555555555555', 'u4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   CURRENT_TIMESTAMP - INTERVAL '50 days', 25.0, 'aceite',
   'ACE-2024-006', 'Entrega mensual.')
ON CONFLICT DO NOTHING;

-- ============================================
-- 8. NOTIFICACIONES DE EJEMPLO
-- ============================================
INSERT INTO notificaciones (cultivador_id, tipo, titulo, mensaje, leida, url_accion)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'alerta_proxima',
   'Cosecha urgente programada',
   'El Lote COS-2024-004 está listo para cosechar en las próximas 48 horas.',
   FALSE, '/cultivos/c4444444-4444-4444-4444-444444444444'),
   
  ('11111111-1111-1111-1111-111111111111', 'cambio_etapa',
   'Cultivo entró en secado',
   'El Lote SEC-2024-005 ha sido movido a etapa de secado.',
   TRUE, '/cultivos/c5555555-5555-5555-5555-555555555555'),
   
  ('11111111-1111-1111-1111-111111111111', 'entrega',
   'Entrega registrada',
   'Se registró entrega de 30g de aceite a María García Fernández.',
   TRUE, '/entregas'),
   
  ('11111111-1111-1111-1111-111111111111', 'sistema',
   'Bienvenido a FECANBO',
   'Tu cuenta ha sido configurada correctamente. Explora el sistema para conocer todas las funcionalidades.',
   TRUE, '/dashboard')
ON CONFLICT DO NOTHING;

-- ============================================
-- RESUMEN DE DATOS INSERTADOS
-- ============================================
-- 1 Cultivador administrador
-- 5 Cultivos en diferentes etapas (germinación, vegetativo, floración, cosecha, secado)
-- 12 Etapas de cultivo (historial)
-- 7 Alertas técnicas (5 pendientes, 2 completadas)
-- 8 Observaciones con métricas
-- 5 Usuarios finales (pacientes)
-- 9 Entregas con trazabilidad
-- 4 Notificaciones

SELECT 'Datos de demostración insertados correctamente' AS resultado;
