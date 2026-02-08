import { z } from "zod"

export const equipmentTypes = [
  { value: "grinder", label: "Molino" },
  { value: "brewer", label: "Cafetera" },
  { value: "espresso_machine", label: "Máquina de espresso" },
  { value: "kettle", label: "Hervidor" },
  { value: "scale", label: "Báscula" },
  { value: "other", label: "Otro" },
] as const

export const maintenanceIntervals = [
  { value: 7, label: "7 dias" },
  { value: 14, label: "14 dias" },
  { value: 30, label: "30 dias" },
  { value: 60, label: "60 dias" },
  { value: 90, label: "90 dias" },
] as const

export const espressoMachineSubtypes = [
  { value: "super_automatic", label: "Superautomatica" },
  { value: "semi_automatic", label: "Semiautomatica" },
  { value: "manual", label: "Manual" },
] as const

export const grinderSubtypes = [
  { value: "electric", label: "Electrico" },
  { value: "manual", label: "Manual" },
] as const

export const equipmentSchema = z.object({
  type: z.enum(["grinder", "brewer", "espresso_machine", "kettle", "scale", "other"]),
  subtype: z.enum(["super_automatic", "semi_automatic", "manual", "electric"]).nullable().optional(),
  brand: z.string().nullable().optional(),
  model: z.string().min(1, "El modelo es requerido"),
  notes: z.string().nullable().optional(),
  purchase_date: z.string().nullable().optional(),
  last_maintenance: z.string().nullable().optional(),
  maintenance_interval_days: z.number().nullable().optional(),
})

export type EquipmentInput = z.infer<typeof equipmentSchema>
