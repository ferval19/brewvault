import Link from "next/link"
import {
  Coffee,
  Flame,
  Users,
  Cog,
  Droplets,
  TrendingUp,
  Star,
  Calendar,
} from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { getDashboardStats } from "./actions"
import { brewMethods } from "@/lib/validations/brews"

export const metadata = {
  title: "Dashboard",
}

export default async function AnalyticsPage() {
  const result = await getDashboardStats()

  if (!result.success) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">{result.error}</p>
      </div>
    )
  }

  const stats = result.data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de tu coleccion de cafe
        </p>
      </div>

      {/* Main stats grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Link href="/beans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Cafes
              </CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.beans.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.beans.active} activos
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/brews">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Preparaciones
              </CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.brews.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.brews.thisMonth} este mes
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/roasters">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tostadores
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.roasters.total}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/equipment">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Equipos
              </CardTitle>
              <Cog className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.equipment.total}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Secondary stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Rating promedio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rating promedio</CardTitle>
            <Star className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            {stats.brews.averageRating ? (
              <>
                <div className="text-2xl font-bold">
                  {stats.brews.averageRating.toFixed(1)}
                </div>
                <div className="text-amber-500">
                  {"★".repeat(Math.round(stats.brews.averageRating))}
                  {"☆".repeat(5 - Math.round(stats.brews.averageRating))}
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Sin datos</p>
            )}
          </CardContent>
        </Card>

        {/* Cafes por estado */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Estado de cafes</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Activos</span>
              <Badge variant="default">{stats.beans.active}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Terminados</span>
              <Badge variant="secondary">{stats.beans.finished}</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Wishlist</span>
              <Badge variant="outline">{stats.beans.wishlist}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recetas de agua */}
        <Link href="/water">
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Recetas de agua</CardTitle>
              <Droplets className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.waterRecipes.total}</div>
              <p className="text-xs text-muted-foreground">
                recetas guardadas
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Metodos mas usados y preparaciones recientes */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top metodos */}
        <Card>
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
              <div className="space-y-3">
                {stats.topMethods.map((method, index) => {
                  const methodLabel =
                    brewMethods.find((m) => m.value === method.method)?.label ||
                    method.method
                  const maxCount = stats.topMethods[0].count
                  const percentage = (method.count / maxCount) * 100

                  return (
                    <div key={method.method} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{methodLabel}</span>
                        <span className="text-muted-foreground">
                          {method.count} {method.count === 1 ? "prep" : "preps"}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Preparaciones recientes
            </CardTitle>
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
                      className="flex items-center justify-between p-2 -mx-2 rounded-lg hover:bg-muted transition-colors"
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
                        <Badge variant="outline" className="text-amber-500 ml-2">
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
