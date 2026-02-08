import Link from "next/link"
import { Plus, Coffee, Star, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { BrewCard } from "@/components/cards/brew-card"

import { getBrews } from "./actions"
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

  const allBrews = result.data
  const brews = filterMethod
    ? allBrews.filter((b) => b.brew_method === filterMethod)
    : allBrews

  const stats = calculateStats(allBrews)
  const usedMethods = [...new Set(allBrews.map((b) => b.brew_method))]

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {allBrews.length > 0 && (
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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Preparaciones</h1>
          <p className="text-muted-foreground">
            {brews.length} {brews.length === 1 ? "preparacion" : "preparaciones"}
            {filterMethod && ` de ${getBrewMethodConfig(filterMethod).label}`}
          </p>
        </div>
        <Link href="/brews/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nueva preparacion
          </Button>
        </Link>
      </div>

      {/* Filter Pills */}
      {usedMethods.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <Link href="/brews">
            <Button
              variant={!filterMethod ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              Todas
            </Button>
          </Link>
          {usedMethods.map((method) => {
            const config = getBrewMethodConfig(method)
            const MethodIcon = config.icon
            return (
              <Link key={method} href={`/brews?method=${method}`}>
                <Button
                  variant={filterMethod === method ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                >
                  <MethodIcon className="mr-1.5 h-4 w-4" />
                  {config.label}
                </Button>
              </Link>
            )
          })}
        </div>
      )}

      {/* Brews Grid */}
      {brews.length === 0 ? (
        <EmptyState hasFilter={!!filterMethod} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brews.map((brew) => (
            <BrewCard key={brew.id} brew={brew} />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/brews/new"
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Button size="lg" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
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

function EmptyState({ hasFilter }: { hasFilter: boolean }) {
  if (hasFilter) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Coffee className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          Sin preparaciones con este metodo
        </h3>
        <p className="text-muted-foreground mb-4">
          Prueba con otro filtro o crea una nueva preparacion
        </p>
        <Link href="/brews">
          <Button variant="outline">Ver todas</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-6 rounded-full bg-primary/10 mb-6">
        <Coffee className="h-12 w-12 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">
        Comienza a registrar tus preparaciones
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Lleva un registro de cada extraccion para perfeccionar tu tecnica y encontrar tu receta ideal
      </p>
      <Link href="/brews/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Nueva preparacion
        </Button>
      </Link>
    </div>
  )
}
