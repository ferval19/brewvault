"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { alertSchema, type AlertInput } from "@/lib/validations/alerts"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type Alert = {
  id: string
  user_id: string
  type: "low_stock" | "maintenance" | "reorder" | "custom"
  entity_type: "bean" | "equipment" | null
  entity_id: string | null
  title: string
  message: string | null
  priority: "low" | "normal" | "high"
  is_read: boolean
  is_dismissed: boolean
  triggered_at: string
  created_at: string
}

export type AlertWithEntity = Alert & {
  bean?: { id: string; name: string } | null
  equipment?: { id: string; model: string; brand: string | null } | null
}

export async function getAlerts(options?: {
  includeRead?: boolean
  includeDismissed?: boolean
  limit?: number
}): Promise<ActionResult<AlertWithEntity[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  let query = supabase
    .from("alerts")
    .select("*")
    .order("triggered_at", { ascending: false })

  if (!options?.includeDismissed) {
    query = query.eq("is_dismissed", false)
  }

  if (!options?.includeRead) {
    query = query.eq("is_read", false)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as AlertWithEntity[] }
}

export async function getUnreadAlertCount(): Promise<ActionResult<number>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { count, error } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .eq("is_dismissed", false)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: count || 0 }
}

export async function createAlert(
  input: AlertInput
): Promise<ActionResult<Alert>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const validatedFields = alertSchema.safeParse(input)
  if (!validatedFields.success) {
    return { success: false, error: "Datos inválidos" }
  }

  // Check for existing active alert of same type for same entity
  if (validatedFields.data.entity_id) {
    const { data: existing } = await supabase
      .from("alerts")
      .select("id")
      .eq("type", validatedFields.data.type)
      .eq("entity_id", validatedFields.data.entity_id)
      .eq("is_dismissed", false)
      .single()

    if (existing) {
      return { success: false, error: "Ya existe una alerta activa para este elemento" }
    }
  }

  const alertData = {
    ...validatedFields.data,
    user_id: userData.user.id,
  }

  const { data, error } = await supabase
    .from("alerts")
    .insert(alertData)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/alerts")
  revalidatePath("/analytics")
  return { success: true, data: data as Alert }
}

export async function markAlertAsRead(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("alerts")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/alerts")
  revalidatePath("/analytics")
  return { success: true, data: undefined }
}

export async function dismissAlert(
  id: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("alerts")
    .update({ is_dismissed: true, is_read: true })
    .eq("id", id)
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/alerts")
  revalidatePath("/analytics")
  return { success: true, data: undefined }
}

export async function markAllAlertsAsRead(): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("alerts")
    .update({ is_read: true })
    .eq("user_id", userData.user.id)
    .eq("is_read", false)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/alerts")
  revalidatePath("/analytics")
  return { success: true, data: undefined }
}

export async function markMaintenanceDone(
  equipmentId: string
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Update equipment last_maintenance date
  const { error: eqError } = await supabase
    .from("equipment")
    .update({ last_maintenance: new Date().toISOString().split("T")[0] })
    .eq("id", equipmentId)
    .eq("user_id", userData.user.id)

  if (eqError) {
    return { success: false, error: eqError.message }
  }

  // Dismiss the maintenance alert
  const { error: alertError } = await supabase
    .from("alerts")
    .update({ is_dismissed: true, is_read: true })
    .eq("entity_type", "equipment")
    .eq("entity_id", equipmentId)
    .eq("type", "maintenance")
    .eq("is_dismissed", false)

  if (alertError) {
    return { success: false, error: alertError.message }
  }

  revalidatePath("/alerts")
  revalidatePath("/analytics")
  revalidatePath("/equipment")
  return { success: true, data: undefined }
}
