import { z } from "zod"

export const brewSchema = z.object({
  bean_id: z.string().uuid("Debes seleccionar un cafe"),
  equipment_id: z.string().uuid().optional().nullable(),
  grinder_id: z.string().uuid().optional().nullable(),
  water_recipe_id: z.string().uuid().optional().nullable(),
  brew_method: z.string().min(1, "El metodo es requerido"),
  grind_size: z.string().optional().nullable(),
  dose_grams: z.coerce.number().positive("La dosis debe ser mayor a 0"),
  water_grams: z.coerce.number().positive("El agua debe ser mayor a 0"),
  water_temperature: z.coerce.number().min(0).max(100).optional().nullable(),
  total_time_seconds: z.coerce.number().int().positive().optional().nullable(),
  bloom_time_seconds: z.coerce.number().int().positive().optional().nullable(),
  bloom_water_grams: z.coerce.number().positive().optional().nullable(),
  pressure_bar: z.coerce.number().positive().optional().nullable(),
  yield_grams: z.coerce.number().positive().optional().nullable(),
  tds: z.coerce.number().positive().optional().nullable(),
  extraction_percentage: z.coerce.number().min(0).max(30).optional().nullable(),
  filter_type: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  brewed_at: z.string().optional(),
})

export type BrewInput = z.infer<typeof brewSchema>

export const brewMethods = [
  { value: "v60", label: "V60" },
  { value: "chemex", label: "Chemex" },
  { value: "aeropress", label: "AeroPress" },
  { value: "french_press", label: "French Press" },
  { value: "moka", label: "Moka" },
  { value: "espresso", label: "Espresso" },
  { value: "cold_brew", label: "Cold Brew" },
  { value: "clever", label: "Clever Dripper" },
  { value: "kalita", label: "Kalita Wave" },
  { value: "siphon", label: "Siphon" },
  { value: "turkish", label: "Cafe Turco" },
  { value: "other", label: "Otro" },
] as const

export const grindSizes = [
  { value: "extra_fine", label: "Extra Fino (Turco)" },
  { value: "fine", label: "Fino (Espresso)" },
  { value: "medium_fine", label: "Medio-Fino (Moka/Aeropress)" },
  { value: "medium", label: "Medio (Goteo/V60)" },
  { value: "medium_coarse", label: "Medio-Grueso (Chemex)" },
  { value: "coarse", label: "Grueso (French Press)" },
  { value: "extra_coarse", label: "Extra Grueso (Cold Brew)" },
] as const

export const filterTypes = [
  { value: "paper", label: "Papel" },
  { value: "metal", label: "Metalico" },
  { value: "cloth", label: "Tela" },
  { value: "none", label: "Sin filtro" },
] as const
