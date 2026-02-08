import { z } from "zod"

export const roasterSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  country: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal("")),
  notes: z.string().optional().nullable(),
  rating: z.coerce.number().int().min(1).max(5).optional().nullable(),
})

export type RoasterInput = z.infer<typeof roasterSchema>
