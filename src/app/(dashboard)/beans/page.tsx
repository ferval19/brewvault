import { Coffee, Package, Star, AlertTriangle } from "lucide-react"

import { getBeans, type Bean } from "./actions"
import { BeansListClient } from "./beans-list-client"

export const metadata = {
  title: "Mis Cafes",
}

function calculateStats(beans: Bean[]) {
  const totalBeans = beans.length
  const activeBeans = beans.filter((b) => b.status === "active").length
  const avgRating = beans.filter((b) => b.personal_rating).length > 0
    ? beans.filter((b) => b.personal_rating).reduce((acc, b) => acc + (b.personal_rating || 0), 0) / beans.filter((b) => b.personal_rating).length
    : 0
  const lowStock = beans.filter((b) => {
    if (!b.current_weight_grams || !b.low_stock_threshold_grams) return false
    return b.current_weight_grams <= b.low_stock_threshold_grams && b.status === "active"
  }).length

  return { totalBeans, activeBeans, avgRating, lowStock }
}

export default async function BeansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const params = await searchParams
  const result = await getBeans()

  if (!result.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Error al cargar los cafes</p>
      </div>
    )
  }

  const beans = result.data
  const stats = calculateStats(beans)

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      {beans.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={Coffee}
            label="Total cafes"
            value={stats.totalBeans.toString()}
          />
          <StatCard
            icon={Package}
            label="Activos"
            value={stats.activeBeans.toString()}
          />
          <StatCard
            icon={Star}
            label="Valoracion media"
            value={stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "-"}
            suffix={stats.avgRating > 0 ? "/5" : ""}
          />
          {stats.lowStock > 0 && (
            <StatCard
              icon={AlertTriangle}
              label="Stock bajo"
              value={stats.lowStock.toString()}
              variant="warning"
            />
          )}
        </div>
      )}

      {/* Client-side list with filters, search, and views */}
      <BeansListClient beans={beans} initialStatus={params.status} />
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  variant = "default",
}: {
  icon: React.ElementType
  label: string
  value: string
  suffix?: string
  variant?: "default" | "warning"
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
        <div className={`p-2 rounded-xl ${variant === "warning" ? "bg-amber-500/10" : "bg-primary/10"}`}>
          <Icon className={`h-5 w-5 ${variant === "warning" ? "text-amber-500" : "text-primary"}`} />
        </div>
      </div>
    </div>
  )
}
