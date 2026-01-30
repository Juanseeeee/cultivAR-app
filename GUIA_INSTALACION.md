# Guía de Instalación y Despliegue

## Sistema de Gestión de Cultivos - FECANBO

---

## Requisitos Previos

- Cuenta en Vercel (gratuita o pago)
- Cuenta en Supabase (gratuita o pago)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

---

## Paso 1: Configurar Supabase

### 1.1 Crear Proyecto
1. Ir a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Crear nuevo proyecto:
   - **Nombre**: fecanbo-cultivos (o el que prefieras)
   - **Contraseña de DB**: Generar una segura y guardarla
   - **Región**: South America (São Paulo) - más cercana a Argentina
4. Esperar a que se cree (puede tomar 2-3 minutos)

### 1.2 Obtener Credenciales
1. Ir a **Project Settings** (ícono de engranaje)
2. Click en **API**
3. Copiar y guardar:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - `service_role` key (SUPABASE_SERVICE_ROLE_KEY)

### 1.3 Ejecutar Scripts SQL
1. Ir a **SQL Editor** en el menú lateral
2. Click en "New query"
3. Copiar y ejecutar cada script EN ORDEN:

**Script 1**: `scripts/001-create-tables.sql`
- Crea todas las tablas necesarias
- Ejecutar y verificar que no haya errores

**Script 2**: `scripts/002-row-level-security.sql`
- Configura la seguridad de acceso a datos
- Ejecutar y verificar que no haya errores

**Script 3**: `scripts/003-functions-triggers.sql`
- Crea funciones automáticas
- Ejecutar y verificar que no haya errores

### 1.4 Verificar Tablas
1. Ir a **Table Editor**
2. Verificar que existen las tablas:
   - cultivadores
   - cultivos
   - etapas_cultivo
   - observaciones
   - alertas
   - usuarios_finales
   - entregas
   - fotos

---

## Paso 2: Desplegar en Vercel

### Opción A: Desde v0 (Recomendado)

1. En v0, click en **"Publish"** (esquina superior derecha)
2. Seleccionar proyecto de Vercel o crear uno nuevo
3. Agregar las variables de entorno:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
   SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
   \`\`\`
4. Click en "Deploy"

### Opción B: Desde GitHub

1. Descargar el código (ZIP o conectar GitHub)
2. Ir a [vercel.com](https://vercel.com)
3. Click en "New Project"
4. Importar desde GitHub
5. En "Environment Variables" agregar las 3 variables
6. Click en "Deploy"

---

## Paso 3: Configurar Dominio (Opcional)

### 3.1 Dominio Personalizado
1. En Vercel, ir al proyecto desplegado
2. Click en **Settings** > **Domains**
3. Agregar tu dominio personalizado
4. Configurar DNS según instrucciones de Vercel

### 3.2 SSL
- Vercel configura HTTPS automáticamente
- No se requiere configuración adicional

---

## Paso 4: Verificar Funcionamiento

### 4.1 Prueba de Registro
1. Acceder a la URL del sistema
2. Click en "Registrarse"
3. Crear cuenta con email real
4. Verificar que se cree el usuario en Supabase (Auth > Users)

### 4.2 Prueba de Base de Datos
1. Iniciar sesión
2. Crear un cultivo de prueba
3. Verificar en Supabase (Table Editor > cultivos)

### 4.3 Prueba de Alertas
1. Crear una alerta
2. Marcarla como completada
3. Verificar el cambio en la base de datos

---

## Solución de Problemas

### Error: "Database error saving new user"
**Causa**: El trigger de creación de perfil falló
**Solución**: Ejecutar este script en Supabase SQL Editor:

\`\`\`sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS create_cultivador_profile();

CREATE OR REPLACE FUNCTION public.create_cultivador_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.cultivadores (id, nombre_completo, metadata)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_cultivador_profile();
\`\`\`

### Error: "Failed to fetch" en consola
**Causa**: Variables de entorno incorrectas o faltantes
**Solución**: 
1. Verificar que las 3 variables estén configuradas
2. Verificar que no haya espacios extra
3. Re-desplegar el proyecto

### Error: Column does not exist
**Causa**: Scripts SQL no ejecutados o ejecutados parcialmente
**Solución**: 
1. Borrar todas las tablas en Supabase
2. Ejecutar los scripts nuevamente en orden

### Las tablas están vacías
**Causa**: Row Level Security bloqueando acceso
**Solución**: 
1. Verificar que el script 002 se ejecutó correctamente
2. Verificar que estás autenticado al hacer las operaciones

---

## Mantenimiento

### Backups
- Supabase realiza backups automáticos diarios (plan Pro)
- Para plan gratuito, exportar datos manualmente desde Table Editor

### Monitoreo
- Usar Vercel Analytics para tráfico
- Usar Supabase Dashboard para métricas de DB

### Actualizaciones
1. Hacer cambios en v0 o código fuente
2. Re-desplegar en Vercel
3. Las migraciones de DB se hacen manualmente con scripts SQL

---

## Contacto de Soporte

Para problemas técnicos que no puedas resolver:
1. Documentar el error con capturas de pantalla
2. Incluir los logs de consola del navegador
3. Indicar navegador y sistema operativo
4. Contactar al equipo de desarrollo

---

**Última actualización**: Enero 2026
