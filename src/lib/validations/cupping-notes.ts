import { z } from "zod"

export const scaCategories = [
  { key: "fragrance", label: "Fragancia / Aroma" },
  { key: "flavor", label: "Sabor" },
  { key: "aftertaste", label: "Resabio" },
  { key: "acidity", label: "Acidez" },
  { key: "body", label: "Cuerpo" },
  { key: "balance", label: "Balance" },
  { key: "sweetness", label: "Dulzura" },
  { key: "uniformity", label: "Uniformidad" },
  { key: "clean_cup", label: "Taza Limpia" },
  { key: "overall", label: "General" },
] as const

const scoreField = z.coerce.number().min(0).max(10).nullable().optional()

export const cuppingNoteSchema = z.object({
  brew_id: z.string().uuid("Debes seleccionar una preparacion"),
  fragrance: scoreField,
  flavor: scoreField,
  aftertaste: scoreField,
  acidity: scoreField,
  body: scoreField,
  balance: scoreField,
  sweetness: scoreField,
  uniformity: scoreField,
  clean_cup: scoreField,
  overall: scoreField,
  flavor_descriptors: z.array(z.string()).nullable().optional(),
})

export type CuppingNoteInput = z.infer<typeof cuppingNoteSchema>
