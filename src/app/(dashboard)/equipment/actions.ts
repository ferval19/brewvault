"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { equipmentSchema, type EquipmentInput } from "@/lib/validations/equipment"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type Equipment = {
  id: string
  user_id: string
  type: string
  brand: string | null
  model: string
  notes: string | null
  purchase_date: string | null
  last_maintenance: string | null
  maintenance_interval_days: number | null
  created_at: string
  updated_at: string
}

export async function getEquipmentList(): Promise<ActionResult<Equipment[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .order("type")
    .order("model")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Equipment[] }
}

export async function getEquipment(id: string): Promise<ActionResult<Equipment>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as Equipment }
}

export async function createEquipment(
  input: EquipmentInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = equipmentSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const equipmentData = {
    ...validatedFields.data,
    user_id: userData.user.id,
  }

  const { error } = await supabase.from("equipment").insert(equipmentData)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/equipment")
  return { success: true, data: undefined }
}

export async function updateEquipment(
  id: string,
  input: EquipmentInput
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = equipmentSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos invalidos" }
  }

  const { error } = await supabase
    .from("equipment")
    .update(validatedFields.data)
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/equipment")
  revalidatePath(`/equipment/${id}`)
  return { success: true, data: undefined }
}

export async function deleteEquipment(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/equipment")
  return { success: true, data: undefined }
}
