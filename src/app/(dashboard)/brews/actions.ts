"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { brewSchema, type BrewInput } from "@/lib/validations/brews"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type Brew = {
  id: string
  user_id: string
  bean_id: string
  equipment_id: string | null
  grinder_id: string | null
  water_recipe_id: string | null
  brew_method: string
  grind_size: string | null
  dose_grams: number
  water_grams: number
  ratio: number | null
  water_temperature: number | null
  total_time_seconds: number | null
  bloom_time_seconds: number | null
  bloom_water_grams: number | null
  pressure_bar: number | null
  yield_grams: number | null
  tds: number | null
  extraction_percentage: number | null
  filter_type: string | null
  notes: string | null
  rating: number | null
  brewed_at: string
  created_at: string
  updated_at: string
  beans: {
    id: string
    name: string
    roaster_id: string | null
    roasters: { id: string; name: string } | null
  } | null
  equipment: { id: string; model: string; brand: string | null } | null
  grinder: { id: string; model: string; brand: string | null } | null
}

export type BeanOption = {
  id: string
  name: string
  roasters: { name: string } | null
  status: string
}

type BeanOptionRaw = {
  id: string
  name: string
  roasters: { name: string } | null
  status: string
}

export type EquipmentOption = {
  id: string
  model: string
  brand: string | null
  type: string
}

export async function getBrews(): Promise<ActionResult<Brew[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("brews")
    .select(`
      *,
      beans (
        id,
        name,
        roaster_id,
        roasters (
          id,
          name
        )
      ),
      equipment (
        id,
        model,
        brand
      ),
      grinder:equipment!brews_grinder_id_fkey (
        id,
        model,
        brand
      )
    `)
    .order("brewed_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Brew[] }
}

export async function getBrew(id: string): Promise<ActionResult<Brew>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("brews")
    .select(`
      *,
      beans (
        id,
        name,
        roaster_id,
        roasters (
          id,
          name
        )
      ),
      equipment (
        id,
        model,
        brand
      ),
      grinder:equipment!brews_grinder_id_fkey (
        id,
        model,
        brand
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Brew }
}

export async function createBrew(
  input: BrewInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = brewSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const brewData = {
    ...validatedFields.data,
    user_id: userData.user.id,
    brewed_at: validatedFields.data.brewed_at || new Date().toISOString(),
  }

  const { error } = await supabase.from("brews").insert(brewData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/brews")
  revalidatePath("/beans")
  return { success: true, data: undefined }
}

export async function updateBrew(
  id: string,
  input: BrewInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = brewSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase
    .from("brews")
    .update(validatedFields.data)
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/brews")
  revalidatePath(`/brews/${id}`)
  return { success: true, data: undefined }
}

export async function deleteBrew(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("brews")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/brews")
  return { success: true, data: undefined }
}

export async function getActiveBeans(): Promise<ActionResult<BeanOption[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("beans")
    .select(`
      id,
      name,
      status,
      roasters (
        name
      )
    `)
    .in("status", ["active", "finished"])
    .order("name")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as unknown as BeanOption[] }
}

export async function getEquipment(): Promise<ActionResult<EquipmentOption[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("id, model, brand, type")
    .order("model")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as EquipmentOption[] }
}
