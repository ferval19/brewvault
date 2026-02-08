# Diseño: Dashboard como Entrada + Navegación Unificada

**Fecha:** 2026-02-08
**Estado:** Aprobado

## Resumen

Unificar la navegación entre desktop y mobile, y establecer el dashboard como página de entrada post-login.

---

## 1. Navegación Unificada

### Estructura (5 items)

| Item | Icono | Ruta | Descripción |
|------|-------|------|-------------|
| Inicio | Home | /dashboard | Dashboard principal |
| Cafés | Coffee | /beans | Lista de cafés |
| Brews | Flame | /brews | Preparaciones |
| Equipo | Wrench | /equipment | Equipamiento |
| Menú | Menu | (drawer) | Opciones secundarias |

### Menú Expandible (drawer)

Contenido del drawer al pulsar "Menú":
- Notas de Cata → /cupping
- Configuración → /settings
- Cerrar sesión

### Cambios vs Estado Actual

| Antes (Desktop) | Antes (Mobile) | Después (Unificado) |
|-----------------|----------------|---------------------|
| Dashboard | Stats | Inicio |
| Cafés | Cafés | Cafés |
| Preparaciones | Brews | Brews |
| Equipamiento | Equipo | Equipo |
| Notas de Cata | ❌ | (en Menú) |
| Configuración | Más | (en Menú) |

---

## 2. Dashboard como Página de Entrada

### Ruta

- Nueva ruta: `/dashboard`
- Antigua `/analytics` redirige a `/dashboard`
- Post-login redirige a `/dashboard` (antes: `/beans`)

### Estructura Visual

```
┌─────────────────────────────────────────────────────┐
│  Buenos días, [Nombre]                              │
│  Resumen de tu café                                 │
├─────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │ Cafés   │ │ Brews   │ │ Equipos │ │ Catas   │   │
│  │   12    │ │   47    │ │    5    │ │    8    │   │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘   │
├─────────────────────────────────────────────────────┤
│  ⚡ Acciones rápidas                                │
│  ┌──────────────────┐ ┌──────────────────┐         │
│  │ + Nueva brew     │ │ + Nuevo café     │         │
│  └──────────────────┘ └──────────────────┘         │
├─────────────────────────────────────────────────────┤
│  📊 Métodos más usados    │  🕐 Últimas brews      │
│  [barras]                 │  [lista]               │
└─────────────────────────────────────────────────────┘
```

### Cambios en Dashboard

1. Añadir saludo personalizado ("Buenos días/tardes/noches, [Nombre]")
2. Quitar card de "Tostadores" (sección eliminada)
3. Añadir card de "Catas" en las stats
4. Añadir sección "Acciones rápidas" con botones:
   - Nueva brew → /brews/new
   - Nuevo café → /beans/new

---

## 3. Atribución de Datos del Catálogo

### En los Pickers (coffee-catalog-picker, equipment-catalog-picker)

Añadir texto en el footer del diálogo:
```
Datos e imágenes obtenidos de las webs oficiales de cada marca.
```

### En Formularios (cuando se precargan datos)

Expandir el mensaje de alerta existente:
```
Datos precargados del catálogo. Información obtenida de la web oficial del fabricante.
```

---

## 4. Archivos a Modificar

| Archivo | Acción |
|---------|--------|
| `src/app/(dashboard)/analytics/` | Renombrar a `dashboard/` |
| `src/app/(dashboard)/analytics/page.tsx` | Mover + modificar |
| `src/app/(dashboard)/analytics/actions.ts` | Mover + añadir datos usuario |
| `src/app/(auth)/actions.ts` | Redirect `/beans` → `/dashboard` |
| `src/components/layout/sidebar.tsx` | Nueva estructura nav |
| `src/components/layout/mobile-nav.tsx` | Nueva estructura + trigger menú |
| `src/components/layout/mobile-menu-drawer.tsx` | **Crear** - drawer con opciones |
| `src/components/forms/coffee-catalog-picker.tsx` | Añadir atribución |
| `src/components/forms/equipment-catalog-picker.tsx` | Añadir atribución |
| `src/middleware.ts` | Redirect `/analytics` → `/dashboard` |

---

## 5. Verificación

1. Login con Google → llega a /dashboard
2. Dashboard muestra nombre del usuario
3. Navegación mobile tiene 5 items
4. Menú drawer abre con Catas, Config, Logout
5. Desktop sidebar coincide con mobile
6. /analytics redirige a /dashboard
7. Catálogo muestra atribución de datos
