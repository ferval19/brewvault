import { z } from "zod"

export const waterRecipeSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  gh: z.number().nullable().optional(),
  kh: z.number().nullable().optional(),
  calcium: z.number().nullable().optional(),
  magnesium: z.number().nullable().optional(),
  tds: z.number().nullable().optional(),
  ph: z.number().min(0).max(14).nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type WaterRecipeInput = z.infer<typeof waterRecipeSchema>
