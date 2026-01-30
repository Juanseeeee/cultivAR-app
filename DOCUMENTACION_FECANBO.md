# Sistema de Gestión de Cultivos Medicinales - FECANBO

## Documentación Completa para el Cliente

---

## 1. Introducción

El **Sistema de Gestión de Cultivos Medicinales** es una aplicación web profesional desarrollada para la Federación Cannábica Bonaerense (FECANBO). Permite trazabilizar en tiempo real los cultivos comunitarios con fines medicinales, incluyendo geolocalización, calendario de cultivo, alertas técnicas y seguimiento sanitario.

### Objetivo Principal
Brindar una herramienta integral para el registro, seguimiento y control de cultivos medicinales, garantizando la trazabilidad completa desde la siembra hasta la entrega al usuario final.

---

## 2. Funcionalidades del Sistema

### 2.1 Dashboard Principal
- **Estadísticas en tiempo real**: Cultivos activos, plantas totales, alertas pendientes, usuarios activos, entregas del mes, cosecha estimada
- **Gráfico de cultivos por etapa**: Visualización de la distribución de cultivos según su etapa actual
- **Gráfico de entregas mensuales**: Histórico de entregas realizadas
- **Lista de alertas pendientes**: Acceso rápido a tareas urgentes
- **Cultivos activos recientes**: Vista rápida de los últimos cultivos

### 2.2 Gestión de Cultivos
- **Registro completo de cultivos**: Nombre, variedad, cantidad de plantas, ubicación, tipo de cultivo, método
- **Geolocalización**: Coordenadas GPS del cultivo con visualización en mapa
- **Seguimiento por etapas**:
  - Germinación
  - Vegetativo
  - Floración
  - Cosecha
  - Secado
- **Timeline visual**: Historial completo de cambios de etapa con fechas
- **Carga de fotos**: Documentación fotográfica de cada cultivo
- **Observaciones**: Registro de altura, pH, temperatura, humedad y notas

### 2.3 Sistema de Alertas
- **Tipos de alerta**:
  - Riego
  - Poda
  - Control biológico (plagas)
  - Nutrientes
  - Cambio de etapa
  - Cosecha
  - General
- **Prioridades**: Alta, media, baja
- **Programación**: Fecha y hora específica para cada alerta
- **Historial**: Registro de alertas completadas

### 2.4 Usuarios Finales (Pacientes)
- **Registro completo**: Nombre, documento, fecha de nacimiento, contacto
- **Información médica**: Condición médica, dosis recomendada, frecuencia
- **Estado activo/inactivo**: Control de usuarios habilitados

### 2.5 Registro de Entregas
- **Trazabilidad completa**: Vinculación con cultivo y usuario final
- **Datos de entrega**: Cantidad en gramos, tipo de producto, número de lote
- **Exportación PDF**: Comprobantes de entrega para documentación legal

### 2.6 Calendario
- **Vista mensual**: Visualización de alertas y tareas programadas
- **Navegación temporal**: Movimiento entre meses
- **Indicadores visuales**: Diferenciación por tipo de alerta

### 2.7 Mapa de Cultivos
- **Geolocalización**: Visualización de todos los cultivos en mapa interactivo
- **Información rápida**: Popup con datos básicos de cada cultivo
- **Basado en OpenStreetMap**: Sin costos adicionales de API

### 2.8 Exportación de Reportes (PDF)
- **Reporte de cultivo**: Información completa incluyendo etapas y observaciones
- **Comprobante de entrega**: Documento legal para cada entrega realizada

---

## 3. Arquitectura Técnica

### 3.1 Stack Tecnológico
| Componente | Tecnología |
|------------|------------|
| Frontend | Next.js 15 (App Router) |
| UI Components | shadcn/ui + Tailwind CSS |
| Base de Datos | Supabase (PostgreSQL) |
| Autenticación | Supabase Auth |
| Mapas | Leaflet + OpenStreetMap |
| Gráficos | Recharts |
| PDF | jsPDF |

### 3.2 Estructura de Base de Datos

#### Tablas Principales:

**cultivadores**
- Perfil del cultivador (se crea automáticamente al registrarse)
- Datos personales y de contacto

**cultivos**
- Información del cultivo
- Estado actual, ubicación, cantidad de plantas
- Geolocalización (latitud/longitud)

**etapas_cultivo**
- Historial de etapas por cultivo
- Fechas de inicio y fin de cada etapa

**observaciones**
- Registros de seguimiento
- Mediciones: altura, pH, temperatura, humedad
- Fotos asociadas

**alertas**
- Sistema de notificaciones y tareas
- Vinculación con cultivos
- Estado de completado

**usuarios_finales**
- Pacientes/receptores
- Información médica y de contacto

**entregas**
- Registro de entregas realizadas
- Trazabilidad cultivo -> usuario

**fotos**
- Almacenamiento de URLs de fotos
- Vinculación con observaciones

### 3.3 Seguridad
- **Row Level Security (RLS)**: Cada cultivador solo ve sus propios datos
- **Autenticación**: Email y contraseña con verificación
- **Tokens seguros**: Manejo automático de sesiones

---

## 4. Guía de Uso

### 4.1 Primer Acceso
1. Acceder a la URL del sistema
2. Click en "Registrarse"
3. Completar email y contraseña
4. Verificar email (revisar spam)
5. Iniciar sesión

### 4.2 Crear un Cultivo
1. Ir a "Cultivos" en el menú lateral
2. Click en "Nuevo Cultivo"
3. Completar el formulario:
   - Nombre identificador
   - Variedad de la planta
   - Cantidad de plantas
   - Ubicación (puede usar GPS)
   - Tipo de cultivo (indoor/outdoor/invernadero)
   - Método de cultivo
4. Guardar

### 4.3 Registrar Observaciones
1. Entrar al detalle de un cultivo
2. Click en "Nueva Observación"
3. Completar mediciones disponibles:
   - Descripción general
   - Altura en cm
   - pH
   - Temperatura
   - Humedad
4. Opcionalmente subir fotos
5. Guardar

### 4.4 Cambiar Etapa de Cultivo
1. Entrar al detalle del cultivo
2. En la sección "Etapa Actual" usar el botón de cambio
3. Seleccionar la nueva etapa
4. El sistema registra automáticamente la fecha de cambio

### 4.5 Crear Alertas
1. Ir a "Alertas" en el menú lateral
2. Click en "Nueva Alerta"
3. Seleccionar:
   - Cultivo asociado (opcional)
   - Tipo de alerta
   - Prioridad
   - Título y descripción
   - Fecha programada
4. Guardar

### 4.6 Registrar Usuarios Finales
1. Ir a "Usuarios Finales"
2. Click en "Nuevo Usuario"
3. Completar datos personales y médicos
4. Guardar

### 4.7 Registrar Entregas
1. Ir a "Entregas"
2. Click en "Nueva Entrega"
3. Seleccionar:
   - Cultivo de origen
   - Usuario destinatario
   - Cantidad en gramos
   - Tipo de producto
   - Número de lote
4. Guardar
5. Opcionalmente exportar comprobante PDF

---

## 5. Configuración de Supabase

### 5.1 Variables de Entorno Requeridas
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[tu-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[tu-service-role-key]
\`\`\`

### 5.2 Scripts SQL
Ejecutar en orden en el SQL Editor de Supabase:
1. `scripts/001-create-tables.sql` - Crea las tablas
2. `scripts/002-row-level-security.sql` - Configura seguridad RLS
3. `scripts/003-functions-triggers.sql` - Funciones y triggers automáticos

### 5.3 Configuración de Auth
1. En Supabase Dashboard ir a Authentication > Settings
2. Habilitar "Email" como proveedor
3. Configurar email de confirmación (opcional para desarrollo)

---

## 6. Futuras Mejoras (Roadmap)

### Fase 2
- [ ] Sincronización con sistema -1780
- [ ] Notificaciones push
- [ ] App móvil nativa (React Native)
- [ ] Reportes avanzados con filtros

### Fase 3
- [ ] Integración con sensores IoT (humedad, temperatura)
- [ ] Predicciones con IA para alertas
- [ ] Multi-organización (otras federaciones)
- [ ] API pública documentada

---

## 7. Soporte

### Contacto Técnico
Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

### Reportar Errores
Al reportar un error, incluir:
1. Descripción del problema
2. Pasos para reproducirlo
3. Captura de pantalla (si aplica)
4. Navegador y dispositivo utilizado

---

## 8. Glosario

| Término | Definición |
|---------|------------|
| Cultivo | Conjunto de plantas registradas como unidad de seguimiento |
| Etapa | Fase del ciclo de vida del cultivo (germinación, vegetativo, floración, cosecha, secado) |
| Observación | Registro de mediciones y notas en un momento específico |
| Usuario Final | Paciente o persona que recibe el producto medicinal |
| Trazabilidad | Capacidad de seguir el historial completo de un cultivo hasta la entrega |
| RLS | Row Level Security - Seguridad a nivel de fila en la base de datos |

---

**Versión del documento**: 1.0  
**Fecha**: Enero 2026  
**Desarrollado para**: FECANBO - Federación Cannábica Bonaerense
