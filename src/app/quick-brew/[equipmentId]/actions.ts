"use server"

import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type QuickBrewStats = {
  totalBrews: number
  avgRating: number | null
  brewsToday: number
  lastBrew: {
    id: string
    brewed_at: string
    brew_method: string
    dose_grams: number
    rating: number | null
    beans: { name: string } | null
  } | null
}

export async function getQuickBrewStats(
  equipmentId: string
): Promise<ActionResult<QuickBrewStats>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Fetch brews for this equipment
  const { data: brews, error } = await supabase
    .from("brews")
    .select("id, brewed_at, brew_method, dose_grams, rating, beans(name)")
    .eq("equipment_id", equipmentId)
    .eq("user_id", userData.user.id)
    .order("brewed_at", { ascending: false })

  if (error) {
    return { success: false, error: error.message }
  }

  const brewsData = brews || []

  // Calculate stats
  const totalBrews = brewsData.length

  const ratingsArray = brewsData
    .filter((b) => b.rating !== null)
    .map((b) => b.rating as number)
  const avgRating =
    ratingsArray.length > 0
      ? ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length
      : null

  // Brews today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const brewsToday = brewsData.filter(
    (b) => new Date(b.brewed_at) >= today
  ).length

  // Last brew
  const lastBrewData = brewsData[0]
  const lastBrew = lastBrewData
    ? {
        id: lastBrewData.id as string,
        brewed_at: lastBrewData.brewed_at as string,
        brew_method: lastBrewData.brew_method as string,
        dose_grams: lastBrewData.dose_grams as number,
        rating: lastBrewData.rating as number | null,
        beans: lastBrewData.beans as unknown as { name: string } | null,
      }
    : null

  return {
    success: true,
    data: {
      totalBrews,
      avgRating,
      brewsToday,
      lastBrew,
    },
  }
}
