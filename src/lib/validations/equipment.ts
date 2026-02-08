import { z } from "zod"

export const equipmentTypes = [
  { value: "grinder", label: "Molino" },
  { value: "brewer", label: "Cafetera" },
  { value: "espresso_machine", label: "Máquina de espresso" },
  { value: "kettle", label: "Hervidor" },
  { value: "scale", label: "Báscula" },
  { value: "other", label: "Otro" },
] as const

export const equipmentSchema = z.object({
  type: z.enum(["grinder", "brewer", "espresso_machine", "kettle", "scale", "other"]),
  brand: z.string().nullable().optional(),
  model: z.string().min(1, "El modelo es requerido"),
  notes: z.string().nullable().optional(),
  purchase_date: z.string().nullable().optional(),
  last_maintenance: z.string().nullable().optional(),
})

export type EquipmentInput = z.infer<typeof equipmentSchema>
