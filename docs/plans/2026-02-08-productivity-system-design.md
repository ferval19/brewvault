# Sistema de Productividad - BrewVault

**Fecha:** 2026-02-08
**Estado:** Aprobado
**Autor:** Colaborativo (Usuario + Claude)

---

## Resumen

Sistema completo de productividad para BrewVault que incluye:
- Control de stock automático de café
- Recordatorios de mantenimiento de equipos
- Lista de compras inteligente
- Notificaciones push + Dashboard de alertas

---

## 1. Modelo de Datos

### Nueva tabla: `alerts`

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('low_stock', 'maintenance', 'reorder', 'custom')),
  entity_type TEXT CHECK (entity_type IN ('bean', 'equipment')),
  entity_id UUID,
  title TEXT NOT NULL,
  message TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
  is_read BOOLEAN DEFAULT false,
  is_dismissed BOOLEAN DEFAULT false,
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_alerts_user_id ON alerts(user_id);
CREATE INDEX idx_alerts_unread ON alerts(user_id, is_read, is_dismissed);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own alerts"
  ON alerts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own alerts"
  ON alerts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can create alerts"
  ON alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
```

### Nueva tabla: `push_subscriptions`

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own subscriptions"
  ON push_subscriptions FOR ALL USING (auth.uid() = user_id);
```

### Modificación: `equipment`

```sql
ALTER TABLE equipment ADD COLUMN maintenance_interval_days INTEGER;
ALTER TABLE equipment ADD COLUMN maintenance_last_notified TIMESTAMPTZ;
```

### Modificación: `beans`

```sql
ALTER TABLE beans ADD COLUMN low_stock_threshold_grams INTEGER DEFAULT 100;
ALTER TABLE beans ADD COLUMN auto_reorder BOOLEAN DEFAULT false;
```

---

## 2. Dashboard de Alertas (UI)

### Componentes

1. **Badge en navegación**
   - Punto rojo con número en icono de navegación
   - Visible en mobile nav y sidebar

2. **Panel de alertas en Dashboard (`/analytics`)**
   - Muestra últimas 3-5 alertas no leídas
   - Acciones: Marcar hecho, Descartar, Posponer
   - Link a "Ver todas"

3. **Página `/alerts`**
   - Lista completa de alertas
   - Filtros por tipo (stock, mantenimiento, reorder)
   - Marcar todas como leídas
   - Historial de alertas descartadas

### Tipos de alerta

| Tipo | Icono | Color | Prioridad |
|------|-------|-------|-----------|
| `low_stock` | AlertTriangle | Amber | Normal/High |
| `maintenance` | Wrench | Blue | Normal |
| `reorder` | ShoppingCart | Green | Low |
| `custom` | Bell | Gray | Variable |

---

## 3. Push Notifications

### Service Worker (`public/sw.js`)

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.message,
      icon: '/icons/icon-192.png',
      badge: '/icons/badge-72.png',
      tag: data.alertId,
      data: { url: data.actionUrl }
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  )
})
```

### Flujo de suscripción

1. Usuario abre Settings
2. Click "Activar notificaciones"
3. Browser solicita permiso
4. Se genera subscription (endpoint + keys)
5. Se guarda en `push_subscriptions`

### Configuración en Settings

- Toggle general de Push notifications
- Toggles por tipo: Stock, Mantenimiento, Recomendaciones

---

## 4. Control de Stock Automático

### Lógica en `createBrew`

```typescript
// Después de crear el brew:
// 1. Descontar dosis del café
const newWeight = bean.current_weight_grams - input.dose_grams

await supabase
  .from('beans')
  .update({ current_weight_grams: newWeight })
  .eq('id', input.bean_id)

// 2. Crear alerta si stock bajo
if (newWeight <= bean.low_stock_threshold_grams) {
  await createAlert({
    type: 'low_stock',
    entity_type: 'bean',
    entity_id: bean.id,
    title: 'Stock bajo',
    message: `${bean.name} - ${newWeight}g restantes`,
    priority: newWeight <= 50 ? 'high' : 'normal'
  })
}
```

### UI en tarjeta de café

- Barra de progreso: `current_weight / weight_grams`
- Warning visual si `current_weight <= low_stock_threshold`
- Color: Verde > 50%, Amber 20-50%, Rojo < 20%

---

## 5. Recordatorios de Mantenimiento

### Intervalos sugeridos

| Tipo equipo | Mantenimiento | Intervalo |
|-------------|---------------|-----------|
| Molino | Limpieza muelas | 14-30 días |
| Espresso | Backflush | 7 días |
| Espresso | Descalcificación | 90 días |
| Hervidor | Descalcificación | 30 días |
| Báscula | Calibración | 90 días |

### Cron Job (diario)

```typescript
async function checkMaintenanceAlerts() {
  const now = new Date()

  const equipmentDue = await supabase
    .from('equipment')
    .select('*, profiles(id)')
    .not('maintenance_interval_days', 'is', null)
    .not('last_maintenance', 'is', null)

  for (const eq of equipmentDue) {
    const lastMaint = new Date(eq.last_maintenance)
    const daysSince = (now - lastMaint) / (1000 * 60 * 60 * 24)

    if (daysSince >= eq.maintenance_interval_days) {
      // Evitar duplicados
      const existing = await getActiveAlert('maintenance', 'equipment', eq.id)
      if (!existing) {
        const alert = await createAlert({...})
        await sendPushNotification(eq.user_id, alert)
      }
    }
  }
}
```

---

## 6. Plan de Implementación

### Fase 1: Base de datos
- [ ] Migración: tabla `alerts`
- [ ] Migración: tabla `push_subscriptions`
- [ ] Migración: campos en `equipment`
- [ ] Migración: campos en `beans`
- [ ] RLS policies

### Fase 2: Backend - Alertas
- [ ] Server actions: `createAlert`, `getAlerts`, `dismissAlert`, `markAsRead`
- [ ] Modificar `createBrew` para descontar stock
- [ ] Lógica de creación de alertas automáticas
- [ ] API de conteo para badge

### Fase 3: UI Dashboard
- [ ] Componente `AlertCard`
- [ ] Panel de alertas en `/analytics`
- [ ] Badge con contador en navegación
- [ ] Página `/alerts` con historial

### Fase 4: Settings
- [ ] Página de configuración completa
- [ ] Preferencias de notificaciones
- [ ] Gestión de cuenta

### Fase 5: Push Notifications
- [ ] Service Worker (`public/sw.js`)
- [ ] Lógica de suscripción en cliente
- [ ] UI activar/desactivar en Settings
- [ ] Edge Function para cron diario

### Fase 6: UI Equipos y Cafés
- [ ] Barra de stock en `bean-card`
- [ ] Campos de mantenimiento en `equipment-form`
- [ ] Indicadores visuales de alertas

---

## Archivos a Crear/Modificar

| Archivo | Acción |
|---------|--------|
| `supabase/migrations/XXX_productivity.sql` | Crear |
| `src/lib/validations/alerts.ts` | Crear |
| `src/app/(dashboard)/alerts/` | Crear (page, actions, components) |
| `src/app/(dashboard)/settings/page.tsx` | Reescribir |
| `src/app/(dashboard)/settings/actions.ts` | Crear |
| `src/app/(dashboard)/brews/actions.ts` | Modificar |
| `src/app/(dashboard)/analytics/page.tsx` | Modificar |
| `src/components/alerts/alert-card.tsx` | Crear |
| `src/components/alerts/alerts-panel.tsx` | Crear |
| `src/components/alerts/alert-badge.tsx` | Crear |
| `src/components/layout/mobile-nav.tsx` | Modificar |
| `src/components/layout/sidebar.tsx` | Modificar |
| `src/components/forms/equipment-form.tsx` | Modificar |
| `src/components/forms/bean-form.tsx` | Modificar |
| `src/app/(dashboard)/beans/bean-card.tsx` | Modificar |
| `public/sw.js` | Crear |
| `src/lib/push-notifications.ts` | Crear |

---

## Decisiones Técnicas

1. **Push vs Polling:** Push notifications para alertas críticas, no polling
2. **Cron:** Supabase Edge Functions (gratuito) o Vercel Cron
3. **Storage:** Alertas en Supabase, no localStorage
4. **Duplicados:** Evitar alertas duplicadas con `entity_type + entity_id + type`
