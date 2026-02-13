"use server"

import { createClient } from "@/lib/supabase/server"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type DashboardStats = {
  userName: string | null
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
  equipment: {
    total: number
  }
  cupping: {
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
  // Chart data
  charts: {
    brewsPerDay: { day: string; count: number }[]
    ratingDistribution: { rating: number; count: number }[]
    coffeeConsumption: { week: string; grams: number }[]
    ratingByMethod: { method: string; avgRating: number; count: number }[]
  }
}

export async function getDashboardStats(): Promise<ActionResult<DashboardStats>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  // Fetch user profile for name
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userData.user.id)
    .single()

  const userName = profile?.full_name || userData.user.email?.split("@")[0] || null

  // Fetch all stats in parallel
  const [
    beansResult,
    brewsResult,
    equipmentResult,
    cuppingResult,
    recentBrewsResult,
  ] = await Promise.all([
    supabase.from("beans").select("status"),
    supabase.from("brews").select("rating, brewed_at, brew_method, dose_grams"),
    supabase.from("equipment").select("id", { count: "exact", head: true }),
    supabase.from("cupping_notes").select("id", { count: "exact", head: true }),
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

  // Chart data calculations

  // 1. Brews per day (last 14 days)
  const brewsPerDay: { day: string; count: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const dayStart = new Date()
    dayStart.setDate(dayStart.getDate() - i)
    dayStart.setHours(0, 0, 0, 0)
    const dayEnd = new Date(dayStart)
    dayEnd.setDate(dayEnd.getDate() + 1)

    const count = brews.filter((b) => {
      const brewDate = new Date(b.brewed_at)
      return brewDate >= dayStart && brewDate < dayEnd
    }).length

    const dayLabel = dayStart.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    brewsPerDay.push({ day: dayLabel, count })
  }

  // 2. Rating distribution
  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  brews.forEach((b) => {
    if (b.rating && b.rating >= 1 && b.rating <= 5) {
      ratingCounts[b.rating] = (ratingCounts[b.rating] || 0) + 1
    }
  })
  const ratingDistribution = Object.entries(ratingCounts)
    .map(([rating, count]) => ({ rating: parseInt(rating), count }))
    .sort((a, b) => a.rating - b.rating)

  // 3. Coffee consumption per week (last 8 weeks)
  const coffeeConsumption: { week: string; grams: number }[] = []
  for (let i = 7; i >= 0; i--) {
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - (i * 7 + weekStart.getDay()))
    weekStart.setHours(0, 0, 0, 0)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)

    const grams = brews
      .filter((b) => {
        const brewDate = new Date(b.brewed_at)
        return brewDate >= weekStart && brewDate < weekEnd
      })
      .reduce((sum, b) => sum + (b.dose_grams || 0), 0)

    const weekLabel = weekStart.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
    coffeeConsumption.push({ week: weekLabel, grams: Math.round(grams) })
  }

  // 4. Average rating by method
  const methodRatings: Record<string, { total: number; count: number }> = {}
  brews.forEach((b) => {
    if (b.rating) {
      if (!methodRatings[b.brew_method]) {
        methodRatings[b.brew_method] = { total: 0, count: 0 }
      }
      methodRatings[b.brew_method].total += b.rating
      methodRatings[b.brew_method].count += 1
    }
  })
  const ratingByMethod = Object.entries(methodRatings)
    .map(([method, data]) => ({
      method,
      avgRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 6)

  return {
    success: true,
    data: {
      userName,
      beans: beanStats,
      brews: {
        total: brews.length,
        thisMonth: brewsThisMonth,
        averageRating,
      },
      equipment: { total: equipmentResult.count || 0 },
      cupping: { total: cuppingResult.count || 0 },
      topMethods,
      recentBrews: (recentBrewsResult.data || []).map((brew) => ({
        id: brew.id as string,
        brewed_at: brew.brewed_at as string,
        brew_method: brew.brew_method as string,
        rating: brew.rating as number | null,
        beans: brew.beans as unknown as { name: string } | null,
      })),
      charts: {
        brewsPerDay,
        ratingDistribution,
        coffeeConsumption,
        ratingByMethod,
      },
    },
  }
}
