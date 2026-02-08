---
name: schema-helper
description: Ayuda a disenar schemas de Supabase y crear migraciones SQL
argument-hint: [nombre-tabla]
---

Ayuda a disenar el schema para la tabla `$0` en Supabase.

## Convenciones de la Base de Datos

1. **Primary Keys**: UUID generado automaticamente
2. **Timestamps**: `created_at` y `updated_at` en todas las tablas
3. **Foreign Keys**: Referencia a `user_id` para datos de usuario
4. **Naming**: snake_case para tablas y columnas

## Plantilla de Migracion

Crear en `supabase/migrations/YYYYMMDDHHMMSS_create_tabla.sql`:

```sql
-- Crear tabla
CREATE TABLE IF NOT EXISTS public.nombre_tabla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Campos especificos
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice para user_id (mejora performance)
CREATE INDEX idx_nombre_tabla_user_id ON public.nombre_tabla(user_id);

-- Trigger para updated_at
CREATE TRIGGER update_nombre_tabla_updated_at
  BEFORE UPDATE ON public.nombre_tabla
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security
ALTER TABLE public.nombre_tabla ENABLE ROW LEVEL SECURITY;

-- Politicas RLS
CREATE POLICY "Users can view own data"
  ON public.nombre_tabla FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON public.nombre_tabla FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own data"
  ON public.nombre_tabla FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own data"
  ON public.nombre_tabla FOR DELETE
  USING (auth.uid() = user_id);
```

## Tipos de Datos Comunes

| Tipo SQL | Uso |
|----------|-----|
| UUID | IDs, referencias |
| TEXT | Strings de cualquier longitud |
| INTEGER | Numeros enteros |
| NUMERIC(10,2) | Precios, decimales |
| BOOLEAN | Flags |
| TIMESTAMPTZ | Fechas con timezone |
| TEXT[] | Arrays de strings |
| JSONB | Datos JSON flexibles |

## Generar Tipos TypeScript

Despues de crear la migracion, generar tipos:

```bash
npx supabase gen types typescript --local > src/types/database.ts
```

## Relaciones

```sql
-- One-to-Many
roaster_id UUID REFERENCES public.roasters(id) ON DELETE SET NULL

-- Many-to-Many (tabla intermedia)
CREATE TABLE public.bean_tags (
  bean_id UUID REFERENCES public.beans(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (bean_id, tag_id)
);
```
