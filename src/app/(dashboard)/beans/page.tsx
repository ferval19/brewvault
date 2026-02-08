import Link from "next/link"
import { Plus, Coffee, Package, Star, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { getBeans, type Bean } from "./actions"
import { BeanCard } from "./bean-card"

export const metadata = {
  title: "Mis Cafes",
}

function calculateStats(beans: Bean[]) {
  const totalBeans = beans.length
  const activeBeans = beans.filter((b) => b.status === "active").length
  const finishedBeans = beans.filter((b) => b.status === "finished").length
  const avgRating = beans.filter((b) => b.personal_rating).length > 0
    ? beans.filter((b) => b.personal_rating).reduce((acc, b) => acc + (b.personal_rating || 0), 0) / beans.filter((b) => b.personal_rating).length
    : 0
  const lowStock = beans.filter((b) => {
    if (!b.current_weight_grams || !b.low_stock_threshold_grams) return false
    return b.current_weight_grams <= b.low_stock_threshold_grams && b.status === "active"
  }).length

  return { totalBeans, activeBeans, finishedBeans, avgRating, lowStock }
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
  const statusFilter = params.status || "all"

  const filteredBeans =
    statusFilter === "all"
      ? beans
      : beans.filter((bean) => bean.status === statusFilter)

  const stats = calculateStats(beans)

  const filterOptions = [
    { value: "all", label: "Todos", count: beans.length },
    { value: "active", label: "Activos", count: stats.activeBeans },
    { value: "finished", label: "Agotados", count: stats.finishedBeans },
  ]

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

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mis Cafes</h1>
          <p className="text-muted-foreground mt-1">
            {filteredBeans.length} {filteredBeans.length === 1 ? "cafe" : "cafes"}
            {statusFilter !== "all" && ` ${statusFilter === "active" ? "activos" : statusFilter === "finished" ? "agotados" : ""}`}
          </p>
        </div>
        <Link href="/beans/new" className="hidden sm:block">
          <Button size="lg" className="rounded-xl">
            <Plus className="mr-2 h-5 w-5" />
            Nuevo cafe
          </Button>
        </Link>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Link key={option.value} href={option.value === "all" ? "/beans" : `/beans?status=${option.value}`}>
            <Button
              variant={statusFilter === option.value ? "default" : "outline"}
              size="sm"
              className="rounded-full"
            >
              {option.label}
              <span className="ml-1.5 text-xs opacity-70">({option.count})</span>
            </Button>
          </Link>
        ))}
      </div>

      {/* Bean Grid */}
      {filteredBeans.length === 0 ? (
        <EmptyState hasAnyBeans={beans.length > 0} />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBeans.map((bean) => (
            <BeanCard key={bean.id} bean={bean} />
          ))}
        </div>
      )}

      {/* Mobile FAB */}
      <Link
        href="/beans/new"
        className="fixed bottom-24 right-6 sm:hidden z-50"
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

function EmptyState({ hasAnyBeans }: { hasAnyBeans: boolean }) {
  if (hasAnyBeans) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Coffee className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">
          No hay cafes con este filtro
        </h3>
        <p className="text-muted-foreground mb-4">
          Prueba cambiando el filtro de estado
        </p>
        <Link href="/beans">
          <Button variant="outline">Ver todos</Button>
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
        Tu boveda esta vacia
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Empieza agregando tu primer cafe para llevar un registro de tu coleccion
      </p>
      <Link href="/beans/new">
        <Button size="lg" className="rounded-xl">
          <Plus className="mr-2 h-5 w-5" />
          Agregar primer cafe
        </Button>
      </Link>
    </div>
  )
}
