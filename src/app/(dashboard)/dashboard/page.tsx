import Link from "next/link"
import {
  Package,
  Coffee,
  Gauge,
  ClipboardList,
  Star,
  Calendar,
  ArrowRight,
  BarChart2,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertsPanel } from "@/components/alerts/alerts-panel"
import { DashboardCharts } from "@/components/charts/dashboard-charts"

import { getDashboardStats } from "./actions"
import { getAlerts, getUnreadAlertCount } from "@/app/(dashboard)/alerts/actions"
import { brewMethods } from "@/lib/validations/brews"

export const metadata = {
  title: "Inicio",
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 20) return "Buenas tardes"
  return "Buenas noches"
}

export default async function DashboardPage() {
  const [result, alertsResult, alertCountResult] = await Promise.all([
    getDashboardStats(),
    getAlerts({ limit: 5 }),
    getUnreadAlertCount(),
  ])

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const stats = result.data
  const alerts = alertsResult.success ? alertsResult.data : []
  const alertCount = alertCountResult.success ? alertCountResult.data : 0
  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      {/* Header with greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {greeting}{stats.userName ? `, ${stats.userName}` : ""}
        </h1>
        <p className="text-muted-foreground mt-1">
          Resumen de tu colección de café
        </p>
      </div>

      {/* Alerts Panel */}
      {alertCount > 0 && (
        <AlertsPanel alerts={alerts} totalCount={alertCount} />
      )}

      {/* Quick Actions */}
      <div data-tour="quick-actions" className="grid grid-cols-2 gap-4">
        <Link href="/brews/new" className="block h-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coffee-600 to-coffee-700 p-5 h-full text-white hover:shadow-xl hover:shadow-coffee-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Nueva brew</p>
                <p className="text-sm text-white/80">Registrar preparación</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/beans/new" className="block h-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coffee-500 to-coffee-600 p-5 h-full text-white hover:shadow-xl hover:shadow-coffee-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Nuevo café</p>
                <p className="text-sm text-white/80">Añadir a colección</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main stats grid */}
      <div data-tour="stats-grid" className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/beans" className="group">
          <div className="relative overflow-hidden rounded-3xl p-5 h-full glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Cafés
                </p>
                <p className="text-3xl font-bold mt-1">{stats.beans.total}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.beans.active} activos
                </p>
              </div>
              <div className="p-2 rounded-xl bg-white/30 dark:bg-white/10">
                <Package className="h-5 w-5 text-coffee-500" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/brews" className="group">
          <div className="relative overflow-hidden rounded-3xl p-5 h-full glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Preparaciones
                </p>
                <p className="text-3xl font-bold mt-1">{stats.brews.total}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.brews.thisMonth} este mes
                </p>
              </div>
              <div className="p-2 rounded-xl bg-white/30 dark:bg-white/10">
                <Coffee className="h-5 w-5 text-coffee-500" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/equipment" className="group">
          <div className="relative overflow-hidden rounded-3xl p-5 h-full glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Equipos
                </p>
                <p className="text-3xl font-bold mt-1">{stats.equipment.total}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stats.brews.averageRating
                    ? `★ ${stats.brews.averageRating.toFixed(1)} media`
                    : "\u00a0"}
                </p>
              </div>
              <div className="p-2 rounded-xl bg-white/30 dark:bg-white/10">
                <Gauge className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/cupping" className="group">
          <div className="relative overflow-hidden rounded-3xl p-5 h-full glass-panel hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  Catas
                </p>
                <p className="text-3xl font-bold mt-1">{stats.cupping.total}</p>
                <p className="text-sm text-muted-foreground mt-1">&nbsp;</p>
              </div>
              <div className="p-2 rounded-xl bg-white/30 dark:bg-white/10">
                <ClipboardList className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts section */}
      <div data-tour="charts" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Últimos 7 días</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Actividad reciente de tus preparaciones
            </p>
          </div>
          <Link href="/analytics">
            <Button variant="ghost" size="sm" className="rounded-full gap-1.5 text-amber-600 dark:text-amber-500 hover:text-amber-700 hover:bg-amber-500/10">
              <BarChart2 className="h-4 w-4" />
              Ver análisis
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <DashboardCharts charts={stats.charts} />
      </div>

      {/* Analytics CTA + Recent brews */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Analytics promo card */}
        <Link href="/analytics" className="block">
          <div className="relative overflow-hidden rounded-3xl p-6 h-full bg-gradient-to-br from-amber-500 to-orange-600 text-white hover:shadow-xl hover:shadow-amber-500/30 transition-all duration-300 hover:-translate-y-1 group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 h-24 w-24 rounded-full border-2 border-white" />
              <div className="absolute top-8 right-8 h-12 w-12 rounded-full border border-white" />
              <div className="absolute bottom-4 left-4 h-16 w-16 rounded-full border border-white" />
            </div>

            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-white/20">
                  <BarChart2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-bold text-lg">Análisis completo</p>
                  <p className="text-sm text-white/80">Métricas avanzadas</p>
                </div>
              </div>
              <p className="text-sm text-white/90 leading-relaxed mb-4">
                Explora tendencias de rating, consumo por método, origen de tus cafés y más con filtros de fecha personalizables.
              </p>
              <div className="flex items-center gap-1.5 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Ver estadísticas <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </Link>

        {/* Preparaciones recientes */}
        <Card className="rounded-3xl h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Preparaciones recientes
            </CardTitle>
            <Link href="/brews">
              <Button variant="ghost" size="sm" className="rounded-full">
                Ver todas
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {stats.recentBrews.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Sin preparaciones registradas
              </p>
            ) : (
              <div className="space-y-1">
                {stats.recentBrews.map((brew) => {
                  const methodLabel =
                    brewMethods.find((m) => m.value === brew.brew_method)?.label ||
                    brew.brew_method

                  return (
                    <Link
                      key={brew.id}
                      href={`/brews/${brew.id}`}
                      className="flex items-center justify-between p-3 -mx-3 rounded-xl hover:bg-white/30 dark:hover:bg-white/[0.06] transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate text-sm">
                          {brew.beans?.name || "Café desconocido"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {methodLabel} ·{" "}
                          {new Date(brew.brewed_at).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      {brew.rating && (
                        <Badge variant="outline" className="text-amber-500 ml-2 rounded-full text-xs shrink-0">
                          {"★".repeat(brew.rating)}
                        </Badge>
                      )}
                    </Link>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top methods - compact */}
      {stats.topMethods.length > 0 && (
        <Card className="rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Métodos favoritos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topMethods.map((method, i) => {
                const methodLabel =
                  brewMethods.find((m) => m.value === method.method)?.label ||
                  method.method
                const maxCount = stats.topMethods[0].count
                const isTop = i === 0
                return (
                  <div
                    key={method.method}
                    className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/40 dark:bg-white/[0.07] border border-white/20 dark:border-white/[0.06]"
                  >
                    <div
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: isTop ? "#f59e0b" : `hsl(${30 + i * 20}, 80%, 55%)`,
                      }}
                    />
                    <span className="text-sm font-medium">{methodLabel}</span>
                    <span className="text-xs text-muted-foreground">
                      {method.count}×
                    </span>
                    <div className="h-1 rounded-full bg-white/30 dark:bg-white/10 overflow-hidden w-12">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(method.count / maxCount) * 100}%`,
                          backgroundColor: isTop ? "#f59e0b" : `hsl(${30 + i * 20}, 80%, 55%)`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
