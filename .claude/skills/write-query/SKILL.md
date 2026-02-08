---
name: write-query
description: Escribe queries tipadas de Supabase con manejo de errores
argument-hint: [operacion: select|insert|update|delete] [tabla]
---

Escribe una query de Supabase para `$0` en la tabla `$1`.

## Patrones de Query

### SELECT - Obtener datos

```typescript
// Obtener todos los registros del usuario
const { data, error } = await supabase
  .from("beans")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })

// Con relaciones
const { data, error } = await supabase
  .from("beans")
  .select(`
    *,
    roaster:roasters(id, name)
  `)
  .eq("user_id", user.id)

// Campos especificos
const { data, error } = await supabase
  .from("beans")
  .select("id, name, origin_country, status")
  .eq("status", "active")

// Un solo registro
const { data, error } = await supabase
  .from("beans")
  .select("*")
  .eq("id", beanId)
  .single()

// Con filtros
const { data, error } = await supabase
  .from("beans")
  .select("*")
  .eq("user_id", user.id)
  .ilike("name", `%${search}%`)
  .in("status", ["active", "finished"])
  .gte("sca_score", 85)
  .order("name")
  .range(0, 9) // Paginacion: primeros 10
```

### INSERT - Crear registro

```typescript
const { data, error } = await supabase
  .from("beans")
  .insert({
    user_id: user.id,
    name: "Ethiopia Yirgacheffe",
    origin_country: "Etiopia",
    // ...resto de campos
  })
  .select()
  .single()
```

### UPDATE - Actualizar registro

```typescript
const { data, error } = await supabase
  .from("beans")
  .update({
    name: "Nuevo nombre",
    updated_at: new Date().toISOString(),
  })
  .eq("id", beanId)
  .eq("user_id", user.id) // Importante para RLS
  .select()
  .single()
```

### DELETE - Eliminar registro

```typescript
const { error } = await supabase
  .from("beans")
  .delete()
  .eq("id", beanId)
  .eq("user_id", user.id)
```

## Manejo de Errores

```typescript
export async function getBeans(): Promise<ActionResult<Bean[]>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("beans")
    .select("*")
    .eq("user_id", user.id)

  if (error) {
    console.error("Error fetching beans:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data: data ?? [] }
}
```

## Filtros Comunes

| Metodo | Uso |
|--------|-----|
| `.eq("col", val)` | Igual a |
| `.neq("col", val)` | No igual a |
| `.gt("col", val)` | Mayor que |
| `.gte("col", val)` | Mayor o igual |
| `.lt("col", val)` | Menor que |
| `.lte("col", val)` | Menor o igual |
| `.like("col", "%val%")` | LIKE (case sensitive) |
| `.ilike("col", "%val%")` | ILIKE (case insensitive) |
| `.in("col", [vals])` | En lista |
| `.is("col", null)` | Es null |
| `.not("col", "is", null)` | No es null |
| `.contains("col", [vals])` | Array contiene |
| `.containedBy("col", [vals])` | Array contenido en |

## Ordenamiento y Paginacion

```typescript
// Ordenar
.order("created_at", { ascending: false })
.order("name", { ascending: true, nullsFirst: false })

// Paginar
.range(0, 9)   // Registros 0-9 (primeros 10)
.range(10, 19) // Registros 10-19 (siguientes 10)

// Limitar
.limit(5)
```
