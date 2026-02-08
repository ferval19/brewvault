"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { waterRecipeSchema, type WaterRecipeInput } from "@/lib/validations/water-recipes"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type WaterRecipe = {
  id: string
  user_id: string
  name: string
  gh: number | null
  kh: number | null
  calcium: number | null
  magnesium: number | null
  tds: number | null
  ph: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export async function getWaterRecipes(): Promise<ActionResult<WaterRecipe[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("water_recipes")
    .select("*")
    .order("name")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as WaterRecipe[] }
}

export async function getWaterRecipe(id: string): Promise<ActionResult<WaterRecipe>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("water_recipes")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as WaterRecipe }
}

export async function createWaterRecipe(
  input: WaterRecipeInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = waterRecipeSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const recipeData = {
    ...validatedFields.data,
    user_id: userData.user.id,
  }

  const { error } = await supabase.from("water_recipes").insert(recipeData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/water")
  return { success: true, data: undefined }
}

export async function updateWaterRecipe(
  id: string,
  input: WaterRecipeInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = waterRecipeSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase
    .from("water_recipes")
    .update(validatedFields.data)
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/water")
  revalidatePath(`/water/${id}`)
  return { success: true, data: undefined }
}

export async function deleteWaterRecipe(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("water_recipes")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/water")
  return { success: true, data: undefined }
}
