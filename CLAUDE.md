# BrewVault - Guia del Proyecto

## Stack Tecnologico

| Tecnologia | Version | Uso |
|------------|---------|-----|
| Next.js | 15+ | Framework con App Router |
| TypeScript | 5 | Tipado estricto |
| Supabase | 2.95+ | Base de datos y Auth |
| Tailwind CSS | 4 | Estilos |
| shadcn/ui | - | Componentes UI |
| React Hook Form | 7.71+ | Formularios |
| Zod | 4.3+ | Validacion |
| Recharts | 3.7+ | Graficas |
| Lucide React | 0.563+ | Iconos |

## Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/                 # Rutas de autenticacion
│   │   ├── login/              # Inicio de sesion
│   │   ├── signup/             # Registro
│   │   ├── forgot-password/    # Recuperar contrasena
│   │   ├── callback/           # OAuth callback
│   │   ├── actions.ts          # Server actions de auth
│   │   └── layout.tsx          # Layout centrado
│   ├── (dashboard)/            # Rutas protegidas
│   │   ├── dashboard/          # Panel principal con stats
│   │   ├── beans/              # CRUD de cafes
│   │   ├── brews/              # CRUD de preparaciones
│   │   ├── equipment/          # CRUD de equipamiento
│   │   ├── roasters/           # CRUD de tostadores
│   │   ├── cupping/            # Notas de cata SCA
│   │   ├── water/              # Recetas de agua
│   │   ├── alerts/             # Sistema de alertas
│   │   ├── settings/           # Configuracion usuario
│   │   └── layout.tsx          # Layout con sidebar/nav
│   ├── quick-brew/[equipmentId]/ # Acceso rapido QR
│   ├── api/cron/maintenance/   # Cron job alertas
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Landing page publica
├── components/
│   ├── ui/                     # Componentes shadcn/ui
│   ├── forms/                  # Formularios reutilizables
│   │   ├── bean-form.tsx
│   │   ├── brew-form.tsx
│   │   ├── equipment-form.tsx
│   │   ├── image-upload.tsx
│   │   └── ...
│   ├── layout/                 # Navegacion
│   │   ├── sidebar.tsx
│   │   ├── mobile-nav.tsx
│   │   └── mobile-menu-drawer.tsx
│   ├── alerts/                 # Componentes de alertas
│   ├── cards/                  # Cards de datos
│   └── charts/                 # Visualizaciones
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Cliente browser
│   │   ├── server.ts           # Cliente servidor
│   │   └── middleware.ts       # Refresh sesion
│   ├── validations/            # Schemas Zod
│   │   ├── auth.ts
│   │   ├── beans.ts
│   │   ├── brews.ts
│   │   └── ...
│   ├── data/
│   │   ├── coffee-catalog.ts   # Catalogo cafes
│   │   └── equipment-catalog.ts
│   ├── brew-methods.ts         # Config metodos
│   ├── design-tokens.ts        # Tokens diseno
│   └── utils.ts
├── hooks/                      # Custom hooks
└── types/
    └── database.types.ts       # Tipos Supabase
```

## Patrones de Codigo

### Server Actions

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export async function createBean(input: BeanInput): Promise<ActionResult<Bean>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = beanSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: validatedFields.error.issues[0]?.message || "Datos invalidos" }
  }

  const { data, error } = await supabase
    .from("beans")
    .insert({ ...validatedFields.data, user_id: userData.user.id })
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/beans")
  return { success: true, data }
}
```

### Componentes de Formulario

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { beanSchema, type BeanInput } from "@/lib/validations/beans"
import { createBean } from "./actions"

export function BeanForm({ bean }: { bean?: Bean }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BeanInput>({
    resolver: zodResolver(beanSchema),
    defaultValues: bean || { status: "active" }
  })

  async function onSubmit(data: BeanInput) {
    setIsLoading(true)
    setError(null)

    const result = bean
      ? await updateBean(bean.id, data)
      : await createBean(data)

    if (result.success) {
      router.push("/beans")
      router.refresh()
    } else {
      setError(result.error)
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Campos del formulario */}
    </form>
  )
}
```

### Componentes Cliente con useSearchParams

Cuando uses `useSearchParams()`, envolver en Suspense:

```typescript
// page.tsx (Server Component)
import { Suspense } from "react"
import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  )
}

// login-form.tsx (Client Component)
"use client"
import { useSearchParams } from "next/navigation"

export function LoginForm() {
  const searchParams = useSearchParams()
  // ...
}
```

## Base de Datos

### Tablas

| Tabla | Campos Principales |
|-------|-------------------|
| `profiles` | id, email, full_name, avatar_url, preferred_unit, notification_preferences |
| `beans` | id, user_id, roaster_id, name, origin_country, variety, process, roast_level, current_weight_grams, status |
| `roasters` | id, user_id, name, country, city, website, rating |
| `equipment` | id, user_id, type, subtype, brand, model, last_maintenance, maintenance_interval_days |
| `brews` | id, user_id, bean_id, equipment_id, brew_method, dose_grams, water_grams, rating, image_url |
| `cupping_notes` | id, brew_id, fragrance, flavor, aftertaste, ..., total_score |
| `water_recipes` | id, user_id, name, gh, kh, tds, ph |
| `alerts` | id, user_id, type, entity_type, entity_id, title, priority, is_dismissed |
| `favorite_brews` | id, user_id, name, brew_method, dose_grams, water_grams, ... |

### Clientes Supabase

```typescript
// Client-side (componentes "use client")
import { createClient } from "@/lib/supabase/client"
const supabase = createClient()

// Server-side (Server Components, Actions)
import { createClient } from "@/lib/supabase/server"
const supabase = await createClient()
```

### RLS (Row Level Security)

Todas las tablas tienen politicas que limitan acceso al user_id:

```sql
CREATE POLICY "Users can CRUD own data" ON beans
  FOR ALL USING (auth.uid() = user_id);
```

## Metodos de Preparacion

Definidos en `src/lib/brew-methods.ts`:

| Metodo | Slug | Icono |
|--------|------|-------|
| V60 | v60 | FlaskConical |
| Chemex | chemex | FlaskConical |
| AeroPress | aeropress | Beaker |
| French Press | french_press | Beaker |
| Moka | moka | Flame |
| Espresso | espresso | Coffee |
| Cold Brew | cold_brew | Snowflake |
| Clever Dripper | clever | Droplets |
| Kalita Wave | kalita | CircleDot |
| Siphon | siphon | Beaker |
| Turkish | turkish | Flame |
| Other | other | Coffee |

## Validaciones (Zod)

### Beans
```typescript
export const beanSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  roaster_id: z.string().uuid().nullable(),
  origin_country: z.string().nullable(),
  variety: z.string().nullable(),
  process: z.enum(["washed", "natural", "honey", ...]).nullable(),
  roast_level: z.enum(["light", "medium", "dark", ...]).nullable(),
  weight_grams: z.number().positive().nullable(),
  current_weight_grams: z.number().min(0).nullable(),
  low_stock_threshold_grams: z.number().min(0).default(100),
  status: z.enum(["active", "finished", "archived"]).default("active"),
  // ...
})
```

### Brews
```typescript
export const brewSchema = z.object({
  bean_id: z.string().uuid(),
  equipment_id: z.string().uuid().nullable(),
  grinder_id: z.string().uuid().nullable(),
  brew_method: z.string().min(1),
  dose_grams: z.number().positive(),
  water_grams: z.number().positive(),
  water_temperature: z.number().min(0).max(100).nullable(),
  total_time_seconds: z.number().positive().nullable(),
  rating: z.number().min(1).max(5).nullable(),
  // ...
})
```

## Convenciones

### Nombres de Archivos
- Componentes: `kebab-case.tsx` (ej: `bean-form.tsx`)
- Paginas: `page.tsx` dentro del directorio
- Actions: `actions.ts` junto a la pagina
- Layouts: `layout.tsx`

### Idioma
- **UI**: Espanol
- **Codigo**: Ingles
- **Comentarios**: Espanol o Ingles

### Estilos
- Mobile-first: `sm:`, `md:`, `lg:`
- Design tokens en `lib/design-tokens.ts`
- Tema oscuro con `next-themes`

## Componentes UI Disponibles

shadcn/ui instalados en `src/components/ui/`:

- **Layout**: Card, Separator, Tabs, Sheet
- **Form**: Button, Input, Label, Textarea, Select, Checkbox, Switch
- **Feedback**: Alert, Badge, Skeleton, Progress
- **Overlay**: Dialog, AlertDialog, DropdownMenu, Popover
- **Data**: Table, Avatar

## Alertas Automaticas

### Tipos
- `low_stock`: Cafe bajo umbral
- `maintenance`: Equipo necesita mantenimiento
- `reorder`: Sugerencia de reorden
- `custom`: Personalizada

### Cron Job
`/api/cron/maintenance` - Ejecuta diariamente a las 9 AM:

```typescript
// vercel.json
{
  "crons": [{
    "path": "/api/cron/maintenance",
    "schedule": "0 9 * * *"
  }]
}
```

## Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
CRON_SECRET=tu-secret-seguro
```

## Comandos

```bash
npm run dev          # Desarrollo (localhost:3000)
npm run build        # Build produccion
npm run start        # Servidor produccion
npm run lint         # ESLint
npx tsc --noEmit     # Type check
```

## Catalogos

### Cafes (`src/lib/data/coffee-catalog.ts`)
- Tostadores espanoles: Incapto, Ineffable, Wake Up, Nomad, Nubra, Syra, Toma, Kima, DFRNT
- Single origins: Panama Gesha, Jamaica Blue Mountain, Hawaii Kona, Yemen Mokha
- Comerciales: Lavazza, Illy, Segafredo, Pellini, Delta, Bonka

### Equipamiento (`src/lib/data/equipment-catalog.ts`)
- Molinillos: 1Zpresso, Comandante, Baratza, Fellow
- Cafeteras: Hario V60, Chemex, AeroPress, Moka
- Hervidores: Fellow Stagg, Hario Buono
- Basculas: Acaia, Hario, Timemore

## Funcionalidades Especiales

### Quick Brew
Ruta `/quick-brew/[equipmentId]` para acceso rapido via QR.

### Favoritos
Guardar recetas de brew como templates reutilizables.

### Seleccion Multiple
Eliminar cafes/brews en lote con checkboxes.

### Pre-carga de Ultima Brew
El formulario de nueva preparacion carga automaticamente los valores de la anterior.

### Subida de Imagenes
Componente `ImageUpload` con soporte para camara y galeria. Storage en Supabase bucket `coffee-photos`.
