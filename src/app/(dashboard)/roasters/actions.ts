"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { roasterSchema, type RoasterInput } from "@/lib/validations/roasters"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type Roaster = {
  id: string
  user_id: string
  name: string
  country: string | null
  city: string | null
  website: string | null
  notes: string | null
  rating: number | null
  created_at: string
  updated_at: string
  _count?: {
    beans: number
  }
}

export async function getRoasters(): Promise<ActionResult<Roaster[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("roasters")
    .select("*")
    .order("name")

  if (error) {
    return { success: false, error: error.message }
  }

  // Get bean counts for each roaster
  const { data: beanCounts } = await supabase
    .from("beans")
    .select("roaster_id")

  const counts: Record<string, number> = {}
  beanCounts?.forEach((bean) => {
    if (bean.roaster_id) {
      counts[bean.roaster_id] = (counts[bean.roaster_id] || 0) + 1
    }
  })

  const roastersWithCounts = data.map((roaster) => ({
    ...roaster,
    _count: {
      beans: counts[roaster.id] || 0,
    },
  }))

  return { success: true, data: roastersWithCounts as Roaster[] }
}

export async function getRoaster(id: string): Promise<ActionResult<Roaster>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("roasters")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Roaster }
}

export async function createRoaster(
  input: RoasterInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = roasterSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const roasterData = {
    ...validatedFields.data,
    user_id: userData.user.id,
    website: validatedFields.data.website || null,
  }

  const { error } = await supabase.from("roasters").insert(roasterData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/roasters")
  revalidatePath("/beans")
  return { success: true, data: undefined }
}

export async function updateRoaster(
  id: string,
  input: RoasterInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = roasterSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase
    .from("roasters")
    .update({
      ...validatedFields.data,
      website: validatedFields.data.website || null,
    })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/roasters")
  revalidatePath(`/roasters/${id}`)
  revalidatePath("/beans")
  return { success: true, data: undefined }
}

export async function deleteRoaster(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("roasters")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/roasters")
  return { success: true, data: undefined }
}
