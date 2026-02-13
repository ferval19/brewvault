import Link from "next/link"
import {
  Package,
  Coffee,
  Gauge,
  ClipboardList,
  TrendingUp,
  Star,
  Calendar,
  ArrowRight,
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
  if (hour < 12) return "Buenos dias"
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
          Resumen de tu coleccion de cafe
        </p>
      </div>

      {/* Alerts Panel */}
      {alertCount > 0 && (
        <AlertsPanel alerts={alerts} totalCount={alertCount} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/brews/new" className="block h-full">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-coffee-600 to-coffee-700 p-5 h-full text-white hover:shadow-xl hover:shadow-coffee-500/30 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20">
                <Coffee className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Nueva brew</p>
                <p className="text-sm text-white/80">Registrar preparacion</p>
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
                <p className="font-semibold">Nuevo cafe</p>
                <p className="text-sm text-white/80">Anadir a coleccion</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Main stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
                <p className="text-sm text-muted-foreground mt-1">&nbsp;</p>
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

      {/* Secondary stats */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Rating promedio */}
        <Card className="rounded-3xl h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating promedio</CardTitle>
            <div className="p-2 rounded-xl bg-coffee-500/10">
              <Star className="h-4 w-4 text-coffee-500" />
            </div>
          </CardHeader>
          <CardContent>
            {stats.brews.averageRating ? (
              <>
                <div className="text-3xl font-bold">
                  {stats.brews.averageRating.toFixed(1)}
                  <span className="text-lg text-muted-foreground">/5</span>
                </div>
                <div className="text-coffee-500 mt-1">
                  {"★".repeat(Math.round(stats.brews.averageRating))}
                  {"☆".repeat(5 - Math.round(stats.brews.averageRating))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Sin datos</p>
            )}
          </CardContent>
        </Card>

        {/* Cafés por estado */}
        <Card className="rounded-3xl h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estado de cafés</CardTitle>
            <div className="p-2 rounded-xl bg-coffee-500/10">
              <Package className="h-4 w-4 text-coffee-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Activos</span>
              <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/10">
                {stats.beans.active}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Terminados</span>
              <Badge variant="secondary">{stats.beans.finished}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Wishlist</span>
              <Badge variant="outline">{stats.beans.wishlist}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts charts={stats.charts} />

      {/* Metodos mas usados y preparaciones recientes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top metodos */}
        <Card className="rounded-3xl h-full">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Metodos mas usados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topMethods.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Sin preparaciones registradas
              </p>
            ) : (
              <div className="space-y-4">
                {stats.topMethods.map((method) => {
                  const methodLabel =
                    brewMethods.find((m) => m.value === method.method)?.label ||
                    method.method
                  const maxCount = stats.topMethods[0].count
                  const percentage = (method.count / maxCount) * 100

                  return (
                    <div key={method.method} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{methodLabel}</span>
                        <span className="text-muted-foreground">
                          {method.count} {method.count === 1 ? "prep" : "preps"}
                        </span>
                      </div>
                      <div className="h-2.5 bg-white/30 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preparaciones recientes */}
        <Card className="rounded-3xl h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
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
              <div className="space-y-3">
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
                        <p className="font-medium truncate">
                          {brew.beans?.name || "Cafe desconocido"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {methodLabel} •{" "}
                          {new Date(brew.brewed_at).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                      {brew.rating && (
                        <Badge variant="outline" className="text-coffee-500 ml-2 rounded-full">
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
    </div>
  )
}
