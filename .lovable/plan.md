

## UpDown Solar OS — Plan de Implementación por Fases

Este prompt describe una transformación completa del sistema. Dado su tamaño (rediseño visual total, 5 módulos nuevos/mejorados, cambio de roles, nuevas tablas, offline-first, cronómetro persistente, etc.), **es imposible implementarlo en un solo paso**. Propongo dividirlo en **6 fases secuenciales**, cada una entregable e independiente.

---

### Fase 1 — Sistema de diseño y componentes base

**Cambios:**
- Reemplazar la paleta de colores actual (amarillo/negro) por la nueva paleta verde (#1B5E37) en `src/index.css`
- Importar Playfair Display + Instrument Sans desde Google Fonts en `index.html`
- Crear componentes reutilizables en `src/components/ui/`:
  - `StatusBadge` (semáforo: activo/alerta/fuera_servicio/en_mantenimiento)
  - `OTBadge` (estados de OT)
  - `PreopItemRow` (fila checklist B/M/N·A)
  - `MachineRow` (fila compacta de máquina)
  - `SectionHeader` (encabezado de sección)
  - `OfflineBanner` y `SyncBanner`
  - `CostCard`, `TechnicianRow`
- Actualizar `tailwind.config.ts` con los nuevos tokens de color
- Rediseñar Layout, AppSidebar y header con el nuevo estilo compacto

**Archivos afectados:** ~10-12 archivos

---

### Fase 2 — Roles y navegación (4 roles)

**Cambios:**
- Actualizar `AuthContext.tsx`: cambiar roles de `operario|supervisor|administrador` a `operador|tecnico|supervisor|gerente`
- Actualizar `authenticate-user` edge function para mapear roles
- Migración SQL: `ALTER TABLE users` para actualizar el enum de roles
- Actualizar `AppSidebar.tsx` con navegación diferenciada por rol (gerente ve todo, operador solo preoperacional, técnico solo "Mis OT")
- Actualizar `ProtectedRoute.tsx` con los nuevos roles
- Implementar bottom tabs en mobile para cada rol
- Actualizar `Auth.tsx` para redirigir según rol
- Crear constante `ROLE_PERMISSIONS` en `src/lib/permissions.ts`

**Archivos afectados:** ~8 archivos

---

### Fase 3 — Módulo de Equipos (Hojas de Vida)

**Cambios:**
- Migración SQL: agregar columnas `equipment_type` (enum), `year`, `condition_data` (JSONB) a tabla `machines`
- Rediseñar `Machines.tsx` con filas compactas y filtros por estado/tipo/ubicación
- Crear modal/página de detalle de máquina con tabs: Ficha Técnica | Condición | Historial | Documentos
- Crear componentes: `MachineDetailModal`, `MachineConditionTab`, `MachineHistoryTimeline`, `MachineDocuments`
- Storage bucket para documentos de máquinas

**Archivos afectados:** ~8-10 archivos nuevos/modificados

---

### Fase 4 — Preoperacionales (offline-first, plantillas por tipo)

**Cambios:**
- Crear `src/lib/preop-templates.ts` con las 5 plantillas hardcoded (minicargador, retroexcavadora, telehandler, manlift, camion_grua)
- Rediseñar `Preoperational.tsx` completamente:
  - Formato A (inicio): selección proyecto/máquina → checklist dinámico por tipo → firma → envío
  - Formato B (cierre): horómetro final, novedades, estado final, firma
  - Cada ítem con botones B/M/N·A, ítems críticos con alerta roja
  - Contador "12/18 completados"
- Implementar offline-first con IndexedDB (guardar localmente, sincronizar al reconectar)
- `OfflineBanner` y `SyncBanner` integrados
- Pantalla principal del operador: pendientes de hoy + historial 7 días

**Archivos afectados:** ~15 archivos

---

### Fase 5 — Órdenes de Trabajo (OT)

**Cambios:**
- Migración SQL: crear tablas `work_orders`, `work_order_pauses`, `work_order_parts`, `work_order_photos`
- Crear páginas: `WorkOrders.tsx` (listado), `WorkOrderDetail.tsx` (detalle), `MyWorkOrders.tsx` (vista técnico)
- Componentes: formulario nueva OT, cronómetro persistente (estado global con Context/Zustand), selector de motivo de pausa, adjuntar foto
- Estados: CREADA → ASIGNADA → EN_CURSO → PAUSADA ↔ REANUDADA → CERRADA → FIRMADA
- Cálculo automático de horas_hombre y costo_OT
- El cronómetro persiste en estado global aunque el técnico cambie de pantalla

**Archivos afectados:** ~15-20 archivos nuevos

---

### Fase 6 — Técnicos + Costos + Dashboard

**Cambios:**
- Migración SQL: crear tabla `technicians`
- Crear página `Technicians.tsx`: listado compacto, perfil con datos/especialidad/tarifa/documentos/historial OT/métricas
- Storage bucket para documentos de técnicos
- Página `Dashboard.tsx` para gerente/supervisor con métricas clave
- Módulo de Costos (vista de costos por máquina, por OT)

**Archivos afectados:** ~10-12 archivos

---

### Recomendación

Sugiero empezar por **Fase 1 (sistema de diseño)** ya que es la base visual de todo lo demás. Cada fase posterior se construye sobre la anterior. ¿Por cuál fase deseas que comience?

