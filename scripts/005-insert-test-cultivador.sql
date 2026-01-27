-- FECANBO - Script para crear un cultivador de prueba
-- Este script crea un cultivador inicial para poder usar el sistema sin autenticación

-- Primero, verificamos si ya existe un cultivador
DO $$
BEGIN
  -- Si no hay cultivadores, insertamos uno de prueba
  IF NOT EXISTS (SELECT 1 FROM cultivadores LIMIT 1) THEN
    -- Insertamos un cultivador con un UUID fijo para pruebas
    INSERT INTO cultivadores (
      id,
      nombre_completo,
      documento,
      telefono,
      direccion,
      provincia,
      ciudad,
      estado,
      es_admin,
      metadata
    ) VALUES (
      '00000000-0000-0000-0000-000000000001'::uuid,
      'Cultivador FECANBO (Pruebas)',
      '00000000',
      '+54 11 0000-0000',
      'Sede FECANBO',
      'Buenos Aires',
      'La Plata',
      'activo',
      true,
      '{"es_cuenta_prueba": true}'::jsonb
    );
    
    RAISE NOTICE 'Cultivador de prueba creado exitosamente';
  ELSE
    RAISE NOTICE 'Ya existe al menos un cultivador, no se creó uno nuevo';
  END IF;
END $$;

-- Verificar que se creó
SELECT id, nombre_completo, estado FROM cultivadores;
