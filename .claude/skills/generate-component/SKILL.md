---
name: generate-component
description: Genera un componente React con TypeScript, Tailwind CSS y shadcn/ui
argument-hint: [nombre-componente] [tipo: ui|form|layout]
---

Genera un nuevo componente `$0` de tipo `$1` para este proyecto Next.js.

## Requisitos

1. **TypeScript estricto**:
   - Definir interface de props con tipos correctos
   - Exportar la interface si puede ser util externamente
   - Usar `React.FC` o tipado explicito de retorno

2. **Estructura del archivo**:
   ```typescript
   "use client" // Solo si usa hooks o eventos

   import { ... } from "react"
   import { ... } from "@/components/ui/..."

   interface ComponentNameProps {
     // props tipadas
   }

   export function ComponentName({ ... }: ComponentNameProps) {
     return (...)
   }
   ```

3. **Estilos con Tailwind CSS**:
   - Usar clases utilitarias
   - Responsive mobile-first (sm:, md:, lg:)
   - Usar variables CSS del tema cuando aplique

4. **Componentes shadcn/ui**:
   - Importar de `@/components/ui/`
   - Componentes disponibles: Button, Input, Label, Select, Dialog, Card, Badge, Alert

5. **Ubicacion**:
   - UI genericos: `src/components/ui/`
   - Formularios: `src/components/forms/`
   - Layout: `src/components/layout/`

## Ejemplo de salida

Para `/generate-component user-avatar ui`:

```typescript
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UserAvatarProps {
  src?: string | null
  name: string
  size?: "sm" | "md" | "lg"
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

export function UserAvatar({ src, name, size = "md" }: UserAvatarProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src || undefined} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
```
