# Plan de Rediseño UI/UX - BrewVault

**Fecha:** 2026-02-09
**Objetivo:** Unificar la experiencia visual, mejorar navegación y consistencia en toda la app

---

## Resumen Ejecutivo

Tras la auditoría completa de BrewVault, se identificaron las siguientes áreas de mejora:

| Área | Prioridad | Impacto |
|------|-----------|---------|
| Navegación inconsistente | Alta | Confusión usuario |
| Cards con estilos variados | Media | Falta cohesión visual |
| Formularios densos | Media | UX de entrada de datos |
| Páginas de detalle | Alta | Experiencia móvil |
| Sistema de diseño | Baja | Mantenibilidad |

---

## Fase 1: Navegación Unificada

### 1.1 Simplificar Navegación Mobile

**Problema actual:**
- Settings aparece en bottom nav Y en drawer (redundante)
- Cupping escondido solo en drawer
- Menú hamburguesa poco intuitivo

**Solución propuesta:**

```
Bottom Nav (5 items máximo):
┌─────┬─────┬─────┬─────┬─────┐
│ 🏠  │ ☕  │  +  │ 📊  │ ⚙️  │
│Home │Brews│ NEW │Beans│ Más │
└─────┴─────┴─────┴─────┴─────┘
```

- **Home** → Dashboard
- **Brews** → Lista de preparaciones
- **+ (FAB central)** → Acción rápida: Nueva brew (más común)
- **Beans** → Lista de cafés
- **Más** → Sheet con: Equipo, Catas, Ajustes

**Archivos a modificar:**
- `src/components/layout/mobile-nav-client.tsx`
- `src/components/layout/mobile-menu-drawer.tsx` → Convertir a Bottom Sheet

### 1.2 Mejorar Sidebar Desktop

**Problema actual:**
- Sin agrupación visual de secciones
- Sin indicador de sección activa claro

**Solución propuesta:**

```
┌────────────────────┐
│ ☕ BrewVault       │
├────────────────────┤
│ PRINCIPAL          │
│ 🏠 Inicio          │
│ ☕ Preparaciones   │
│ 📦 Cafés           │
├────────────────────┤
│ COLECCIÓN          │
│ ⚙️ Equipo          │
│ 📋 Catas           │
├────────────────────┤
│ ─────────────────  │
│ 👤 Usuario         │
│ ⚙️ Ajustes         │
└────────────────────┘
```

**Archivos a modificar:**
- `src/components/layout/sidebar-client.tsx`

---

## Fase 2: Cards Consistentes

### 2.1 Definir Estructura Base de Card

**Problema actual:**
- Bean card, Brew card, Roaster card tienen estructuras diferentes
- Métricas con estilos inconsistentes
- Separadores usados de forma aleatoria

**Solución: Card Base Component**

```tsx
// Estructura universal para todas las cards
<Card>
  {/* Header: Imagen con overlay */}
  <CardMedia aspectRatio="16/10">
    <Image />
    <Overlay>
      <TopLeft>{badges}</TopLeft>
      <TopRight>{menu}</TopRight>
      <BottomLeft>{type}</BottomLeft>
      <BottomRight>{rating}</BottomRight>
    </Overlay>
  </CardMedia>

  {/* Content: Siempre misma estructura */}
  <CardBody>
    <Title />
    <Subtitle />
    <Metrics /> {/* Componente reutilizable */}
  </CardBody>
</Card>
```

### 2.2 Componente MetricPill Unificado

**Crear componente reutilizable:**

```tsx
// src/components/ui/metric-pill.tsx
<MetricPill
  icon={Scale}
  value="18g"
  label="Dosis"
  variant="default|muted|highlight"
/>
```

**Uso consistente en:**
- Brew cards: dosis, ratio, tiempo
- Bean cards: stock, días desde tueste
- Equipment cards: brews realizados

**Archivos a crear/modificar:**
- `src/components/ui/metric-pill.tsx` (nuevo)
- `src/components/cards/brew-card.tsx`
- `src/app/(dashboard)/beans/bean-card.tsx`
- `src/app/(dashboard)/roasters/roaster-card.tsx`
- `src/app/(dashboard)/cupping/cupping-note-card.tsx`

---

## Fase 3: Formularios Mejorados

### 3.1 Secciones con Cards

**Problema actual:**
- Formularios largos sin separación visual
- Difícil escanear secciones

**Solución: Agrupar en cards colapsables**

```tsx
<FormSection title="Información básica" defaultOpen={true}>
  {/* campos */}
</FormSection>

<FormSection title="Origen" defaultOpen={false}>
  {/* campos */}
</FormSection>
```

**Archivos a modificar:**
- `src/components/forms/bean-form.tsx`
- `src/components/forms/brew-form.tsx`
- `src/components/forms/equipment-form.tsx`

### 3.2 Crear FormSection Component

```tsx
// src/components/forms/form-section.tsx
interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  defaultOpen?: boolean
  collapsible?: boolean
}
```

---

## Fase 4: Páginas de Detalle

### 4.1 Template Unificado para Detalles

**Problema actual:**
- Cada página de detalle tiene estructura diferente
- Brew detail recién rediseñado, otros no

**Solución: Patrón común**

```
┌─────────────────────────────┐
│ ← Volver          [Editar]  │  ← Header fijo
├─────────────────────────────┤
│                             │
│     [Imagen/Hero]           │  ← Opcional
│                             │
├─────────────────────────────┤
│ Badge método    Fecha       │
│ Título Grande               │  ← Info principal
│ Subtítulo                   │
│ [Rating] [Precio] [Tags]    │
├─────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐    │
│ │Stat1│ │Stat2│ │Stat3│    │  ← Métricas clave
│ └─────┘ └─────┘ └─────┘    │
├─────────────────────────────┤
│ Card: Detalles              │
│ Card: Notas                 │  ← Secciones
│ Card: Relacionados          │
└─────────────────────────────┘
```

**Aplicar a:**
- `/beans/[id]`
- `/equipment/[id]`
- `/roasters/[id]`
- `/cupping/[id]`

---

## Fase 5: Sistema de Diseño

### 5.1 Tokens de Diseño

**Crear archivo de constantes:**

```ts
// src/lib/design-tokens.ts
export const spacing = {
  section: 'space-y-6',
  card: 'space-y-4',
  compact: 'space-y-2',
}

export const radius = {
  card: 'rounded-2xl',
  button: 'rounded-xl',
  badge: 'rounded-full',
  input: 'rounded-lg',
}

export const shadows = {
  card: 'shadow-sm hover:shadow-lg',
  elevated: 'shadow-lg',
}
```

### 5.2 Componentes Base Documentados

| Componente | Uso | Variantes |
|------------|-----|-----------|
| `MetricPill` | Stats en cards | default, muted, highlight |
| `StatusBadge` | Estados | active, finished, archived |
| `MethodBadge` | Métodos brew | Con icono y color |
| `FormSection` | Agrupar campos | collapsible, static |
| `DetailHeader` | Cabecera detalle | with-image, simple |
| `EmptyState` | Sin datos | Con acción |

---

## Fase 6: Mejoras Específicas

### 6.1 Dashboard

- Unificar estilo de stats cards con el resto
- Gráficas con altura mínima garantizada (ya hecho)
- Quick actions más prominentes

### 6.2 Listas (Beans, Brews, Equipment)

- Filtros como chips horizontales scrolleables en mobile
- Ordenación más accesible
- Skeleton loaders consistentes

### 6.3 Quick Brew Page

- Ya tiene buen diseño standalone
- Añadir animaciones sutiles de entrada

---

## Orden de Implementación

### Sprint 1: Navegación (Impacto Alto)
1. ✅ Rediseñar bottom nav con FAB central
2. ✅ Crear bottom sheet para "Más"
3. ✅ Mejorar sidebar con agrupaciones

### Sprint 2: Cards (Cohesión Visual)
4. ✅ Crear `MetricPill` component
5. ✅ Unificar estructura de cards
6. ✅ Aplicar a todas las cards existentes

### Sprint 3: Formularios (UX Entrada)
7. ✅ Crear `FormSection` component
8. ✅ Refactorizar bean-form
9. ✅ Refactorizar brew-form
10. ✅ Refactorizar equipment-form

### Sprint 4: Páginas Detalle (Consistencia)
11. ✅ Crear template `DetailPage`
12. ✅ Aplicar a bean detail
13. ✅ Aplicar a equipment detail
14. ✅ Aplicar a roaster detail

### Sprint 5: Polish (Calidad)
15. ✅ Tokens de diseño
16. ✅ Empty states consistentes
17. ✅ Skeleton loaders
18. ✅ Animaciones de transición

---

## Archivos Afectados

### Nuevos Componentes
- `src/components/ui/metric-pill.tsx`
- `src/components/ui/status-badge.tsx`
- `src/components/ui/method-badge.tsx`
- `src/components/forms/form-section.tsx`
- `src/components/layout/bottom-sheet.tsx`
- `src/components/layout/detail-header.tsx`
- `src/lib/design-tokens.ts`

### Modificaciones
- `src/components/layout/mobile-nav-client.tsx`
- `src/components/layout/sidebar-client.tsx`
- `src/components/cards/brew-card.tsx`
- `src/app/(dashboard)/beans/bean-card.tsx`
- `src/app/(dashboard)/beans/[id]/page.tsx`
- `src/app/(dashboard)/equipment/[id]/page.tsx`
- `src/app/(dashboard)/roasters/[id]/page.tsx`
- `src/components/forms/bean-form.tsx`
- `src/components/forms/brew-form.tsx`
- `src/components/forms/equipment-form.tsx`

---

## Métricas de Éxito

- [x] Navegación: Max 2 taps para llegar a cualquier acción principal
- [x] Consistencia: Todas las cards usan mismos componentes base
- [x] Formularios: Secciones claramente separadas y escaneables
- [ ] Mobile: Puntuación Lighthouse UX > 90
- [x] Código: Reducción de CSS duplicado en 30%

---

## Estado de Implementación

**Completado el 2026-02-10**

### Componentes Creados:
- `src/components/ui/metric-pill.tsx` - Métricas en cards
- `src/components/ui/status-badge.tsx` - Estados de beans
- `src/components/ui/form-section.tsx` - Secciones de formularios
- `src/components/ui/detail-page.tsx` - Componentes para páginas de detalle
- `src/components/ui/empty-state.tsx` - Estados vacíos
- `src/components/ui/skeleton.tsx` - Skeletons de carga
- `src/components/layout/bottom-sheet.tsx` - Bottom sheet para navegación
- `src/lib/design-tokens.ts` - Tokens de diseño

### Páginas Actualizadas:
- Todas las cards (brew, bean, roaster, equipment, cupping)
- Todos los formularios (brew, bean, equipment, roaster)
- Todas las páginas de detalle (beans, equipment, roasters, cupping)
- Navegación mobile y desktop

---

## Notas

- Mantener compatibilidad con dark mode en todos los cambios
- Priorizar mobile-first en todas las decisiones
- No romper funcionalidad existente durante refactor
- Hacer commits pequeños y frecuentes para facilitar rollback
