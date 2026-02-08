import { z } from "zod"

export const alertTypes = [
  { value: "low_stock", label: "Stock bajo", icon: "AlertTriangle", color: "amber" },
  { value: "maintenance", label: "Mantenimiento", icon: "Wrench", color: "blue" },
  { value: "reorder", label: "Reordenar", icon: "ShoppingCart", color: "green" },
  { value: "custom", label: "Personalizada", icon: "Bell", color: "gray" },
] as const

export const alertPriorities = [
  { value: "low", label: "Baja" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
] as const

export const alertSchema = z.object({
  type: z.enum(["low_stock", "maintenance", "reorder", "custom"]),
  entity_type: z.enum(["bean", "equipment"]).nullable().optional(),
  entity_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, "El título es requerido"),
  message: z.string().nullable().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
})

export type AlertInput = z.infer<typeof alertSchema>
