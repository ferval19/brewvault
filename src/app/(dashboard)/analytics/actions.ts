"use server"

import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type DashboardStats = {
  beans: {
    total: number
    active: number
    finished: number
    wishlist: number
  }
  brews: {
    total: number
    thisMonth: number
    averageRating: number | null
  }
  roasters: {
    total: number
  }
  equipment: {
    total: number
  }
  topMethods: { method: string; count: number }[]
  recentBrews: {
    id: string
    brewed_at: string
    brew_method: string
    rating: number | null
    beans: { name: string } | null
  }[]
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Fetch all stats in parallel
  const [
    beansResult,
    brewsResult,
    roastersResult,
    equipmentResult,
    recentBrewsResult,
  ] = await Promise.all([
    supabase.from("beans").select("status"),
    supabase.from("brews").select("rating, brewed_at, brew_method"),
    supabase.from("roasters").select("id", { count: "exact", head: true }),
    supabase.from("equipment").select("id", { count: "exact", head: true }),
    supabase
      .from("brews")
      .select("id, brewed_at, brew_method, rating, beans(name)")
      .order("brewed_at", { ascending: false })
      .limit(5),
  ])

  // Calculate bean stats
  const beans = beansResult.data || []
  const beanStats = {
    total: beans.length,
    active: beans.filter((b) => b.status === "active").length,
    finished: beans.filter((b) => b.status === "finished").length,
    wishlist: beans.filter((b) => b.status === "wishlist").length,
  }

  // Calculate brew stats
  const brews = brewsResult.data || []
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const brewsThisMonth = brews.filter(
    (b) => new Date(b.brewed_at) >= startOfMonth
  ).length
  const ratingsArray = brews
    .filter((b) => b.rating !== null)
    .map((b) => b.rating as number)
  const averageRating =
    ratingsArray.length > 0
      ? ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length
      : null

  // Calculate top methods
  const methodCounts: Record<string, number> = {}
  brews.forEach((b) => {
    methodCounts[b.brew_method] = (methodCounts[b.brew_method] || 0) + 1
  })
  const topMethods = Object.entries(methodCounts)
    .map(([method, count]) => ({ method, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  return {
    success: true,
    data: {
      beans: beanStats,
      brews: {
        total: brews.length,
        thisMonth: brewsThisMonth,
        averageRating,
      },
      roasters: { total: roastersResult.count || 0 },
      equipment: { total: equipmentResult.count || 0 },
      topMethods,
      recentBrews: (recentBrewsResult.data || []).map((brew) => ({
        id: brew.id as string,
        brewed_at: brew.brewed_at as string,
        brew_method: brew.brew_method as string,
        rating: brew.rating as number | null,
        beans: brew.beans as unknown as { name: string } | null,
      })),
    },
  }
}
