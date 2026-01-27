# FECANBO - Sistema de Gestión de Cultivos Medicinales

Sistema profesional para la Federación Cannábica Bonaerense (FECANBO) que permite la trazabilidad completa de cultivos comunitarios de cannabis medicinal.

## Características Principales

### Gestión de Cultivos
- Registro completo de cultivos con información detallada
- Seguimiento por etapas (germinación, vegetativo, floración, cosecha, secado, curado)
- Geolocalización con coordenadas GPS
- Sistema de observaciones con mediciones (temperatura, humedad, pH, EC, altura)
- Línea de tiempo visual del progreso del cultivo
- Galería fotográfica para cada cultivo

### Sistema de Alertas
- Alertas técnicas personalizables (riego, poda, nutrición, control de plagas, etc.)
- Prioridades: baja, media, alta, urgente
- Alertas recurrentes con intervalos configurables
- Recordatorios automáticos días antes del evento
- Filtrado por cultivo y prioridad

### Calendario
- Vista mensual interactiva
- Visualización de alertas por día
- Indicadores de prioridad por colores
- Lista de próximos eventos

### Dashboard con Estadísticas
- Métricas en tiempo real de cultivos activos
- Gráficos de distribución por etapas
- Evolución de entregas mensuales
- Alertas pendientes y vencidas
- Estadísticas de producción total

### Gestión de Usuarios Finales
- Registro de pacientes/receptores
- Información de condiciones médicas
- Dosis recomendadas
- Historial de entregas por paciente

### Sistema de Entregas
- Trazabilidad completa de entregas
- Registro de cantidad, tipo de producto y lote
- Asociación con cultivo origen y usuario final
- Exportación de comprobantes en PDF
- Estadísticas de producción y entregas

### Exportación de Reportes
- Reportes PDF de cultivos individuales
- Comprobantes de entrega para trazabilidad legal
- Información completa para auditorías

## Stack Tecnológico

- **Framework**: Next.js 16 con App Router
- **UI**: React 19.2 + Tailwind CSS v4
- **Componentes**: shadcn/ui + Radix UI
- **Gráficos**: Recharts
- **Base de Datos**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Fechas**: date-fns
- **Tipos**: TypeScript

## Estructura de la Base de Datos

```
cultivadores (perfiles de usuarios)
├── cultivos (información principal de cada cultivo)
│   ├── cultivo_etapas (historial de etapas)
│   ├── alertas (recordatorios y tareas)
│   ├── observaciones (registros diarios)
│   └── entregas (trazabilidad de entregas)
├── usuarios_finales (pacientes/receptores)
│   └── entregas (entregas por usuario)
└── notificaciones (sistema de notificaciones)
```

## Configuración

### 1. Conectar Supabase

Cuando resuelvas el tema del pago de Supabase:

1. Ve a la sección **"Connect"** en el sidebar de v0
2. Selecciona **Supabase** y conecta tu cuenta
3. Las variables de entorno se configurarán automáticamente

### 2. Ejecutar Scripts de Base de Datos

Ejecuta los scripts SQL en este orden desde la carpeta `/scripts`:

1. `001-create-tables.sql` - Crea todas las tablas
2. `002-row-level-security.sql` - Configura seguridad RLS
3. `003-functions-triggers.sql` - Crea funciones y triggers automáticos
4. `004-seed-data.sql` - (Opcional) Datos de ejemplo

Ver `DATABASE_SETUP.md` para instrucciones detalladas.

### 3. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
```

## Seguridad

- **Row Level Security (RLS)**: Todos los datos están protegidos a nivel de base de datos
- **Autenticación**: Sistema seguro con Supabase Auth
- **Políticas de acceso**: Cada cultivador solo ve sus propios datos
- **Encriptación**: Comunicación segura HTTPS

## Características Futuras

- [ ] Sincronización con sistema 1780
- [ ] Notificaciones push en tiempo real
- [ ] Modo offline con sincronización posterior
- [ ] App móvil nativa (iOS/Android)
- [ ] Integración con sensores IoT
- [ ] Sistema de chat entre cultivadores
- [ ] Marketplace de genéticas
- [ ] Análisis predictivo con IA

## Soporte

Para soporte técnico o consultas sobre FECANBO, contacta a través de los canales oficiales de la Federación Cannábica Bonaerense.

## Licencia

Sistema desarrollado para FECANBO - Federación Cannábica Bonaerense
© 2026 Todos los derechos reservados

---

**NOTA IMPORTANTE**: Este sistema funciona completamente con datos de ejemplo hasta que conectes Supabase y ejecutes los scripts de base de datos. Una vez configurada la base de datos, todos los datos de ejemplo serán reemplazados por información real.
