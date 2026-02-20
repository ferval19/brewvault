"use server"

import { createClient } from "@/lib/supabase/server"
import { brewMethods } from "@/lib/validations/brews"

export type DateRange = "7d" | "30d" | "90d" | "1y" | "all"

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type AnalyticsData = {
  totalBrews: number
  avgRating: number | null
  totalGrams: number
  favoriteMethod: { method: string; label: string; count: number } | null

  brewsOverTime: { date: string; count: number }[]
  consumptionOverTime: { date: string; grams: number }[]
  ratingOverTime: { date: string; avgRating: number | null }[]

  methodDistribution: { method: string; label: string; count: number }[]
  ratingByMethod: { method: string; label: string; avgRating: number; count: number }[]
  topBeans: { name: string; avgRating: number; count: number }[]
  roastDistribution: { roast: string; label: string; count: number }[]
  originDistribution: { country: string; count: number }[]
}

function getDateBounds(range: DateRange): { start: Date | null; end: Date } {
  const end = new Date()
  end.setHours(23, 59, 59, 999)

  if (range === "all") return { start: null, end }

  const start = new Date()
  start.setHours(0, 0, 0, 0)

  switch (range) {
    case "7d":
      start.setDate(start.getDate() - 6)
      break
    case "30d":
      start.setDate(start.getDate() - 29)
      break
    case "90d":
      start.setDate(start.getDate() - 89)
      break
    case "1y":
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return { start, end }
}

type GroupBy = "day" | "week" | "month"

function getGroupBy(range: DateRange): GroupBy {
  if (range === "7d" || range === "30d") return "day"
  if (range === "90d") return "week"
  return "month"
}

function generateTimeBuckets(
  start: Date,
  end: Date,
  groupBy: GroupBy
): { bucketStart: Date; bucketEnd: Date; label: string }[] {
  const buckets: { bucketStart: Date; bucketEnd: Date; label: string }[] = []

  if (groupBy === "day") {
    const current = new Date(start)
    while (current <= end) {
      const bucketStart = new Date(current)
      bucketStart.setHours(0, 0, 0, 0)
      const bucketEnd = new Date(current)
      bucketEnd.setHours(23, 59, 59, 999)
      const label = current.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
      buckets.push({ bucketStart, bucketEnd, label })
      current.setDate(current.getDate() + 1)
    }
  } else if (groupBy === "week") {
    const current = new Date(start)
    // Align to Monday
    const dayOfWeek = current.getDay()
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    current.setDate(current.getDate() + diff)

    while (current <= end) {
      const bucketStart = new Date(current)
      bucketStart.setHours(0, 0, 0, 0)
      const bucketEnd = new Date(current)
      bucketEnd.setDate(bucketEnd.getDate() + 6)
      bucketEnd.setHours(23, 59, 59, 999)
      const label = bucketStart.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      })
      buckets.push({ bucketStart, bucketEnd, label })
      current.setDate(current.getDate() + 7)
    }
  } else {
    const current = new Date(start.getFullYear(), start.getMonth(), 1)
    while (current <= end) {
      const bucketStart = new Date(current)
      const bucketEnd = new Date(
        current.getFullYear(),
        current.getMonth() + 1,
        0
      )
      bucketEnd.setHours(23, 59, 59, 999)
      const label = current.toLocaleDateString("es-ES", {
        month: "short",
        year: "2-digit",
      })
      buckets.push({ bucketStart, bucketEnd, label })
      current.setMonth(current.getMonth() + 1)
    }
  }

  return buckets
}

type BrewRow = {
  brewed_at: string
  brew_method: string
  dose_grams: number | null
  water_grams: number | null
  rating: number | null
  beans: {
    name: string
    roast_level: string | null
    origin_country: string | null
  } | null
}

export async function getAnalyticsData(
  range: DateRange = "30d",
  brewMethod?: string
): Promise<ActionResult<AnalyticsData>> {
  const supabase = await createClient()

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) {
    return { success: false, error: "No autenticado" }
  }

  const { start, end } = getDateBounds(range)

  let query = supabase
    .from("brews")
    .select(
      "brewed_at, brew_method, dose_grams, water_grams, rating, beans(name, roast_level, origin_country)"
    )
    .order("brewed_at", { ascending: true })

  if (start) {
    query = query.gte("brewed_at", start.toISOString())
  }
  query = query.lte("brewed_at", end.toISOString())

  if (brewMethod && brewMethod !== "all") {
    query = query.eq("brew_method", brewMethod)
  }

  const { data, error } = await query

  if (error) {
    return { success: false, error: error.message }
  }

  const brewData = (data || []) as unknown as BrewRow[]

  // KPIs
  const totalBrews = brewData.length
  const ratingsArray = brewData
    .filter((b) => b.rating !== null)
    .map((b) => b.rating as number)
  const avgRating =
    ratingsArray.length > 0
      ? Math.round(
          (ratingsArray.reduce((a, b) => a + b, 0) / ratingsArray.length) * 10
        ) / 10
      : null
  const totalGrams = Math.round(
    brewData.reduce((sum, b) => sum + (b.dose_grams || 0), 0)
  )

  // Favorite method
  const methodCounts: Record<string, number> = {}
  brewData.forEach((b) => {
    methodCounts[b.brew_method] = (methodCounts[b.brew_method] || 0) + 1
  })
  const favoriteMethodEntry = Object.entries(methodCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]
  const favoriteMethod = favoriteMethodEntry
    ? {
        method: favoriteMethodEntry[0],
        label:
          brewMethods.find((m) => m.value === favoriteMethodEntry[0])?.label ||
          favoriteMethodEntry[0],
        count: favoriteMethodEntry[1],
      }
    : null

  // Time series
  const effectiveStart =
    start ||
    (brewData.length > 0
      ? new Date(brewData[0].brewed_at)
      : (() => {
          const d = new Date()
          d.setDate(d.getDate() - 29)
          return d
        })())
  const groupBy = getGroupBy(range)
  const buckets = generateTimeBuckets(effectiveStart, end, groupBy)

  const brewsOverTime = buckets.map(({ bucketStart, bucketEnd, label }) => ({
    date: label,
    count: brewData.filter((b) => {
      const date = new Date(b.brewed_at)
      return date >= bucketStart && date <= bucketEnd
    }).length,
  }))

  const consumptionOverTime = buckets.map(
    ({ bucketStart, bucketEnd, label }) => ({
      date: label,
      grams: Math.round(
        brewData
          .filter((b) => {
            const date = new Date(b.brewed_at)
            return date >= bucketStart && date <= bucketEnd
          })
          .reduce((sum, b) => sum + (b.dose_grams || 0), 0)
      ),
    })
  )

  const ratingOverTime = buckets.map(({ bucketStart, bucketEnd, label }) => {
    const periodBrews = brewData.filter((b) => {
      const date = new Date(b.brewed_at)
      return date >= bucketStart && date <= bucketEnd && b.rating !== null
    })
    const avgRatingPeriod =
      periodBrews.length > 0
        ? Math.round(
            (periodBrews.reduce((sum, b) => sum + (b.rating as number), 0) /
              periodBrews.length) *
              10
          ) / 10
        : null
    return { date: label, avgRating: avgRatingPeriod }
  })

  // Method distribution
  const methodDistribution = Object.entries(methodCounts)
    .map(([method, count]) => ({
      method,
      label:
        brewMethods.find((m) => m.value === method)?.label || method,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  // Rating by method
  const methodRatings: Record<string, { total: number; count: number }> = {}
  brewData.forEach((b) => {
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
      label: brewMethods.find((m) => m.value === method)?.label || method,
      avgRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 8)

  // Top beans by rating
  const beanRatings: Record<string, { total: number; count: number }> = {}
  brewData.forEach((b) => {
    const beanName = b.beans?.name
    if (beanName && b.rating) {
      if (!beanRatings[beanName]) beanRatings[beanName] = { total: 0, count: 0 }
      beanRatings[beanName].total += b.rating
      beanRatings[beanName].count += 1
    }
  })
  const topBeans = Object.entries(beanRatings)
    .map(([name, data]) => ({
      name,
      avgRating: Math.round((data.total / data.count) * 10) / 10,
      count: data.count,
    }))
    .sort((a, b) => b.avgRating - a.avgRating || b.count - a.count)
    .slice(0, 6)

  // Roast distribution
  const roastLabels: Record<string, string> = {
    light: "Claro",
    medium_light: "Medio-claro",
    medium: "Medio",
    medium_dark: "Medio-oscuro",
    dark: "Oscuro",
    extra_dark: "Extra oscuro",
  }
  const roastCounts: Record<string, number> = {}
  brewData.forEach((b) => {
    const roast = b.beans?.roast_level
    if (roast) roastCounts[roast] = (roastCounts[roast] || 0) + 1
  })
  const roastDistribution = Object.entries(roastCounts)
    .map(([roast, count]) => ({
      roast,
      label: roastLabels[roast] || roast,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  // Origin distribution
  const originCounts: Record<string, number> = {}
  brewData.forEach((b) => {
    const country = b.beans?.origin_country
    if (country) originCounts[country] = (originCounts[country] || 0) + 1
  })
  const originDistribution = Object.entries(originCounts)
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  return {
    success: true,
    data: {
      totalBrews,
      avgRating,
      totalGrams,
      favoriteMethod,
      brewsOverTime,
      consumptionOverTime,
      ratingOverTime,
      methodDistribution,
      ratingByMethod,
      topBeans,
      roastDistribution,
      originDistribution,
    },
  }
}
