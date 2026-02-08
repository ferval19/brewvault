---
name: create-api-route
description: Crea una ruta API de Next.js 14+ con TypeScript y validacion
argument-hint: [ruta] [metodos: GET,POST,PUT,DELETE]
disable-model-invocation: true
---

Crea una nueva ruta API en `$0` con los metodos `$1`.

## Estructura

Crear archivo en `src/app/api/$0/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      )
    }

    // Logica aqui

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
```

## Requisitos

1. **Autenticacion**: Verificar usuario con Supabase Auth
2. **Validacion**: Validar body con Zod si es POST/PUT
3. **Errores**: Retornar codigos HTTP apropiados (400, 401, 404, 500)
4. **Tipos**: Tipar request body y response
5. **Parametros dinamicos**: Usar `[id]` en el nombre del directorio

## Validacion con Zod

```typescript
import { z } from "zod"

const createBeanSchema = z.object({
  name: z.string().min(1),
  origin_country: z.string().optional(),
  // ...
})

export async function POST(request: NextRequest) {
  const body = await request.json()
  const parsed = createBeanSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  // Usar parsed.data
}
```

## Rutas dinamicas

Para `src/app/api/beans/[id]/route.ts`:

```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  // ...
}
```
