"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type UserProfile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
}

export type NotificationPreferences = {
  push_enabled: boolean
  low_stock_alerts: boolean
  maintenance_alerts: boolean
  reorder_suggestions: boolean
}

export async function getUserProfile(): Promise<ActionResult<UserProfile>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userData.user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    data: {
      id: data.id,
      email: userData.user.email || "",
      full_name: data.full_name,
      avatar_url: data.avatar_url,
      created_at: data.created_at,
    },
  }
}

export async function updateProfile(input: {
  full_name?: string
}): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: input.full_name })
    .eq("id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/settings")
  return { success: true, data: undefined }
}

export async function signOut(): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: undefined }
}

export async function getStats(): Promise<ActionResult<{
  totalBeans: number
  totalBrews: number
  totalEquipment: number
  memberSince: string
}>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const [beansResult, brewsResult, equipmentResult, profileResult] = await Promise.all([
    supabase.from("beans").select("id", { count: "exact", head: true }),
    supabase.from("brews").select("id", { count: "exact", head: true }),
    supabase.from("equipment").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("created_at").eq("id", userData.user.id).single(),
  ])

  return {
    success: true,
    data: {
      totalBeans: beansResult.count || 0,
      totalBrews: brewsResult.count || 0,
      totalEquipment: equipmentResult.count || 0,
      memberSince: profileResult.data?.created_at || userData.user.created_at,
    },
  }
}

const defaultPreferences: NotificationPreferences = {
  push_enabled: false,
  low_stock_alerts: true,
  maintenance_alerts: true,
  reorder_suggestions: false,
}

export async function getNotificationPreferences(): Promise<ActionResult<NotificationPreferences>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("notification_preferences")
    .eq("id", userData.user.id)
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return {
    success: true,
    data: (data.notification_preferences as NotificationPreferences) || defaultPreferences
  }
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      notification_preferences: preferences as unknown as Record<string, unknown>,
      updated_at: new Date().toISOString()
    })
    .eq("id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/settings")
  return { success: true, data: undefined }
}

export async function savePushSubscription(
  subscription: PushSubscriptionJSON
): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({
      user_id: userData.user.id,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys?.p256dh || "",
      auth: subscription.keys?.auth || "",
    }, {
      onConflict: "user_id,endpoint"
    })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: undefined }
}

export async function removePushSubscription(): Promise<ActionResult<undefined>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userData.user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: undefined }
}

export type EquipmentForQR = {
  id: string
  type: string
  brand: string | null
  model: string
  image_url: string | null
}

export async function getEquipmentForQR(): Promise<ActionResult<EquipmentForQR[]>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { data, error } = await supabase
    .from("equipment")
    .select("id, type, brand, model, image_url")
    .in("type", ["brewer", "espresso_machine"])
    .order("model")

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: data as EquipmentForQR[] }
}
