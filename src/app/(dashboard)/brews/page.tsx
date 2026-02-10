import { Coffee, Star, TrendingUp } from "lucide-react"

import { getBrews } from "./actions"
import { BrewsListClient } from "./brews-list-client"
import { getBrewMethodConfig } from "@/lib/brew-methods"

export const metadata = {
  title: "Mis Preparaciones",
}

function calculateStats(brews: Awaited<ReturnType<typeof getBrews>>["data"]) {
  if (!brews || brews.length === 0) {
    return { totalBrews: 0, avgRating: 0, favoriteMethod: null }
  }

  const totalBrews = brews.length

  // Average rating
  const ratedBrews = brews.filter((b) => b.rating !== null)
  const avgRating = ratedBrews.length > 0
    ? ratedBrews.reduce((acc, b) => acc + (b.rating || 0), 0) / ratedBrews.length
    : 0

  // Favorite method
  const methodCounts: Record<string, number> = {}
  brews.forEach((b) => {
    methodCounts[b.brew_method] = (methodCounts[b.brew_method] || 0) + 1
  })
  const favoriteMethod = Object.entries(methodCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null

  return { totalBrews, avgRating, favoriteMethod }
}

export default async function BrewsPage({
  searchParams,
}: {
  searchParams: Promise<{ method?: string }>
}) {
  const result = await getBrews()
  const { method: filterMethod } = await searchParams

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Error al cargar las preparaciones</p>
      </div>
    )
  }

  const brews = result.data
  const stats = calculateStats(brews)

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {brews.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <StatCard
            icon={Coffee}
            label="Preparaciones"
            value={stats.totalBrews.toString()}
          />
          <StatCard
            icon={Star}
            label="Valoracion media"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "-"}
            suffix={stats.avgRating > 0 ? "/5" : ""}
          />
          <StatCard
            icon={TrendingUp}
            label="Metodo favorito"
            value={stats.favoriteMethod ? getBrewMethodConfig(stats.favoriteMethod).label : "-"}
          />
        </div>
      )}

      {/* Client-side list with filters, search, and views */}
      <BrewsListClient brews={brews} initialMethod={filterMethod} />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ElementType
  label: string
  value: string
  suffix?: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold mt-1">
            {value}
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </p>
        </div>
        <div className="p-2 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
    </div>
  )
}
