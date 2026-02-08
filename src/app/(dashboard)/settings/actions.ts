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
