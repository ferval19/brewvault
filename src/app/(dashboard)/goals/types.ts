export type GoalType =
  | "brews_count"
  | "grams_consumed"
  | "avg_rating"
  | "origins_count"
  | "methods_count"
  | "roasters_count"

export type Goal = {
  id: string
  user_id: string
  type: GoalType
  target_value: number
  is_active: boolean
  created_at: string
}

export type GoalWithProgress = Goal & {
  current: number
  percentage: number
  achieved: boolean
}

export const GOAL_META: Record<GoalType, { label: string; unit: string; description: string; max?: number }> = {
  brews_count:    { label: "Brews al mes",         unit: "brews",       description: "Número de preparaciones este mes" },
  grams_consumed: { label: "Gramos consumidos",    unit: "g",           description: "Total de café preparado este mes" },
  avg_rating:     { label: "Rating mínimo",        unit: "★",           description: "Promedio de rating este mes", max: 5 },
  origins_count:  { label: "Orígenes distintos",   unit: "países",      description: "Países de origen probados este mes" },
  methods_count:  { label: "Métodos distintos",    unit: "métodos",     description: "Métodos de preparación usados este mes" },
  roasters_count: { label: "Tostadores distintos", unit: "tostadores",  description: "Tostadores distintos probados este mes" },
}
