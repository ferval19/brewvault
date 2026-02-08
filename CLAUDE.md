# BrewVault - Guia del Proyecto

## Stack Tecnologico

- **Framework**: Next.js 14+ con App Router
- **Base de datos**: Supabase (PostgreSQL)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: Tailwind CSS
- **Componentes UI**: shadcn/ui
- **Formularios**: React Hook Form
- **Validacion**: Zod
- **Autenticacion**: Supabase Auth (Email, Google, GitHub)

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/           # Rutas de autenticacion (login, signup, etc.)
│   ├── (dashboard)/      # Rutas protegidas del dashboard
│   │   ├── beans/        # CRUD de granos de cafe
│   │   ├── roasters/     # CRUD de tostadores
│   │   ├── brews/        # CRUD de preparaciones
│   │   └── equipment/    # CRUD de equipamiento
│   ├── api/              # API routes
│   └── page.tsx          # Landing page
├── components/
│   ├── ui/               # Componentes shadcn/ui
│   ├── forms/            # Componentes de formularios
│   └── layout/           # Componentes de layout
├── lib/
│   ├── supabase/         # Clientes de Supabase (client, server, middleware)
│   ├── validations/      # Schemas de Zod
│   └── data/             # Datos estaticos (catalogo de cafes)
└── types/                # Tipos TypeScript globales
```

## Patrones de Codigo

### Server Actions

Usar Server Actions para mutaciones de datos:

```typescript
"use server"

import { createClient } from "@/lib/supabase/server"

export async function createBean(data: CreateBeanInput) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "No autenticado" }
  }

  const { data: bean, error } = await supabase
    .from("beans")
    .insert({ ...data, user_id: user.id })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: bean }
}
```

### Componentes de Formulario

Usar React Hook Form con validacion manual:

```typescript
"use client"

import { useForm } from "react-hook-form"

export function MyForm() {
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: { ... }
  })

  async function onSubmit(data: FormData) {
    // Validacion y envio
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

### Componentes shadcn/ui

Componentes disponibles en `src/components/ui/`:
- Button, Input, Label, Textarea
- Select, SelectContent, SelectItem, SelectTrigger, SelectValue
- Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
- Card, CardContent, CardHeader, CardTitle
- Alert, AlertDescription
- Badge, Separator, Tabs

### Tipos de Retorno para Actions

```typescript
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string }
```

## Base de Datos (Supabase)

### Tablas Principales

| Tabla | Descripcion |
|-------|-------------|
| profiles | Perfiles de usuario |
| roasters | Tostadores de cafe |
| beans | Granos de cafe |
| equipment | Equipamiento (molinos, cafeteras) |
| water_recipes | Recetas de agua |
| brews | Preparaciones/extracciones |
| cupping_notes | Notas de cata |

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Cada usuario solo puede ver/modificar sus propios datos:

```sql
CREATE POLICY "Users can view own data" ON beans
  FOR SELECT USING (auth.uid() = user_id);
```

### Clientes de Supabase

- **Cliente**: `src/lib/supabase/client.ts` - Para componentes client-side
- **Servidor**: `src/lib/supabase/server.ts` - Para Server Components y Actions
- **Middleware**: `src/lib/supabase/middleware.ts` - Para refresh de sesion

## Convenciones

### Nombres de Archivos
- Componentes: `kebab-case.tsx` (ej: `bean-form.tsx`)
- Paginas: `page.tsx` dentro del directorio de ruta
- Actions: `actions.ts` junto a la pagina
- Tipos: `types.ts` o en el mismo archivo si son especificos

### Idioma
- UI y textos: Espanol
- Codigo (variables, funciones): Ingles
- Comentarios: Espanol o Ingles

### Estilos Tailwind
- Usar clases utilitarias de Tailwind
- Variables CSS para colores del tema (hsl)
- Responsive: mobile-first (`sm:`, `md:`, `lg:`)

## Comandos Utiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Catalogo de Cafes

El archivo `src/lib/data/coffee-catalog.ts` contiene cafes precargados de:
- Tostadores espanoles: Incapto, Ineffable, Wake Up, Nomad, Nubra, Syra, Toma, Kima, DFRNT
- Single origins: Panama Gesha, Jamaica Blue Mountain, Hawaii Kona, Yemen Mokha
- Comerciales: Lavazza, Illy, Segafredo, Pellini, Delta, Bonka
