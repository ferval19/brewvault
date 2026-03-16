"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

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
  brews_count:    { label: "Brews al mes",        unit: "brews",    description: "Número de preparaciones este mes" },
  grams_consumed: { label: "Gramos consumidos",   unit: "g",        description: "Total de café preparado este mes" },
  avg_rating:     { label: "Rating mínimo",       unit: "★",        description: "Promedio de rating este mes", max: 5 },
  origins_count:  { label: "Orígenes distintos",  unit: "países",   description: "Países de origen probados este mes" },
  methods_count:  { label: "Métodos distintos",   unit: "métodos",  description: "Métodos de preparación usados este mes" },
  roasters_count: { label: "Tostadores distintos",unit: "tostadores",description: "Tostadores distintos probados este mes" },
}

export async function getGoals(): Promise<ActionResult<Goal[]>> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "No autenticado" }

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userData.user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  if (error) return { success: false, error: error.message }
  return { success: true, data: data as Goal[] }
}

export async function getGoalsWithProgress(): Promise<ActionResult<GoalWithProgress[]>> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "No autenticado" }

  const goalsResult = await getGoals()
  if (!goalsResult.success) return { success: false, error: goalsResult.error }
  const goals = goalsResult.data

  if (goals.length === 0) return { success: true, data: [] }

  // Current month bounds
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

  const { data: brews, error } = await supabase
    .from("brews")
    .select("dose_grams, rating, brew_method, beans(origin_country, roaster_id)")
    .eq("user_id", userData.user.id)
    .gte("brewed_at", monthStart.toISOString())
    .lte("brewed_at", monthEnd.toISOString())

  if (error) return { success: false, error: error.message }

  const rows = brews || []

  const currentValues: Record<GoalType, number> = {
    brews_count:    rows.length,
    grams_consumed: Math.round(rows.reduce((s, b) => s + (b.dose_grams || 0), 0)),
    avg_rating:     (() => {
      const rated = rows.filter((b) => b.rating !== null)
      return rated.length > 0
        ? Math.round((rated.reduce((s, b) => s + (b.rating as number), 0) / rated.length) * 10) / 10
        : 0
    })(),
    origins_count:  new Set(rows.map((b) => (b.beans as unknown as { origin_country: string | null } | null)?.origin_country).filter(Boolean)).size,
    methods_count:  new Set(rows.map((b) => b.brew_method)).size,
    roasters_count: new Set(rows.map((b) => (b.beans as unknown as { roaster_id: string | null } | null)?.roaster_id).filter(Boolean)).size,
  }

  const result: GoalWithProgress[] = goals.map((goal) => {
    const current = currentValues[goal.type]
    const percentage = goal.type === "avg_rating"
      ? Math.min(100, Math.round((current / goal.target_value) * 100))
      : Math.min(100, Math.round((current / goal.target_value) * 100))
    const achieved = goal.type === "avg_rating"
      ? current >= goal.target_value
      : current >= goal.target_value
    return { ...goal, current, percentage, achieved }
  })

  return { success: true, data: result }
}

export async function createGoal(type: GoalType, targetValue: number): Promise<ActionResult<Goal>> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "No autenticado" }

  if (targetValue <= 0) return { success: false, error: "El objetivo debe ser mayor que 0" }

  // Only one active goal per type
  const { data: existing } = await supabase
    .from("goals")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("type", type)
    .eq("is_active", true)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from("goals")
      .update({ target_value: targetValue })
      .eq("id", existing.id)
      .select()
      .single()
    if (error) return { success: false, error: error.message }
    revalidatePath("/goals")
    revalidatePath("/dashboard")
    return { success: true, data: data as Goal }
  }

  const { data, error } = await supabase
    .from("goals")
    .insert({ user_id: userData.user.id, type, target_value: targetValue })
    .select()
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true, data: data as Goal }
}

export async function deleteGoal(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return { success: false, error: "No autenticado" }

  const { error } = await supabase
    .from("goals")
    .update({ is_active: false })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath("/goals")
  revalidatePath("/dashboard")
  return { success: true, data: undefined }
}
