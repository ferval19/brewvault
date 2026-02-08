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
  image_url: string | null
  brewed_at: string
  created_at: string
  updated_at: string
  beans: {
    id: string
    name: string
    roaster_id: string | null
    roasters: { id: string; name: string } | null
  } | null
}

export type BeanOption = {
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
    const firstError = validatedFields.error.issues[0]
    return { success: false, error: firstError?.message || "Datos invalidos" }
  }

  // Get the bean to check stock
  const { data: bean } = await supabase
    .from("beans")
    .select("id, name, current_weight_grams, low_stock_threshold_grams")
    .eq("id", validatedFields.data.bean_id)
    .single()

  const brewData = {
    ...validatedFields.data,
    user_id: userData.user.id,
    brewed_at: validatedFields.data.brewed_at || new Date().toISOString(),
  }

  const { error } = await supabase.from("brews").insert(brewData)

  if (error) {
    return { success: false, error: error.message }
  }

  // Deduct dose from bean stock
  if (bean && bean.current_weight_grams !== null) {
    const newWeight = Math.max(0, bean.current_weight_grams - validatedFields.data.dose_grams)
    const threshold = bean.low_stock_threshold_grams || 100

    await supabase
      .from("beans")
      .update({ current_weight_grams: newWeight })
      .eq("id", bean.id)

    // Create low stock alert if below threshold
    if (newWeight <= threshold && bean.current_weight_grams > threshold) {
      // Check if alert already exists
      const { data: existingAlert } = await supabase
        .from("alerts")
        .select("id")
        .eq("type", "low_stock")
        .eq("entity_id", bean.id)
        .eq("is_dismissed", false)
        .single()

      if (!existingAlert) {
        await supabase.from("alerts").insert({
          user_id: userData.user.id,
          type: "low_stock",
          entity_type: "bean",
          entity_id: bean.id,
          title: "Stock bajo",
          message: `${bean.name} - ${newWeight}g restantes`,
          priority: newWeight <= 50 ? "high" : "normal",
        })
      }
    }
  }

  revalidatePath("/brews")
  revalidatePath("/beans")
  revalidatePath("/alerts")
  revalidatePath("/analytics")
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
    const firstError = validatedFields.error.issues[0]
    return { success: false, error: firstError?.message || "Datos invalidos" }
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

export async function getLastBrew(): Promise<ActionResult<Brew | null>> {
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
      )
    `)
    .eq("user_id", userData.user.id)
    .order("brewed_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Brew | null }
}
