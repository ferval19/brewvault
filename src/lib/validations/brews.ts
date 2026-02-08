import { z } from "zod"

// Helper for optional numeric fields that handles empty strings and NaN
const optionalNumber = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : val),
  z.coerce.number().positive().optional().nullable()
)

const optionalInt = z.preprocess(
  (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : val),
  z.coerce.number().int().positive().optional().nullable()
)

export const brewSchema = z.object({
  bean_id: z.string().uuid("Debes seleccionar un cafe"),
  equipment_id: z.string().uuid().optional().nullable().or(z.literal("")),
  grinder_id: z.string().uuid().optional().nullable().or(z.literal("")),
  brew_method: z.string().min(1, "El metodo es requerido"),
  grind_size: z.string().optional().nullable(),
  dose_grams: z.coerce.number().positive("La dosis debe ser mayor a 0"),
  water_grams: z.coerce.number().positive("El agua debe ser mayor a 0"),
  water_temperature: optionalNumber,
  total_time_seconds: optionalInt,
  bloom_time_seconds: optionalInt,
  bloom_water_grams: optionalNumber,
  pressure_bar: optionalNumber,
  yield_grams: optionalNumber,
  tds: optionalNumber,
  extraction_percentage: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : val),
    z.coerce.number().min(0).max(30).optional().nullable()
  ),
  filter_type: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  rating: z.preprocess(
    (val) => (val === "" || val === null || val === undefined || Number.isNaN(val) ? undefined : val),
    z.coerce.number().int().min(1).max(5).optional().nullable()
  ),
  brewed_at: z.string().optional(),
  image_url: z.string().url().optional().nullable(),
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

// Tipos de bebida para cafeteras superautomáticas
export const automaticDrinkTypes = [
  { value: "espresso", label: "Espresso", dose: 7, water: 40 },
  { value: "doppio", label: "Doppio", dose: 14, water: 60 },
  { value: "lungo", label: "Lungo", dose: 7, water: 110 },
  { value: "americano", label: "Americano", dose: 7, water: 150 },
  { value: "ristretto", label: "Ristretto", dose: 7, water: 25 },
] as const

export type AutomaticDrinkType = (typeof automaticDrinkTypes)[number]["value"]
