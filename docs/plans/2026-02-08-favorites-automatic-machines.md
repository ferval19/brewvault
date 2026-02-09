# Diseño: Preparaciones Favoritas + Máquinas Automáticas

**Fecha:** 2026-02-08
**Estado:** Aprobado

---

## 1. Preparaciones Favoritas

### Modelo de datos

Nueva tabla `favorite_brews`:

```sql
CREATE TABLE favorite_brews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  brew_method TEXT NOT NULL,
  dose_grams NUMERIC,
  water_grams NUMERIC,
  water_temperature INTEGER,
  grind_size TEXT,
  total_time_seconds INTEGER,
  bloom_time_seconds INTEGER,
  bloom_water_grams NUMERIC,
  filter_type TEXT,
  equipment_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  grinder_id UUID REFERENCES equipment(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE favorite_brews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own favorites" ON favorite_brews
  FOR ALL USING (auth.uid() = user_id);
```

### Flujo de usuario

1. **Guardar favorita**: Desde detalle de brew → "Guardar como favorita" → Modal con nombre
2. **Usar favorita**: Nueva brew → Sección "Mis favoritas" → Clic → Pre-rellena formulario
3. **Eliminar favorita**: Desde la sección de favoritas → Icono eliminar

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/app/(dashboard)/brews/actions.ts` | Añadir CRUD de favoritas |
| `src/app/(dashboard)/brews/[id]/page.tsx` | Botón "Guardar como favorita" |
| `src/app/(dashboard)/brews/new/page.tsx` | Obtener y mostrar favoritas |
| `src/components/forms/brew-form.tsx` | Sección de favoritas + lógica pre-fill |

---

## 2. Máquinas Automáticas

### Modelo de datos

Añadir campo `subtype` a tabla `equipment`:

```sql
ALTER TABLE equipment
ADD COLUMN subtype TEXT
CHECK (subtype IN ('super_automatic', 'semi_automatic', 'manual', 'electric'));
```

### Lógica de formulario

Cuando `equipment.subtype = 'super_automatic'`:
- Mostrar selector de tipo de bebida (Espresso, Lungo, Americano)
- Campos de dosis/agua se muestran como readonly con valores fijos
- Ocultar: temperatura, molienda, bloom, tiempos

### Valores por defecto

| Bebida | Dosis | Agua |
|--------|-------|------|
| Espresso | 7g | 40g |
| Lungo | 7g | 110g |
| Doppio | 14g | 60g |
| Americano | 7g | 150g |

### Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/app/(dashboard)/equipment/actions.ts` | Incluir subtype en queries |
| `src/components/forms/equipment-form.tsx` | Campo subtype para espresso machines |
| `src/components/forms/brew-form.tsx` | Lógica condicional según subtype |
| `src/lib/validations/brews.ts` | Añadir tipos de bebida |

---

## 3. Orden de implementación

1. Migración SQL (favorite_brews + equipment.subtype)
2. Actions para favoritas (CRUD)
3. UI favoritas en brew detail y new brew
4. Lógica máquinas automáticas en brew form
5. Campo subtype en equipment form
