---
name: generate-types
description: Genera interfaces y tipos TypeScript para modelos y APIs
argument-hint: [nombre-entidad]
---

Genera tipos TypeScript completos para la entidad `$0`.

## Estructura de Tipos

Crear en `src/types/$0.ts` o en el archivo donde se use:

```typescript
// Tipo base (como viene de la DB)
export interface Bean {
  id: string
  user_id: string
  name: string
  roaster_id: string | null
  origin_country: string | null
  // ... resto de campos
  created_at: string
  updated_at: string
}

// Tipo para crear (sin campos auto-generados)
export type CreateBeanInput = Omit<Bean, "id" | "user_id" | "created_at" | "updated_at">

// Tipo para actualizar (todos opcionales excepto id)
export type UpdateBeanInput = Partial<CreateBeanInput>

// Tipo con relaciones expandidas
export interface BeanWithRoaster extends Bean {
  roaster: {
    id: string
    name: string
  } | null
}

// Tipo para listas (campos minimos)
export type BeanListItem = Pick<Bean, "id" | "name" | "origin_country" | "roast_level" | "status">
```

## Patrones Comunes

### Resultado de Actions

```typescript
export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

### Estados y Enums

```typescript
export const BEAN_STATUS = {
  active: "Activo",
  finished: "Terminado",
  archived: "Archivado",
} as const

export type BeanStatus = keyof typeof BEAN_STATUS

export const ROAST_LEVELS = [
  { value: "light", label: "Claro" },
  { value: "medium-light", label: "Medio-Claro" },
  { value: "medium", label: "Medio" },
  { value: "medium-dark", label: "Medio-Oscuro" },
  { value: "dark", label: "Oscuro" },
] as const

export type RoastLevel = typeof ROAST_LEVELS[number]["value"]
```

### Props de Componentes

```typescript
export interface BeanCardProps {
  bean: BeanListItem
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export interface BeanFormProps {
  bean?: Bean  // undefined = crear, definido = editar
  roasters: { id: string; name: string }[]
  onSuccess?: () => void
}
```

### Respuestas de API

```typescript
export interface ApiResponse<T> {
  data: T
  error?: never
}

export interface ApiError {
  data?: never
  error: string
  details?: Record<string, string[]>
}

export type ApiResult<T> = ApiResponse<T> | ApiError
```

## Ubicacion de Tipos

| Tipo | Ubicacion |
|------|-----------|
| Globales/compartidos | `src/types/` |
| Especificos de componente | En el mismo archivo |
| Schemas de validacion | `src/lib/validations/` |
| Tipos de Supabase | `src/types/database.ts` (auto-generado) |
