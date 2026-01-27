# FECANBO - Configuración de Base de Datos

## Instrucciones para configurar Supabase

### 1. Conectar Supabase

Una vez resuelvas el tema del pago:

1. Ve a la sección **"Connect"** en el sidebar de v0
2. Selecciona **Supabase** y conecta tu cuenta
3. Crea un nuevo proyecto o selecciona uno existente
4. Las variables de entorno se configurarán automáticamente

### 2. Ejecutar Scripts SQL

Los scripts deben ejecutarse en el siguiente orden:

#### Script 1: Crear Tablas
```bash
scripts/001-create-tables.sql
```
Crea todas las tablas necesarias:
- cultivadores (perfiles de usuarios)
- cultivos (información principal de cada cultivo)
- cultivo_etapas (historial de etapas)
- alertas (recordatorios y tareas)
- observaciones (registros diarios)
- usuarios_finales (pacientes/receptores)
- entregas (trazabilidad de entregas)
- notificaciones (sistema de notificaciones)

#### Script 2: Row Level Security
```bash
scripts/002-row-level-security.sql
```
Configura la seguridad a nivel de fila para que:
- Cada cultivador solo vea sus propios datos
- Los datos estén protegidos automáticamente
- Las políticas de acceso sean estrictas

#### Script 3: Functions & Triggers
```bash
scripts/003-functions-triggers.sql
```
Crea automatizaciones:
- Creación automática de perfil al registrarse
- Notificaciones de alertas vencidas
- Notificaciones de alertas próximas
- Cálculo automático de duración de etapas
- Actualización de timestamps

#### Script 4: Datos de Ejemplo (Opcional)
```bash
scripts/004-seed-data.sql
```
Solo para desarrollo/pruebas. Crea:
- Plantillas de alertas comunes
- Vistas para estadísticas

### 3. Configurar Autenticación

En el dashboard de Supabase:
1. Ve a **Authentication** > **Providers**
2. Habilita **Email** provider
3. Configura las URLs de redirect si es necesario

### 4. Configurar Storage (Para fotos)

1. Ve a **Storage** en Supabase
2. Crea un bucket llamado `cultivos-fotos`
3. Configura las políticas de acceso:
   - Los cultivadores pueden subir fotos
   - Solo pueden ver/editar sus propias fotos

### 5. Variables de Entorno

El sistema usará automáticamente estas variables (ya configuradas por v0):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (para operaciones del servidor)

### Estructura de la Base de Datos

```
cultivadores
├── cultivos (1:N)
│   ├── cultivo_etapas (1:N)
│   ├── alertas (1:N)
│   ├── observaciones (1:N)
│   └── entregas (1:N)
├── usuarios_finales (1:N)
│   └── entregas (1:N)
└── notificaciones (1:N)
```

### Próximos Pasos

Una vez ejecutados los scripts:
1. ✅ La base de datos estará completamente configurada
2. ✅ Podrás registrar usuarios
3. ✅ El sistema funcionará completamente
4. ✅ Todos los datos estarán protegidos con RLS

### Notas Importantes

- **Seguridad**: Todos los datos están protegidos con Row Level Security
- **Escalabilidad**: La estructura soporta miles de cultivos y usuarios
- **Trazabilidad**: Sistema completo de auditoría y seguimiento
- **Performance**: Índices optimizados para consultas rápidas

### Soporte

Si tienes problemas al ejecutar los scripts:
1. Verifica que tengas permisos de administrador en Supabase
2. Ejecuta los scripts en orden
3. Revisa los logs de Supabase para ver errores específicos
