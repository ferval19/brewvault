import { z } from "zod"

export const beanSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  roaster_id: z.string().uuid().optional().nullable(),
  origin_country: z.string().optional().nullable(),
  origin_region: z.string().optional().nullable(),
  farm: z.string().optional().nullable(),
  altitude: z.coerce.number().int().positive().optional().nullable(),
  variety: z.string().optional().nullable(),
  process: z.string().optional().nullable(),
  roast_level: z
    .enum(["light", "medium-light", "medium", "medium-dark", "dark"])
    .optional()
    .nullable(),
  roast_date: z.string().optional().nullable(),
  flavor_notes: z.array(z.string()).optional().nullable(),
  sca_score: z.coerce.number().min(0).max(100).optional().nullable(),
  weight_grams: z.coerce.number().positive().optional().nullable(),
  price: z.coerce.number().positive().optional().nullable(),
  currency: z.string().optional().default("EUR"),
  barcode: z.string().optional().nullable(),
  photo_url: z.string().optional().nullable(),
  certifications: z.array(z.string()).optional().nullable(),
  personal_rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
  status: z.enum(["active", "finished", "archived"]).optional().default("active"),
})

export type BeanInput = z.infer<typeof beanSchema>

export const roastLevels = [
  { value: "light", label: "Claro" },
  { value: "medium-light", label: "Medio-Claro" },
  { value: "medium", label: "Medio" },
  { value: "medium-dark", label: "Medio-Oscuro" },
  { value: "dark", label: "Oscuro" },
] as const

export const beanStatuses = [
  { value: "active", label: "Activo" },
  { value: "finished", label: "Agotado" },
  { value: "archived", label: "Archivado" },
] as const

export const commonProcesses = [
  "Lavado",
  "Natural",
  "Honey",
  "Anaerobico",
  "Doble Fermentacion",
  "Wet Hulled",
] as const

export const commonVarieties = [
  "Arabica",
  "Bourbon",
  "Caturra",
  "Catuai",
  "Gesha",
  "Typica",
  "SL28",
  "SL34",
  "Pacamara",
  "Mundo Novo",
] as const
